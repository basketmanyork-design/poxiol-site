import assert from 'node:assert/strict'
import {existsSync, readFileSync} from 'node:fs'
import {createRequire} from 'node:module'
import path from 'node:path'
import vm from 'node:vm'
import {test} from 'node:test'
import ts from 'typescript'

const require = createRequire(import.meta.url)
// Real ContactForm and local helpers; only scheduling, navigation, analytics and
// HTTP are controlled. The fake clock never waits or contacts a real provider.
function harness({request = async()=>new Response('{}'), tracking = {}, navigate, endpoint = 'https://example.invalid/qa', uuid = ()=>'qa-only'} = {}) {
  const slots=[], effects=[], requests=[], navigations=[], analytics=[], timers=new Map(), cache=new Map(), dom=new Map(), focus=[], scroll=[]
  let cursor=0, nextTimer=1
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
      exports,Error,URL,URLSearchParams,Response,FormData,AbortController,
      setTimeout(fn,ms){const id=nextTimer++;timers.set(id,{fn,ms});return id},clearTimeout(id){timers.delete(id)},
      process:{env:{NEXT_PUBLIC_FORMSPREE_CONTACT_ENDPOINT:endpoint}},
      window:{location:{pathname:'/get-quote/',search:'',href:'https://example.invalid/get-quote/'}},
      crypto:{randomUUID:uuid},
      fetch:async(url,options)=>{assert.equal(url,'https://example.invalid/qa');requests.push({url,...options});return request(url,options)},
      require(name){
        if(name==='react')return hooks
        if(name==='next/navigation')return{usePathname:()=>'/get-quote/',useRouter:()=>({push(url){navigations.push(url);navigate?.(url)}})}
        if(name==='next/link')return{default:props=>require('react').createElement('a',props)}
        if(name==='@/lib/analytics/client')return{
          trackFormStart(...args){analytics.push({name:'form_start',args})},
          trackFileSelect(...args){analytics.push({name:'file_select',args})},
          trackFileUpload(...args){analytics.push({name:'file_upload',args})},
          trackFormSubmit(...args){analytics.push({name:'form_submit',args})},
          trackLead(...args){analytics.push({name:'generate_lead',args})},
          ...tracking,
        }
        if(!name.startsWith('@/')&&!name.startsWith('.'))return require(name)
        let resolved=name.startsWith('@/')?path.resolve(name.slice(2)):path.resolve(path.dirname(filename),name)
        if(!existsSync(resolved))resolved=['.ts','.tsx'].map(ext=>resolved+ext).find(existsSync)
        assert.ok(resolved,`Cannot resolve ${name}`)
        if(resolved.endsWith('.json'))return{default:JSON.parse(readFileSync(resolved,'utf8'))}
        return load(resolved)
      },
    })
    return exports
  }
  const Component=load(path.resolve('components/forms/ContactForm.tsx')).default
  function expand(node){if(!node||typeof node!=='object')return[];if(typeof node.type==='function')return expand(node.type(node.props));return[node,...[node.props?.children].flat(Infinity).flatMap(expand)]}
  // Model only DOM ref boundaries; the Browser tests cover native file inputs,
  // actual focus and viewport positioning. Components/helpers remain real.
  function render(){for(let pass=0;pass<10;pass++){cursor=0;const nodes=expand(Component({intent:'quote',formId:'factory_quote_form',formType:'Get Quote Conversion',successUrl:'/quote-received/',publicEmail:'sales@poxiol.com',whatsappHref:'https://wa.me/8613055646888'}));for(const node of nodes){const id=node.props?.id;if(!id)continue;if(!dom.has(id))dom.set(id,{value:'',focus(options){focus.push({id,options})},scrollIntoView(options){scroll.push({id,options})}});if(node.ref&&typeof node.ref==='object')node.ref.current=dom.get(id)}if(!effects.length)return nodes;effects.splice(0).forEach(fn=>fn())}throw Error('Effects did not settle')}
  const find=id=>render().find(n=>n.props?.id===id)
  const edit=(id,value)=>find(id).props.onChange({target:{value}})
  const attach=(id,file)=>{const input=find(id);dom.get(id).value=file?`C:\\fakepath\\${file.name}`:'';input.props.onChange({target:{files:file?[file]:[]}})}
  const handler=()=>render().find(n=>n.type==='form').props.onSubmit
  const event={preventDefault(){},currentTarget:{}}
  const send=()=>handler()(event)
  const button=()=>render().find(n=>n.type==='button'&&n.props.type==='submit')
  const alert=()=>render().find(n=>n.props?.role==='alert')
  const status=()=>render().find(n=>n.props?.role==='status')
  const text=node=>typeof node==='string'||typeof node==='number'?String(node):!node||typeof node!=='object'?'':[node.props?.children].flat(Infinity).map(text).join(' ')
  const removeButton=id=>render().find(n=>n.type==='button'&&n.props['aria-controls']===id&&/^Remove /.test(n.props['aria-label']||''))
  return{requests,navigations,analytics,timers,dom,focus,scroll,render,find,edit,attach,removeButton,handler,event,send,button,alert,status,text,expire(){for(const[id,t]of[...timers]){timers.delete(id);t.fn()}}}
}

function assertRecovery(ui){
  const alert=ui.alert();assert.ok(alert,'Failure guidance must be accessible')
  const links=[]
  function walk(node){if(!node||typeof node!=='object')return;if(node.type==='a')links.push(node);[node.props?.children].flat(Infinity).forEach(walk)}
  walk(alert)
  assert.ok(links.some(n=>n.props.href.startsWith('mailto:sales@poxiol.com')),'Put email inside the error panel')
  assert.ok(links.some(n=>n.props.href.startsWith('https://wa.me/8613055646888')),'Put WhatsApp inside the error panel')
}

const conversionNames = ui => ui.analytics.map(event => event.name).filter(name => ['form_submit','generate_lead','file_upload'].includes(name))
const contextOf = event => JSON.parse(JSON.stringify(event.args[0]))

test('Formspree 2xx emits one submit, one lead, and one attachment upload with stable quote keys',async()=>{
  const ui=harness();ui.attach('field-logo-file',new File(['QA'],'logo.png',{type:'image/png'}));await ui.send();await ui.send()
  assert.deepEqual(conversionNames(ui),['form_submit','generate_lead','file_upload'])
  for(const event of ui.analytics){
    assert.deepEqual(contextOf(event),{lead_type:'factory_quote',form_id:'factory_quote_form',form_type:'Get Quote Conversion'})
  }
  assert.equal(ui.analytics.filter(event=>event.name==='file_select').length,1)
})

for(const scenario of ['http-4xx','http-5xx','request-timeout','network-failure'])test(`${scenario} emits no generate_lead`,async()=>{
  const ui=harness({request:async()=>{
    if(scenario==='network-failure')throw TypeError('Disconnected')
    return new Response('{}',{status:scenario==='http-4xx'?422:scenario==='http-5xx'?503:408})
  }})
  await ui.send()
  assert.equal(ui.analytics.filter(event=>event.name==='generate_lead').length,0)
})

test('same-render duplicate submissions produce only one request while pending',async()=>{
  let resolve;const ui=harness({request:()=>new Promise(r=>{resolve=r})})
  const submit=ui.handler();const first=submit(ui.event);const second=submit(ui.event)
  assert.equal(ui.requests.length,1)
  assert.equal(ui.button().props.disabled,true)
  resolve(new Response('{}'));await Promise.all([first,second])
  await ui.send();assert.equal(ui.requests.length,1)
})

for(const failure of ['trackFormSubmit','trackLead','uuid'])test(`accepted request is not turned into a retry when ${failure} fails`,async()=>{
  const throws=()=>{throw Error('Optional telemetry unavailable')}
  const ui=harness({tracking:{[failure]:throws},...(failure==='uuid'?{uuid:throws}:{})})
  await ui.send();assert.equal(ui.requests.length,1);assert.deepEqual(ui.navigations,['/quote-received/'])
  assert.equal(ui.alert(),undefined);await ui.send();assert.equal(ui.requests.length,1)
})

test('tracking failure cannot discard text or a selected file',()=>{
  const throws=()=>{throw Error('Tracking unavailable')};const ui=harness({tracking:{trackFormStart:throws,trackFileUpload:throws}})
  assert.doesNotThrow(()=>ui.edit('field-company','Local teamwear reseller'))
  assert.equal(ui.find('field-company').props.value,'Local teamwear reseller')
  assert.doesNotThrow(()=>ui.attach('field-tech-pack-file',new File(['QA'],'qa.pdf',{type:'application/pdf'})))
})

test('explicit rejection retains draft and optional file for a deliberate retry',async()=>{
  let calls=0;const ui=harness({request:async()=>new Response('{}',{status:++calls===1?422:200})})
  ui.edit('field-company','Local teamwear reseller');ui.attach('field-tech-pack-file',new File(['QA'],'qa.pdf',{type:'application/pdf'}))
  await ui.send();assertRecovery(ui);assert.equal(ui.navigations.length,0);assert.equal(ui.button().props.disabled,false)
  assert.equal(ui.find('field-company').props.value,'Local teamwear reseller')
  await ui.send();assert.equal(ui.requests.length,2);assert.equal(ui.requests[1].body.get('size_chart_tech_pack_file').name,'qa.pdf')
  assert.equal(ui.timers.size,0)
})

for(const scenario of ['network','server','request-timeout'])test(`${scenario} uncertainty cannot be blindly resubmitted or cleared by editing`,async()=>{
  const ui=harness({request:async()=>{if(scenario==='network')throw TypeError('Disconnected');return new Response('{}',{status:scenario==='server'?503:408})}})
  ui.edit('field-company','Keep this draft');await ui.send();assertRecovery(ui)
  assert.equal(ui.button().props.disabled,true);assert.match(ui.text(ui.alert()),/confirm|check/i)
  ui.edit('field-company','Edited but not resent');await ui.send()
  assert.equal(ui.requests.length,1);assert.equal(ui.button().props.disabled,true);assertRecovery(ui)
  assert.equal(ui.navigations.length,0)
})

test('60-second deadline releases pending state without treating abort as non-delivery; late response cannot redirect',async()=>{
  let resolve;const ui=harness({request:()=>new Promise(r=>{resolve=r})})
  const pending=ui.send();assert.equal(ui.requests.length,1)
  assert.deepEqual([...ui.timers.values()].map(t=>t.ms),[60000])
  ui.expire();await pending
  assert.equal(ui.requests[0].signal.aborted,true);assertRecovery(ui);assert.equal(ui.button().props.disabled,true)
  resolve(new Response('{}'));await Promise.resolve();await Promise.resolve()
  assert.equal(ui.navigations.length,0);await ui.send();assert.equal(ui.requests.length,1);assert.equal(ui.timers.size,0)
  assert.equal(ui.analytics.filter(event=>event.name==='generate_lead').length,0)
})

test('an oversized selection blocks sending even after another valid file is selected',async()=>{
  const ui=harness();ui.attach('field-tech-pack-file',{name:'too-large.pdf',size:10*1024*1024+1})
  ui.attach('field-logo-file',new File(['QA'],'logo.png',{type:'image/png'}))
  await ui.send();assert.equal(ui.requests.length,0);assertRecovery(ui)
  ui.attach('field-tech-pack-file',null);await ui.send();assert.equal(ui.requests.length,1)
  assert.equal(ui.requests[0].body.get('logo_file').name,'logo.png')
})

test('missing configuration shows buyer contacts rather than sending to the page',async()=>{
  const ui=harness({endpoint:''});await ui.send();assert.equal(ui.requests.length,0);assertRecovery(ui)
  assert.doesNotMatch(ui.text(ui.alert()),/NEXT_PUBLIC|Cloudflare Pages/)
})

test('navigation failure after acceptance leaves a locked success state with an existing next-step link',async()=>{
  const ui=harness({navigate(){throw Error('Router unavailable')}});await ui.send()
  assert.ok(ui.status());assert.equal(ui.alert(),undefined);assert.equal(ui.button().props.disabled,true)
  assert.ok(ui.render().some(n=>n.type==='a'&&n.props.href==='/quote-received/'))
  await ui.send();assert.equal(ui.requests.length,1)
})

// Removing a field association, clearing only React state, clearing all files,
// or moving focus on every edit would each violate a buyer-visible contract.
const attachmentFields=[
  ['field-logo-file','logo_file'],
  ['field-reference-file','reference_design_file'],
  ['field-tech-pack-file','size_chart_tech_pack_file'],
]
for(const[id]of attachmentFields)test(`${id}: oversize error is attached to that input without stealing selection focus`,()=>{
  const ui=harness();ui.attach(id,{name:'a-long-project-file-name-too-large.pdf',size:10485761})
  const input=ui.find(id);assert.equal(input.props['aria-invalid'],true)
  const linked=(input.props['aria-describedby']||'').split(/\s+/).map(key=>ui.find(key)).filter(Boolean)
  assert.ok(linked.some(node=>/10\s*MB/.test(ui.text(node))&&/large|limit|exceed/i.test(ui.text(node))),'Associate a specific size error with its file input')
  assert.ok(linked.some(node=>ui.text(node).includes('a-long-project-file-name-too-large.pdf')),'Expose the complete selected filename outside the native truncated control')
  assert.equal(ui.focus.length,0,'Selection alone must not jump away from the file controls')
  for(const[other]of attachmentFields)if(other!==id)assert.notEqual(ui.find(other).props['aria-invalid'],true)
})

for(const[id,field]of attachmentFields)test(`${id}: explicit removal clears native selection and only its submitted file`,async()=>{
  const ui=harness();ui.edit('field-company','Keep this reseller draft')
  for(const[input,name]of attachmentFields)ui.attach(input,new File(['QA'],`${name}.pdf`,{type:'application/pdf'}))
  const remove=ui.removeButton(id);assert.ok(remove,'Provide an explicit accessible remove action');assert.equal(remove.props.type,'button')
  remove.props.onClick();ui.render()
  assert.equal(ui.dom.get(id).value,'','Clear the native picker so the same file can be selected again')
  assert.equal(ui.focus.at(-1)?.id,`${id}-choose`,'Return focus to the visible English file chooser')
  assert.equal(ui.removeButton(id),undefined);assert.equal(ui.find('field-company').props.value,'Keep this reseller draft')
  await ui.send();assert.equal(ui.requests.length,1);assert.equal(ui.requests[0].body.has(field),false)
  for(const[,other]of attachmentFields)if(other!==field)assert.equal(ui.requests[0].body.get(other).name,`${other}.pdf`)
})

test('removing an oversized file clears its error and allows choosing the same file again',async()=>{
  const ui=harness();const file={name:'too-large.pdf',size:10485761};ui.attach('field-tech-pack-file',file)
  const remove=ui.removeButton('field-tech-pack-file');assert.ok(remove);remove.props.onClick()
  assert.equal(ui.alert(),undefined);assert.notEqual(ui.find('field-tech-pack-file').props['aria-invalid'],true)
  ui.attach('field-tech-pack-file',file);assert.equal(ui.find('field-tech-pack-file').props['aria-invalid'],true)
  await ui.send();assert.equal(ui.requests.length,0)
})

test('a rejected submit focuses visible recovery guidance, but subsequent edits do not steal focus',async()=>{
  const ui=harness({request:async()=>new Response('{}',{status:422})});await ui.send();ui.render()
  assert.ok(ui.focus.some(item=>item.id==='project-form-error'),'Focus the committed error panel after a submission fails')
  assert.ok(ui.scroll.some(item=>item.id==='project-form-error'&&item.options.block==='start'),'Bring the error heading into the viewport')
  assert.equal(ui.find('project-form-error').props.tabIndex,-1)
  const previous=ui.focus.length;ui.edit('field-company','Corrected draft');ui.render();assert.equal(ui.focus.length,previous)
  await ui.send();ui.render();assert.ok(ui.focus.length>previous,'The same failure on a deliberate retry must be located again')
})

test('removing a file after an uncertain send cannot imply withdrawal or unlock resending',async()=>{
  const ui=harness({request:async()=>new Response('{}',{status:503})});ui.attach('field-logo-file',new File(['QA'],'logo.pdf'))
  await ui.send();const remove=ui.removeButton('field-logo-file');assert.ok(remove);remove.props.onClick();ui.render()
  assert.equal(ui.dom.get('field-logo-file').value,'');assert.equal(ui.button().props.disabled,true);assertRecovery(ui)
  assert.match(ui.text(ui.alert()),/check|confirm/i)
  assert.match(ui.text(ui.alert()),/does not withdraw/i)
  await ui.send();assert.equal(ui.requests.length,1)
})

test('a stale remove action cannot change selected files during or after an accepted send',async()=>{
  let resolve;const ui=harness({request:()=>new Promise(r=>{resolve=r})});ui.attach('field-logo-file',new File(['QA'],'logo.pdf'))
  const remove=ui.removeButton('field-logo-file');assert.ok(remove);const pending=ui.send();remove.props.onClick();ui.render()
  assert.notEqual(ui.dom.get('field-logo-file').value,'');assert.ok(ui.removeButton('field-logo-file'))
  resolve(new Response('{}'));await pending;remove.props.onClick();ui.render();assert.notEqual(ui.dom.get('field-logo-file').value,'')
  assert.equal(ui.requests.length,1)
})
