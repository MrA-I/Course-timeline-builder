import {useState} from 'react'
import {ArrowUp,ArrowDown,Trash2,Plus} from 'lucide-react'
const fmt=b=>Object.entries(b||{}).map(([k,v])=>`${k}=${v}`).join(', ')
const parse=s=>Object.fromEntries(s.split(',').map(x=>x.trim().split('=')).filter(x=>x[0]&&x[1]).map(([k,v])=>[+k,v.trim()]))
export default function TermConfigModal({terms,onSave,onClose}){
  const [t,setT]=useState(terms.map(x=>({...x,txt:fmt(x.blocks)})))
  const set=(i,p)=>setT(a=>a.map((x,j)=>j===i?{...x,...p}:x))
  const move=(i,d)=>setT(a=>{const b=[...a],j=i+d;if(j<0||j>=b.length)return a;[b[i],b[j]]=[b[j],b[i]];return b})
  const I="border rounded px-2 py-1"
  return(<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"><div className="bg-white rounded-lg p-5 w-[680px] max-h-[90vh] overflow-y-auto shadow-xl">
    <h2 className="font-semibold text-base mb-1">Terms & blocks</h2>
    <p className="text-xs text-slate-500 mb-3">Add as many terms as you need (e.g. “Step Up” before Term 1) and reorder them with the arrows. Non-teaching weeks use <code>week=Label</code> pairs, e.g. <code>6=Camp, 10=Exams</code>; they are shaded and can’t take units. Existing units keep their term and week when you reorder.</p>
    {t.map((x,i)=><div key={x.id||i} className="flex items-center gap-2 mb-2">
      <input value={x.name} onChange={e=>set(i,{name:e.target.value})} className={`${I} w-32`}/>
      <input type="number" min="1" max="20" value={x.weeks} onChange={e=>set(i,{weeks:Math.max(1,+e.target.value||1)})} className={`${I} w-16`}/><span>wks</span>
      <input value={x.txt} onChange={e=>set(i,{txt:e.target.value})} placeholder="6=Camp" className={`${I} flex-1`}/>
      <button onClick={()=>move(i,-1)} title="Move earlier"><ArrowUp size={14}/></button><button onClick={()=>move(i,1)} title="Move later"><ArrowDown size={14}/></button>
      <button onClick={()=>setT(a=>a.length>1?a.filter((_,j)=>j!==i):a)} title="Delete term" className="text-red-600"><Trash2 size={14}/></button></div>)}
    <button onClick={()=>setT(a=>[...a,{id:'t'+Date.now(),name:'New term',weeks:5,blocks:{},txt:''}])} className="flex items-center gap-1 text-sky-700 mt-1"><Plus size={14}/>Add term</button>
    <div className="flex justify-end gap-2 mt-4"><button onClick={onClose} className="px-3 py-1 rounded bg-slate-100">Cancel</button>
      <button onClick={()=>onSave(t.map(({txt,...x})=>({...x,blocks:parse(txt)})))} className="px-3 py-1 rounded bg-slate-800 text-white">Apply</button></div>
  </div></div>)}
