import {ATTRS,ITEMS,LOCATIONS,proficiency} from '../content/base.js';
import {growthRate,attributeFor} from '../core/growth.js';
import {stamp} from '../core/calendar.js';
import {enlisted} from '../core/tasks.js';
export const number=v=>Number((v||0).toFixed(1));
export function duration(ticks){return ticks>=12?`${Math.floor(ticks/12)}日${ticks%12?`又${ticks%12}時辰`:''}`:`${ticks}時辰`;}
export function trainingInfo(s,skill,ticks=1){const p=s.people.player,index=attributeFor(skill),rate=growthRate(p,skill,s.tick),xp=p.proficiencyXP[skill]||0,growth=p.growthXP[index],threshold=[100,300,700,1400].find(v=>v>xp);return {index,attribute:ATTRS[index],xp:number(xp),grade:proficiency(xp),next:threshold??null,remaining:threshold?number(threshold-xp):0,growth:number(growth),gainXP:number(rate*4*ticks),gainGrowth:number(rate*ticks),toAttribute:p.attributesBase[index]>=100?null:Math.ceil((100-growth)/rate),cost:ticks*5,end:stamp(s.tick+ticks)};}
export function inventoryGroups(s){const out=new Map();for(const item of Object.values(s.resources.items)){if(item.holder!=='player'||!ITEMS[item.defId])continue;const key=`${item.defId}:${item.owner}:${item.quality}`,d=ITEMS[item.defId];if(!out.has(key))out.set(key,{key,defId:item.defId,name:d.name,type:d.type,owner:item.owner,quality:item.quality,items:[],count:0,equipped:0});const group=out.get(key);group.items.push(item);group.count++;if(Object.values(s.people.player.equipment).includes(item.id))group.equipped++;}return [...out.values()].map(g=>({...g,available:g.items.find(i=>!i.reservedBy)?.id||null}));}
// Forecast only currently known daily meals and recovery, never future hidden events or random outcomes.
export function restForecast(s,ticks){const p=s.people.player;let vitality=p.vitality,stamina=p.stamina,food=s.resources.accounts.personal.food,army=s.resources.accounts.army.food,n=ticks;if(p.location==='inn')n=Math.max(0,Math.min(n,s.lodging.innUntil-s.tick));for(let i=1;i<=n;i++){if((s.tick+i)%12===0){if(enlisted(s)&&army>0)army--;else if(food>0)food--;}const fed=food>0||enlisted(s)&&army>0;stamina=Math.min(100,stamina+(p.location==='shelter'?5:10)*(fed?1:.5));if(!p.injuries.includes('重傷'))vitality=Math.min(100,vitality+(p.location==='shelter'?1:5)/6);}return {ticks:n,end:stamp(s.tick+n),stamina:number(stamina),vitality:number(vitality)};}
export function restSuggestions(s){const p=s.people.player;const reason=p.vitality===0?'請先求醫恢復行動':p.location==='barracks'&&!enlisted(s)?'尚未取得營舍留宿資格':p.location==='inn'&&s.lodging.innUntil<=s.tick?'先租客舍，或前往免費露宿處':'';const targets=[{key:'stamina',target:50,label:'體力恢復至一半'},{key:'stamina',target:100,label:'體力恢復全滿'},...(p.vitality<100?[{key:'vitality',target:p.vitality<50?50:100,label:p.vitality<50?'生命養至一半':'生命養至全滿'}]:[])];return targets.map(t=>{let forecast=null;const attained=p[t.key]>=t.target;if(!attained&&!reason&&!(t.key==='vitality'&&p.injuries.includes('重傷')))for(let n=1;n<=120;n++){const f=restForecast(s,n);if(f.ticks<n)break;if(f[t.key]+1e-8>=t.target){forecast=f;break;}}return {...t,attained,...forecast,reason:attained?'目前已達成':reason||(!forecast?(p.injuries.includes('重傷')&&t.key==='vitality'?'重傷須求醫':'此段住宿不足，請先續住或換地方'):''),enabled:!!forecast&&!reason};});}
export const LOCAL_SERVICES={
 market:[{label:'逛市採買',kind:'shop',note:'糧食、書卷與隨身物品'},{label:'找份工作',kind:'tasks',note:'搬運、看攤與核價'}],
 smith:[{label:'挑選兵甲',kind:'shop',note:'刀、弓、長槍與身甲'},{label:'替鐵匠搭手',kind:'tasks',note:'顧爐火、清點農具'}],
 tavern:[{label:'打聽見聞',kind:'listen',note:'花1時辰，聽行旅談時局'},{label:'買一壺酒',kind:'shop',note:'可帶去贈予故人'},{label:'辨明商路消息',kind:'tasks',note:'比較不同旅人的說法'}],
 inn:[{label:'租一間客舍',kind:'rent',note:'8錢可留宿一日'},{label:'替掌櫃分憂',kind:'tasks',note:'抄帳單、安頓旅人'},{label:'代售書卷',kind:'shop',note:'可購書作為禮物'}],
 clinic:[{label:'請醫者療養',kind:'heal',note:'10錢、3時辰；生命＋30，治傷'},{label:'幫忙分藥',kind:'tasks',note:'辨認相似藥草'}],
 gate:[{label:'問路尋物',kind:'tasks',note:'幫旅人找回失物'},{label:'去市場謀生',kind:'market',note:'在野也能安身'}],
 office:[{label:'幫書佐謄錄',kind:'tasks',note:'整理鄉籍與舊冊'}],
 supply:[{label:'打聽軍需消息',kind:'listen',note:'花1時辰詢問近況'},{label:'協助盤點',kind:'tasks',note:'查看可承接的工作'}],
 camp:[{label:'查看軍營事務',kind:'tasks',note:'軍令、任務與交付期限'},{label:'在校場修煉',kind:'train',note:'查看所長與成長'}],
 barracks:[{label:'歇息整備',kind:'rest',note:'留宿需有守備隊任職'}],
 shelter:[{label:'鋪席歇息',kind:'rest',note:'免費露宿，恢復較慢'}],
 liuxi:[{label:'幫村人疏渠',kind:'tasks',note:'田裡的水路等人整理'}],
 road:[{label:'整備車馬行囊',kind:'tasks',note:'替行旅整理鬆動的物件'}],
 manor:[{label:'向管事詢問差事',kind:'tasks',note:'核收宅中貨單'}]
};
export function workSituation(t){return {civ_accounts:'貨主的口頭價與帳上不同，兩人各執一詞。你要怎麼核對？',civ_stall:'有位客人要求退換，後面又排了幾人等你招呼。',civ_forge:'爐火忽明忽暗，下一批鐵料已送到手邊。',civ_tools:'兩件農具的記號模糊，數量卻正好對上貨單。',civ_herbs:'幾束藥草形貌相近，混放在同一只竹篩裡。',civ_guest:'兩名旅客都想換到靠窗的房間，誰也不肯先退。',civ_rumor:'兩桌行旅對同一段商路說法不同，你得決定如何查問。',civ_register:'舊冊被水漬浸過，一行姓名已辨不清楚。',civ_fields:'上游又有泥沙沖下來，村人催你快些放水。',civ_wagon:'一捆行李的繫繩鬆了，車伕又急著趕路。',civ_house:'貨單的總數對上了，其中一箱的封記卻不同。',civ_stock:'幾只糧袋的標記磨損了，需要重新核數。',civ_carry:'一箱貨物的繩結鬆開了，商販在旁催著交貨。',civ_copy:'帳單有一筆數目模糊，掌櫃暫時脫不開身。',civ_find:'找到的行囊沒有姓名，得再確認是否屬於旅人。'}[t?.defId]||'手頭的工作出了些小變化，你要如何處理？';}
