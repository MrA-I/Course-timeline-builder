import {useRef} from 'react'
import {FileSpreadsheet,Save,FolderOpen} from 'lucide-react'
import ExcelJS from 'exceljs'
import {DISC} from '../data.js'
const dl=(blob,name)=>{const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();URL.revokeObjectURL(a.href)}
export default function ExportManager({state,setState,weeks}){
  const file=useRef()
  const lab=gi=>{const w=weeks[Math.min(gi,weeks.length-1)];return `T${w.term+1} W${w.w}`}
  const save=()=>dl(new Blob([JSON.stringify(state,null,2)],{type:'application/json'}),'curriculum-timeline.json')
  const load=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader()
    r.onload=()=>{try{const s=JSON.parse(r.result);if(s.terms&&s.units&&(s.rows||s.plans))setState(s.rows?s:{title:Object.keys(s.plans)[0]||'Timeline',terms:s.terms,units:s.units,rows:Object.values(s.plans).flat()});else alert('Not a timeline file')}catch{alert('Could not read file')}};r.readAsText(f);e.target.value=''}
  const exportXlsx=async()=>{
    const wb=new ExcelJS.Workbook(),ws=wb.addWorksheet('Timeline View'),N=weeks.length
    const grey={type:'pattern',pattern:'solid',fgColor:{argb:'FFCBD5E1'}},bd={style:'thin',color:{argb:'FFCBD5E1'}}
    ws.getColumn(1).width=26;ws.getColumn(2).width=18;for(let i=0;i<N;i++)ws.getColumn(i+3).width=5
    ws.getCell(1,1).value='Unit';ws.getCell(1,2).value='Staff';ws.getCell(2,1).value='Week'
    let c=3;state.terms.forEach(t=>{ws.mergeCells(1,c,1,c+t.weeks-1);const x=ws.getCell(1,c);x.value=t.name;x.alignment={horizontal:'center'};x.font={bold:true,color:{argb:'FFFFFFFF'}};x.fill={type:'pattern',pattern:'solid',fgColor:{argb:'FF334155'}};c+=t.weeks})
    weeks.forEach(w=>{const x=ws.getCell(2,w.gi+3);x.value=w.block?w.block.slice(0,3):w.w;x.alignment={horizontal:'center'};if(w.block)x.fill=grey})
    let r=3;const detail=[]
    [[state.title||'Timeline',state.rows]].forEach(([year,rows])=>{
      ws.mergeCells(r,1,r,N+2);const y=ws.getCell(r,1);y.value=year;y.font={bold:true};y.fill={type:'pattern',pattern:'solid',fgColor:{argb:'FFE2E8F0'}};r++
      rows.forEach(p=>{const u=state.units.find(x=>x.id===p.unitId);if(!u)return;const col=DISC[u.disc].argb
        ws.getCell(r,1).value=u.name;ws.getCell(r,2).value=p.staff
        weeks.forEach(w=>{if(w.block)ws.getCell(r,w.gi+3).fill=grey})
        ws.mergeCells(r,p.start+3,r,p.start+p.len+2);const b=ws.getCell(r,p.start+3);b.value=u.name;b.alignment={horizontal:'center'}
        b.fill={type:'pattern',pattern:'solid',fgColor:{argb:col}};b.border={top:bd,bottom:bd,left:bd,right:bd}
        const codes=(p.codes??u.codes).join(', ')
        p.cats.forEach(t=>{const x=ws.getCell(r+1,p.start+t.week+2);x.value=t.type[0];x.fill={type:'pattern',pattern:'solid',fgColor:{argb:col}};x.alignment={horizontal:'center'};
          detail.push([year,u.name,u.disc,p.staff,lab(p.start)+' – '+lab(p.start+p.len-1),t.name,t.type,t.role,lab(p.start+t.week-1),codes])})
        p.miles.forEach(t=>{const x=ws.getCell(r+2,p.start+t.week+2);x.value='●';x.alignment={horizontal:'center'}
          detail.push([year,u.name,u.disc,p.staff,lab(p.start)+' – '+lab(p.start+p.len-1),t.name,'Milestone','',lab(p.start+t.week-1),codes])})
        if(!p.cats.length&&!p.miles.length)detail.push([year,u.name,u.disc,p.staff,lab(p.start)+' – '+lab(p.start+p.len-1),'','','','',codes])
        ws.getCell(r+1,1).value='  CATs';ws.getCell(r+2,1).value='  Homework / milestones';ws.getCell(r+1,1).font=ws.getCell(r+2,1).font={italic:true,color:{argb:'FF64748B'}}
        r+=3})})
    const w2=wb.addWorksheet('Assessment & Curriculum')
    w2.columns=['Timeline','Unit','Discipline','Staff','Unit weeks','Task / milestone','Type','Role','Due','Curriculum codes'].map((h,i)=>({header:h,width:[10,28,14,18,18,30,22,10,10,50][i]}))
    detail.forEach(d=>w2.addRow(d));w2.getRow(1).font={bold:true,color:{argb:'FFFFFFFF'}};w2.getRow(1).fill={type:'pattern',pattern:'solid',fgColor:{argb:'FF334155'}}
    w2.autoFilter={from:'A1',to:'J1'};w2.views=[{state:'frozen',ySplit:1}]
    dl(new Blob([await wb.xlsx.writeBuffer()],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}),(state.title||'curriculum-timeline').replace(/[^\w -]/g,'')+'.xlsx')}
  const B="flex items-center gap-1 px-3 py-1 rounded bg-slate-100 hover:bg-slate-200"
  return(<div className="flex gap-2"><button className={B} onClick={save}><Save size={14}/>Save .json</button>
    <button className={B} onClick={()=>file.current.click()}><FolderOpen size={14}/>Load</button>
    <input ref={file} type="file" accept=".json" hidden onChange={load}/>
    <button className="flex items-center gap-1 px-3 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700" onClick={exportXlsx}><FileSpreadsheet size={14}/>Export .xlsx</button></div>)}
