import http from 'node:http';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
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
if(typeof process!=='undefined'&&process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){await startPreview();console.log('SupportLab preview: http://127.0.0.1:4173');}

