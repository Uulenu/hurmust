import { provisions, topicKeywords } from '@/data/catalog';
import type { LegalProvision, ConfidenceLevel } from './types';
export interface Incident {category:string;location:string;description:string;safetyStatus:'safe'|'unsafe'|'unsure';evidence:string[];age:'child'|'adult'|'unknown'}
export interface LegalMatch {provision:LegalProvision;confidence:ConfidenceLevel;reason:string;score:number}
export const emptyIncident:Incident={category:'',location:'',description:'',safetyStatus:'safe',evidence:[],age:'unknown'};
export function incidentTopics(incident:Incident){
 const text=`${incident.category} ${incident.description}`.toLocaleLowerCase('mn');
 const topics=new Set(Object.entries(topicKeywords).filter(([,words])=>words.some(w=>text.includes(w))).map(([topic])=>topic));
 if(['school','university'].includes(incident.location))topics.add('education');
 if(incident.location==='work')topics.add('work');
 if(incident.location==='home'&&topics.has('safety'))topics.add('violence');
 if(incident.age==='child')topics.add('children');
 return [...topics];
}
// ponytail: local keyword scoring; replace with reviewed context rules when the curated library grows.
export function matchIncident(incident:Incident,dataset:LegalProvision[]=provisions):LegalMatch[]{
 const topics=incidentTopics(incident);
 const text=`${incident.description} ${incident.category}`.toLocaleLowerCase('mn');
 return dataset.flatMap(provision=>{
  if(provision.status!=='ACTIVE'||!provision.verifiedAt||!provision.sourceUrl.startsWith('https://legalinfo.mn/'))return [];
  if(provision.childOnly&&incident.age!=='child')return [];
  if(provision.contexts?.length&&!provision.contexts.includes(incident.location))return [];
  if(provision.lawId==='domestic'&&incident.location!=='home')return [];
  if(provision.lawId==='nhrc'&&!topics.includes('justice'))return [];
  if(provision.lawId==='protection'&&provision.article==='23'&&!['school','university'].includes(incident.location))return [];
  const hits=provision.relatedTopics.filter(t=>topics.includes(t));
  if(!hits.length)return [];
  const specific=provision.lawId==='labour'||provision.lawId==='education'||provision.lawId==='protection';
  let score=hits.length*2+(specific?3:0)+provision.keywords.filter(k=>text.includes(k)).length;
  if(provision.lawId==='criminal'||provision.lawId==='violations')score=1;
  const confidence:ConfidenceLevel=score>=6?'high':score>=3?'medium':'low';
  return [{provision,score,confidence,reason:provision.lawId==='criminal'||provision.lawId==='violations'?'Гэмт хэрэг, зөрчлийн шинж болон нэмэлт нөхцөлийг эрх бүхий байгууллага шалгана.':`${hits.length} холбогдох сэдэв${specific?', орчны мэдээлэл':''} таарсан.`}];
 }).sort((a,b)=>b.score-a.score||a.provision.id.localeCompare(b.provision.id)).slice(0,12);
}
export function searchProvisions(query:string,dataset=provisions){
 const words=query.trim().toLocaleLowerCase('mn').split(/\s+/).filter(Boolean);
 if(!words.length)return dataset.filter(p=>p.status==='ACTIVE');
 const topicHits=Object.entries(topicKeywords).filter(([,keys])=>keys.some(key=>words.some(w=>w.startsWith(key)||key.startsWith(w)))).map(([id])=>id);
 return dataset.filter(p=>p.status==='ACTIVE').map(p=>({p,score:words.reduce((n,w)=>n+(`${p.lawName} ${p.referenceLabel} ${p.plainLanguageSummary} ${p.keywords.join(' ')}`.toLocaleLowerCase('mn').includes(w)?3:0),0)+p.relatedTopics.filter(t=>topicHits.includes(t)).length})).filter(x=>x.score>0).sort((a,b)=>b.score-a.score).map(x=>x.p);
}
