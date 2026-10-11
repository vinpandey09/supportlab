import http from 'node:http';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {spawn} from 'node:child_process';
const root=fileURLToPath(new URL('../',import.meta.url));
export async function startPreview({port=4173}={}){
 const server=http.createServer(async(req,res)=>{
  const boundPort=server.address().port;
  const origin=`http://127.0.0.1:${boundPort}`;
  if(req.headers.host!==`127.0.0.1:${boundPort}`){res.writeHead(403);return res.end('Local preview only.');}
  const url=new URL(req.url,origin);
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);return res.end('Read-only local website.');}
  const name=url.pathname==='/'?'index.html':url.pathname.slice(1);
  const allowed=['index.html','style.css','data.js','app.js','ai.js','browser-ai.mjs','coach-prompts.mjs','ai-worker.mjs','README.md','THIRD_PARTY_NOTICES.md','favicon.svg','vendor/webllm.js','vendor/webllm.js.LEGAL.txt','vendor/WebLLM-LICENSE.txt','vendor/loglevel-LICENSE.txt'];
  if(!allowed.includes(name)){res.writeHead(404);return res.end('Not found');}
  try{const body=fs.readFileSync(path.join(root,name));res.writeHead(200,{'Content-Type':({'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css','.md':'text/plain; charset=utf-8','.txt':'text/plain; charset=utf-8','.svg':'image/svg+xml'})[path.extname(name)],'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(req.method==='HEAD'?undefined:body);}catch{res.writeHead(404);res.end('Not found');}
 });
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(port,'127.0.0.1',resolve);});
 return server;
}
if(typeof process!=='undefined'&&process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 let server;
 try{
  server=await startPreview();
  const address='http://127.0.0.1:4173/';
  await new Promise((resolve,reject)=>{
   const request=http.get(address,response=>{
    let body='';response.setEncoding('utf8');response.on('data',chunk=>body+=chunk);
    response.on('end',()=>response.statusCode===200&&body.includes('SupportLab')?resolve():reject(new Error('The website did not return the expected page.')));
   });
   request.setTimeout(5000,()=>request.destroy(new Error('The local connection check timed out.')));
   request.on('error',reject);
  });
  console.log('\nSupportLab is ready: '+address+'\nConnection check passed. Keep this window open while using the website.\nPress Ctrl+C to stop.');
  if(process.argv.includes('--open')&&process.platform==='win32'){
   const browser=spawn('explorer.exe',[address],{windowsHide:true,stdio:'ignore'});
   browser.on('error',()=>console.log('Could not open your browser automatically. Paste the address above into Chrome or Edge.'));
  }
 }catch(error){
  if(server){server.closeAllConnections();server.close();}
  console.error('\nSupportLab could not start: '+error.message);
  if(error.code==='EADDRINUSE')console.error('Port 4173 is already in use. Close the previous SupportLab launcher and try again.');
  console.error('Copy this message when asking for help.');process.exitCode=1;
 }
}
