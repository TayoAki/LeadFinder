const {chromium}=require('/home/user/LeadFinder/node_modules/playwright');
const U='file:///home/user/LeadFinder/idea-engine/plans/managed-security-wazuh/ui/index.html';
const D='/home/user/LeadFinder/idea-engine/plans/managed-security-wazuh/ui/sim/review3/';
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--no-sandbox']});
 const pg=await b.newPage({viewport:{width:390,height:844}});
 await pg.goto(U); await pg.selectOption('#role','msp_tech').catch(e=>console.log('role sel hidden?',e.message.split('\n')[0]));
 await pg.click('.toggle-side'); await pg.waitForTimeout(300);
 await pg.screenshot({path:D+'x-phone-drawer.png'});
 await pg.click("[data-select='harbor']"); await pg.waitForTimeout(300);
 await pg.click("[data-tab='devices']"); await pg.waitForTimeout(200);
 console.log(await pg.locator('[data-testid=ctx]').innerText());
 await pg.screenshot({path:D+'x-phone-harbor-devices.png'});
 const small=await pg.evaluate(()=>[...document.querySelectorAll('button,a,select,input')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0&&(r.height<24||r.width<24)}).map(e=>(e.innerText||e.getAttribute('aria-label')||e.tagName).slice(0,30)+' '+Math.round(e.getBoundingClientRect().width)+'x'+Math.round(e.getBoundingClientRect().height)));
 console.log('small targets',small.length,small.slice(0,20));
 const unl=await pg.evaluate(()=>[...document.querySelectorAll('select,input')].filter(e=>!e.labels?.length&&!e.getAttribute('aria-label')&&!e.getAttribute('aria-labelledby')).map(e=>e.id||e.name||e.outerHTML.slice(0,60)));
 console.log('unlabelled',unl);
 await b.close();})();
