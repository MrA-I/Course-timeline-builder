import {useRef} from 'react'
import {FileSpreadsheet,Save,FolderOpen} from 'lucide-react'
import {buildBuffer} from '../exportXlsx.js'
const dl=(blob,name)=>{const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click()
  setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1000)}
export default function ExportManager({state,setState,weeks}){
  const file=useRef(),name=(state.title||'curriculum-timeline').replace(/[^\w -]/g,'').trim()||'curriculum-timeline'
  const save=()=>dl(new Blob([JSON.stringify(state,null,2)],{type:'application/json'}),name+'.json')
  const load=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader()
    r.onload=()=>{try{const s=JSON.parse(r.result);if(!(s.terms&&s.units&&(s.rows||s.plans)))return alert('Not a timeline file')
      const st=s.rows?s:{title:Object.keys(s.plans)[0]||'Timeline',terms:s.terms,units:s.units,rows:Object.values(s.plans).flat()}
      setState({...st,terms:st.terms.map((t,i)=>({id:'t'+i,...t}))})}catch{alert('Could not read file')}};r.readAsText(f);e.target.value=''}
  const exportXlsx=async()=>{try{const buf=await buildBuffer(state,weeks)
    dl(new Blob([buf],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}),name+'.xlsx')}catch(err){console.error(err);alert('Export failed: '+err.message)}}
  const B="flex items-center gap-1 px-3 py-1 rounded bg-slate-100 hover:bg-slate-200"
  return(<div className="flex gap-2"><button className={B} onClick={save}><Save size={14}/>Save .json</button>
    <button className={B} onClick={()=>file.current.click()}><FolderOpen size={14}/>Load</button>
    <input ref={file} type="file" accept=".json" hidden onChange={load}/>
    <button className="flex items-center gap-1 px-3 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700" onClick={exportXlsx}><FileSpreadsheet size={14}/>Export .xlsx</button></div>)}
