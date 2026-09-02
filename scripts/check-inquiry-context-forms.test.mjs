import assert from 'node:assert/strict'
import {existsSync,readFileSync} from 'node:fs'
import {createRequire} from 'node:module'
import path from 'node:path'
import vm from 'node:vm'
import {test} from 'node:test'
import ts from 'typescript'

const require = createRequire(import.meta.url)
// Real form modules and helpers; only React scheduling, navigation and the
// external HTTP boundary are substituted. No browser or real request is used.
function formHarness(file, intent, search) {
  const slots = [], effects = [], sent = []
  let cursor = 0
  const hooks = {
    useState(initial) {const i=cursor++; if (!(i in slots)) slots[i]=initial; return [slots[i],value=>{slots[i]=typeof value==='function'?value(slots[i]):value}]},
    useRef(initial) {const i=cursor++; return slots[i]??={current:initial}},
    useEffect(fn,deps) {const i=cursor++; if (!slots[i] || deps.some((value,j)=>value!==slots[i][j])) {slots[i]=deps;effects.push(fn)}},
  }
  const pathname = intent==='contact'?'/contact/':'/get-quote/'
  const location = {pathname,search,href:`https://www.poxiol.com${pathname}${search}`}
  const cache = new Map()
  function load(filename) {
    if (cache.has(filename)) return cache.get(filename)
    const exports = {}; cache.set(filename,exports)
    const code=ts.transpileModule(readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022}}).outputText
    vm.runInNewContext(code, {
      exports, Error, URL, URLSearchParams, Response, AbortController, setTimeout, clearTimeout,
      FormData:class extends FormData {constructor() {super()}},
      process:{env:{NEXT_PUBLIC_FORMSPREE_CONTACT_ENDPOINT:'https://example.invalid/never-sent'}},
      window:{location}, crypto:{randomUUID:()=> 'qa-id'},
      fetch:async(url,options)=>{assert.equal(url,'https://example.invalid/never-sent');sent.push(options.body);return new Response('{}')},
      require(name) {
        if (name==='react') return hooks
        if (name==='next/navigation') return {usePathname:()=>pathname,useRouter:()=>({push(){}})}
        if (name==='next/link') return {default:props=>require('react').createElement('a',props)}
        if (!name.startsWith('@/') && !name.startsWith('.')) return require(name)
        let resolved=name.startsWith('@/')?path.resolve(name.slice(2)):path.resolve(path.dirname(filename),name)
        if (!existsSync(resolved)) resolved=['.ts','.tsx'].map(ext=>resolved+ext).find(existsSync)
        assert.ok(resolved,`Cannot resolve ${name}`)
        if (resolved.endsWith('.json')) return {default: JSON.parse(readFileSync(resolved, 'utf8'))}
        return load(resolved)
      },
    })
    return exports
  }
  const Component=load(path.resolve(file)).default
  function expand(node) {
    if (!node || typeof node!=='object') return []
    if (typeof node.type==='function') return expand(node.type(node.props))
    return [node,...[node.props?.children].flat(Infinity).flatMap(expand)]
  }
  function render() {
    let nodes
    for (let pass=0;pass<10;pass++) {
      cursor=0
      nodes=expand(Component({intent,publicEmail:'sales@example.invalid',whatsappHref:'https://wa.me/8613055646888'}))
      if (!effects.length) return nodes
      effects.splice(0).forEach(fn=>fn())
    }
    throw Error('Effects did not settle')
  }
  const find=id=>render().find(node=>node.props?.id===id)
  const edit=(id,value)=>{const node=find(id);assert.ok(node,`Missing editable field ${id}`);node.props.onChange({target:{value}})}
  const send=()=>render().find(node=>node.type==='form').props.onSubmit({preventDefault(){},currentTarget:{}})
  return {find,edit,send,sent,render}
}
const query='?product=Basketball+Uniforms&sport=Basketball&style=home-kit&source=%2Fproducts%2Fbasketball-uniforms%2F'

test('project deadline remains English on a browser with a non-English operating-system locale',()=>{
  const ui=formHarness('components/forms/ContactForm.tsx','quote',query)
  const deadline=ui.find('field-deadline')
  assert.equal(deadline.props.type,'text','A native date control localizes its placeholder outside the site language')
  assert.equal(deadline.props.placeholder,'YYYY-MM-DD')
  assert.equal(deadline.props.inputMode,'numeric')
  assert.equal(deadline.props.autoComplete,'off')
})

test('project attachments expose only custom English chooser text',()=>{
  const ui=formHarness('components/forms/ContactForm.tsx','quote',query)
  for(const id of ['field-logo-file','field-reference-file','field-tech-pack-file']){
    const input=ui.find(id)
    assert.equal(input.props.type,'file')
    assert.match(input.props.className,/\bsr-only\b/,'Hide operating-system-localized native file text')
    const chooser=ui.find(`${id}-choose`)
    assert.equal(chooser.type,'button')
    assert.equal(chooser.props.children,'Choose file')
    assert.equal(chooser.props['aria-controls'],id)
    assert.equal(ui.find(`${id}-status`).props.children,'No file selected')
  }
})

test('starting reference puts the first optional input before supplementary guidance',()=>{
  const ui=formHarness('components/forms/ContactForm.tsx','quote',query)
  const nodes=ui.render()
  const inputIndex=nodes.findIndex(node=>node.props?.id==='inquiry-product')
  const guidanceIndex=nodes.findIndex(node=>typeof node.props?.children==='string' && node.props.children.startsWith('Brought from the page'))
  assert.ok(inputIndex>=0 && guidanceIndex>inputIndex,'Keep reference guidance after the first input on narrow screens')
  assert.equal(nodes[inputIndex].props.required,undefined)
})

test('quote prefill is editable and actual submitted data reflects buyer corrections', async()=>{
  const ui=formHarness('components/forms/ContactForm.tsx','quote',query)
  assert.equal(ui.find('inquiry-product')?.props.value,'Basketball Uniforms')
  assert.equal(ui.find('field-sport').props.value,'Basketball')
  ui.edit('inquiry-product','Training Tops')
  ui.edit('inquiry-style','away-kit')
  ui.edit('field-sport','Soccer')
  await ui.send()
  assert.equal(ui.sent.length,1)
  const body=ui.sent[0]
  assert.equal(body.get('requested_product'),'Training Tops')
  assert.equal(body.get('selected_style'),'away-kit')
  assert.equal(body.get('sport'),'Soccer')
  assert.equal(body.get('intent'),'quote')
  assert.equal(body.get('originPage'),'/products/basketball-uniforms/')
  assert.equal(body.get('sourcePage'),'/get-quote/')
})
test('general question retains context without requiring project fields',async()=>{
  const ui=formHarness('components/forms/GeneralInquiryForm.tsx','contact',query)
  assert.equal(ui.find('inquiry-product')?.props.value,'Basketball Uniforms')
  ui.edit('general-message','Can you help me get started?')
  ui.edit('general-email','buyer@example.com')
  ui.edit('inquiry-product','Training Tops')
  await ui.send()
  assert.equal(ui.sent.length,1)
  assert.equal(ui.sent[0].get('requested_product'),'Training Tops')
  assert.equal(ui.sent[0].get('originPage'),'/products/basketball-uniforms/')
  assert.equal(ui.sent[0].get('intent'),'contact')
  assert.equal(ui.sent[0].get('sourceSport'),'Basketball')
  assert.equal(ui.sent[0].has('leadPriority'),false)
})
test('a cleared product and style stay cleared in the quote request',async()=>{
  const ui=formHarness('components/forms/ContactForm.tsx','quote',query)
  ui.edit('inquiry-product','')
  ui.edit('inquiry-style','')
  await ui.send()
  assert.equal(ui.sent[0].has('requested_product'),false)
  assert.equal(ui.sent[0].get('selected_style'),'')
})
