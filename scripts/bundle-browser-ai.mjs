import {build} from 'esbuild';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
const root=new URL('../',import.meta.url);
fs.mkdirSync(new URL('vendor/',root),{recursive:true});
await build({entryPoints:[fileURLToPath(new URL('scripts/browser-ai-entry.mjs',root))],outfile:fileURLToPath(new URL('vendor/webllm.js',root)),bundle:true,format:'esm',platform:'browser',target:'es2022',minify:true,legalComments:'linked'});
fs.copyFileSync(new URL('node_modules/@mlc-ai/web-llm/LICENSE',root),new URL('vendor/WebLLM-LICENSE.txt',root));
fs.copyFileSync(new URL('node_modules/loglevel/LICENSE-MIT',root),new URL('vendor/loglevel-LICENSE.txt',root));
console.log('Open-source browser AI bundled locally.');
