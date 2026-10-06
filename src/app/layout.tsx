import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:'HURMUST — Эрхээ мэд. Зөв алхмаа ол.',description:'Хүний эрх, холбогдох хууль, тусламжийн замыг энгийнээр ойлгоход зориулсан Монгол хэл дээрх загвар.',robots:{index:false,follow:false}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="mn"><body>{children}</body></html>;}
