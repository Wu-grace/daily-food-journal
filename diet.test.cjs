const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const html=fs.existsSync('index.html')?fs.readFileSync('index.html','utf8'):'';
const source=html.match(/<script id="core">([\s\S]*?)<\/script>/)?.[1]||'';
const context={}; vm.createContext(context); vm.runInContext(source,context);
test('daily totals exclude other dates and accept unspecified calories',()=>{
 assert.equal(typeof context.dailyTotal,'function');
 assert.equal(context.dailyTotal([{date:'2026-10-17',calories:150},{date:'2026-10-17',calories:null},{date:'2026-10-16',calories:900}], '2026-10-17'),150);
});
test('backup rejects malformed, duplicate, and unsafe entries',()=>{
 assert.equal(typeof context.validateBackup,'function');
 const entry={id:'a',date:'2026-10-17',meal:'早餐',food:'燕麥',portion:'一碗',calories:250,note:''};
 assert.equal(context.validateBackup({version:1,entries:[entry]}).length,1);
 for(const entries of [[{...entry,calories:-1}],[{...entry,date:'2026-02-30'}],[entry,entry],[{...entry,food:''}],[{...entry,calories:'250'}]]) assert.throws(()=>context.validateBackup({version:1,entries}));
 assert.throws(()=>context.validateBackup({version:2,entries:[]}));
});
