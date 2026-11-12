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
  // Pack non-overlapping units onto shared lanes so a year's sequence reads on one line
  const laneEnd=[],lane={}
  ;[...rows].sort((x,y)=>x.start-y.start).forEach(p=>{let i=laneEnd.findIndex(e=>e<=p.start);if(i<0){i=laneEnd.length;laneEnd.push(0)}laneEnd[i]=p.start+p.len;lane[p.id]=i})
  const L=Math.max(1,laneEnd.length)
  const mk=key=>{const items=[];rows.forEach(p=>{const u=units.find(x=>x.id===p.unitId);if(u)p[key].forEach(t=>items.push({col:p.start+t.week+1,t,p,u}))})
    const ends=[];items.sort((x,y)=>x.col-y.col).forEach(k=>{k.span=Math.max(1,Math.min(3,N+2-k.col));let j=ends.findIndex(e=>e<=k.col);if(j<0){j=ends.length;ends.push(0)};ends[j]=k.col+k.span;k.sub=j})
    return {items,n:Math.max(1,ends.length)}}
  const cats=mk('cats'),miles=mk('miles'),catStart=3+L,mileStart=catStart+cats.n
  const defs=[]
  for(let i=0;i<L;i++)defs.push([3+i,i===0?'Unit sequence':'Overlapping unit',true])
  for(let k=0;k<cats.n;k++)defs.push([catStart+k,k?'':'CATs',false])
  for(let k=0;k<miles.n;k++)defs.push([mileStart+k,k?'':'Homework / milestones',false])
  const out=[]
  defs.forEach(([row,label,isUnit])=>{
    const top=row===catStart||row===mileStart?'border-t-2 border-t-slate-400':''
    out.push(<div key={'l'+row} style={{gridRow:row,gridColumn:1}} className={`${cell} ${top} px-2 flex items-center bg-slate-50 text-xs ${isUnit?'text-slate-500':'font-semibold text-slate-700'}`}>{label}</div>)
    weeks.forEach(w=>out.push(<div key={'c'+row+'_'+w.gi} style={{gridRow:row,gridColumn:w.gi+2}} className={`${cell} ${top} ${isUnit?'h-9':'h-6'} ${bg(w)}`}
      onDragOver={isUnit?e=>!w.block&&e.preventDefault():undefined} onDrop={isUnit?e=>{e.preventDefault();const id=e.dataTransfer.getData('unit');if(id&&!w.block)onAdd(id,w.gi)}:undefined}/>))})
  rows.forEach(p=>{
    const u=units.find(x=>x.id===p.unitId);if(!u)return;const c=DISC[u.disc]
    out.push(<div key={p.id+'bar'} onClick={()=>onOpen(p.id)} title={`${u.name} \u2022 ${p.staff||'Unassigned'}`} style={{gridRow:3+lane[p.id],gridColumn:`${p.start+2} / span ${p.len}`,background:c.bg,color:c.fg,borderColor:c.fg}}
      className="relative m-0.5 rounded border cursor-pointer flex items-center px-3 text-xs font-medium overflow-hidden whitespace-nowrap z-10">
      <span className="truncate">{u.name}{p.staff?` \u00b7 ${p.staff}`:''}</span>
      {['l','r'].map(e=><span key={e} onMouseDown={ev=>{ev.stopPropagation();setRs({id:p.id,edge:e,x0:ev.clientX,start:p.start,len:p.len})}}
        className={`absolute top-0 bottom-0 w-2 cursor-ew-resize hover:bg-black/20 ${e==='l'?'left-0':'right-0'}`}/>)}</div>)})
  const chip=(group,start,milestone)=>group.items.forEach((k,n)=>out.push(<div key={(milestone?'m':'c')+n} onClick={()=>onOpen(k.p.id)}
    title={`${k.u.name}: ${k.t.name}${milestone?'':` (${k.t.type}, ${k.t.role})`}`}
    style={{gridRow:start+k.sub,gridColumn:`${k.col} / span ${k.span}`,background:milestone?'#f59e0b':DISC[k.u.disc].fg}}
    className="z-20 m-0.5 rounded text-white text-[10px] px-1 flex items-center truncate whitespace-nowrap cursor-pointer">{k.t.name}</div>))
  chip(cats,catStart,false);chip(miles,mileStart,true)
  return(<div className="inline-grid border-t border-l border-slate-300 bg-white" style={{gridTemplateColumns:cols}}>
    <div style={{gridRow:1,gridColumn:1}} className={`${cell} bg-slate-100 font-semibold px-2 flex items-center`}>Unit</div>
    <div style={{gridRow:2,gridColumn:1}} className={`${cell} bg-slate-100 text-xs px-2 flex items-center`}>Week</div>
    {terms.map((t,ti)=>{const first=weeks.find(w=>w.term===ti);return first&&<div key={ti} style={{gridRow:1,gridColumn:`${first.gi+2} / span ${t.weeks}`}} className={`${cell} bg-slate-700 text-white text-center font-semibold py-1`}>{t.name}</div>})}
    {weeks.map(w=><div key={w.gi} title={w.block||''} style={{gridRow:2,gridColumn:w.gi+2}} className={`${cell} text-center text-[11px] py-0.5 ${w.block?'bg-slate-300 text-slate-600':'bg-slate-100'}`}>{w.block?w.block.slice(0,3):w.w}</div>)}
    {out}
  </div>)}
