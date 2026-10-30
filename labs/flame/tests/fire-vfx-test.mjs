import assert from 'node:assert/strict';
import {makeLab,cast,step,burn} from '../fire-vfx-engine.mjs';
const p={x:0,y:0};function single(){const m=makeLab();m.targets=m.targets.slice(0,1);Object.assign(m.targets[0],{x:45,y:0});return m;}
let m=single();m.enabled.clear();cast(m,'fan',p,0);step(m,.1,p,0,false);assert.equal(m.targets[0].hp,500);step(m,.05,p,0,false);assert.equal(m.targets[0].hp,430);step(m,.05,p,0,false);assert(m.targets[0].hp>429&&m.targets[0].hp<430);
m=single();m.targets[0].x=100;m.enabled.clear();cast(m,'ball',p);step(m,.05,p,0,false);assert.equal(m.targets[0].hp,500);for(let i=0;i<10;i++)step(m,.05,p,0,false);assert(m.targets[0].hp<500);assert.equal(m.shots.length,0);assert.equal(m.fields.length,0);
m=single();m.fields=[{x:45,y:0,age:0,duration:3},{x:45,y:0,age:0,duration:3}];step(m,.1,p,0,false);assert.equal(m.targets[0].hp,497.5);
m=single();burn(m,m.targets[0],3);assert.equal(m.targets[0].burn,3);assert.equal(m.targets[0].hp,380);burn(m,m.targets[0],1);assert.equal(m.targets[0].hp,380);m.time=5;burn(m,m.targets[0]);assert.equal(m.targets[0].hp,260);
m=makeLab();m.enabled.clear();for(let i=0;i<100;i++)step(m,.1,p,0,true);assert.equal(m.shots.length+m.effects.length+m.fields.length,0);
m=single();m.enabled.clear();cast(m,'meteor',p);for(let i=0;i<10;i++)step(m,.1,p,0,false);assert.equal(m.targets[0].hp,500);step(m,.1,p,0,false);assert.equal(m.targets[0].hp,300);assert.equal(m.targets[0].burn,2);
m=single();cast(m,'field',p);for(let i=0;i<40;i++)step(m,.1,p,0,false);assert.equal(m.fields.length,0);
m=makeLab();for(let i=0;i<1800;i++)step(m,.05,{x:175,y:150},0,true);assert(m.effects.length<=100&&m.fields.length<=12&&m.shots.length<=48);assert(m.targets.every(t=>Number.isFinite(t.hp)&&t.hp>=0&&t.burn<=3));
console.log('Six-skill tests passed: cast timing, projectile travel, fire-field overlap, burn cap, burst cooldown, toggles, meteor delay, expiration, 90-second bounded simulation.');
