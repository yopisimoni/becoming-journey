import { test } from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { makeGateway, MODEL } from './server.mjs';

async function setup(env, fetcher) {
  const server=makeGateway({env,fetcher});server.listen(0,'127.0.0.1');await once(server,'listening');
  const url=`http://127.0.0.1:${server.address().port}`;
  return {url, close:()=>new Promise(resolve=>server.close(resolve))};
}
const base={GROQ_GATEWAY_ENABLED:'true',GROQ_API_KEY:'test-only',GATEWAY_INTERNAL_TOKEN:'test-internal',GROQ_DAILY_REQUEST_CAP:'1'};
const request=(url,body,token='test-internal')=>fetch(`${url}/internal/greeting`,{method:'POST',headers:{'content-type':'application/json',authorization:`Bearer ${token}`},body:JSON.stringify(body)});
const permitted={locale:'ar',stage:'welcome',approvedForExternalProcessing:true};

test('no-key and disabled services fail closed, without provider calls',async()=>{
 let calls=0;const g=await setup({GROQ_GATEWAY_ENABLED:'false',GATEWAY_INTERNAL_TOKEN:'test-internal'},async()=>{calls++});
 try{assert.equal((await request(g.url,permitted)).status,503);assert.equal(calls,0)}finally{await g.close()}
});
test('authentication and explicit request approval are required',async()=>{
 let calls=0;const g=await setup(base,async()=>{calls++});
 try{assert.equal((await request(g.url,permitted,'wrong')).status,401);assert.equal((await request(g.url,{...permitted,approvedForExternalProcessing:false})).status,422);assert.equal((await request(g.url,{...permitted,notes:'private'})).status,422);assert.equal(calls,0)}finally{await g.close()}
});
test('predefined locale and stage only, response validated, daily cap applied',async()=>{
 let calls=0, upstream;
 const g=await setup(base,async(_url,options)=>{calls++;upstream=JSON.parse(options.body);return {ok:true,json:async()=>({choices:[{message:{content:'مرحباً بك في لحظة هادئة.'}}]})}});
 try{assert.equal((await request(g.url,{...permitted,stage:'unknown'})).status,422);
  const response=await request(g.url,permitted);assert.equal(response.status,200);assert.equal((await response.json()).provider,'groq');assert.equal(upstream.model,MODEL);assert.equal(upstream.messages[1].content.includes('private'),false);
  assert.equal((await request(g.url,permitted)).status,429);assert.equal(calls,1)
 }finally{await g.close()}
});

test('mounted secret files work; missing secret files fail closed',async()=>{
 const dir=mkdtempSync(join(tmpdir(),'becoming-groq-test-'));
 try {
   const key=join(dir,'key'), token=join(dir,'token');
   writeFileSync(key,'test-file-key\n',{mode:0o600});writeFileSync(token,'test-file-token\n',{mode:0o600});
   let captured;
   const env={GROQ_GATEWAY_ENABLED:'true',GROQ_API_KEY_FILE:key,GATEWAY_INTERNAL_TOKEN_FILE:token};
   const g=await setup(env,async(_url,options)=>{captured=options.headers.Authorization;return {ok:true,json:async()=>({choices:[{message:{content:'A peaceful moment awaits.'}}]})}});
   try { const res=await request(g.url,{locale:'en',stage:'pause',approvedForExternalProcessing:true},'test-file-token'); assert.equal(res.status,200);assert.equal(captured,'Bearer test-file-key') }finally{await g.close()}
   const missing=await setup({...env,GROQ_API_KEY_FILE:join(dir,'missing')},async()=>{throw Error('must not call provider')});
   try {assert.equal((await request(missing.url,permitted,'test-file-token')).status,503)} finally{await missing.close()}
 }finally{rmSync(dir,{recursive:true,force:true})}
});
