import {buildCoachMessages} from './coach-prompts.mjs';

const MODEL_PREFIX='Qwen2.5-1.5B-Instruct-';
export function browserSupport({protocol=globalThis.location?.protocol,secure=globalThis.isSecureContext,gpu=globalThis.navigator?.gpu}={}) {
  if(protocol==='file:')return 'Open SupportLab through its local launcher or a private HTTPS website to use AI. The learning tools work from this file.';
  if(!secure)return 'AI needs a secure HTTPS website or the local SupportLab launcher.';
  if(!gpu)return 'This browser does not provide WebGPU. Try a current Chrome or Edge browser on a computer with graphics acceleration available.';
  return '';
}

export class BrowserCoach {
  constructor({loadModule=()=>import('./vendor/webllm.js'),makeWorker=()=>new Worker(new URL('./ai-worker.mjs',import.meta.url),{type:'module'}),gpu=globalThis.navigator?.gpu,support=()=>browserSupport(),onStatus=()=>{}}={}) {
    Object.assign(this,{loadModule,makeWorker,gpu,support,onStatus});
    this.state='idle';this.engine=null;this.worker=null;this.epoch=0;this.job=null;
  }
  status(state,detail='',progress=0){this.state=state;this.onStatus({state,detail,progress});}
  async load(){
    if(this.state==='ready')return;
    if(this.state==='loading'||this.state==='generating')return;
    const unsupported=this.support();if(unsupported)throw Error(unsupported);
    const epoch=++this.epoch;
    this.status('loading','Checking your graphics device…');
    let timer;
    try {
      const cancelled=new Promise((_,reject)=>{this.rejectLoad=reject;timer=setTimeout(()=>reject(Error('Loading took too long. Check your connection and try loading again.')),8*60*1000);});
      await Promise.race([cancelled,(async()=>{
        const adapter=await this.gpu.requestAdapter({powerPreference:'high-performance'});
        if(epoch!==this.epoch)throw Error('Loading cancelled.');
        if(!adapter)throw Error('No compatible graphics device was found. Try Chrome or Edge with graphics acceleration available.');
        this.model=MODEL_PREFIX+(adapter.features.has('shader-f16')?'q4f16_1-MLC':'q4f32_1-MLC');
        const runtime=await this.loadModule();
        if(epoch!==this.epoch)throw Error('Loading cancelled.');
        this.worker=this.makeWorker();
        this.worker.onerror=()=>{
          const error=Error('The AI worker stopped. Reload the model and try again.');
          if(this.state==='loading')this.rejectLoad?.(error);
          else{this.job?.reject(error);++this.epoch;this.worker?.terminate();this.worker=null;this.engine=null;this.status('error','Reload the model to try again.');}
        };
        this.engine=new runtime.WebWorkerMLCEngine(this.worker,{initProgressCallback:p=>{
          if(epoch===this.epoch)this.status('loading',p.text||'Downloading and preparing the model…',Math.max(0,Math.min(1,p.progress||0)));
        }});
        await this.engine.reload(this.model,{context_window_size:4096});
        if(epoch!==this.epoch)throw Error('Loading cancelled.');
      })()]);
      this.status('ready','Free AI is ready on this device.',1);
    }catch(error){
      if(epoch===this.epoch){this.worker?.terminate();this.worker=null;this.engine=null;this.status('error','The model could not be loaded.');}
      throw error;
    }finally{clearTimeout(timer);if(epoch===this.epoch)this.rejectLoad=null;}
  }
  unload(){
    ++this.epoch;this.rejectLoad?.(Error('Loading cancelled.'));this.rejectLoad=null;
    if(this.job){this.job.cancelled=true;this.job.reject(Error('Request cancelled.'));}
    this.worker?.terminate();this.worker=null;this.engine=null;this.job=null;
    this.status('idle','AI has been unloaded. Downloaded model files may remain in the browser cache.');
  }
  cancel(){if(this.job){this.job.cancelled=true;this.engine?.interruptGenerate();}}
  async generate(input,articles=[],onText=()=>{}){
    if(this.state!=='ready'||!this.engine)throw Error('Load the free AI model first.');
    const messages=buildCoachMessages(input,articles);
    const engine=this.engine,epoch=this.epoch,job={cancelled:false,reject:null};
    this.job=job;this.status('generating','Preparing coaching notes…',1);
    let timer;
    try {
      const timeout=new Promise((_,reject)=>{job.reject=reject;timer=setTimeout(()=>{
        job.cancelled=true;engine.interruptGenerate();
        reject(Error('This device took too long to answer. Try a shorter question or reload the model.'));
        if(epoch===this.epoch){++this.epoch;this.worker?.terminate();this.worker=null;this.engine=null;this.status('error','Reload the model to try again.');}
      },120000);});
      return await Promise.race([timeout,(async()=>{
        await engine.resetChat();
        if(job.cancelled||epoch!==this.epoch)return {answer:'',cancelled:true};
        const stream=await engine.chat.completions.create({messages,stream:true,max_tokens:600,temperature:0.4,repetition_penalty:1.05});
        let text='',incomplete=false;
        for await(const part of stream){
          if(job.cancelled||epoch!==this.epoch)break;
          text+=part.choices?.[0]?.delta?.content||'';
          incomplete ||= part.choices?.[0]?.finish_reason==='length';
          if(text)onText(text);
        }
        if(job.cancelled||epoch!==this.epoch)return {answer:text.trim(),cancelled:true};
        if(!text.trim())throw Error('The model returned no text. Try a more specific question.');
        return {answer:text.trim(),incomplete};
      })()]);
    }finally{
      clearTimeout(timer);if(this.job===job)this.job=null;
      if(epoch===this.epoch&&this.engine)this.status('ready','Free AI is ready on this device.',1);
    }
  }
}
