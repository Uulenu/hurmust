import raw from './legal-provisions.json';
import type { LegalProvision, Organization } from '@/lib/legal/types';
export const provisions = raw as LegalProvision[];
export const topicNames: Record<string,string> = { equality:'Тэгш эрх', safety:'Аюулгүй байх', privacy:'Хувийн нууц', education:'Боловсрол', work:'Хөдөлмөр', expression:'Үзэл бодол', children:'Хүүхдийн эрх', online:'Цахим орчны эрх', violence:'Хүчирхийллээс ангид байх', justice:'Хууль зүйн хамгаалалт', discrimination:'Ялгаварлан гадуурхалтаас ангид байх' };
export const topicDescriptions: Record<string,string> = {
 equality:'Хүн бүр хүндлэлтэй, тэгш харилцааг хүртэх ёстой. Тэгш байдлын баталгааг хуулийн заалтаас танилцаарай.',
 safety:'Айдас, заналхийлэл, дарамттай нөхцөлд аюулгүй байдлаа эхэлж анхаарна. Тусламж хүсэх нь таны буруу биш.',
 privacy:'Зураг, захидал, хувийн мэдээллээ хэнтэй хуваалцахаа шийдэх нь чухал. Зөвшөөрөл болон хуульд заасан үндэслэлүүдийг ялгаж ойлгоё.',
 education:'Суралцах орчин нь хүндлэл, аюулгүй байдал, тэгш боломжийг дэмжих учиртай.',
 work:'Ажлын орчны хүндлэл, аюулгүй байдал, цалин, амралттай холбоотой эрхүүдийг ойлгоё.',
 expression:'Өөрийн бодол, саналаа илэрхийлэхэд эрх, бусдыг хүндэтгэх үүрэг хамт үйлчилдэг.',
 children:'18 нас хүрээгүй хүүхдийн аюулгүй байдал, хөгжил, үзэл бодлыг хамгаалахад зориулсан баталгаанууд.',
 online:'Цахим орчинд ч хүний хувийн мэдээлэл, нэр төр, аюулгүй байдал чухал. Хувийн мэдээллийн тухай хуулийн үйлчлэх хүрээ, нөхцөлийг давхар шалгана.',
 violence:'Бие махбод, сэтгэл санаа, эдийн засаг, бэлгийн хүчирхийллийн талаар тусламжийн замыг мэдье.',
 justice:'Ямар эрх зөрчигдсөн гэж үзэж байгаагаа тайлбарлах, баримтаа бэлдэх, тохирох байгууллагад хандах алхмууд.',
 discrimination:'Нас, хүйс, үндэс, үзэл бодол зэрэг шинжээр ялгаатай харьцсан нөхцөлд хуулийн яг ямар баталгаа байгааг шалгана.'
};
export const topicKeywords: Record<string,string[]> = {
 equality:['ялгавар','тэгш','гадуурх','үндэс','хөгжлийн бэрхшээл'],
 safety:['дором','дарам','дээрэлх','зод','занал','айда','айж','сүрдүүл','цох','аюул'],
 privacy:['зураг','бичлэг','мэдээлэл','нууц','зөвшөөрөл','тараа','чат','фото'],
 education:['сургуул','багш','ангийн','суралц','оюутан','их сургууль'],
 work:['ажил','дарга','цалин','хамт олон','ажлын'],
 expression:['үзэл','санал','үг хэл','илэрхийл'],
 children:['хүүхэд','насанд хүрээгүй','сурагч'],
 violence:['хүчирхий','гэр бүл','нөхөр','эхнэр','хамтран','гэрт','зод'],
 justice:['гомдол','хэүк','комисс','өргөдөл','шүүх','төрийн']
};
export const categories = ['Дээрэлхэлт','Дарамт','Хүчирхийлэл','Ялгаварлан гадуурхалт','Сургуулийн асуудал','Их сургуулийн асуудал','Ажлын байрны асуудал','Цахим дарамт','Хувийн мэдээлэл','Зураг / бичлэг зөвшөөрөлгүй тараасан','Төрийн байгууллагатай холбоотой','Бусад'];
export const locations: Record<string,string> = {school:'Сургууль',university:'Их сургууль',work:'Ажлын байр',online:'Цахим орчин',home:'Гэр бүл',public:'Олон нийтийн газар',authority:'Төрийн байгууллага',other:'Бусад'};
export const evidenceOptions=['Зурвас, чатын зураг','Зураг, бичлэг','Огноо, цагийн тэмдэглэл','Гэрчийн мэдээлэл','Эмнэлгийн баримт','Өргөдөл, хариу бичиг'];
export const organizations: Organization[] = [
 {id:'nhrc',name:'Хүний эрхийн Үндэсний Комисс',type:'Хүний эрх',phone:'7000-0222',email:'info@nhrcm.gov.mn',website:'https://2026.nhrcm.gov.mn/complaint',services:['equality','privacy','work','education','justice'],emergency:false,verified:true,lastVerified:'2026-10-06',source:'https://2026.nhrcm.gov.mn/complaint/send?lang=mn'},
 {id:'police',name:'Цагдаагийн байгууллага',type:'Яаралтай тусламж',phone:'102',website:'https://police.gov.mn',services:['violence','safety','privacy'],emergency:true,verified:true,lastVerified:'2026-10-06',source:'https://travel.state.gov/en/international-travel/travel-advisories/mongolia.html'},
 {id:'child',name:'Хүүхдийн тусламжийн утас',type:'Хүүхэд хамгаалал',phone:'108',services:['children','safety','education'],emergency:true,verified:true,lastVerified:'2026-10-06',source:'https://travel.state.gov/en/international-travel/travel-advisories/mongolia.html'},
 {id:'ambulance',name:'Эмнэлгийн түргэн тусламж',type:'Яаралтай тусламж',phone:'103',website:'https://www.103.ub.gov.mn',services:['safety','violence'],emergency:true,verified:true,lastVerified:'2026-10-06',source:'https://travel.state.gov/en/international-travel/travel-advisories/mongolia.html'},
 {id:'school',name:'Сургуулийн нийгмийн ажилтан, захиргаа',type:'Боловсрол',services:['children','education','safety'],emergency:false,verified:false},
 {id:'union',name:'Байгууллагын үйлдвэрчний эвлэл, хүний нөөц',type:'Хөдөлмөр',services:['work','equality'],emergency:false,verified:false}
];
export const scenarios = [
 {id:'university',title:'Их сургуулийн дарамт',description:'Их сургуулийн ангийнхан намайг байнга доромжилж, заналхийлдэг.',category:'Дарамт',location:'university',age:'adult'},
 {id:'photo',title:'Зөвшөөрөлгүй тараасан зураг',description:'Миний хувийн зургийг зөвшөөрөлгүй бүлгийн чатад тараасан.',category:'Зураг / бичлэг зөвшөөрөлгүй тараасан',location:'online',age:'adult'},
 {id:'work',title:'Ажлын байрны дарамт',description:'Ажлын дарга намайг байнга доромжилж, сэтгэл санааны дарамт үзүүлдэг.',category:'Ажлын байрны асуудал',location:'work',age:'adult'},
 {id:'school',title:'Сургуулийн дээрэлхэлт',description:'Би сургуулийн сурагч. Ангийнхан намайг дээрэлхдэг, хэнд ч хэлэхээс айж байна.',category:'Дээрэлхэлт',location:'school',age:'child'},
 {id:'complaint',title:'ХЭҮК-т гомдол гаргах',description:'Хүний эрхийн асуудлаар ХЭҮК-т гомдол гаргахдаа юу бэлдэх вэ?',category:'Төрийн байгууллагатай холбоотой',location:'authority',age:'adult'}
];
export const disclaimer='HURMUST нь хууль зүйн албан ёсны дүгнэлт гаргахгүй. Нөхцөл байдлыг эрх бүхий байгууллага, хуульч эцэслэн үнэлнэ.';
export function rightProvisions(id:string){ const topic=id==='online'?'privacy':id==='discrimination'?'equality':id; return provisions.filter(p=>p.status==='ACTIVE'&&p.relatedTopics.includes(topic)); }
