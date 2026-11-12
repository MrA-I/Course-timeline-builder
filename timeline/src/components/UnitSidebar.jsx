import {useState} from 'react'
import {Plus,GripVertical} from 'lucide-react'
import {DISC} from '../data.js'
export default function UnitSidebar({units,setState}){
  const [q,setQ]=useState('')
  const addUnit=()=>{const name=prompt('Unit name?');if(!name)return
    const disc=prompt('Discipline: '+Object.keys(DISC).slice(0,4).join(', '),'Physics');if(!DISC[disc])return
    const weeks=+prompt('Default weeks?','4')||4
    setState(s=>({...s,units:[...s.units,{id:'u'+Date.now(),name,disc,weeks,codes:[]}]}))}
  return(<aside className="w-60 bg-white border-r p-3 overflow-y-auto shrink-0">
    <div className="flex items-center justify-between mb-2"><h2 className="font-semibold">Unit bank</h2>
      <button onClick={addUnit} title="Add unit" className="p-1 rounded hover:bg-slate-100"><Plus size={16}/></button></div>
    <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search units…" className="w-full border rounded px-2 py-1 mb-3"/>
    {Object.keys(DISC).filter(d=>d!=='Inquiry').map(d=>{const list=units.filter(u=>u.disc===d&&u.name.toLowerCase().includes(q.toLowerCase()))
      return list.length?<div key={d} className="mb-3"><div className="text-xs font-semibold uppercase text-slate-500 mb-1">{d}</div>
        {list.map(u=><div key={u.id} draggable onDragStart={e=>e.dataTransfer.setData('unit',u.id)}
          style={{background:DISC[d].bg,color:DISC[d].fg}} className="flex items-center gap-1 rounded px-2 py-1.5 mb-1 cursor-grab border border-black/5">
          <GripVertical size={12}/><span className="flex-1 truncate">{u.name}</span><span className="text-xs opacity-70">{u.weeks}w</span></div>)}
      </div>:null})}
    <p className="text-xs text-slate-500">Drag a unit onto a week in the grid’s bottom row. Drag the bar edges to resize; click a bar for details.</p>
  </aside>)}
