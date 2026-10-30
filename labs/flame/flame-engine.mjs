export const FRAMES=8, DURATION=.56, ACTIVE_START=.14, ACTIVE_END=.35;
export function frameAt(t){return Math.min(7,Math.floor(Math.max(0,t)/DURATION*8));}
export function inCone(origin,target,angle,range=54){const dx=target.x-origin.x,dy=target.y-origin.y,d=Math.hypot(dx,dy);return d<=range+8&&(d<12||(dx*Math.cos(angle)+dy*Math.sin(angle))/d>=Math.cos(.52));}
export function startCast(angle){return {elapsed:0,angle,hit:new Set()};}
export function stepCast(cast,dt,origin,targets){const previous=cast.elapsed;cast.elapsed+=dt;const hits=[];if(previous<=ACTIVE_END&&cast.elapsed>=ACTIVE_START)for(const t of targets)if(!cast.hit.has(t.id)&&inCone(origin,t,cast.angle)){cast.hit.add(t.id);hits.push(t.id);}return {hits,done:cast.elapsed>=DURATION};}
