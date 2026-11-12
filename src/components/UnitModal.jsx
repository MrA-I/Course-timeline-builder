import {useState} from 'react'
import {X,Trash2,Plus,ChevronRight,ChevronDown} from 'lucide-react'
import {CURRICULUM,CAT_TYPES,ROLES,DISC,LEVELS,AREAS,levelOf,areaOf} from '../data.js'
export default function UnitModal({p,unit,weeks,onChange,onDelete,onClose}){
  const [q,setQ]=useState('')
  const [open,setOpen]=useState({})
  const codes=p.codes??unit.codes
  const toggle=c=>onChange({codes:codes.includes(c)?codes.filter(x=>x!==c):[...codes,c]})
  const edit=(key,i,patch)=>onChange({[key]:p[key].map((x,j)=>j===i?{...x,...patch}:x)})
  const del=(key,i)=>onChange({[key]:p[key].filter((_,j)=>j!==i)})
  const maxW=p.len,LenSel=({t,i,k})=><select value={t.len||2} title="Length" onChange={e=>edit(k,i,{len:+e.target.value})} className={inp}>{Array.from({length:Math.max(1,maxW-t.week+1)},(_,j)=>j+1).map(n=><option key={n} value={n}>{n} wk{n>1?'s':''}</option>)}</select>,wopts=Array.from({length:maxW},(_,i)=>i+1)
  const inp="border rounded px-1.5 py-1"
  const list=CURRICULUM.filter(c=>(c.code+c.text+c.disc+c.strand).toLowerCase().includes(q.toLowerCase()))
  const tree=LEVELS.map(lv=>[lv,AREAS.map(a=>[a,list.filter(c=>levelOf(c.code)===lv&&areaOf(c)===a)]).filter(x=>x[1].length)]).filter(x=>x[1].length)
  const WeekSel=({v,on})=><select value={v} onChange={e=>on(+e.target.value)} className={inp}>{wopts.map(w=><option key={w} value={w}>Wk {w}</option>)}</select>
  return(<div className="fixed inset-0 bg-black/40 flex justify-end z-50"><div className="bg-white w-[560px] h-full overflow-y-auto p-5 shadow-xl">
    <div className="flex items-center mb-3"><h2 className="font-semibold text-base flex-1" style={{color:DISC[unit.disc].fg}}>{unit.name} <span className="text-xs text-slate-500">({unit.disc}, {p.len} wks)</span></h2>
      <button onClick={onDelete} title="Remove from timeline" className="p-1 text-red-600"><Trash2 size={16}/></button><button onClick={onClose} className="p-1"><X size={16}/></button></div>
    <h3 className="font-semibold mb-1">CATs</h3>
    {p.cats.map((t,i)=><div key={i} className="flex gap-1 mb-1"><input value={t.name} onChange={e=>edit('cats',i,{name:e.target.value})} className={`${inp} flex-1`}/>
      <select value={t.type} onChange={e=>edit('cats',i,{type:e.target.value})} className={inp}>{CAT_TYPES.map(x=><option key={x}>{x}</option>)}</select>
      <select value={t.role} onChange={e=>edit('cats',i,{role:e.target.value})} className={inp}>{ROLES.map(x=><option key={x}>{x}</option>)}</select>
      <WeekSel v={t.week} on={w=>edit('cats',i,{week:w,len:Math.min(t.len||2,p.len-w+1)})}/><LenSel t={t} i={i} k="cats"/><button onClick={()=>del('cats',i)}><X size={14}/></button></div>)}
    <button onClick={()=>onChange({cats:[...p.cats,{name:'New task',type:'Test',role:'Creator',week:Math.max(1,p.len-1),len:Math.min(2,p.len)}]})} className="flex items-center gap-1 text-sky-700 mb-4"><Plus size={14}/>Add CAT</button>
    <h3 className="font-semibold mb-1">Homework & milestones</h3>
    {p.miles.map((t,i)=><div key={i} className="flex gap-1 mb-1"><input value={t.name} onChange={e=>edit('miles',i,{name:e.target.value})} className={`${inp} flex-1`}/>
      <WeekSel v={t.week} on={w=>edit('miles',i,{week:w,len:Math.min(t.len||2,p.len-w+1)})}/><LenSel t={t} i={i} k="miles"/><button onClick={()=>del('miles',i)}><X size={14}/></button></div>)}
    <button onClick={()=>onChange({miles:[...p.miles,{name:'Workbook check',week:1,len:Math.min(2,p.len)}]})} className="flex items-center gap-1 text-sky-700 mb-4"><Plus size={14}/>Add milestone</button>
    <h3 className="font-semibold mb-1">Victorian Curriculum 2.0 codes <span className="font-normal text-slate-500">({codes.length} selected)</span></h3>
    <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search code, topic or discipline…" className={`${inp} w-full mb-2`}/>
    <div className="border rounded max-h-96 overflow-y-auto">{tree.map(([lv,areas])=>{const lk=lv;const lc=areas.flatMap(x=>x[1])
      const lo=q||open[lk]
      return <div key={lv}><button onClick={()=>setOpen(o=>({...o,[lk]:!o[lk]}))} className="w-full flex items-center gap-1 px-2 py-1.5 bg-slate-100 font-semibold border-b text-left">
        {lo?<ChevronDown size={14}/>:<ChevronRight size={14}/>}{lv}<span className="ml-auto text-xs font-normal text-slate-500">{lc.filter(c=>codes.includes(c.code)).length}/{lc.length}</span></button>
        {lo&&areas.map(([area,items])=>{const ak=lv+area;const ao=q||open[ak]
          return <div key={ak}><button onClick={()=>setOpen(o=>({...o,[ak]:!o[ak]}))} className="w-full flex items-center gap-1 pl-5 pr-2 py-1 bg-slate-50 border-b text-left">
            {ao?<ChevronDown size={12}/>:<ChevronRight size={12}/>}{area}<span className="ml-auto text-xs text-slate-500">{items.filter(c=>codes.includes(c.code)).length}/{items.length}</span></button>
            {ao&&items.map(c=><label key={c.code} className="flex gap-2 pl-9 pr-2 py-1 border-b hover:bg-slate-50 cursor-pointer">
              <input type="checkbox" checked={codes.includes(c.code)} onChange={()=>toggle(c.code)}/><span className="font-mono text-xs w-24 shrink-0">{c.code}</span><span className="text-xs">{c.text}</span></label>)}</div>})}</div>})}
      {!tree.length&&<div className="p-3 text-slate-500">No matching codes.</div>}</div>
  </div></div>)}
