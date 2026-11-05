import { test } from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
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
