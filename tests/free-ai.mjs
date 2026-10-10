import assert from 'node:assert/strict';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import {BrowserCoach,browserSupport} from '../browser-ai.mjs';
import {buildCoachMessages,selectReferences,validateCoachInput,COACH_MODES} from '../coach-prompts.mjs';
const require=createRequire(import.meta.url),{parseHTML}=require('linkedom');
let checks=0;function check(value,label){assert(value,label);checks++;}
const input={action:'explain',message:'Explain authentication versus authorization in a fictional API case.',context:''};
check(browserSupport({protocol:'file:',secure:true,gpu:{}}).includes('launcher'),'File mode guidance');
check(browserSupport({protocol:'http:',secure:false,gpu:{}}).includes('HTTPS'),'Insecure page guidance');
check(browserSupport({protocol:'https:',secure:true,gpu:null}).includes('WebGPU'),'Unsupported browser guidance');
check(browserSupport({protocol:'https:',secure:true,gpu:{}})==='','Supported environment');
for(const mode of Object.keys(COACH_MODES)){const messages=buildCoachMessages({...input,action:mode},[{title:'API authentication',body:'A 401 indicates missing or invalid authentication.'}]);check(messages.length===2&&messages[0].role==='system','Mode prompt: '+mode);check(messages[0].content.includes('Never claim'),'No state change instruction');}
for(const invalid of [{action:'constructor'},{message:'hi'},{context:null},{message:'x'.repeat(3001)},{context:'x'.repeat(2501)},{message:'Bearer '+'x'.repeat(40)}]){assert.throws(()=>validateCoachInput({...input,...invalid}));checks++;}
check(selectReferences('webhook','',[]).length===0,'No reference crash');
const refs=selectReferences('webhook retry','',[{title:'SQL records'},{title:'Webhook retry',body:'x'.repeat(3000)},{title:'Webhook signature'},{title:'Webhook timeout'}]);
check(refs.length===2&&refs.every(x=>x.length<=750),'Bounded relevant references');
let latestEngine,lastWorker,replyConfig,releaseLoad;
class MockWorker {terminate(){this.terminated=true;}}
class MockEngine {
 constructor(worker,config){latestEngine=this;this.worker=worker;this.config=config;this.chat={completions:{create:async config=>{replyConfig=config;return this.stream();}}};}
 async reload(model,options){this.model=model;this.options=options;this.config.initProgressCallback({progress:.5,text:'Loading test model'});if(releaseLoad)await new Promise(resolve=>releaseLoad=resolve);}
 async *stream(){yield {choices:[{delta:{content:'Identity <script> is checked.'}}]};if(!this.interrupted)yield {choices:[{delta:{content:' Access is authorized.'},finish_reason:'length'}]};}
 interruptGenerate(){this.interrupted=true;}
 async resetChat(){this.interrupted=false;this.reset=true;}
}
const statuses=[];
function client(f16=true){return new BrowserCoach({gpu:{requestAdapter:async()=>({features:new Set(f16?['shader-f16']:[])})},support:()=>'',loadModule:async()=>({WebWorkerMLCEngine:MockEngine}),makeWorker:()=>lastWorker=new MockWorker(),onStatus:s=>statuses.push(s)});}
const coach=client();check(coach.state==='idle'&&!latestEngine,'No automatic model download');
await coach.load();check(coach.state==='ready','Model ready');check(latestEngine.model.includes('q4f16'),'FP16 model selected');check(latestEngine.options.context_window_size===4096,'Bounded context');check(statuses.some(s=>s.progress===.5),'Loading progress');
const streamed=[];const result=await coach.generate(input,[],text=>streamed.push(text));
check(result.answer.includes('Access')&&result.incomplete,'Streaming and truncation');check(streamed.length===2,'Incremental output');check(replyConfig.max_tokens===600&&replyConfig.stream,'Bounded local generation');check(!('apiKey' in replyConfig),'No API credential');check(coach.state==='ready','Ready after generation');
check(latestEngine.reset,'Each question starts a fresh model conversation');
latestEngine.interrupted=false;const cancelled=await coach.generate(input,[],()=>coach.cancel());check(cancelled.cancelled&&cancelled.answer.includes('Identity'),'Cancellation preserves partial reply');check(coach.state==='ready','Retry after cancellation');
coach.unload();check(lastWorker.terminated&&coach.state==='idle'&&!coach.engine,'Unload frees worker');
const fallback=client(false);await fallback.load();check(latestEngine.model.includes('q4f32'),'FP32 fallback without shader-f16');fallback.unload();
const noGPU=client();noGPU.gpu.requestAdapter=async()=>null;await assert.rejects(()=>noGPU.load(),/graphics device/);checks++;check(noGPU.state==='error','GPU failure recoverable');
const failed=client();failed.loadModule=async()=>{throw Error('Offline');};await assert.rejects(()=>failed.load(),/Offline/);checks++;check(failed.state==='error','Download failure recoverable');
const slow=client();releaseLoad=true;const pending=slow.load();await new Promise(resolve=>setTimeout(resolve,0));slow.unload();await assert.rejects(()=>pending,/cancelled/);checks++;releaseLoad?.();releaseLoad=null;check(slow.state==='idle','Cancelled load cannot become ready');

const root=fileURLToPath(new URL('../',import.meta.url));const {window}=parseHTML(fs.readFileSync(root+'/index.html','utf8'));const storage=new Map();
const sandbox={document:window.document,window,location:{hash:'',protocol:'https:'},navigator:{gpu:{}},isSecureContext:true,localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},confirm:()=>true,Blob,URL,setTimeout,clearTimeout,console};
const ctx=vm.createContext(sandbox),run=code=>vm.runInContext(code,ctx);
for(const file of ['data.js','app.js','ai.js'])vm.runInContext(fs.readFileSync(root+'/'+file,'utf8'),ctx);
run("go('ai')");check(window.document.querySelector('#aiSubmit').disabled,'Submit locked until ready');check(!window.document.querySelector('#aiLoad').disabled,'Explicit load available');
const before=run('JSON.stringify(db)');run("aiDrafts.explain.message='My concept question';aiDrafts.explain.context='Concept context';renderAI()");
window.document.querySelector('[data-ai-mode="review"]').click();check(window.document.querySelector('#aiMessage').value==='','No cross-mode draft leakage');
window.document.querySelector('[data-ai-mode="explain"]').click();check(window.document.querySelector('#aiMessage').value==='My concept question','Draft retained in its mode');
window.document.querySelector('[data-ai-mode="plan"]').click();check(run('aiDrafts.plan.context').includes('topics'),'Explicit progress context');
run("aiMode='explain';aiStatus={state:'ready',detail:'Ready',progress:1};aiClient={generate:async(input,articles,onText)=>{onText('<script>alert(1)</script>');return {answer:'<script>alert(1)</script>'}}};renderAI()");
await run('askAI({preventDefault(){}})');check(!window.document.querySelector('.ai-answer-text script'),'AI reply escaped');check(window.document.querySelector('.ai-answer-text').textContent.includes('<script>'),'AI reply remains readable');check(run('JSON.stringify(db)')===before,'AI leaves learning state unchanged');
run("aiBusy=true;renderAI()");check(window.document.querySelector('[data-ai-mode="review"]').disabled,'Modes locked during request');check(window.document.querySelector('#aiClear').disabled,'Clear locked during request');
run("aiBusy=false;aiStatus={state:'idle',detail:'',progress:0};location.protocol='file:';renderAI()");check(window.document.querySelector('#aiLoad').disabled,'File mode blocks model load');check(window.document.querySelector('#aiStatusText').textContent.includes('launcher'),'File mode next step');
check(!fs.readFileSync(root+'/ai.js','utf8').includes('/api/coach'),'No paid endpoint client call');
console.log(`${checks} free AI and interface checks passed. Real GPU generation is not covered by these mocked checks.`);
