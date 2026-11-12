import {useState,useEffect,useRef} from 'react'
import {DISC} from '../data.js'
import {layout} from '../layout.js'
const CW=36
export default function TimelineGrid({weeks,terms,rows,units,onAdd,onUpdate,onOpen}){
  const [rs,setRs]=useState(null),moved=useRef(false),N=weeks.length
  useEffect(()=>{if(!rs)return
    const mv=e=>{const d=Math.round((e.clientX-rs.x0)/CW);if(d)moved.current=true
      if(rs.kind==='unit'){let s=rs.start,l=rs.len
        if(rs.edge==='r')l=Math.max(1,rs.len+d)
        else{s=Math.min(rs.start+rs.len-1,Math.max(0,rs.start+d));l=rs.len+rs.start-s}
        l=Math.min(l,N-s);const shift=rs.start-s
        const fit=a=>a.map(t=>{const w=Math.min(l,Math.max(1,t.week+shift));return {...t,week:w,len:Math.min(t.len||2,l-w+1)}})
        onUpdate(rs.id,{start:s,len:l,cats:fit(rs.cats),miles:fit(rs.miles)})}
      else{let week=rs.w0,len=rs.len0
        if(rs.edge==='m')week=Math.min(rs.max-len+1,Math.max(1,rs.w0+d))
        else if(rs.edge==='r')len=Math.min(rs.max-week+1,Math.max(1,rs.len0+d))
        else{week=Math.min(rs.w0+rs.len0-1,Math.max(1,rs.w0+d));len=rs.len0+rs.w0-week}
        onUpdate(rs.pid,{[rs.key]:rs.arr.map((t,i)=>i===rs.idx?{...t,week,len}:t)})}}
    const up=()=>setRs(null)
    window.addEventListener('mousemove',mv);window.addEventListener('mouseup',up)
    return()=>{window.removeEventListener('mousemove',mv);window.removeEventListener('mouseup',up)}},[rs])
  const cols=`200px repeat(${N},${CW}px)`
  const bg=w=>w.block?'bg-slate-300 [background-image:repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(0,0,0,.08)_4px,rgba(0,0,0,.08)_8px)]':'bg-white'
  const cell="border-r border-b border-slate-200"
  const {L,lane,cats,miles}=layout(rows,units,N),catStart=3+L,mileStart=catStart+cats.n
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
  const click=id=>()=>{if(moved.current){moved.current=false;return}onOpen(id)}
  rows.forEach(p=>{
    const u=units.find(x=>x.id===p.unitId);if(!u)return;const c=DISC[u.disc]
    out.push(<div key={p.id+'bar'} onClick={click(p.id)} title={u.name} style={{gridRow:3+lane[p.id],gridColumn:`${p.start+2} / span ${p.len}`,background:c.bg,color:c.fg,borderColor:c.fg}}
      className="relative m-0.5 rounded border cursor-pointer flex items-center px-3 text-xs font-medium overflow-hidden whitespace-nowrap z-10">
      <span className="truncate">{u.name}</span>
      {['l','r'].map(e=><span key={e} onMouseDown={ev=>{ev.stopPropagation();moved.current=false;setRs({kind:'unit',id:p.id,edge:e,x0:ev.clientX,start:p.start,len:p.len,cats:p.cats,miles:p.miles})}}
        className={`absolute top-0 bottom-0 w-2 cursor-ew-resize hover:bg-black/20 ${e==='l'?'left-0':'right-0'}`}/>)}</div>)})
  const chips=(group,start,key,ms)=>group.items.forEach(k=>{
    const begin=edge=>ev=>{ev.stopPropagation();ev.preventDefault();moved.current=false;setRs({kind:'task',key,idx:k.idx,pid:k.p.id,arr:k.p[key],edge,x0:ev.clientX,w0:k.t.week,len0:Math.max(1,k.t.len||2),max:k.p.len})}
    out.push(<div key={key+k.p.id+k.idx} onMouseDown={begin('m')} onClick={click(k.p.id)} title={`${k.u.name}: ${k.t.name}${ms?'':` (${k.t.type}, ${k.t.role})`} \u2013 drag to move, drag edges to resize`}
      style={{gridRow:start+k.sub,gridColumn:`${k.col} / span ${k.span}`,background:ms?'#f59e0b':DISC[k.u.disc].fg}}
      className="relative z-20 m-0.5 rounded text-white text-[10px] px-2 flex items-center whitespace-nowrap cursor-grab select-none overflow-hidden">
      <span className="truncate pointer-events-none">{k.t.name}</span>
      {['l','r'].map(e=><span key={e} onMouseDown={begin(e)} className={`absolute top-0 bottom-0 w-1.5 cursor-ew-resize hover:bg-black/30 ${e==='l'?'left-0':'right-0'}`}/>)}</div>)})
  chips(cats,catStart,'cats',false);chips(miles,mileStart,'miles',true)
  return(<div className="inline-grid border-t border-l border-slate-300 bg-white" style={{gridTemplateColumns:cols}}>
    <div style={{gridRow:1,gridColumn:1}} className={`${cell} bg-slate-100 font-semibold px-2 flex items-center`}>Unit</div>
    <div style={{gridRow:2,gridColumn:1}} className={`${cell} bg-slate-100 text-xs px-2 flex items-center`}>Week</div>
    {terms.map((t,ti)=>{const first=weeks.find(w=>w.term===ti);return first&&<div key={ti} style={{gridRow:1,gridColumn:`${first.gi+2} / span ${t.weeks}`}} className={`${cell} bg-slate-700 text-white text-center font-semibold py-1 truncate px-1`}>{t.name}</div>})}
    {weeks.map(w=><div key={w.gi} title={w.block||''} style={{gridRow:2,gridColumn:w.gi+2}} className={`${cell} text-center text-[11px] py-0.5 ${w.block?'bg-slate-300 text-slate-600':'bg-slate-100'}`}>{w.block?w.block.slice(0,3):w.w}</div>)}
    {out}
  </div>)}
