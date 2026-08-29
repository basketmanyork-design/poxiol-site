import assert from 'node:assert/strict'
import {existsSync, readFileSync} from 'node:fs'
import {createRequire} from 'node:module'
import path from 'node:path'
import vm from 'node:vm'
import {test} from 'node:test'
import ts from 'typescript'

const require = createRequire(import.meta.url)
// Load real form, validation, request transport and contextual links. Only
// external I/O, React scheduling and the clock are replaced; no live requests.
function harness({request=async()=>new Response('{}'), prepareError=false, endpoint='https://example.invalid/qa'}={}) {
  const slots=[], effects=[], requests=[], timers=new Map(), cache=new Map()
  let cursor=0, nextTimer=1, failPreparation=prepareError
  const hooks={
    useState(initial){const i=cursor++;if(!(i in slots))slots[i]=initial;return[slots[i],v=>{slots[i]=typeof v==='function'?v(slots[i]):v}]},
    useRef(initial){const i=cursor++;return slots[i]??={current:initial}},
    useEffect(fn,deps){const i=cursor++;if(!slots[i]||deps.some((v,j)=>v!==slots[i][j])){slots[i]=deps;effects.push(fn)}},
  }
  function load(filename){
    if(cache.has(filename))return cache.get(filename)
    const exports={};cache.set(filename,exports)
    const code=ts.transpileModule(readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022}}).outputText
    vm.runInNewContext(code,{
      exports,Error,URL,URLSearchParams,Response,AbortController,
      FormData:class extends FormData {constructor(){if(failPreparation){failPreparation=false;throw Error('Cannot prepare local form')}super()}},
      setTimeout(fn,ms){const id=nextTimer++;timers.set(id,{fn,ms});return id},clearTimeout(id){timers.delete(id)},
      process:{env:{NEXT_PUBLIC_FORMSPREE_CONTACT_ENDPOINT:endpoint}},
      window:{location:{pathname:'/contact/',search:'?product=Basketball+Uniforms&source=%2Fproducts%2Fbasketball-uniforms%2F',href:'https://example.invalid/contact/'}},
      crypto:{randomUUID:()=> 'qa-only'},
      fetch:async(url,options)=>{assert.equal(url,'https://example.invalid/qa');requests.push({url,...options});return request(url,options)},
      require(name){
        if(name==='react')return hooks
        if(name==='next/navigation')return{usePathname:()=>'/contact/'}
        if(name==='next/link')return{default:props=>require('react').createElement('a',props)}
        if(name==='@/lib/analytics/client')return{trackFormStart(){},trackFormSubmit(){},trackLead(){}}
        if(!name.startsWith('@/')&&!name.startsWith('.'))return require(name)
        let resolved=name.startsWith('@/')?path.resolve(name.slice(2)):path.resolve(path.dirname(filename),name)
        if(!existsSync(resolved))resolved=['.ts','.tsx'].map(ext=>resolved+ext).find(existsSync)
        assert.ok(resolved,`Cannot resolve ${name}`)
        return load(resolved)
      },
    })
    return exports
  }
  const Component=load(path.resolve('components/forms/GeneralInquiryForm.tsx')).default
  function expand(node){if(!node||typeof node!=='object')return[];if(typeof node.type==='function')return expand(node.type(node.props));return[node,...[node.props?.children].flat(Infinity).flatMap(expand)]}
  function render(){for(let pass=0;pass<10;pass++){cursor=0;const nodes=expand(Component({publicEmail:'sales@poxiol.com',whatsappHref:'https://wa.me/8613055646888'}));if(!effects.length)return nodes;effects.splice(0).forEach(fn=>fn())}throw Error('Effects did not settle')}
  const find=id=>render().find(n=>n.props?.id===id)
  const edit=(id,value)=>find(id).props.onChange({target:{value}})
  const handler=()=>render().find(n=>n.type==='form').props.onSubmit
  const event={preventDefault(){},currentTarget:{}}
  const send=()=>handler()(event)
  const button=()=>render().find(n=>n.type==='button'&&n.props.type==='submit')
  const alert=()=>render().find(n=>n.props?.role==='alert')
  const text=node=>typeof node==='string'||typeof node==='number'?String(node):!node||typeof node!=='object'?'':[node.props?.children].flat(Infinity).map(text).join(' ')
  edit('general-message','How do I start supplying local teams?');edit('general-email','qa@example.com')
  return{requests,timers,render,find,edit,handler,event,send,button,alert,text,expire(){for(const[id,t]of[...timers]){timers.delete(id);t.fn()}}}
}

function assertRecovery(ui){
  const alert=ui.alert();assert.ok(alert,'Failure must have an accessible alert')
  const links=[]
  function walk(node){if(!node||typeof node!=='object')return;if(node.type==='a')links.push(node);[node.props?.children].flat(Infinity).forEach(walk)}
  walk(alert)
  assert.ok(links.some(n=>n.props.href.startsWith('mailto:sales@poxiol.com')),'Email must be inside the recovery panel')
  assert.ok(links.some(n=>n.props.href.startsWith('https://wa.me/8613055646888')),'WhatsApp must be inside the recovery panel')
  assert.match(ui.text(alert),/refresh|leaving/i,'State the current-page draft boundary')
}

test('a stale submit handler cannot resend an accepted general question',async()=>{
  const ui=harness();const submit=ui.handler();await submit(ui.event);await submit(ui.event)
  assert.equal(ui.requests.length,1);assert.equal(ui.button().props.disabled,true)
})

for(const status of [400,422,429])test(`HTTP${status} keeps the draft and permits one deliberate retry`,async()=>{
  let calls=0;const ui=harness({request:async()=>new Response('{}',{status:++calls===1?status:200})})
  await ui.send();assertRecovery(ui);assert.equal(ui.button().props.disabled,false)
  assert.equal(ui.find('general-message').props.value,'How do I start supplying local teams?')
  assert.equal(ui.find('general-email').props.value,'qa@example.com')
  await ui.send();assert.equal(ui.requests.length,2)
  assert.equal(ui.requests[1].body.get('message'),'How do I start supplying local teams?')
  assert.equal(ui.requests[1].body.get('inquiryType'),'general-question')
  assert.equal(ui.requests[1].body.has('leadPriority'),false)
  assert.equal(ui.button().props.disabled,true);assert.equal(ui.timers.size,0)
})

for(const scenario of ['network','server','request-timeout'])test(`${scenario} ambiguity locks general inquiry resending even after edits`,async()=>{
  const ui=harness({request:async()=>{if(scenario==='network')throw TypeError('Disconnected');return new Response('{}',{status:scenario==='server'?503:408})}})
  await ui.send();assertRecovery(ui);assert.equal(ui.button().props.disabled,true)
  ui.edit('general-message','Corrected question');ui.edit('general-email','corrected@example.com');ui.edit('inquiry-product','Training tops')
  await ui.send();assert.equal(ui.requests.length,1);assertRecovery(ui)
  assert.equal(ui.button().props.disabled,true);assert.match(ui.text(ui.alert()),/check receipt|confirm/i)
  assert.equal(ui.render().find(n=>n.props?.role==='status'),undefined)
})

test('a 60-second deadline releases pending UI but a late success cannot become accepted',async()=>{
  let resolve;const ui=harness({request:()=>new Promise(r=>{resolve=r})})
  const pending=ui.send();const waiting=ui.render().find(n=>n.props?.role==='status')
  assert.ok(waiting,'Explain the pending state');assert.equal(ui.button().props.disabled,true)
  assert.deepEqual([...ui.timers.values()].map(t=>t.ms),[60000])
  ui.expire();await pending;assert.equal(ui.requests[0].signal.aborted,true);assertRecovery(ui)
  resolve(new Response('{}'));await Promise.resolve();await Promise.resolve()
  assert.equal(ui.render().find(n=>n.props?.role==='status'),undefined)
  await ui.send();assert.equal(ui.requests.length,1);assert.equal(ui.button().props.disabled,true);assert.equal(ui.timers.size,0)
})

test('a form-preparation exception is caught before any network send and does not freeze retry',async()=>{
  const ui=harness({prepareError:true});await assert.doesNotReject(()=>ui.send())
  assert.equal(ui.requests.length,0);assertRecovery(ui);assert.equal(ui.button().props.disabled,false)
  await ui.send();assert.equal(ui.requests.length,1)
})

test('local validation keeps the draft and recovery options without any request',async()=>{
  const ui=harness();ui.edit('general-email','not-an-email');await ui.send()
  assert.equal(ui.requests.length,0);assertRecovery(ui);assert.equal(ui.button().props.disabled,false)
  ui.edit('general-email','corrected@example.com');await ui.send();assert.equal(ui.requests.length,1)
})

test('missing configuration cannot send and offers the configured contact channels',async()=>{
  const ui=harness({endpoint:''});await ui.send();assert.equal(ui.requests.length,0);assertRecovery(ui)
  assert.equal(ui.button().props.disabled,false)
})
