const {chromium}=require('/home/user/LeadFinder/node_modules/playwright');
const fs=require('fs');
const U='file:///home/user/LeadFinder/idea-engine/plans/managed-security-wazuh/ui/index.html';
const D='/home/user/LeadFinder/idea-engine/plans/managed-security-wazuh/ui/sim/review3/';
const P=JSON.parse(fs.readFileSync('/home/user/LeadFinder/idea-engine/plans/managed-security-wazuh/ui/personas.json')).personas;
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--no-sandbox']});
 const res=[];
 for(const [vn,vp] of [['d',{width:1440,height:900}],['m',{width:390,height:844}]]){
  for(const p of P){ let ti=0;
   for(const t of p.tasks){ ti++;
    const pg=await b.newPage({viewport:vp}); const errs=[];
    pg.on('pageerror',e=>errs.push(e.message));
    await pg.goto(U);
    const stepErr=[];
    for(const s of t.steps){
      try{
       if(s.select) await pg.selectOption(s.select,s.value,{timeout:3000});
       else if(s.click){ const l=pg.locator(s.click).first(); await l.scrollIntoViewIfNeeded({timeout:3000}).catch(()=>{}); await l.click({timeout:3000}); }
       else if(s.fill) await pg.fill(s.fill,s.value,{timeout:3000});
       await pg.waitForTimeout(150);
      }catch(e){stepErr.push(JSON.stringify(s)+': '+e.message.split('\n')[0]);}
    }
    const fails=[];
    for(const e of t.expect){ const n=await pg.locator(e).count().catch(()=>-1); if(n<1) fails.push(e); }
    await pg.screenshot({path:`${D}${vn}-${p.id}-t${ti}.png`,fullPage:true});
    res.push({vp:vn,id:p.id,task:t.name,stepErr,fails,errs});
    await pg.close();
   }
  }
 }
 fs.writeFileSync(D+'results.json',JSON.stringify(res,null,1));
 for(const r of res) if(r.stepErr.length||r.fails.length||r.errs.length) console.log(JSON.stringify(r));
 console.log('done',res.length);
 await b.close();
})();
