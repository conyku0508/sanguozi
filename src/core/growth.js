import {ITEMS} from '../content/base.js?v=20261018';
import {age} from './calendar.js?v=20261018';
import {clamp} from './rng.js?v=20261018';
export const attributeFor=skill=>skill==='帶隊'?2:['槍','刀','弓','騎'].includes(skill)?0:skill==='文書'||skill==='農政'?3:skill==='口才'?4:1;
export function ageRate(p,skill,tick){const a=age(p,tick),physical=['槍','刀','弓','騎'].includes(skill);return a<30?1.2:a<45?1:a<60?(physical?.8:1):(physical?.6:.9);}
export function growthRate(p,skill,tick){const value=p.attributesBase[attributeFor(skill)],hours=value<50?6:value<70?8:value<80?12:value<90?18:20;return 100/hours*ageRate(p,skill,tick)/1.2;}
export function grow(s,id,skill,ticks,practice=false,consume=true){const p=s.people[id],ageMult=ageRate(p,skill,s.tick),index=attributeFor(skill);p.proficiencyXP[skill]=(p.proficiencyXP[skill]||0)+ticks*(practice?6:4)*ageMult;if(practice)p.practicalXP[skill]=(p.practicalXP[skill]||0)+ticks*6*ageMult;
let growth=p.growthXP[index]+ticks*growthRate(p,skill,s.tick)*(practice?1.35:1);
while(growth>=100&&p.attributesBase[index]<100){if(p.attributesBase[index]>=90){if(!(p.specialLessons?.[index]>0)){growth=100;break;}p.specialLessons[index]--;}growth-=100;p.attributesBase[index]++;}p.growthXP[index]=p.attributesBase[index]>=100?0:growth;
if(consume)p.stamina=clamp(p.stamina-(practice?4:5)*ticks,0,100);}
export function injuryFactor(p){return p.injuries.includes('重傷')?.5:p.injuries.includes('中傷')?.75:p.injuries.length?.9:1;}
export function effective(p,index){return p.attributesBase[index]+p.modifiers[index];}

// These are the same factors used by individual combat, expressed as readable ratings.
export function combatProfile(s,id='player'){const p=s.people[id],weapon=s.resources.items[p.equipment.weapon],armor=s.resources.items[p.equipment.armor],skill=ITEMS[weapon?.defId]?.skill||(weapon?.defId==='bow'?'弓':weapon?.defId==='knife'?'刀':'槍'),xp=p.proficiencyXP[skill]||0,skillScore=[20,40,60,80,100][[100,300,700,1400].filter(t=>xp>=t).length];const power=(.55*effective(p,0)+.25*skillScore+.2*p.stamina)*injuryFactor(p),weaponFactor=weapon?(ITEMS[weapon.defId]?.weaponFactor??(weapon.quality==='粗製'?.9:weapon.quality==='精良'?1.1:1)):.9,armorFactor=armor?(ITEMS[armor.defId]?.armorFactor??(armor.quality==='精良'?.8:.9)):1;return {skill,power,weaponFactor,armorFactor,attack:Math.round((power+20)*weaponFactor),defense:Math.round((power+20)/armorFactor),weaponBonus:weapon?Math.round((power+20)*(weaponFactor-.9)):0,armorBonus:Math.round((power+20)*(1/armorFactor-1))};}
