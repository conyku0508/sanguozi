import {validate,clone} from './state.js?v=20261018';
import {digest} from './rng.js?v=20261018';
import {stamp} from './calendar.js?v=20261018';
export const SLOT_IDS=['manual1','manual2','manual3','manual4','manual5','auto'];
const prefix='sanguozi:v1:';
export class SaveStore{
constructor(storage){this.storage=storage;}
key(id){if(!SLOT_IDS.includes(id))throw Error('不存在的存檔槽');return prefix+id;}
encode(s,id){validate(s);const state=clone(s);const payload={schemaVersion:1,contentVersion:'0.1.0',rulesVersion:'0.1.0',calendarProfile:'fixed_12x30',revision:s.revision,metadata:{slot:id,name:s.people.player.name,gameDate:stamp(s.tick),location:s.people.player.location,identity:s.appointments.filter(a=>a.endTick===null).at(-1)?.label||'在野',activeSeconds:s.activeSeconds,savedAt:new Date().toISOString(),terminal:s.story.chapterStatus},state};const raw=JSON.stringify(payload);return JSON.stringify({...payload,integrity:digest(raw)});}
write(id,s){const raw=this.encode(s,id);if(raw.length>4000000)throw Error('存檔過大，舊存檔保留');this.storage.setItem(this.key(id),raw);return raw;}
parse(raw){if(!raw)throw Error('此槽尚無存檔');let e;try{e=JSON.parse(raw);}catch{throw Error('存檔格式損毀');}const {integrity,...p}=e;if(integrity!==digest(JSON.stringify(p)))throw Error('存檔完整性檢查失敗');if(p.schemaVersion!==1||p.contentVersion!=='0.1.0'||p.rulesVersion!=='0.1.0'||p.calendarProfile!=='fixed_12x30'||!SLOT_IDS.includes(p.metadata?.slot))throw Error('不支援此存檔版本');validate(p.state);return p;}
read(id){const e=this.parse(this.storage.getItem(this.key(id)));if(e.metadata.slot!==id)throw Error('存檔槽識別不符');return clone(e.state);}
remove(id){this.storage.removeItem(this.key(id));}
list(){return SLOT_IDS.map(id=>{try{const raw=this.storage.getItem(this.key(id));if(!raw)return{id,empty:true};const e=this.parse(raw);return{id,metadata:e.metadata};}catch(e){return{id,error:e.message};}});}
}
