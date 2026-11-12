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
  const L=laneEnd.length+1 // +1 spare lane for dropping
  const catsBy=Array.from({length:L},()=>[])
  rows.forEach(p=>{const u=units.find(x=>x.id===p.unitId);if(u)p.cats.forEach(t=>catsBy[lane[p.id]].push({col:p.start+t.week+1,t,p,u}))})
  const subOf=new Map(),subCount=[],start=[];let rr=3
  catsBy.forEach((cs,i)=>{const ends=[];cs.sort((x,y)=>x.col-y.col).forEach(k=>{k.span=Math.max(1,Math.min(3,N+2-k.col))
      let j=ends.findIndex(e=>e<=k.col);if(j<0){j=ends.length;ends.push(0)};ends[j]=k.col+k.span;k.sub=j})
    subCount[i]=ends.length;start[i]=rr;rr+=1+ends.length})
  const out=[]
  for(let i=0;i<L;i++){
    for(let k=0;k<=subCount[i];k++){const row=start[i]+k
      out.push(<div key={'l'+i+'_'+k} style={{gridRow:row,gridColumn:1}} className={`${cell} px-2 flex items-center bg-slate-50 text-xs text-slate-500 ${k?'italic':''}`}>{k?'CATs':i===0?'Unit sequence':i<L-1?'Parallel / overlap':'Spare lane'}</div>)
      weeks.forEach(w=>out.push(<div key={'c'+i+'_'+k+'_'+w.gi} style={{gridRow:row,gridColumn:w.gi+2}} className={`${cell} ${k?'h-6':'h-9'} ${bg(w)}`}
        onDragOver={k?undefined:e=>!w.block&&e.preventDefault()} onDrop={k?undefined:e=>{e.preventDefault();const id=e.dataTransfer.getData('unit');if(id&&!w.block)onAdd(id,w.gi)}}/>))}}
  rows.forEach(p=>{
    const u=units.find(x=>x.id===p.unitId);if(!u)return;const c=DISC[u.disc];const row=start[lane[p.id]]
    out.push(<div key={p.id+'bar'} onClick={()=>onOpen(p.id)} title={`${u.name} \u2022 ${p.staff||'Unassigned'}`} style={{gridRow:row,gridColumn:`${p.start+2} / span ${p.len}`,background:c.bg,color:c.fg,borderColor:c.fg}}
      className="relative m-0.5 rounded border cursor-pointer flex items-center px-3 text-xs font-medium overflow-hidden whitespace-nowrap z-10">
      <span className="truncate">{u.name}{p.staff?` \u00b7 ${p.staff}`:''}</span>
      {['l','r'].map(e=><span key={e} onMouseDown={ev=>{ev.stopPropagation();setRs({id:p.id,edge:e,x0:ev.clientX,start:p.start,len:p.len})}}
        className={`absolute top-0 bottom-0 w-2 cursor-ew-resize hover:bg-black/20 ${e==='l'?'left-0':'right-0'}`}/>)}</div>)
    p.miles.forEach((t,k)=>out.push(<div key={p.id+'m'+k} title={t.name} onClick={()=>onOpen(p.id)}
      style={{gridRow:row,gridColumn:t.week+p.start+1}} className="z-20 self-start justify-self-start mt-0.5 ml-0.5 w-2.5 h-2.5 rounded-full bg-orange-400 cursor-pointer"/>))})
  catsBy.forEach((cs,i)=>cs.forEach((k,n)=>out.push(<div key={'cat'+i+'_'+n} onClick={()=>onOpen(k.p.id)} title={`${k.u.name}: ${k.t.name} (${k.t.type}, ${k.t.role})`}
    style={{gridRow:start[i]+1+k.sub,gridColumn:`${k.col} / span ${k.span}`,background:DISC[k.u.disc].fg}}
    className="z-20 m-0.5 rounded text-white text-[10px] px-1 flex items-center truncate whitespace-nowrap cursor-pointer">{k.t.name}</div>)))
  return(<div className="inline-grid border-t border-l border-slate-300 bg-white" style={{gridTemplateColumns:cols}}>
    <div style={{gridRow:1,gridColumn:1}} className={`${cell} bg-slate-100 font-semibold px-2 flex items-center`}>Unit</div>
    <div style={{gridRow:2,gridColumn:1}} className={`${cell} bg-slate-100 text-xs px-2 flex items-center`}>Week</div>
    {terms.map((t,ti)=>{const first=weeks.find(w=>w.term===ti);return first&&<div key={ti} style={{gridRow:1,gridColumn:`${first.gi+2} / span ${t.weeks}`}} className={`${cell} bg-slate-700 text-white text-center font-semibold py-1`}>{t.name}</div>})}
    {weeks.map(w=><div key={w.gi} title={w.block||''} style={{gridRow:2,gridColumn:w.gi+2}} className={`${cell} text-center text-[11px] py-0.5 ${w.block?'bg-slate-300 text-slate-600':'bg-slate-100'}`}>{w.block?w.block.slice(0,3):w.w}</div>)}
    {out}
  </div>)}
