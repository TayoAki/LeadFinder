const {chromium}=require('/home/user/LeadFinder/node_modules/playwright');
const fs=require('fs');
const U='file:///home/user/LeadFinder/idea-engine/plans/managed-security-wazuh/ui/index.html';
const D='/home/user/LeadFinder/idea-engine/plans/managed-security-wazuh/ui/sim/review3/';
const roles=['owner','office','it','hr','staff','trial','group_coo','msp_tech','msp_am','msp_owner','auditor','broker','counsel','vendor_risk'];
const EXP='.app{height:auto!important;min-height:100vh} .main,.content{overflow:visible!important}';
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--no-sandbox']});
 let txt='';
 for(const scheme of ['light','dark']){
 for(const [vn,vp] of [['d',{width:1440,height:900}],['m',{width:390,height:844}]]){
  if(scheme==='dark'&&vn==='m') {}
  for(const r of roles){
   const pg=await b.newPage({viewport:vp,colorScheme:scheme});
   const errs=[]; pg.on('pageerror',e=>errs.push(e.message));
   await pg.goto(U); await pg.selectOption('#role',r); await pg.waitForTimeout(200);
   const tabs=await pg.$$eval('.tabs [data-tab]',els=>els.map(e=>e.dataset.tab));
   for(const t of tabs){
     await pg.click(`.tabs [data-tab='${t}']`); await pg.waitForTimeout(150);
     if(scheme==='light'){
       if(vn==='d'){
        const c=await pg.evaluate(()=>{const g=s=>(document.querySelector(s)||{}).innerText||'';return {ctx:g('[data-testid=ctx]'),content:g('.content'),right:g('#right'),side:g('#side'),bb:g('#bb'),rail:[...document.querySelectorAll('.rail [data-view]')].map(b=>b.dataset.view+':'+(b.getAttribute('aria-label')||'')+(b.querySelector('.badge')?'['+b.querySelector('.badge').innerText+']':'')).join(',')}});
        txt+=`\n\n######## ROLE ${r} TAB ${t}\n--SIDE--\n${c.side}\n--RAIL-- ${c.rail}\n--CONTENT--\n${c.content}\n--RIGHT--\n${c.right}\n--BB-- ${c.bb}\n`;
       }
       const st=await pg.addStyleTag({content:EXP});
       await pg.screenshot({path:`${D}tour-${vn}-${r}-${t}.png`,fullPage:true});
       await st.evaluate(e=>e.remove());
     } else if(vn==='d' || ['overview','incidents'].includes(t)) {
       const st=await pg.addStyleTag({content:EXP});
       await pg.screenshot({path:`${D}dark-${vn}-${r}-${t}.png`,fullPage:true});
       await st.evaluate(e=>e.remove());
     }
   }
   if(scheme==='light'&&vn==='m') await pg.screenshot({path:`${D}tour-m-${r}-viewport.png`});
   if(errs.length) console.log(r,vn,errs);
   await pg.close();
  }
 }}
 fs.writeFileSync(D+'text.txt',txt);
 console.log('ok'); await b.close();
})();
