import fs from 'node:fs';
const root=new URL('../',import.meta.url);
const html=fs.readFileSync(new URL('index.html',root),'utf8');
fs.writeFileSync(new URL('lib/workspace-shell.ts',root),'export default '+JSON.stringify(html)+';\n');
for(const name of ['app.js','data.js','style.css','ai.js','browser-ai.mjs','coach-prompts.mjs','ai-worker.mjs','favicon.svg','README.md','THIRD_PARTY_NOTICES.md'])fs.copyFileSync(new URL(name,root),new URL('public/'+name,root));
fs.cpSync(new URL('vendor/',root),new URL('public/vendor/',root),{recursive:true});
console.log('Workspace assets synchronized. No credential files included.');
