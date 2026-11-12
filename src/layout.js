// Shared by the on-screen grid and the Excel export so they always match
export function layout(rows,units,N){
  const laneEnd=[],lane={}
  ;[...rows].sort((a,b)=>a.start-b.start).forEach(p=>{let i=laneEnd.findIndex(e=>e<=p.start);if(i<0){i=laneEnd.length;laneEnd.push(0)}laneEnd[i]=p.start+p.len;lane[p.id]=i})
  const mk=key=>{const items=[]
    rows.forEach(p=>{const u=units.find(x=>x.id===p.unitId);if(!u)return
      ;(p[key]||[]).forEach((t,idx)=>{const col=p.start+t.week+1;items.push({col,span:Math.max(1,Math.min(Math.max(1,t.len||2),N+2-col)),t,idx,p,u})})})
    const ends=[];items.sort((x,y)=>x.col-y.col).forEach(k=>{let j=ends.findIndex(e=>e<=k.col);if(j<0){j=ends.length;ends.push(0)};ends[j]=k.col+k.span;k.sub=j})
    return {items,n:Math.max(1,ends.length)}}
  return {L:Math.max(1,laneEnd.length),lane,cats:mk('cats'),miles:mk('miles')}
}
