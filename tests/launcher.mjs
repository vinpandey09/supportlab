import assert from 'node:assert/strict';
import http from 'node:http';
import {startPreview} from '../scripts/preview.mjs';
const server=await startPreview({port:0}),port=server.address().port;let checks=0;
try{
 for(const asset of ['/','/ai.js','/browser-ai.mjs','/coach-prompts.mjs','/ai-worker.mjs','/vendor/webllm.js','/favicon.svg','/vendor/loglevel-LICENSE.txt']){
  const response=await fetch(`http://127.0.0.1:${port}${asset}`);assert.equal(response.status,200,asset);checks++;
  if(asset.endsWith('.mjs')){assert(response.headers.get('content-type').includes('javascript'));checks++;}
  await response.arrayBuffer();
 }
 for(const asset of ['/.env.local','/api/coach','/package.json','/scripts/preview.mjs','/%2eenv.local']){
  const response=await fetch(`http://127.0.0.1:${port}${asset}`);assert.equal(response.status,404,asset);checks++;await response.arrayBuffer();
 }
 const spoofStatus=await new Promise((resolve,reject)=>{const request=http.get(`http://127.0.0.1:${port}/`,{headers:{Host:'external.example'}},response=>{response.resume();response.on('end',()=>resolve(response.statusCode));});request.on('error',reject);});assert.equal(spoofStatus,403);checks++;
 const post=await fetch(`http://127.0.0.1:${port}/`,{method:'POST'});assert.equal(post.status,405);checks++;await post.arrayBuffer();
 console.log(`${checks} local launcher HTTP checks passed.`);
}finally{server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
