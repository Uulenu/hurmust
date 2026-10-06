'use client';
import {useEffect,useState} from 'react';
import type {Session} from '@supabase/supabase-js';
import {Cloud,LogOut} from 'lucide-react';
import type {Json} from '@/lib/database.types';
import {getSupabase} from '@/lib/supabase';
import {storageKeys,readLocal,writeLocal,isSnapshot,type Snapshot} from '@/lib/storage';
import {Button} from './ui/button';

export function CloudStorage(){
 const [session,setSession]=useState<Session|null>(null);
 const [mode,setMode]=useState<'login'|'register'|'reset'>('login');
 const [email,setEmail]=useState('');const [password,setPassword]=useState('');
 const [consent,setConsent]=useState(false);const [busy,setBusy]=useState(false);
 const [status,setStatus]=useState('');const [error,setError]=useState('');
 const [confirm,setConfirm]=useState<'upload'|'download'|'delete'|null>(null);
 const [recovering,setRecovering]=useState(false);
 useEffect(()=>{
  const db=getSupabase();if(!db)return;
  let mounted=true;
  void db.auth.getSession().then(({data})=>{if(mounted)setSession(data.session);});
  const {data}=db.auth.onAuthStateChange((event,next)=>{setSession(next);setConsent(false);setConfirm(null);if(event==='PASSWORD_RECOVERY')setRecovering(true);});
  return()=>{mounted=false;data.subscription.unsubscribe();};
 },[]);
 async function authenticate(e:React.FormEvent){
  e.preventDefault();const db=getSupabase();if(!db){setError('Үүлэн хадгалалт одоогоор тохируулагдаагүй.');return;}
  setBusy(true);setError('');setStatus('');
  try{
   if(recovering){const {error}=await db.auth.updateUser({password});if(error)throw error;setRecovering(false);setPassword('');setStatus('Нууц үг шинэчлэгдлээ.');return;}
   if(mode==='reset'){const {error}=await db.auth.resetPasswordForEmail(email,{redirectTo:window.location.origin+'/saved'});if(error)throw error;setStatus('Бүртгэлтэй хаяг бол нууц үг шинэчлэх холбоос очно.');return;}
   if(mode==='register'){const {data,error}=await db.auth.signUp({email,password,options:{emailRedirectTo:window.location.origin+'/saved'}});if(error)throw error;setStatus(data.session?'Бүртгэл үүслээ.':'Цахим шуудангаа шалгаж, бүртгэлээ баталгаажуулна уу.');}
   else{const {error}=await db.auth.signInWithPassword({email,password});if(error)throw error;setStatus('Нэвтэрлээ.');}
   setPassword('');
  }catch{setError(mode==='login'?'Нэвтэрч чадсангүй. Хаяг, нууц үг болон шуудангийн баталгаажуулалтаа шалгана уу.':'Хүсэлтийг гүйцэтгэж чадсангүй. Түр хүлээгээд дахин оролдоно уу.');}
  finally{setBusy(false);}
 }
 async function sync(action:'upload'|'download'|'delete'){
  const db=getSupabase();if(!db||!session)return;
  if(action==='upload'&&!consent){setError('Мэдээллээ үүлэн хадгалалт руу илгээхийг зөвшөөрнө үү.');return;}
  setBusy(true);setStatus('');setError('');
  try{
   if(action==='upload'){
    const payload:Snapshot={draft:readLocal(storageKeys.draft,null),plans:readLocal(storageKeys.plans,[]),bookmarks:readLocal(storageKeys.bookmarks,[])};
    if(!isSnapshot(payload))throw new Error('Хадгалсан мэдээллийн бүтэц хүчингүй.');
    const {error}=await db.from('hurmust_user_data').upsert({user_id:session.user.id,payload:JSON.parse(JSON.stringify(payload)) as Json,updated_at:new Date().toISOString()},{onConflict:'user_id'});if(error)throw error;
    setStatus('Ноорог, төлөвлөгөө, хадгалсан заалтууд Supabase-д хадгалагдлаа.');
   }else if(action==='download'){
    const {data,error}=await db.from('hurmust_user_data').select('payload,updated_at').eq('user_id',session.user.id).maybeSingle();if(error)throw error;
    if(!data){setStatus('Үүлэн хадгалалтад мэдээлэл алга.');return;}
    const payload=data.payload;if(!isSnapshot(payload))throw new Error('Үүлэн хадгалалтын мэдээлэл хүчингүй.');
    const previous=Object.fromEntries(Object.values(storageKeys).map(k=>[k,readLocal(k,null)]));
    const entries=Object.entries(storageKeys) as [keyof Snapshot,string][];
    if(!entries.every(([kind,key])=>writeLocal(key,payload[kind]))){entries.forEach(([,key])=>writeLocal(key,previous[key]));throw new Error('Төхөөрөмж дээр хадгалж чадсангүй.');}
    window.dispatchEvent(new Event('hurmust-storage'));
    setStatus('Үүлэн хадгалалтын мэдээллийг энэ төхөөрөмж дээр сэргээлээ.');
   }else{
    const {error}=await db.from('hurmust_user_data').delete().eq('user_id',session.user.id);if(error)throw error;
    setStatus('Supabase дахь ноорог, төлөвлөгөө, хадгалсан заалтуудыг устгалаа. Энэ төхөөрөмжийн хуулбар тусдаа үлдэнэ.');
   }
  }catch(err){setError(err instanceof Error&&err.message.includes('мэдээл')?err.message:'Үйлдэл амжилтгүй. Сүлжээ, нэвтрэлтээ шалгаад дахин оролдоно уу.');}
  finally{setBusy(false);setConfirm(null);}
 }
 return <section className="cloud-panel" aria-labelledby="cloud-title"><div className="cloud-heading"><Cloud size={25}/><div><h2 id="cloud-title">Миний үүлэн хадгалалт</h2><p>Өөр төхөөрөмжөөс төлөвлөгөөгөө сэргээхийн тулд Supabase-д хадгалаарай.</p></div></div>
 <p className="small-text">Хадгалалт автомат биш. Товч дарж хадгалах бүрд өмнөх үүлэн хуулбар шинэчлэгдэнэ. Хамгийн сүүлд хадгалсан төхөөрөмжийн мэдээлэл үлдэнэ. Яриа, баримтын файл үүнд орохгүй.</p>
 {session&&!recovering?<><p>Нэвтэрсэн хаяг: <strong>{session.user.email}</strong></p><label className="check-control"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/>Ноорог дахь тайлбар, төлөвлөгөө болон хадгалсан заалтуудаа Supabase-ийн Япон дахь өгөгдлийн санд илгээхийг зөвшөөрч байна.</label>
 <div className="cloud-actions"><Button disabled={busy||!consent} onClick={()=>setConfirm('upload')}>Үүлэнд хадгалах</Button><Button disabled={busy} variant="secondary" onClick={()=>setConfirm('download')}>Үүлнээс сэргээх</Button><Button disabled={busy} variant="danger" onClick={()=>setConfirm('delete')}>Үүлэн мэдээллээ устгах</Button><Button disabled={busy} variant="ghost" onClick={async()=>{const {error}=await getSupabase()!.auth.signOut({scope:'local'});if(error)setError('Гарч чадсангүй. Дахин оролдоно уу.');else setStatus('Бүртгэлээс гарлаа. Төхөөрөмж дээрх мэдээлэл тусдаа үлдэнэ.');}}><LogOut size={16}/>Гарах</Button></div>
 {confirm&&<div className="cloud-confirm" role="group" aria-label="Үйлдлийг баталгаажуулах"><p>{confirm==='upload'?'Өмнөх үүлэн хуулбарыг энэ төхөөрөмжийн мэдээллээр солих уу?':confirm==='download'?'Энэ төхөөрөмжийн ноорог, төлөвлөгөө, хадгалсан заалтыг үүлэн хуулбараар солих уу?':'Үүлэнд хадгалсан мэдээллээ устгах уу? Бүртгэл болон энэ төхөөрөмжийн хуулбар устахгүй.'}</p><Button disabled={busy} variant={confirm==='delete'?'danger':'default'} onClick={()=>void sync(confirm)}>Тийм, үргэлжлүүлэх</Button><Button disabled={busy} variant="secondary" onClick={()=>setConfirm(null)}>Цуцлах</Button></div>}</>:<form onSubmit={authenticate} className="auth-form"><h3>{recovering?'Шинэ нууц үг':mode==='register'?'Бүртгэл үүсгэх':mode==='reset'?'Нууц үг сэргээх':'Нэвтрэх'}</h3>{!recovering&&<label className="field">Цахим шуудан<input type="email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" required maxLength={254}/></label>}{(recovering||mode!=='reset')&&<label className="field">Нууц үг<input type="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete={mode==='register'||recovering?'new-password':'current-password'} minLength={8} maxLength={128} required/><small>8-аас доошгүй тэмдэгт. Нууц үгийг аппын өгөгдлийн хүснэгтэд хадгалахгүй.</small></label>}<Button disabled={busy} type="submit">{busy?'Түр хүлээнэ үү…':recovering?'Нууц үг шинэчлэх':mode==='register'?'Бүртгэл үүсгэх':mode==='reset'?'Сэргээх холбоос авах':'Нэвтрэх'}</Button>{!recovering&&<div className="auth-switch">{(['login','register','reset'] as const).filter(m=>m!==mode).map(m=><Button key={m} variant="ghost" disabled={busy} onClick={()=>{setMode(m);setError('');setStatus('');}}>{m==='login'?'Нэвтрэх':m==='register'?'Бүртгэл үүсгэх':'Нууц үгээ мартсан'}</Button>)}</div>}<p className="small-text">Туршилтын хувилбар: шуудан илгээх үйлчилгээ хязгаарлагдмал тул шинэ бүртгэл баталгаажуулах болон нууц үг сэргээх шуудан хүрэхгүй байж болно. Эрх, хуулийг үзэхэд бүртгэл шаардлагагүй. Нэвтрэлтийн төлөв энэ цонхны sessionStorage-д хадгалагдана. Нийтийн төхөөрөмж дээр бүртгэлээс гарч, дотоод мэдээллээ мөн устгаарай.</p></form>}
 {busy&&<p role="status">Үйлдлийг гүйцэтгэж байна…</p>}{status&&<p className="cloud-status" role="status">{status}</p>}{error&&<p className="error" role="alert">{error}</p>}
 </section>;
}
