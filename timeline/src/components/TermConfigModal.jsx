import {useState} from 'react'
const fmt=b=>Object.entries(b||{}).map(([k,v])=>`${k}=${v}`).join(', ')
const parse=s=>Object.fromEntries(s.split(',').map(x=>x.trim().split('=')).filter(x=>x[0]&&x[1]).map(([k,v])=>[+k,v.trim()]))
export default function TermConfigModal({terms,onSave,onClose}){
  const [t,setT]=useState(terms.map(x=>({...x,txt:fmt(x.blocks)})))
  const set=(i,p)=>setT(a=>a.map((x,j)=>j===i?{...x,...p}:x))
  return(<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"><div className="bg-white rounded-lg p-5 w-[560px] shadow-xl">
    <h2 className="font-semibold text-base mb-3">Term configuration</h2>
    <p className="text-xs text-slate-500 mb-3">Non-teaching blocks: <code>week=Label</code> pairs, e.g. <code>6=Step-Up, 10=Exams</code>. These weeks are shaded and units cannot be dropped on them.</p>
    {t.map((x,i)=><div key={i} className="flex items-center gap-2 mb-2"><span className="w-16 font-medium">{x.name}</span>
      <input type="number" min="1" max="15" value={x.weeks} onChange={e=>set(i,{weeks:+e.target.value})} className="w-16 border rounded px-2 py-1"/><span>weeks</span>
      <input value={x.txt} onChange={e=>set(i,{txt:e.target.value})} placeholder="6=Camp" className="flex-1 border rounded px-2 py-1"/></div>)}
    <div className="flex justify-end gap-2 mt-4"><button onClick={onClose} className="px-3 py-1 rounded bg-slate-100">Cancel</button>
      <button onClick={()=>onSave(t.map(({txt,...x})=>({...x,blocks:parse(txt)})))} className="px-3 py-1 rounded bg-slate-800 text-white">Apply</button></div>
  </div></div>)}
