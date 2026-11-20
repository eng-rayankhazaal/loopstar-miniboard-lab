import test from 'node:test';
import assert from 'node:assert/strict';
import {seedLifecycle,isReadyForFirstCycle} from '../src/seed.mjs';
import {createMiniBoardServer} from '../src/server.mjs';

test('seed does not falsely claim a completed development cycle',()=>{
  assert.equal(isReadyForFirstCycle(),true);
  assert.deepEqual(seedLifecycle,{phase:'seed',completedCycles:0,requiredCycles:2});
});

test('local server serves the seed and rejects other routes/mutations',async()=>{
  const server=createMiniBoardServer();
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const base=`http://127.0.0.1:${server.address().port}`;
  try{
    const a=await fetch(base);assert.equal(a.status,200);
    assert.match(await a.text(),/MiniBoard/);
    assert.match(a.headers.get('content-security-policy'),/default-src 'none'/);
    assert.equal((await fetch(base+'/../secret.txt')).status,404);
    assert.equal((await fetch(base,{method:'POST'})).status,405);
    const css=await fetch(base+'/styles.css');assert.equal(css.status,200);
    assert.match(css.headers.get('content-type'),/text\/css/);
  }finally{await new Promise((resolve,reject)=>server.close(e=>e?reject(e):resolve()));}
});
