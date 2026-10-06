export const clarifyingQuestions={
 details:'Энэ үйлдэл хэзээ болсон, нэг удаа эсвэл давтагдсан уу?',
 consent:'Зураг, мэдээллээ ашиглуулах эсвэл бусдад дамжуулах зөвшөөрөл өгсөн үү?',
 support:'Та өмнө нь итгэдэг хүн эсвэл байгууллагад энэ тухай хэлсэн үү? Ямар хариу авсан бэ?',
 outcome:'Та одоо ямар тусламж хүсэж байна: үйлдлийг зогсоох, мэдээлэл устгуулах, эсвэл гомдол бэлдэх үү?',
 context:'Энэ асуудал сургууль, ажил, гэр бүл эсвэл цахим орчинд болсон уу? Хувийн нэр бичих шаардлагагүй.'
} as const;
export function parseQuestion(text:string){
 try{const value=JSON.parse(text.trim().replace(/^```(?:json)?\s*/,'').replace(/\s*```$/,''));return typeof value.questionId==='string'&&Object.hasOwn(clarifyingQuestions,value.questionId)?clarifyingQuestions[value.questionId as keyof typeof clarifyingQuestions]:null;}catch{return null;}
}
