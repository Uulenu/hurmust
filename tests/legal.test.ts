import assert from 'node:assert/strict';
import evidence from '../legal-source-evidence.json';
import {provisions,scenarios} from '../src/data/catalog';
import {emptyIncident,matchIncident,searchProvisions,type Incident} from '../src/lib/legal/matcher';
import {isIncident,isPlan,isSnapshot} from '../src/lib/storage';
import {parseQuestion} from '../src/lib/advisor';
assert.equal(provisions.length,69);
assert.equal(new Set(provisions.map(p=>p.id)).size,69);
assert.equal(new Set(provisions.map(p=>p.lawId)).size,10);
for(const p of provisions){
 const source=evidence.find(e=>e.id===p.id);assert.ok(source,`Missing evidence ${p.id}`);
 assert.equal(source.sourceUrl,p.sourceUrl);assert.equal(source.reference,p.referenceLabel);
 assert.equal(source.checkedAt,p.verifiedAt);assert.equal(p.status,'ACTIVE');
 assert.ok(p.officialTextShort&&source.fullSourceParagraph.includes(p.officialTextShort.replace(/…$/,'')),`Incorrect extract ${p.id}`);
 assert.ok(p.sourceUrl.startsWith('https://legalinfo.mn/'));
}
for(const scenario of scenarios){const input={...emptyIncident,...scenario,age:scenario.age as Incident['age']};assert.ok(matchIncident(input).length,scenario.id);}
const school:Incident={...emptyIncident,description:'Ангийнхан намайг дээрэлхэж доромжилдог',category:'Дээрэлхэлт',location:'school',age:'child'};
assert.ok(matchIncident(school).some(m=>m.provision.lawId==='education'));
assert.ok(matchIncident(school).some(m=>m.provision.childOnly));
assert.ok(!matchIncident({...school,age:'adult'}).some(m=>m.provision.childOnly));
assert.ok(!matchIncident(school).some(m=>m.provision.lawId==='labour'||m.provision.lawId==='domestic'));
assert.ok(matchIncident({...school,location:'work',age:'adult'}).some(m=>m.provision.lawId==='labour'));
assert.equal(matchIncident({...emptyIncident,category:'Бусад',location:'other',description:'кофе авч уулаа'}).length,0);
assert.equal(matchIncident(school,provisions.map(p=>({...p,status:'REPEALED'}))).length,0);
assert.equal(matchIncident(school,provisions.map(p=>({...p,status:'UNVERIFIED'}))).length,0);
assert.deepEqual(searchProvisions('ДАРАМТ').map(p=>p.id),searchProvisions('дарамт').map(p=>p.id));
assert.ok(searchProvisions('10.2.6').some(p=>p.referenceLabel==='10.2.6'));
assert.ok(!isIncident({description:'bad'}));assert.ok(isIncident(school));
assert.ok(isPlan({id:'test',createdAt:new Date().toISOString(),incident:school,completed:[]}));
assert.ok(!isPlan({id:'test',createdAt:'bad',incident:school,completed:[0]}));
assert.ok(isSnapshot({draft:school,plans:[],bookmarks:[]}));assert.ok(!isSnapshot({draft:null,plans:['bad'],bookmarks:[]}));
assert.ok(parseQuestion('{"questionId":"consent"}'));assert.equal(parseQuestion('{"questionId":"invented-law"}'),null);assert.equal(parseQuestion('<html>bad</html>'),null);
console.log('PASS: 69 source records, all five scenarios, context/age exclusions, search, saved-data validation, AI output validation.');
