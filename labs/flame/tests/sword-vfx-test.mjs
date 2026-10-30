import assert from 'node:assert/strict';
import {makeLab,cast,step,pick,hitPlayer} from '../sword-vfx-engine.mjs';
const p={x:0,y:0};function one(){const m=makeLab();m.targets=m.targets.slice(0,1);Object.assign(m.targets[0],{x:40,y:0,armor:0,hp:10000,maxHp:10000});return m;}function advance(m,n=3){for(let i=0;i<n;i++)step(m,.1,p,0,false);}
let m=one();m.enabled=new Set(['slash']);cast(m,'slash',p,0);step(m,.1,p,0,false);assert.equal(m.targets[0].hp,10000);advance(m,1);assert.equal(m.targets[0].hp,9900);advance(m,5);assert.equal(m.targets[0].hp,9900);
m=one();m.targets.push({...m.targets[0],id:1,x:42,y:10});cast(m,'slash',p,0);advance(m);assert.equal(m.targets[0].hp,9900);assert.equal(m.targets[1].hp,9975);
m=one();for(let i=0;i<4;i++){cast(m,'slash',p,0);advance(m);}assert.equal(m.combo,3);assert.equal(m.targets[0].hp,9560);assert(m.targets[0].rendUntil>m.time);assert.equal(pick(m,p,0).id,0);advance(m,25);assert.equal(m.combo,0);
m=one();m.targets[0].hp=1500;cast(m,'slash',p,0);advance(m);assert.equal(m.targets[0].hp,1300);assert(m.targets[0].finishAt>m.time);cast(m,'slash',p,0);advance(m);assert.equal(m.targets[0].hp,1200);
m=one();m.targets[0].x=100;cast(m,'stab',p,0);assert.equal(m.targets[0].hp,10000);assert(m.effects.some(e=>e.id==='stab'));
m=one();assert(hitPlayer(m));assert.equal(m.hp,88);assert(!hitPlayer(m));assert.equal(m.hp,80);m.enabled.delete('step');m.time=20;assert(!hitPlayer(m));
m=one();m.enabled.clear();for(let i=0;i<50;i++)step(m,.1,p,0,true);assert.equal(m.hits,0);
m=makeLab();for(let i=0;i<1800;i++)step(m,.05,{x:165,y:149},0,true);assert(m.effects.length<=100&&m.events.length<=80);assert(m.targets.every(t=>Number.isFinite(t.hp)&&t.hp>=0));
console.log('Sword VFX tests passed: active timing, single hit, 25% collateral, combo cap/expiry, fourth-hit rend, finisher cooldown, melee range, defensive cooldown, toggles and bounded 90s simulation.');
