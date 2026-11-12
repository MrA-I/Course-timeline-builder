import {useState,useMemo} from 'react'
import {Settings,PanelLeft} from 'lucide-react'
import {DEFAULT_TERMS,DEFAULT_UNITS,DEFAULT_PLANS,buildWeeks} from './data.js'
import UnitSidebar from './components/UnitSidebar.jsx'
import TimelineGrid from './components/TimelineGrid.jsx'
import TermConfigModal from './components/TermConfigModal.jsx'
import UnitModal from './components/UnitModal.jsx'
import ExportManager from './components/ExportManager.jsx'

export default function App(){
  const [state,setState]=useState({title:'Year 7 Science Rotation',terms:DEFAULT_TERMS,units:DEFAULT_UNITS,rows:DEFAULT_PLANS['Year 7']})
  const [showBank,setShowBank]=useState(true)
  const [showCfg,setShowCfg]=useState(false)
  const [openId,setOpenId]=useState(null)
  const {terms,units,rows,title}=state
  const weeks=useMemo(()=>buildWeeks(terms),[terms])
  const setRows=fn=>setState(s=>({...s,rows:fn(s.rows)}))
  const add=(unitId,start)=>{const u=units.find(x=>x.id===unitId);const len=Math.min(u.weeks,weeks.length-start)
    setRows(r=>[...r,{id:'p'+Date.now(),unitId,start,len,staff:'',cats:[],miles:[],codes:null}])}
  const update=(id,patch)=>setRows(r=>r.map(p=>p.id===id?{...p,...patch}:p))
  const remove=id=>{setRows(r=>r.filter(p=>p.id!==id));setOpenId(null)}
  const open=rows.find(p=>p.id===openId)
  return(
  <div className="h-screen flex flex-col text-sm text-slate-800">
    <header className="flex items-center gap-3 px-4 py-2 bg-white border-b">
      <button onClick={()=>setShowBank(v=>!v)} title={showBank?"Hide unit bank":"Show unit bank"} className="p-1.5 rounded bg-slate-100 hover:bg-slate-200"><PanelLeft size={16}/></button>
      
      <input value={title} onChange={e=>setState(s=>({...s,title:e.target.value}))} placeholder="Enter timeline title…" className="ml-4 w-80 border rounded px-2 py-1 font-medium"/>
      <div className="flex-1"/>
      <button onClick={()=>setShowCfg(true)} className="flex items-center gap-1 px-3 py-1 rounded bg-slate-100 hover:bg-slate-200"><Settings size={14}/>Terms</button>
      <ExportManager state={state} setState={setState} weeks={weeks}/>
    </header>
    <div className="flex flex-1 overflow-hidden">
      {showBank&&<UnitSidebar units={units} setState={setState}/>}
      <main className="flex-1 overflow-auto p-3">
        <TimelineGrid weeks={weeks} terms={terms} rows={rows} units={units} onAdd={add} onUpdate={update} onOpen={setOpenId}/>
      </main>
    </div>
    {showCfg&&<TermConfigModal terms={terms} onSave={t=>{setState(s=>({...s,terms:t}));setShowCfg(false)}} onClose={()=>setShowCfg(false)}/>}
    {open&&<UnitModal p={open} unit={units.find(u=>u.id===open.unitId)} weeks={weeks} onChange={patch=>update(open.id,patch)} onDelete={()=>remove(open.id)} onClose={()=>setOpenId(null)}/>}
  </div>)
}
