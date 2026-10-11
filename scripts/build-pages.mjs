import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=new URL('../',import.meta.url);
const out=new URL('pages-dist/',root);
// Publish only this explicit list, never the checkout or environment files.
const files=['index.html','style.css','data.js','app.js','ai.js','browser-ai.mjs','coach-prompts.mjs','ai-worker.mjs','favicon.svg','THIRD_PARTY_NOTICES.md','vendor/webllm.js','vendor/WebLLM-LICENSE.txt','vendor/loglevel-LICENSE.txt'];
fs.mkdirSync(out,{recursive:true});
for(const name of files){
 const source=new URL(name,root),target=new URL(name,out);
 if(!fs.lstatSync(source).isFile())throw Error('Expected regular asset: '+name);
 fs.mkdirSync(new URL('./',target),{recursive:true});
 fs.copyFileSync(source,target);
}
const legal=new URL('vendor/webllm.js.LEGAL.txt',root);
if(fs.existsSync(legal))fs.copyFileSync(legal,new URL('vendor/webllm.js.LEGAL.txt',out));
fs.writeFileSync(new URL('.nojekyll',out),'');
const allowed=new Set([...files,'vendor/webllm.js.LEGAL.txt','.nojekyll']);
for(const entry of fs.readdirSync(out,{recursive:true,withFileTypes:true})){
 if(entry.isDirectory())continue;
 const relative=path.relative(fileURLToPath(out),path.join(entry.parentPath,entry.name)).split(path.sep).join('/');
 if(!entry.isFile()||!allowed.has(relative))throw Error('Unexpected file in publish folder: '+relative);
}
console.log('GitHub Pages assets prepared from the public asset allowlist.');
