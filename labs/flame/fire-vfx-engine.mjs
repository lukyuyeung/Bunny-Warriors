export const SKILLS=[
{id:'fan',name:'焰舌掃擊',en:'FLAME FAN',duration:.56,desc:'近身扇形噴火，命中一次並施加燃燒。'},
{id:'ball',name:'熾熱火球',en:'FIREBALL',duration:.6,desc:'遠程火球命中後爆開，附加燃燒。'},
{id:'field',name:'餘燼之地',en:'EMBER FIELD',duration:3,desc:'火球爆炸留下低矮火場，持續造成傷害。'},
{id:'spread',name:'引火蔓延',en:'FIRE SPREAD',duration:.65,desc:'燃燒敵人死亡時，火種飛向最多兩個目標。'},
{id:'burst',name:'熔核爆燃',en:'CORE BURST',duration:.65,desc:'燃燒三層引發環形爆燃，同目標冷卻 5 秒。'},
{id:'meteor',name:'天降熔星',en:'METEOR',duration:1.6,desc:'預警、墜落、衝擊；命中附加兩層燃燒。'}];
export function makeLab(){return {time:0,enabled:new Set(SKILLS.map(s=>s.id)),targets:[{x:220,y:150},{x:248,y:170},{x:270,y:134},{x:320,y:190},{x:350,y:110},{x:100,y:190}].map((p,i)=>({...p,id:i,hp:500,burn:0,burnUntil:0,burstAt:-10,flash:0,deadUntil:0})),effects:[],shots:[],fields:[],cooldowns:{fan:0,ball:0,meteor:3},spreadAt:-1,events:[],hits:0};}
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
function effect(m,id,x,y,extra={}){m.effects.push({id,x,y,age:0,...extra});if(m.effects.length>100)m.effects.shift();}
function alive(m){return m.targets.filter(t=>t.hp>0);}
function damage(m,t,amount){if(t.hp<=0)return;t.hp=Math.max(0,t.hp-amount);if(amount>=2){t.flash=.12;m.events.push({x:t.x,y:t.y,amount,age:0});if(m.events.length>80)m.events.shift();m.hits++;}if(t.hp===0){t.deadUntil=m.time+2;if(t.burn&&m.enabled.has('spread')&&m.time>=m.spreadAt){m.spreadAt=m.time+.6;for(const other of alive(m).filter(o=>distance(o,t)<120).sort((a,b)=>distance(a,t)-distance(b,t)).slice(0,2))effect(m,'spread',t.x,t.y,{to:other,duration:.65});}t.burn=0;}}
export function burn(m,t,count=1){if(t.hp<=0)return;t.burn=Math.min(3,t.burn+count);t.burnUntil=m.time+3;if(t.burn===3&&m.enabled.has('burst')&&m.time>=t.burstAt){t.burstAt=m.time+5;effect(m,'burst',t.x,t.y,{duration:.65});for(const other of alive(m))if(distance(t,other)<=44)damage(m,other,120);}}
function area(m,p,r,amount,stacks=0){for(const t of alive(m))if(distance(p,t)<=r){damage(m,t,amount);if(stacks)burn(m,t,stacks);}}
function field(m,p){m.fields.push({x:p.x,y:p.y,age:0,duration:3});if(m.fields.length>12)m.fields.shift();}
export function cast(m,id,p,angle=0){const targets=alive(m),target=targets.slice().sort((a,b)=>distance(a,p)-distance(b,p))[0];
 if(id==='fan')effect(m,'fan',p.x,p.y,{angle,duration:.56,applied:false});
 if(id==='ball'){const a=target?Math.atan2(target.y-p.y,target.x-p.x):angle;m.shots.push({x:p.x,y:p.y,vx:Math.cos(a)*210,vy:Math.sin(a)*210,angle:a,age:0});}
 if(id==='field')field(m,target??{x:p.x+70*Math.cos(angle),y:p.y+70*Math.sin(angle)});
 if(id==='spread'&&target){effect(m,'spread',p.x,p.y,{to:target,duration:.65});}
 if(id==='burst'&&target){effect(m,'burst',target.x,target.y,{duration:.65});area(m,target,44,120);}
 if(id==='meteor'){const point=target??{x:p.x+90*Math.cos(angle),y:p.y+90*Math.sin(angle)};effect(m,'meteor',point.x,point.y,{duration:1.6,impacted:false});}
}
export function step(m,dt,p,angle,auto){dt=Math.min(.1,Math.max(0,dt));m.time+=dt;
 for(const t of m.targets){t.flash=Math.max(0,t.flash-dt);if(t.hp<=0&&m.time>=t.deadUntil){t.hp=500;t.burn=0;t.burstAt=-10;}if(t.burn&&m.time>t.burnUntil)t.burn=0;if(t.hp>0&&t.burn)damage(m,t,t.burn*15*dt);}
 if(auto)for(const [id,cd] of [['fan',1.2],['ball',2.4],['meteor',12]]){m.cooldowns[id]-=dt;if(m.enabled.has(id)&&m.cooldowns[id]<=0){cast(m,id,p,angle);m.cooldowns[id]=cd;}}
 for(const s of m.shots){s.x+=s.vx*dt;s.y+=s.vy*dt;s.age+=dt;const target=alive(m).find(t=>distance(t,s)<12);if(target){area(m,s,35,90,1);effect(m,'ball',s.x,s.y,{duration:.35,impact:true});if(m.enabled.has('field'))field(m,s);s.dead=true;}}
 m.shots=m.shots.filter(s=>!s.dead&&s.age<2.2).slice(-48);
 for(const f of m.fields)f.age+=dt;m.fields=m.fields.filter(f=>f.age<f.duration);
 for(const t of alive(m))if(m.fields.some(f=>distance(f,t)<42))damage(m,t,25*dt);
 for(const e of [...m.effects]){e.age+=dt;if(e.id==='fan'&&!e.applied&&e.age>=.14){e.applied=true;for(const t of alive(m)){const dx=t.x-e.x,dy=t.y-e.y,d=Math.hypot(dx,dy);if(d<60&&(d<8||(dx*Math.cos(e.angle)+dy*Math.sin(e.angle))/d>Math.cos(.61))){damage(m,t,70);burn(m,t);}}}if(e.id==='meteor'&&!e.impacted&&e.age>=1.05){e.impacted=true;area(m,e,80,200,2);}if(e.id==='spread'&&!e.applied&&e.age>=.5){e.applied=true;burn(m,e.to);}}
 m.effects=m.effects.filter(e=>e.age<(e.duration??.6));for(const e of m.events)e.age+=dt;m.events=m.events.filter(e=>e.age<.55);
}
