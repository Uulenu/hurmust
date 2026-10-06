import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('routes, wrapping, navigation, keyboard and accessibility',async({page},testInfo)=>{
 test.setTimeout(90000);
 const accessibility:{route:string;id:string;nodes:unknown[]}[]=[];const failures:string[]=[];page.on('pageerror',e=>failures.push(e.message));
 for(const route of ['/','/rights','/rights/privacy','/laws','/laws/education-10-2-6','/organizations','/guides/nhrc-complaint','/help','/advisor','/saved','/demo','/safety','/privacy']){
  await page.goto(route);await expect(page.locator('h1')).toBeVisible();await page.waitForLoadState('networkidle');
  if(['/','/laws','/help','/advisor','/saved'].includes(route)){const audit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();accessibility.push(...audit.violations.map(v=>({route,id:v.id,nodes:v.nodes.map(n=>n.target)})));}
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+1);expect(overflow,route).toBe(false);
 }
 await page.goto('/');
 // Safari's default macOS keyboard mode reaches links with Option-Tab.
 await page.keyboard.press(testInfo.project.name.includes('webkit')?'Alt+Tab':'Tab');await expect(page.getByRole('link',{name:'Үндсэн агуулга руу'})).toBeFocused();
 if(testInfo.project.name.startsWith('mobile')){await page.getByRole('button',{name:'Цэс нээх'}).click();await expect(page.getByRole('navigation',{name:'Нэмэлт цэс'})).toBeVisible();await page.getByRole('navigation',{name:'Нэмэлт цэс'}).getByRole('link',{name:'Жишээ нөхцөл'}).click();await expect(page).toHaveURL(/demo/);}
 await page.goto('/advisor');await page.emulateMedia({reducedMotion:'reduce'});
 const results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();accessibility.push(...results.violations.map(v=>({route:'/advisor',id:v.id,nodes:v.nodes.map(n=>n.target)})));expect(accessibility).toEqual([]);
 expect(failures).toEqual([]);
 await page.screenshot({path:`test-results/${testInfo.project.name}-advisor.png`,fullPage:true});
 if(testInfo.project.name==='chromium-desktop'){for(const width of [320,390,768,1024,1440]){await page.setViewportSize({width,height:900});for(const route of ['/','/advisor','/help/result?scenario=school','/saved']){await page.goto(route);expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),`${width} ${route}`).toBe(false);}await page.goto('/');await page.screenshot({path:`test-results/home-${width}.png`,fullPage:true});}}
});

test('Cyrillic search, filters, bookmarks and local deletion',async({page})=>{
 await page.goto('/laws');await page.getByRole('textbox',{name:'Хууль, эрх, асуудлаар хайх'}).fill('10.2.6');
 await expect(page.locator('.law-card')).toHaveCount(1);await page.getByRole('button',{name:'Заалтыг хадгалах',exact:true}).click();
 await page.goto('/saved');await expect(page.locator('.law-card')).toHaveCount(1);
 await page.goto('/laws');await page.getByRole('textbox',{name:'Хууль, эрх, асуудлаар хайх'}).fill('ДАРАМТ');await expect(page.locator('.law-card').first()).toBeVisible();
 await page.getByRole('button',{name:'Хайлтыг цэвэрлэх'}).click();await page.getByLabel('Хуулиар шүүх').selectOption('labour');
 await expect(page.locator('.law-card')).toHaveCount(7);
 await page.evaluate(()=>localStorage.setItem('unrelated','preserve'));
 await page.goto('/saved');await page.getByRole('button',{name:'Бүх мэдээллийг устгах',exact:true}).click();await page.getByRole('button',{name:'Тийм, бүгдийг устгах'}).click();
 await expect(page.locator('.law-card')).toHaveCount(0);expect(await page.evaluate(()=>localStorage.getItem('unrelated'))).toBe('preserve');
});

test('wizard, safety, saved progress, download and local advisor',async({page})=>{
 await page.goto('/help');await page.getByRole('button',{name:'Үргэлжлүүлэх',exact:true}).click();await expect(page.locator('.error[role=alert]')).toBeVisible();
 await page.getByRole('button',{name:'Дээрэлхэлт',exact:true}).click();await page.getByLabel('Насны бүлэг',{exact:false}).selectOption('child');
 await page.getByRole('button',{name:'Үргэлжлүүлэх',exact:true}).click();await page.getByRole('button',{name:'Сургууль',exact:true}).click();await page.getByRole('button',{name:'Үргэлжлүүлэх',exact:true}).click();
 await page.getByRole('textbox').fill('Ангийнхан намайг өдөр бүр дээрэлхэж доромжилдог.');await page.getByRole('button',{name:'Үргэлжлүүлэх',exact:true}).click();await page.getByRole('button',{name:'Үгүй, аюултай байна'}).click();await expect(page.getByRole('link',{name:'108 · Хүүхдийн тусламж'})).toBeVisible();
 await page.getByRole('button',{name:'Үргэлжлүүлэх',exact:true}).click();await page.getByLabel('Зураг, бичлэг',{exact:true}).check();await page.getByRole('button',{name:'Үргэлжлүүлэх',exact:true}).click();await page.getByRole('button',{name:'Боломжит алхмаа харах',exact:true}).click();
 await expect(page).toHaveURL(/help\/result/);await expect(page.locator('.law-card').first()).toBeVisible();
 await page.locator('.action-checklist input').first().check();await page.getByRole('button',{name:'Алхмаа хадгалах',exact:true}).click();
 const download=page.waitForEvent('download');await page.getByRole('button',{name:'Татах',exact:true}).click();expect((await download).suggestedFilename()).toContain('HURMUST');
 await page.goto('/saved');await page.getByRole('link',{name:'Төлөвлөгөө нээх',exact:true}).click();await expect(page.locator('.action-checklist input').first()).toBeChecked();
 await page.locator('.action-checklist input').first().uncheck();await page.getByRole('button',{name:'Алхмаа хадгалах',exact:true}).click();await page.reload();await expect(page.locator('.action-checklist input').first()).not.toBeChecked();
 await page.goto('/advisor');await page.getByRole('textbox',{name:'Таны асуулт'}).fill('Дарга намайг ажлын байранд доромжилдог.');await page.getByRole('button',{name:'Асуултаа илгээх'}).click();await expect(page.locator('.chat-message.assistant')).toBeVisible();await expect(page.locator('.chat-message.assistant .law-card').first()).toBeVisible();
 await page.getByLabel('xKiro-той ярилцах').check();await page.getByRole('textbox',{name:'Таны асуулт'}).fill('Надад туслаач');await page.getByRole('button',{name:'Асуултаа илгээх'}).click();await expect(page.locator('.error[role=alert]')).toContainText('зөвшөөрлөө');
});

test('all demo scenarios show source-backed results and API failures are JSON',async({page,request})=>{
 for(const scenario of ['university','photo','work','school','complaint']){await page.goto(`/help/result?scenario=${scenario}`);await expect(page.locator('.law-card').first()).toBeVisible();expect(await page.locator('.law-card a[href^="https://legalinfo.mn/"]').count()).toBeGreaterThan(0);}
 const invalid=await request.post('/api/advisor',{data:{message:'test'}});expect(invalid.status()).toBe(400);expect(invalid.headers()['content-type']).toContain('application/json');await expect(page.locator('h1')).toBeVisible();
});

test('Supabase upload, second-device restore and cloud deletion',async({page,browser},testInfo)=>{
 test.setTimeout(120000);
 test.skip(testInfo.project.name!=='chromium-desktop'||!process.env.TEST_QA_FILE,'Requires disposable integration account; run once against real Supabase.');
 const fs=await import('node:fs/promises');const qa=JSON.parse(await fs.readFile(process.env.TEST_QA_FILE!,'utf8'));
 async function login(p:typeof page){await p.goto('/saved');await p.getByLabel('Цахим шуудан',{exact:true}).fill(qa.email);await p.getByLabel('Нууц үг',{exact:false}).fill(qa.password);await p.getByRole('button',{name:'Нэвтрэх',exact:true}).click();await expect(p.getByText('Нэвтэрсэн хаяг:',{exact:false})).toBeVisible({timeout:30000});}
 await login(page);
 await page.evaluate(()=>localStorage.setItem('hurmust:draft',JSON.stringify({category:'Дарамт',location:'work',description:'Туршилтын өгөгдөл — бодит хүний мэдээлэл биш.',safetyStatus:'safe',age:'adult',evidence:[]})));
 await page.getByLabel('Ноорог дахь тайлбар',{exact:false}).check();await page.getByRole('button',{name:'Үүлэнд хадгалах',exact:true}).click();await page.getByRole('button',{name:'Тийм, үргэлжлүүлэх',exact:true}).click();await expect(page.getByText('Ноорог, төлөвлөгөө, хадгалсан заалтууд Supabase-д хадгалагдлаа.',{exact:true})).toBeVisible();
 const other=await browser.newContext({baseURL:process.env.TEST_BASE_URL||'http://localhost:3100'});const second=await other.newPage();await login(second);await second.getByRole('button',{name:'Үүлнээс сэргээх',exact:true}).click();await second.getByRole('button',{name:'Тийм, үргэлжлүүлэх',exact:true}).click();await expect(second.getByText('Үүлэн хадгалалтын мэдээллийг энэ төхөөрөмж дээр сэргээлээ.',{exact:true})).toBeVisible();
 expect(await second.evaluate(()=>JSON.parse(localStorage.getItem('hurmust:draft')!).description)).toContain('Туршилтын өгөгдөл');
 await second.getByRole('button',{name:'Үүлэн мэдээллээ устгах',exact:true}).click();await second.getByRole('button',{name:'Тийм, үргэлжлүүлэх',exact:true}).click();await expect(second.getByText('Supabase дахь ноорог, төлөвлөгөө, хадгалсан заалтуудыг устгалаа.',{exact:false})).toBeVisible();await other.close();
});
