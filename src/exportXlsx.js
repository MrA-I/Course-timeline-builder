import ExcelJS from 'exceljs'
import {DISC} from './data.js'
import {layout} from './layout.js'
const fill=a=>({type:'pattern',pattern:'solid',fgColor:{argb:a}})
const bd={style:'thin',color:{argb:'FFCBD5E1'}},box={top:bd,bottom:bd,left:bd,right:bd}
export async function buildBuffer(state,weeks){
  const {terms,units,rows,title}=state,N=weeks.length,wb=new ExcelJS.Workbook(),ws=wb.addWorksheet('Timeline View')
  const lab=gi=>{const w=weeks[Math.max(0,Math.min(gi,N-1))];return `${terms[w.term].name} W${w.w}`}
  const grey=fill('FFCBD5E1'),dark=fill('FF334155'),white={bold:true,color:{argb:'FFFFFFFF'}}
  ws.getColumn(1).width=26;for(let i=0;i<N;i++)ws.getColumn(i+2).width=7
  ws.getCell(1,1).value=title||'Curriculum timeline';ws.getCell(1,1).font={bold:true,size:14}
  ws.getCell(2,1).value='Term';ws.getCell(3,1).value='Week';ws.getCell(2,1).font=ws.getCell(3,1).font={bold:true}
  terms.forEach((t,ti)=>{const f=weeks.find(w=>w.term===ti);if(!f)return;const c=f.gi+2
    if(t.weeks>1)ws.mergeCells(2,c,2,c+t.weeks-1);const x=ws.getCell(2,c);x.value=t.name;x.alignment={horizontal:'center'};x.font=white;x.fill=dark})
  weeks.forEach(w=>{const x=ws.getCell(3,w.gi+2);x.value=w.block||w.w;x.alignment={horizontal:'center'};x.font={bold:true,size:w.block?7:10};if(w.block)x.fill=grey})
  const {L,lane,cats,miles}=layout(rows,units,N),R=g=>g+1,catStart=3+L,mileStart=catStart+cats.n
  const total=mileStart+miles.n
  for(let g=3;g<total;g++){const lbl=g<catStart?(g===3?'Unit sequence':'Overlapping unit'):g===catStart?'CATs':g===mileStart?'Homework / milestones':''
    const c=ws.getCell(R(g),1);c.value=lbl;c.font={bold:g>=catStart&&!!lbl};weeks.forEach(w=>{const x=ws.getCell(R(g),w.gi+2);x.border=box;if(w.block)x.fill=grey})}
  rows.forEach(p=>{const u=units.find(x=>x.id===p.unitId);if(!u)return;const row=R(3+lane[p.id]),a=p.start+2,b=Math.min(N+1,p.start+p.len+1)
    if(b>a)ws.mergeCells(row,a,row,b);const x=ws.getCell(row,a);x.value=u.name;x.fill=fill(DISC[u.disc].argb);x.alignment={horizontal:'center'};x.font={bold:true};x.border=box})
  const put=(group,start,ms)=>group.items.forEach(k=>{const row=R(start+k.sub),b=k.col+k.span-1
    if(b>k.col)ws.mergeCells(row,k.col,row,b);const x=ws.getCell(row,k.col);x.value=k.t.name;x.alignment={horizontal:'center',wrapText:false};x.font={size:9,bold:true}
    x.fill=fill(ms?'FFFDE68A':DISC[k.u.disc].argb);x.border=box})
  put(cats,catStart,false);put(miles,mileStart,true)
  ws.views=[{state:'frozen',xSplit:1,ySplit:3}]
  const w2=wb.addWorksheet('Assessment & Curriculum')
  w2.columns=['Timeline','Unit','Discipline','Unit weeks','Task / milestone','Type','Role','Due','Length (wks)','Curriculum codes'].map((h,i)=>({header:h,width:[22,28,14,20,30,22,10,12,12,50][i]}))
  rows.forEach(p=>{const u=units.find(x=>x.id===p.unitId);if(!u)return;const codes=(p.codes??u.codes).join(', '),span=lab(p.start)+' \u2013 '+lab(p.start+p.len-1)
    const add=(t,type,role)=>w2.addRow([title,u.name,u.disc,span,t.name,type,role,lab(p.start+t.week-1),t.len||2,codes])
    p.cats.forEach(t=>add(t,t.type,t.role));p.miles.forEach(t=>add(t,'Homework / milestone',''))
    if(!p.cats.length&&!p.miles.length)w2.addRow([title,u.name,u.disc,span,'','','','','',codes])})
  w2.getRow(1).font=white;w2.getRow(1).fill=dark;w2.autoFilter={from:'A1',to:'J1'};w2.views=[{state:'frozen',ySplit:1}]
  return wb.xlsx.writeBuffer()
}
