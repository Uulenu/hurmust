'use client';
import Link from 'next/link';
import { useMemo,useSyncExternalStore,useState } from 'react';
import {ArrowUpRight,Bookmark,Check,ShieldCheck,Phone,ExternalLink,ArrowLeft} from 'lucide-react';
import {topicNames,disclaimer,organizations} from '@/data/catalog';
import type {LegalProvision} from '@/lib/legal/types';
import {readLocal,writeLocal,storageKeys} from '@/lib/storage';
import {Button} from './ui/button';
const subscribe=(callback:()=>void)=>{window.addEventListener('storage',callback);window.addEventListener('hurmust-storage',callback);return()=>{window.removeEventListener('storage',callback);window.removeEventListener('hurmust-storage',callback);};};
export function useStored<T>(key:string,fallback:T):[T,(value:T)=>boolean]{
 const raw=useSyncExternalStore(subscribe,()=>{try{return localStorage.getItem(key);}catch{return null;}},()=>null);
 const value=useMemo(()=>{try{return raw?JSON.parse(raw) as T:fallback;}catch{return fallback;}},[raw,fallback]);
 return [value,(next:T)=>{const ok=writeLocal(key,next);if(ok)window.dispatchEvent(new Event('hurmust-storage'));return ok;}];
}
export function Notice(){return <p className="notice"><ShieldCheck size={17} aria-hidden="true"/>{disclaimer}</p>;}
export function PageTitle({eyebrow,title,description}:{eyebrow:string;title:string;description:string}){return <header className="page-title"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></header>;}
export function Back({href='/laws',children='Хуулийн сан руу'}:{href?:string;children?:React.ReactNode}){return <Link prefetch={false} href={href} className="back"><ArrowLeft size={17}/>{children}</Link>;}
export const ruleNames:Record<string,string>={RIGHT:'Миний эрх',DUTY:'Үүрэг',PROHIBITION:'Хориглосон үйлдэл',PROCEDURE:'Гомдол гаргах',AUTHORITY_POWER:'Байгууллагын бүрэн эрх',REMEDY:'Хамгаалуулах боломж',RESPONSIBILITY:'Хариуцлага'};
export function LawCard({provision:p,compact=false}:{provision:LegalProvision;compact?:boolean}){
 const [stored,setStored]=useStored<string[]>(storageKeys.bookmarks,[]);
 const [error,setError]=useState('');
 const bookmarks=Array.isArray(stored)?stored.filter(x=>typeof x==='string'):[];
 const saved=bookmarks.includes(p.id);
 function toggle(){if(!setStored(saved?bookmarks.filter(id=>id!==p.id):[...bookmarks,p.id]))setError('Хадгалах боломжгүй байна. Төхөөрөмжийн хадгалах зай, тохиргоог шалгана уу.');}
 return <article className={`law-card ${compact?'compact':''}`}>
  <div className="law-card-top"><span className="tag">{ruleNames[p.ruleType]}</span><Button variant="ghost" className="icon-button" onClick={toggle} aria-label={saved?'Заалтын хадгалалтыг цуцлах':'Заалтыг хадгалах'} aria-pressed={saved}><Bookmark size={18} fill={saved?'currentColor':'none'}/></Button></div>
  <p className="law-name">{p.lawName}</p><Link prefetch={false} href={`/laws/${p.id}`} className="citation">{p.referenceLabel}<ArrowUpRight size={20}/></Link>
  <p className="summary">{p.plainLanguageSummary}</p><span className="explanation-label">HURMUST-ийн хялбаршуулсан тайлбар</span>
  {!compact&&<div className="tags">{p.relatedTopics.slice(0,3).map(t=><Link prefetch={false} key={t} href={`/rights/${t}`}>{topicNames[t]}</Link>)}</div>}
  <div className="law-card-bottom"><Link prefetch={false} href={`/laws/${p.id}`}>Дэлгэрэнгүй <ArrowUpRight size={14}/></Link><a href={p.sourceUrl} target="_blank" rel="noopener noreferrer">Legalinfo <ExternalLink size={13}/></a></div>
  {error&&<p role="alert" className="error">{error}</p>}
 </article>;
}
export function Sources({p}:{p:LegalProvision}){return <div className="source-panel"><p><Check size={16}/>Эх сурвалж: Legalinfo.mn · Шалгасан: {p.verifiedAt}</p><a href={p.sourceUrl} target="_blank" rel="noopener noreferrer">Хуулийн албан ёсны эхийг шалгах <ExternalLink size={15}/></a><small>Хуульд нэмэлт, өөрчлөлт орж болдог тул албан ёсны эх сурвалжийг давхар шалгана уу. Энэ тэмдэглэгээ нь төрийн баталгаажуулалт биш.</small></div>;}
export function Emergency({child=false}:{child?:boolean}){return <aside className="emergency" role="status"><ShieldCheck size={25}/><div><strong>Аюулгүй байдлаа эхэлж хамгаалаарай.</strong><p>Боломжтой бол аюулгүй газар очиж, итгэдэг хүнтэй холбоо бариарай. Баримт цуглуулахын тулд өөрийгөө эрсдэлд бүү оруулаарай.</p><div className="emergency-links"><a href="tel:102"><Phone size={16}/>102 · Цагдаа</a>{child&&<a href="tel:108">108 · Хүүхдийн тусламж</a>}<a href="tel:103">103 · Түргэн тусламж</a></div><a className="small-link" href={organizations[1].source} target="_blank" rel="noopener noreferrer">Дугаарын эх сурвалж</a></div></aside>;}
export function Empty({title='Илэрц олдсонгүй',description='Өөр түлхүүр үг эсвэл шүүлтүүр ашиглаад үзээрэй.',children}:{title?:string;description?:string;children?:React.ReactNode}){return <div className="empty"><ShieldCheck size={34}/><h2>{title}</h2><p>{description}</p>{children}</div>;}
export function currentBookmarks(){const raw=readLocal<unknown>(storageKeys.bookmarks,[]);return Array.isArray(raw)?raw.filter((v):v is string=>typeof v==='string'):[];}
