import {clone,validate,enter,log,ensurePeople,meetNearby} from './state.js';
import {fate,clamp} from './rng.js';
import {advance} from './clock.js';
import {start,sendRecall,cancelDelivered,busy} from './plans.js';
import {TASKS} from '../content/tasks.js';
import {LOCATIONS} from '../content/base.js';
import {accept,settle,councilBegin,councilAgenda,enlisted,leader,loseAuthority,endingCheck} from './tasks.js';
import * as life from './life.js';
import {duelStart,duelRound,armyStart,armyRound,captiveChoice} from './battles.js';
import {workChoice,equip,meetPerson,sceneTalk} from './field.js';
const pendingCommands=['attend','skipCouncil','agenda','resume','abandon','reroute','ack','finishCouncil','workChoice'];
export function dispatch(current,command){if(!command?.id||!command.type)throw Error('缺少命令識別');if(current.processedIds.includes(command.id))return current;if(command.expectedRevision!=null&&command.expectedRevision!==current.revision)throw Error('畫面已更新，請重新確認');const s=clone(current),a=command.args||{};ensurePeople(s);
if(s.phase==='ending')throw Error('此人生已到本版終局，可檢視、存讀或重開');if(s.phase==='creation'){if(command.type==='create'){s.creation={...s.creation,...a};if(!Number.isInteger(s.creation.step)||s.creation.step<0||s.creation.step>5)throw Error('建角步驟無效');}else if(command.type==='fate'){s.creation.fated=fate(s);}else if(command.type==='enter'){enter(s);}else throw Error('請先完成入世');}
else {if(s.pending&&!pendingCommands.includes(command.type))throw Error('請先處理目前事件');if(s.people.player.captivity&&command.type!=='captive'&&!(s.pending&&pendingCommands.includes(command.type)))throw Error('被俘中，普通行動受限');if(s.battle&&!['duel','army'].includes(command.type)&&!(s.pending&&pendingCommands.includes(command.type)))throw Error('請先處理本場戰鬥');if(s.people.player.vitality===0&&!['heal','move'].includes(command.type))throw Error('失去行動能力，須先療護');
switch(command.type){
case 'choosePath':{if(s.story.entryChoice!==null)throw Error('你已踏上自己的路，仍可隨時前往軍營');if(!['civil','military'].includes(a.path))throw Error('請選擇眼前的去向');s.story.entryChoice=a.path;life.move(s,a.path==='civil'?'market':'camp');if(a.path==='military')life.enlist(s);break;}
case 'workChoice':workChoice(s,a.choice);break;
case 'equip':equip(s,a.itemId);break;
case 'meet':meetPerson(s,a.person);break;
case 'sceneTalk':sceneTalk(s,a.person,a.choice);break;
case 'move':life.move(s,a.location);break;
case 'waitReturn':{const p=s.plans.find(p=>p.participants.includes('player')&&p.status==='returning');if(!p)throw Error('無需等待玩家回程');advance(s,p.returnPlan.remaining);break;}
case 'rest':life.rest(s,a.ticks);break;
case 'quick':life.rest(s,a.days,true);break;
case 'train':life.train(s,a.skill,a.ticks);break;
case 'rent':life.rent(s);break;
case 'shop':life.shop(s,a.item);break;
case 'heal':life.heal(s);break;
case 'locate':life.locate(s,a.person);break;
case 'social':life.social(s,a.person,a.gift);break;
case 'listen':life.listen(s);break;
case 'enlist':life.enlist(s);break;
case 'resettle':life.resettle(s);break;
case 'leave':if(busy(s,'player'))throw Error('先處理進行中的行動');loseAuthority(s);break;
case 'accept':{const d=TASKS[a.defId];if(!d||!a.defId.startsWith('civ_'))throw Error('正式評議任務只能由合法議程分派');if(s.people.player.location!==d.location)throw Error('委託人在指定地點');if(s.tasks.some(t=>t.defId===a.defId&&t.settledTick===null))throw Error('先處理上一份同類委託');accept(s,a.defId,`civil_${s.tasks.filter(t=>t.defId.startsWith('civ_')).length}`);break;}
case 'bagClue':{const t=s.tasks.find(t=>t.id===a.taskId);if(!t||t.defId!=='civ_find'||t.frozen)throw Error('沒有可尋找的行囊');t.clueStage=(t.clueStage||0)+1;advance(s,1);log(s,t.clueStage===1?'旅人指向城門旁的車隊：下一條線索可靠。':'車隊主人指出行囊所在，可取回並交付。');break;}
case 'task':{const t=s.tasks.find(t=>t.id===a.taskId),d=TASKS[t?.defId];if(!t||!d)throw Error('任務不存在');if(t.channel==='正式評議'&&!enlisted(s))throw Error('目前缺少組織任務授權');if(t.defId==='road_cover'){if(s.people.player.location!=='road')throw Error('請先抵達驛路營地');armyStart(s);break;}if(t.defId==='liuxi_recon'&&!s.story.firstDuel){if(s.people.player.location!=='liuxi')throw Error('請先抵達柳溪村');duelStart(s);break;}if(t.defId==='civ_find'&&(t.clueStage||0)<2)throw Error('先取得兩段可靠線索');if(a.extra&&(!t.completedTick||d.extra<1||t.extraDone))throw Error('無可執行的額外目標');const plan=start(s,{kind:'task',taskId:t.id,mode:a.mode||'self',ticks:a.extra?d.extra:d.work,location:s.people.player.location,skill:d.skill,extra:!!a.extra});plan.encounterEnabled=!!(d.encounter||a.interactive)&&t.defId.startsWith('civ_')&&plan.mode==='self'&&!a.extra;if(plan.mode!=='delegate')advance(s,plan.totalTicks);break;}
case 'report':{const t=s.tasks.find(t=>t.id===a.taskId);if(!t)throw Error('任務不存在');if(t.channel==='正式評議')throw Error('請於下一場可出席的正式評議驗收，不提供會後補報');if(s.people.player.location!==TASKS[t.defId].location)throw Error('請向指定地點的委託人交付');settle(s,t,t.channel);break;}
case 'recall':sendRecall(s,a.planId);break;
case 'attend':{const old=s.pending?.planId;councilBegin(s);if(old)s.pending.planId=old;break;}
case 'agenda':{const suspended=s.pending?.planId,c=s.councils.find(c=>c.id===s.pending?.councilId);if(councilAgenda(s)){s.pending=null;finishCouncilTime(s,c,suspended);}break;}
case 'finishCouncil':{const c=s.councils.find(c=>c.id===s.pending?.councilId);const suspended=s.pending?.suspendedPlanId;if(!c||s.pending.type!=='councilFinish')throw Error('無待繼續的評議');s.pending=null;finishCouncilTime(s,c,suspended);break;}
case 'skipCouncil':{if(s.pending?.type!=='council')throw Error('沒有此場評議選擇');const c=s.councils.find(c=>c.id===s.pending.councilId);c.status='missed';const r=s.relationships[leader(s)];if(r){r.敬重=Math.max(0,r.敬重-3);r.戒心=clamp(r.戒心+2,0,100);}const planId=s.pending.planId;s.pending=planId?{type:'interruption',planId,reason:'已記缺席，沒有會後補報；可繼續或放棄原行動。'}:null;log(s,'本場評議缺席。期限不重設，報功等下一場正式評議。');break;}
case 'resume':{const p=s.plans.find(p=>p.id===s.pending?.planId);if(!p||p.status!=='paused')throw Error('無可繼續的行動');if(p.encounterPending){s.pending={type:'commissionChoice',planId:p.id,taskId:p.taskId};break;}p.status='active';s.pending=null;advance(s,p.remainingWork);break;}
case 'reroute':{const p=s.plans.find(p=>p.id===s.pending?.planId);if(!p||p.kind!=='travel'||p.status!=='paused')throw Error('無可改道的旅行');p.routeMode='mountain';p.remainingWork+=2;p.totalTicks+=2;p.status='active';s.pending=null;log(s,'改走山路，額外兩時區；已耗時間不回復。');advance(s,p.remainingWork);break;}
case 'abandon':{const p=s.plans.find(p=>p.id===s.pending?.planId);if(!p)throw Error('無可放棄的行動');s.pending=null;cancelDelivered(s,p,'玩家放棄');break;}
case 'ack':{if(s.pending?.councilTimeId){s.pending={type:'councilFinish',councilId:s.pending.councilTimeId,suspendedPlanId:s.pending.suspendedPlanId};break;}const pid=s.pending?.planId;s.pending=pid?{type:'interruption',planId:pid,reason:'事件已處理，可繼續、改道或放棄原行動。'}:null;break;}
case 'duel':duelRound(s,a.move);break;
case 'army':armyRound(s,a.move);break;
case 'captive':captiveChoice(s,a.choice);break;
default:throw Error('未知行動');}}
if(s.phase==='playing')meetNearby(s);endingCheck(s);s.processedIds.push(command.id);s.revision++;validate(s);return s;}
export function availableActions(s){return {enlisted:enlisted(s),location:LOCATIONS[s.people.player.location],busy:busy(s,'player'),canDelegate:s.commandLinks.some(l=>l.subjectId==='shen'&&l.validUntil===null),nextCouncil:s.organizations.guard.nextCouncil};}

function finishCouncilTime(s,c,suspended){const before=s.tick;advance(s,c.duration-c.elapsed);c.elapsed+=s.tick-before;if(s.phase==='ending'){c.status='terminated';return;}if(c.elapsed<c.duration){if(s.pending){s.pending.councilTimeId=c.id;s.pending.suspendedPlanId=suspended;}else s.pending={type:'councilFinish',councilId:c.id,suspendedPlanId:suspended};return;}c.status='completed';s.story.firstCouncilEndTick??=s.tick;if(!s.pending&&suspended&&s.plans.find(p=>p.id===suspended)?.status==='paused')s.pending={type:'interruption',planId:suspended,reason:'評議已結束，可繼續或放棄原行動。'};}
