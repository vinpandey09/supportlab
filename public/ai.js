/* Free, device-local coaching. It cannot change training scores or outcomes. */
pages.ai='AI coach';
const aiModes={explain:['Explain a concept','Understand an idea with an example and a recall question.','Why can a successful login still lead to a 403 response?'],hint:['Investigate with me','One focused hint based on your available evidence.','Describe the symptom and what you have already checked…'],review:['Review my writing','Improve a fictional customer response or handoff.','Paste a fictional practice draft…'],plan:['Plan my next steps','Three activities based on your recorded learning progress.','Help me choose three useful learning activities.'],scenario:['Create a scenario','A new fictional case for you to reason through.','Create a beginner case about webhook delivery failures.']};
let aiMode='explain',aiBusy=false,aiLoading=false,aiClient=null,aiClientPromise=null;
let aiLoadRequest=0;
let aiStatus={state:'idle',detail:'Load once, then ask questions on this device.',progress:0};
const aiDrafts=Object.fromEntries(Object.keys(aiModes).map(id=>[id,{message:'',context:'',result:'',error:''}]));
const originalRenderPage=renderPage;
renderPage=function(){if(currentPage==='ai')renderAI();else originalRenderPage();};
function aiProgressContext(){return JSON.stringify({topics:modules.map(m=>({topic:m.title,learned:!!db.learning[m.id]?.complete,practiceBest:pct(m.id)})),casesCompleted:completed(db.cases),communicationReviews:completed(db.communication),recallCardsDue:dueCards().length});}
function aiSupportMessage(){
  if(location.protocol==='file:')return 'Use the local launcher or a private HTTPS website for AI. The learning tools still work from this file.';
  if(!globalThis.isSecureContext)return 'AI requires HTTPS or the local SupportLab launcher.';
  if(!navigator.gpu)return 'WebGPU is unavailable in this browser. Try a current Chrome or Edge browser on a computer with graphics acceleration available.';
  return '';
}
function aiStatusChanged(status){
  aiStatus=status;
  if(currentPage!=='ai')return;
  const text=$('#aiStatusText'),progress=$('#aiLoadProgress');
  if(text)text.textContent=status.detail;
  if(progress){progress.value=status.progress;progress.setAttribute('aria-valuetext',Math.round(status.progress*100)+'%');}
}
async function getAIClient(){
  if(!aiClientPromise)aiClientPromise=import('./browser-ai.mjs').then(({BrowserCoach})=>aiClient=new BrowserCoach({onStatus:aiStatusChanged})).catch(error=>{aiClientPromise=null;throw error;});
  return aiClientPromise;
}
function renderAI(){
  const mode=aiModes[aiMode],draft=aiDrafts[aiMode],unsupported=aiSupportMessage(),locked=aiBusy||aiLoading,ready=aiStatus.state==='ready';
  $('#page').innerHTML=heading('FREE AI LEARNING COACH','A second perspective. On your device.','Explain concepts, investigate evidence and improve your writing with an open-source model. Your questions stay in this browser.')+`
    <div class="ai-engine-card" aria-labelledby="aiEngineTitle">
      <div class="ai-engine-intro"><span class="ai-engine-symbol" aria-hidden="true">✦</span><div><h3 id="aiEngineTitle">Free AI · Qwen 2.5</h3><p>No API key. No per-answer fee. Runs on your computer.</p></div><span class="badge local-badge">Device local</span></div>
      <div class="ai-engine-controls"><div><p id="aiStatusText" role="status">${escapeHTML(unsupported||aiStatus.detail)}</p>${aiLoading?'<progress id="aiLoadProgress" max="1" value="'+aiStatus.progress+'" aria-label="AI model loading progress"></progress>':''}</div><div class="ai-engine-buttons">${ready?button('Unload AI',`id="aiUnload" ${locked?'disabled':''}`,'secondary-button'):aiLoading?button('Cancel loading','id="aiStopLoad"','secondary-button'):button(aiStatus.state==='error'?'Retry loading':'Load free AI',`id="aiLoad" ${unsupported||locked?'disabled':''}`)}</div></div>
      <details class="ai-requirements"><summary>First-use download & privacy</summary><p>The first load downloads about 1 GB of public model files from Hugging Face and GitHub and caches them in your browser. Allow roughly 2 GB of available graphics memory. Performance varies by device. Your questions, training context and replies are processed locally; SupportLab does not send them to an AI service.</p><p>Use Chrome or Edge with WebGPU on HTTPS or through the local launcher. Clearing browser site data may remove the cached model. Downloaded files may remain after unloading AI.</p><p><a href="https://huggingface.co/Qwen/Qwen2.5-1.5B-Instruct" target="_blank" rel="noopener noreferrer">Qwen model · Apache 2.0</a> · <a href="https://github.com/mlc-ai/web-llm" target="_blank" rel="noopener noreferrer">WebLLM runtime · Apache 2.0</a></p></details>
      ${unsupported?'<p class="ai-alternative">You can still use the <a href="#kb">knowledge base</a>, <a href="#reference">reference guides</a> and <a href="#communication">writing checklist</a>.</p>':''}
    </div>
    <div class="ai-layout"><aside class="panel-card ai-modes"><p class="eyebrow">CHOOSE YOUR TASK</p>${Object.entries(aiModes).map(([id,[name,copy]])=>button(`<strong>${name}</strong><small>${copy}</small>`,`data-ai-mode="${id}" aria-pressed="${id===aiMode}" ${locked?'disabled':''}`,'ai-mode '+(id===aiMode?'active':''))).join('')}<div class="ai-note"><span class="ai-spark" aria-hidden="true">✦</span><p>Keep your own judgment.<br>Check advice against the evidence.</p></div></aside>
    <article class="panel-card ai-main" aria-busy="${aiBusy}"><div class="ai-title-row"><div><p class="eyebrow">GUIDED SUPPORT PRACTICE</p><h3>${mode[0]}</h3></div><span class="badge">Free AI</span></div><p>${mode[1]}</p>
      <form id="aiForm"><label for="aiMessage">${aiMode==='review'?'Your fictional practice draft':'What would you like help with?'}</label><textarea id="aiMessage" rows="6" maxlength="3000" required minlength="5" ${locked?'disabled':''} placeholder="${mode[2]}" aria-describedby="aiPrivacy">${escapeHTML(draft.message)}</textarea>
        <div class="ai-input-meta"><span id="aiPrivacy">Use fictional examples. No passwords or customer records.</span><span id="aiCount">${draft.message.length}/3000</span></div>
        <details class="ai-context"><summary>Training context used by the coach</summary><label for="aiContext">Optional context</label><textarea id="aiContext" rows="3" maxlength="2500" ${locked?'disabled':''}>${escapeHTML(draft.context)}</textarea><p class="muted">Your question, this context and matching knowledge-base excerpts are processed on your device. Drafts and replies are session-only unless you download them.</p></details>
        <div class="workflow-actions">${button('Clear',`id="aiClear" type="button" ${locked?'disabled':''}`,'secondary-button')}<div>${aiBusy?button('Stop answer','id="aiCancel" type="button"','secondary-button'):''}<button id="aiSubmit" class="primary-button" ${!ready||locked?'disabled':''}>${aiBusy?'Writing…':'Ask AI coach'} <span aria-hidden="true">↗</span></button></div></div>
        ${!ready&&!locked?'<p class="muted ai-start-hint">'+(unsupported?'The learning guides and exercises remain available on this device.':'Write your question now, then load free AI above to ask.')+'</p>':''}
      </form>
      <div class="feedback caution" id="aiError" role="status" ${draft.error?'':'hidden'}>${escapeHTML(draft.error)}</div>
      ${aiBusy?'<div class="ai-working" role="status"><span aria-hidden="true"></span> Preparing guidance on this device…</div>':''}
      <section class="ai-answer" ${draft.result?'':'hidden'}><p class="eyebrow">COACHING NOTES</p><div class="ai-answer-text">${escapeHTML(draft.result)}</div><div class="ai-answer-footer"><span>AI-generated · Verify against the evidence</span>${button('Download notes',`id="aiDownload" ${aiBusy?'disabled':''}`,'text-button')}</div></section>
      <div class="ai-empty" ${draft.result||aiBusy?'hidden':''}><span aria-hidden="true">✦</span><h3>Good questions build good judgment.</h3><p>Include what you observed, what you expected and what you have already checked.</p></div>
    </article></div>`;
  $$('[data-ai-mode]').forEach(b=>b.onclick=()=>{if(locked)return;aiMode=b.dataset.aiMode;if(aiMode==='plan'&&!aiDrafts.plan.message){aiDrafts.plan.context=aiProgressContext();aiDrafts.plan.message='Suggest three focused next steps based on my recorded learning progress.';}renderAI();});
  $('#aiMessage').oninput=e=>{draft.message=e.target.value;$('#aiCount').textContent=draft.message.length+'/3000';};
  $('#aiContext').oninput=e=>draft.context=e.target.value;
  $('#aiClear').onclick=()=>{if(locked)return;Object.assign(draft,{message:'',context:'',result:'',error:''});renderAI();};
  $('#aiLoad')?.addEventListener('click',loadAI);
  $('#aiStopLoad')?.addEventListener('click',()=>{++aiLoadRequest;aiClient?.unload();aiLoading=false;aiStatus={state:'idle',detail:'Loading cancelled. You can load AI when ready.',progress:0};renderAI();});
  $('#aiUnload')?.addEventListener('click',()=>{aiClient?.unload();renderAI();});
  $('#aiCancel')?.addEventListener('click',()=>aiClient?.cancel());
  $('#aiDownload')?.addEventListener('click',()=>download('supportlab-ai-notes.txt',draft.result,'text/plain'));
  $('#aiForm').onsubmit=askAI;
}
async function loadAI(){
  if(aiLoading||aiBusy)return;const draft=aiDrafts[aiMode],request=++aiLoadRequest;draft.error='';aiLoading=true;renderAI();
  try{const client=await getAIClient();if(request===aiLoadRequest)await client.load();}catch(error){if(request===aiLoadRequest)draft.error=error.message||'The model could not be loaded. Check your connection and device support, then retry.';}
  finally{if(request===aiLoadRequest){aiLoading=false;if(currentPage==='ai')renderAI();}}
}
async function askAI(event){
  event.preventDefault();if(aiBusy||aiLoading)return;
  const draft=aiDrafts[aiMode],mode=aiMode;
  draft.message=$('#aiMessage').value;draft.context=$('#aiContext').value;
  if(!aiClient||aiStatus.state!=='ready'){draft.error='Load the free AI model first.';renderAI();return;}
  aiBusy=true;draft.error='';draft.result='';renderAI();
  try{
    const result=await aiClient.generate({action:mode,message:draft.message,context:draft.context},kbArticles,text=>{
      draft.result=text;
      if(currentPage==='ai'&&aiMode===mode){$('.ai-answer').hidden=false;$('.ai-answer-text').textContent=text;$('.ai-empty').hidden=true;}
    });
    draft.result=result.answer;
    if(result.cancelled)draft.error='Answer stopped. Any notes shown are partial.';
    else if(result.incomplete)draft.error='The answer reached its length limit. Ask a narrower question for more detail.';
  }catch(error){draft.error=/context|token.*limit|window size/i.test(error.message)?'This question is too long for the compact model. Shorten the question or training context.':error.message||'The local model could not answer. Try a shorter question.';}
  finally{aiBusy=false;if(currentPage==='ai')renderAI();}
}
document.addEventListener('click',event=>{
  const b=event.target.closest('[data-coach-task]');if(!b||aiBusy||aiLoading)return;
  const mode=b.dataset.coachTask;if(!Object.hasOwn(aiDrafts,mode))return;
  aiMode=mode;const draft=aiDrafts[mode];draft.result='';draft.error='';
  if(mode==='review'){draft.message=commDraft.slice(0,3000);draft.context=communicationTasks[commIndex].prompt;}
  else if(mode==='hint'&&investigation){draft.message='What should I think about next? Give me one hint.';draft.context=JSON.stringify({symptom:investigation.scenario.symptom,evidence:investigation.scenario.evidence,decisions:investigation.trail}).slice(0,2500);}
  else{draft.context=aiProgressContext();draft.message='Help me choose my next learning activity.';}
  location.hash='ai';if(currentPage==='ai')renderAI();
});
window.addEventListener('pagehide',()=>aiClient?.unload());
go(pages[location.hash.slice(1)]?location.hash.slice(1):'home');
