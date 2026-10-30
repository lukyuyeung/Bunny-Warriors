export const SKILLS=[
{id:'slash',name:'劍術普攻',duration:.32,desc:'主要目標完整傷害，側邊敵人只受 25% 傷害。'},
{id:'tempo',name:'決鬥節奏',duration:.55,desc:'連續命中同一目標加快攻速，最多三層；兩秒未命中重置。'},
{id:'rend',name:'裂甲重擊',duration:.42,desc:'每第四次普攻追加重擊，並削弱目標護甲 4 秒。'},
{id:'step',name:'決鬥步法',duration:.6,desc:'受擊後短暫加速及減傷；可按「模擬受擊」測試。'},
{id:'stab',name:'追心刺',duration:.32,desc:'每 5 秒對近身主要目標直刺，只命中一個目標。'},
{id:'finish',name:'終結斬',duration:.48,desc:'主要目標低於 20% 血量，普攻追加重斬；目標冷卻 4 秒。'}];
export const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
export function makeLab(){return {time:0,enabled:new Set(SKILLS.map(s=>s.id)),targets:[{x:210,y:154},{x:226,y:174},{x:260,y:130},{x:320,y:190},{x:350,y:110},{x:110,y:190}].map((p,id)=>({...p,id,hp:700,maxHp:700,armor:id===0?40:0,rendUntil:0,flash:0,deadUntil:0,finishAt:-1})),effects:[],events:[],hits:0,combo:0,comboTarget:null,lastHit:-10,primaryCount:0,primaryAt:0,stabAt:1,stepAt:0,speedUntil:0,guardUntil:0,hp:100,attackSerial:0};}
function fx(m,id,x,y,angle=0){m.effects.push({id,x,y,angle,age:0,duration:SKILLS.find(s=>s.id===id).duration});if(m.effects.length>100)m.effects.shift();}
function hurt(m,t,raw){if(t.hp<=0)return;const armor=t.armor*(m.time<t.rendUntil?.88:1),amount=raw*100/(100+armor);t.hp=Math.max(0,t.hp-amount);t.flash=.1;m.hits++;m.events.push({x:t.x,y:t.y,age:0,amount});if(m.events.length>80)m.events.shift();if(!t.hp)t.deadUntil=m.time+2;}
export function inArc(p,t,a,range=54){const d=dist(p,t);return d<=range&&(d<8||((t.x-p.x)*Math.cos(a)+(t.y-p.y)*Math.sin(a))/d>=Math.cos(.75));}
export function pick(m,p,a){const candidates=m.targets.filter(t=>t.hp>0&&inArc(p,t,a));return candidates.find(t=>t.id===m.comboTarget)??candidates.sort((a,b)=>dist(p,a)-dist(p,b))[0];}
export function hitPlayer(m){const amount=m.time<m.guardUntil?8:12;m.hp=Math.max(0,m.hp-amount);if(m.enabled.has('step')&&m.time>=m.stepAt){m.stepAt=m.time+12;m.speedUntil=m.time+.8;m.guardUntil=m.time+.8;return true;}return false;}
export function cast(m,id,p,a=0,preview=false){const target=pick(m,p,a);m.attackSerial++;
 if(id==='slash'){fx(m,id,p.x+Math.cos(a)*26,p.y+Math.sin(a)*26,a);Object.assign(m.effects.at(-1),{pending:true,origin:{...p},targetId:target?.id});return;}
 if(id==='tempo'){fx(m,id,p.x,p.y-9,a);return;}
 if(id==='step'){m.speedUntil=m.time+.8;m.guardUntil=m.time+.8;fx(m,id,p.x,p.y+12,a);return;}
 const point=target??{x:p.x+Math.cos(a)*42,y:p.y+Math.sin(a)*42};
 if(id==='stab'){fx(m,id,p.x+Math.cos(a)*30,p.y+Math.sin(a)*30,a);if(target)hurt(m,target,140);}
 if(id==='rend'){fx(m,id,point.x,point.y,a);if(target){target.rendUntil=m.time+4;hurt(m,target,40);}}
 if(id==='finish'){fx(m,id,point.x,point.y,a);if(target&&(preview||(target.hp/target.maxHp<=.2&&m.time>=target.finishAt))){target.finishAt=m.time+4;hurt(m,target,100);}}
}
export function step(m,dt,p,a,auto){dt=Math.min(.1,Math.max(0,dt));m.time+=dt;
 for(const t of m.targets){t.flash=Math.max(0,t.flash-dt);if(t.hp<=0&&m.time>=t.deadUntil){t.hp=t.maxHp;t.rendUntil=0;t.finishAt=-1;}}
 if(m.time-m.lastHit>2){m.combo=0;m.comboTarget=null;}
 if(auto){if(m.enabled.has('slash')&&m.time>=m.primaryAt){cast(m,'slash',p,a);m.primaryAt=m.time+.85/(1+(m.enabled.has('tempo')?m.combo*.08:0));}if(m.enabled.has('stab')&&m.time>=m.stabAt){cast(m,'stab',p,a);m.stabAt=m.time+5;}}
 for(const e of [...m.effects]){e.age+=dt;if(e.id==='slash'&&e.pending&&e.age>=.12){e.pending=false;const primary=m.targets.find(t=>t.id===e.targetId&&t.hp>0&&inArc(e.origin,t,e.angle));if(primary){const execute=primary.hp/primary.maxHp<=.2&&m.time>=primary.finishAt;
 if(m.enabled.has('tempo')){m.combo=m.comboTarget===primary.id?Math.min(3,m.combo+1):1;fx(m,'tempo',p.x,p.y-12,e.angle);}else m.combo=0;
 m.comboTarget=primary.id;m.lastHit=m.time;m.primaryCount++;
 hurt(m,primary,100);if(m.enabled.has('rend')&&m.primaryCount%4===0&&primary.hp>0){primary.rendUntil=m.time+4;fx(m,'rend',primary.x,primary.y,e.angle);hurt(m,primary,40);}
 if(m.enabled.has('finish')&&execute&&primary.hp>0){primary.finishAt=m.time+4;fx(m,'finish',primary.x,primary.y,e.angle);hurt(m,primary,100);}
 for(const other of m.targets)if(other.id!==primary.id&&other.hp>0&&inArc(e.origin,other,e.angle))hurt(m,other,25);
 }}}
 m.effects=m.effects.filter(e=>e.age<e.duration);for(const e of m.events)e.age+=dt;m.events=m.events.filter(e=>e.age<.55);
}
