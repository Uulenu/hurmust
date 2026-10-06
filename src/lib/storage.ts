import type {Incident} from './legal/matcher';
export interface Plan {id:string;createdAt:string;incident:Incident;completed:number[]}
export interface Snapshot {draft:unknown;plans:unknown;bookmarks:unknown}
export function isPlan(value:unknown):value is Plan{if(!value||typeof value!=='object')return false;const p=value as Partial<Plan>;return typeof p.id==='string'&&p.id.length<=100&&typeof p.createdAt==='string'&&!Number.isNaN(Date.parse(p.createdAt))&&isIncident(p.incident)&&Array.isArray(p.completed)&&p.completed.every(n=>Number.isInteger(n)&&n>=0&&n<20);}
export function isSnapshot(value:unknown):value is Snapshot{if(!value||typeof value!=='object')return false;const s=value as Snapshot;return (s.draft===null||isIncident(s.draft))&&Array.isArray(s.plans)&&s.plans.length<=100&&s.plans.every(isPlan)&&Array.isArray(s.bookmarks)&&s.bookmarks.length<=500&&s.bookmarks.every(x=>typeof x==='string'&&x.length<=100);}
export const storageKeys={draft:'hurmust:draft',plans:'hurmust:plans',bookmarks:'hurmust:bookmarks'};
export function readLocal<T>(key:string,fallback:T):T{try{const value=localStorage.getItem(key);return value?JSON.parse(value) as T:fallback;}catch{return fallback;}}
export function writeLocal(key:string,value:unknown){try{localStorage.setItem(key,JSON.stringify(value));return true;}catch{return false;}}
export function eraseLocal(){try{Object.values(storageKeys).forEach(k=>localStorage.removeItem(k));sessionStorage.removeItem('hurmust:result');return true;}catch{return false;}}
export function isIncident(value:unknown):value is Incident {if(!value||typeof value!=='object')return false;const v=value as Partial<Incident>;return typeof v.description==='string'&&v.description.length<=5000&&typeof v.category==='string'&&typeof v.location==='string'&&['safe','unsafe','unsure'].includes(v.safetyStatus??'')&&['adult','child','unknown'].includes(v.age??'')&&Array.isArray(v.evidence)&&v.evidence.every(x=>typeof x==='string');}
