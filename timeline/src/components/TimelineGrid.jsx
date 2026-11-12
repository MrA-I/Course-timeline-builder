import {useState,useEffect} from 'react'
import {DISC} from '../data.js'
const CW=36
export default function TimelineGrid({weeks,terms,rows,units,onAdd,onUpdate,onOpen}){
  const [rs,setRs]=useState(null)
  useEffect(()=>{if(!rs)return
    const mv=e=>{const d=Math.round((e.clientX-rs.x0)/CW);let s=rs.start,l=rs.len
      if(rs.edge==='r')l=Math.max(1,rs.len+d)
      else{s=Math.min(rs.start+rs.len-1,Math.max(0,rs.start+d));l=rs.len+rs.start-s}
      l=Math.min(l,weeks.length-s);onUpdate(rs.id,{start:s,len:l})}
    const up=()=>setRs(null)
    window.addEventListener('mousemove',mv);window.addEventListener('mouseup',up)
    return()=>{window.removeEventListener('mousemove',mv);window.removeEventListener('mouseup',up)}},[rs])
  const N=weeks.length
  const cols=`200px repeat(${N},${CW}px)`
  const bg=w=>w.block?'bg-slate-300 [background-image:repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(0,0,0,.08)_4px,rgba(0,0,0,.08)_8px)]':'bg-white'
  const cell="border-r border-b border-slate-200"
  let r=3
  const out=[]
  rows.forEach(p=>{
    const u=units.find(x=>x.id===p.unitId);if(!u)return;const c=DISC[u.disc];const base=r;r+=3
    ;['','CATs','Homework / milestones'].forEach((lab,i)=>{
      out.push(<div key={p.id+'l'+i} style={{gridRow:base+i,gridColumn:1}} className={`${cell} px-2 flex items-center bg-slate-50 ${i?'text-xs text-slate-500':'font-medium'}`}>
        {i===0?<button className="text-left truncate hover:underline" onClick={()=>onOpen(p.id)}>{u.name}<span className="block text-xs font-normal text-slate-500">{p.staff||'Unassigned'}</span></button>:lab}</div>)
      weeks.forEach(w=>out.push(<div key={p.id+i+w.gi} style={{gridRow:base+i,gridColumn:w.gi+2}} className={`${cell} ${bg(w)}`}/>))})
    out.push(<div key={p.id+'bar'} onClick={()=>onOpen(p.id)} style={{gridRow:base,gridColumn:`${p.start+2} / span ${p.len}`,background:c.bg,color:c.fg,borderColor:c.fg}}
      className="relative m-0.5 rounded border cursor-pointer flex items-center px-3 text-xs font-medium overflow-hidden z-10">
      <span className="truncate">{u.name}</span>
      {['l','r'].map(e=><span key={e} onMouseDown={ev=>{ev.stopPropagation();setRs({id:p.id,edge:e,x0:ev.clientX,start:p.start,len:p.len})}}
        className={`absolute top-0 bottom-0 w-2 cursor-ew-resize hover:bg-black/20 ${e==='l'?'left-0':'right-0'}`}/>)}</div>)
    p.cats.forEach((t,k)=>out.push(<div key={p.id+'c'+k} title={`${t.name} (${t.type}, ${t.role})`} onClick={()=>onOpen(p.id)}
      style={{gridRow:base+1,gridColumn:t.week+p.start+1,background:c.fg}} className="z-10 m-0.5 rounded text-white text-[10px] px-0.5 flex items-center justify-center cursor-pointer truncate">{t.type[0]}</div>))
    p.miles.forEach((t,k)=>out.push(<div key={p.id+'m'+k} title={t.name} onClick={()=>onOpen(p.id)}
      style={{gridRow:base+2,gridColumn:t.week+p.start+1}} className="z-10 m-1 rounded-full bg-orange-400 cursor-pointer"/>))})
  return(<div className="inline-grid border-t border-l border-slate-300 bg-white" style={{gridTemplateColumns:cols}}>
    <div style={{gridRow:1,gridColumn:1}} className={`${cell} bg-slate-100 font-semibold px-2 flex items-center`}>Unit</div>
    <div style={{gridRow:2,gridColumn:1}} className={`${cell} bg-slate-100 text-xs px-2 flex items-center`}>Week</div>
    {terms.map((t,ti)=>{const first=weeks.find(w=>w.term===ti);return first&&<div key={ti} style={{gridRow:1,gridColumn:`${first.gi+2} / span ${t.weeks}`}} className={`${cell} bg-slate-700 text-white text-center font-semibold py-1`}>{t.name}</div>})}
    {weeks.map(w=><div key={w.gi} title={w.block||''} style={{gridRow:2,gridColumn:w.gi+2}} className={`${cell} text-center text-[11px] py-0.5 ${w.block?'bg-slate-300 text-slate-600':'bg-slate-100'}`}>{w.block?w.block.slice(0,3):w.w}</div>)}
    {out}
    <div style={{gridRow:r,gridColumn:1}} className={`${cell} px-2 flex items-center text-xs text-slate-500 italic`}>Drop unit here →</div>
    {weeks.map(w=><div key={'d'+w.gi} style={{gridRow:r,gridColumn:w.gi+2}} className={`${cell} h-9 ${bg(w)} hover:bg-sky-100`}
      onDragOver={e=>!w.block&&e.preventDefault()} onDrop={e=>{e.preventDefault();const id=e.dataTransfer.getData('unit');if(id&&!w.block)onAdd(id,w.gi)}}/>)}
  </div>)}
