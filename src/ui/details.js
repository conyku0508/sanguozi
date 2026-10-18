import {ATTRS,ITEMS,LOCATIONS,proficiency} from '../content/base.js?v=20261018';
import {growthRate,ageRate,attributeFor} from '../core/growth.js?v=20261018';
import {stamp} from '../core/calendar.js?v=20261018';
import {CHAPTER,chapterState} from '../core/adventure.js?v=20261018';
import {enlisted} from '../core/tasks.js?v=20261018';
export const number=v=>Number((v||0).toFixed(1));
export function duration(ticks){return ticks>=12?`${Math.floor(ticks/12)}日${ticks%12?`又${ticks%12}時辰`:''}`:`${ticks}時辰`;}
export function trainingInfo(s,skill,ticks=1){const p=s.people.player,index=attributeFor(skill),rate=growthRate(p,skill,s.tick),xp=p.proficiencyXP[skill]||0,growth=p.growthXP[index],threshold=[100,300,700,1400].find(v=>v>xp);return {index,attribute:ATTRS[index],xp:number(xp),grade:proficiency(xp),next:threshold??null,remaining:threshold?number(threshold-xp):0,growth:number(growth),gainXP:number(ageRate(p,skill,s.tick)*4*ticks),gainGrowth:number(rate*ticks),needsLesson:p.attributesBase[index]>=90&&!(p.specialLessons?.[index]>0),toAttribute:p.attributesBase[index]>=100?null:Math.max(0,Math.ceil((100-growth)/rate)),cost:ticks*5,end:stamp(s.tick+ticks)};}
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

const voices={smith:['鐵料要看火候，貨單也要看封記；急著交貨，最容易出錯。','環首刀適合劈砍；換了兵器，也得把相應武藝練起來。'],merchant:['同一袋粟出現兩個價，我得知道究竟漏在哪一筆。','糧商若換了路，運費便會變；先問清單價，再定數量。'],host:['驛路失貨的說法傳了兩桌，卻沒人說得清是哪一天。','前一位行旅只見過斷繩，後一位卻說見到流寇；得分清親見與轉述。'],farmer:['田渠通了，這一季的糧才有盼頭。','送糧的車走了，回程的人卻遲了；先去驛路問問馬車伕。'],luan:['少一枚糧籌，也不能隨意填上；得找實際收貨的人對帳。','已完成的軍令可回營先領錢糧，軍功仍要評議核定。'],scribe:['字要寫清，數也得核實；兩份冊子相左，便把來源一併記下。','傳聞若沒查過，請註明是誰何時聽來，別當成已查實的事。'],innkeeper:['有人把簡冊忘在房裡，交給我保管，等他回來便好。','住客的名字和行李要分清；安頓妥當，也是一門本領。'],carter:['車軸和繫繩都得查；破一條繩，往往就耽誤一整隊。','柳溪到陳留有幾個坡口，天色晚了，寧可先在營地整備。'],physician:['看傷先說明來由；輕傷可歇息，重傷可不能只靠硬撐。','藥草形似，氣味卻有別；分揀時別只憑一眼。']};
export function localVoice(s,id){const list=voices[id]||['各人都有手頭的事，願意聽，便能多知道一些。','有些話要親眼核實；若是路過傳聞，先留個心眼。'];return list[(Math.floor(s.tick/3)+s.tasks.filter(t=>t.settledTick!==null).length)%list.length];}
