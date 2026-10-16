export const ATTRS=['武力','智力','統率','政治','魅力'];
export const ORIGINS=[
{id:'farm',name:'農家',mods:[0,0,5,-5,0],money:50,food:3,skill:'農政',text:'田畝與收成，教會你在變動中安身。'},
{id:'trade',name:'商賈之家',mods:[-5,0,0,5,0],money:80,food:3,skill:'經商',text:'帳簿與商路，是你最初認識天下的方式。'},
{id:'scholar',name:'沒落士族',mods:[0,5,-5,0,0],money:60,food:2,skill:'文書',text:'家聲已淡，書卷還在。'},
{id:'military',name:'軍戶',mods:[5,0,0,0,-5],money:50,food:3,skill:'槍',text:'刀槍與軍令，曾是家中日常。'},
{id:'gentry',name:'地方豪族旁支',mods:[0,-5,0,0,5],money:80,food:3,skill:'口才',text:'你見過門第，也知道自己仍須謀一條路。'},
{id:'refugee',name:'流民',mods:[0,0,3,-5,2],money:20,food:1,skill:'情報',text:'離散的故鄉，留下活下去的本領。'}];
export const LOCATIONS={gate:{name:'陳留城門',city:'chenliu'},office:{name:'官署',city:'chenliu'},camp:{name:'軍營',city:'chenliu'},barracks:{name:'營舍',city:'chenliu',lodging:true},supply:{name:'軍需處',city:'chenliu'},market:{name:'市場',city:'chenliu'},tavern:{name:'酒肆',city:'chenliu'},inn:{name:'客舍',city:'chenliu',lodging:true},clinic:{name:'醫館',city:'chenliu'},smith:{name:'鐵匠',city:'chenliu'},manor:{name:'豪族宅邸',city:'chenliu'},shelter:{name:'城門安全露宿處',city:'chenliu',lodging:true},liuxi:{name:'柳溪村',city:'liuxi',provenance:'fictional'},road:{name:'驛路營地',city:'road',provenance:'fictional'}};
export const ROUTES=[['chenliu','liuxi',12],['chenliu','road',6],['liuxi','road',6]];
export const NPCS={merchant:{name:'梁商販',attrs:[30,45,25,45,45],skill:'經商',xp:300,trait:'務實',pref:'酒',roles:'市場委託人',schedule:['market','market','market','inn']},innkeeper:{name:'顧掌櫃',attrs:[25,50,25,55,45],skill:'文書',xp:100,trait:'細心',pref:'書',roles:'客舍委託人',schedule:['inn','inn','inn','inn']},traveler:{name:'周旅人',attrs:[35,40,30,30,50],skill:'情報',xp:100,trait:'重義',pref:'酒',roles:'城門委託人',schedule:['gate','gate','gate','inn']},hanfu:{name:'韓福',attrs:[55,50,65,50,45],skill:'帶隊',xp:100,trait:'謹慎・重實績',pref:'軍務',roles:'上級與評議',schedule:['office','camp','office','barracks']},zhang:{name:'張二牛',attrs:[48,30,35,25,50],skill:'槍',xp:100,trait:'重義・務實',pref:'糧',roles:'同袍與生活',schedule:['camp','camp','tavern','barracks']},luan:{name:'陸安',attrs:[25,65,35,65,45],skill:'文書',xp:300,trait:'細心・守規矩',pref:'書',roles:'文書與軍需',schedule:['supply','office','supply','barracks']},duwei:{name:'杜威',attrs:[70,40,55,30,40],skill:'槍',xp:700,trait:'嚴厲・肯教',pref:'勤學',roles:'訓練與戰鬥',schedule:['camp','camp','camp','barracks']},shen:{name:'沈禾',attrs:[40,38,32,30,45],skill:'槍',xp:100,trait:'穩重・願意學習',pref:'糧',roles:'守備隊成員',schedule:['camp','camp','camp','barracks']},xu:{name:'許紀',attrs:[48,55,60,50,45],skill:'帶隊',xp:100,trait:'重實績',pref:'軍務',roles:'接任軍令與評議',schedule:['office','camp','office','barracks']},su:{name:'蘇簡',attrs:[25,60,35,60,45],skill:'文書',xp:300,trait:'守規矩',pref:'書',roles:'接任文書與軍需',schedule:['supply','office','supply','barracks']},cheng:{name:'程嶺',attrs:[65,40,50,35,40],skill:'槍',xp:700,trait:'肯教',pref:'勤學',roles:'接任訓練',schedule:['camp','camp','camp','barracks']}};
export const ITEMS={knife:{name:'普通短刀',price:20,type:'weapon',quality:'普通',weight:'輕'},bow:{name:'普通弓',price:25,type:'weapon',quality:'普通',weight:'中'},armor:{name:'普通身甲',price:30,type:'armor',quality:'普通',weight:'中'},wine:{name:'酒',price:5,type:'gift',quality:'普通',weight:'輕'},grain:{name:'糧',price:3,type:'food',quality:'普通',weight:'輕'},book:{name:'書',price:12,type:'gift',quality:'普通',weight:'輕'}};
// 示意佈局；不宣稱184年精確建制或行政邊界。
export const NODES=[['陳留',57,34],['洛陽',45,34],['長安',30,34],['許昌',54,42],['濮陽',61,28],['鄴',57,20],['南皮',65,17],['北平',73,8],['平原',65,23],['濟南',74,25],['北海',83,27],['下邳',76,37],['小沛',68,36],['壽春',71,47],['廬江',67,53],['汝南',56,49],['宛',44,46],['襄陽',44,54],['江陵',44,65],['江夏',57,59],['長沙',53,73],['武陵',42,75],['零陵',45,83],['桂陽',57,83],['建業',82,54],['吳',90,59],['會稽',88,66],['豫章',70,66],['成都',18,64],['江州',29,67],['梓潼',18,54],['漢中',28,49],['天水',20,34],['武威',9,18],['安定',27,25],['上庸',37,52],['永安',35,66],['雲南',19,87],['南海',74,89],['交趾',46,96]].map(([name,x,y],i)=>({id:i===0?'chenliu':`node_${i}`,name,x,y,open:i===0}));
for(const d of Object.values(NPCS)){d.provenance='fictional';d.portrait=null;d.ideal=d.roles.includes('委託')?'在亂世安穩度日':'守住地方，也做好自己職責';}
for(const d of Object.values(LOCATIONS)){d.locationIcon=null;d.locationArt=null;d.sceneArt=null;}for(const d of Object.values(ITEMS))d.icon=null;for(const n of NODES)n.mapMarker=null;
export const proficiency=x=>['初學','熟悉','熟練','精通','大成'][[100,300,700,1400].filter(t=>x>=t).length];

// Additional local residents share the same Person model as every other career.
Object.assign(NPCS,{
 smith:{name:'石鐵生',attrs:[58,38,28,25,34],skill:'槍',xp:300,trait:'直爽・重手藝',pref:'酒',roles:'鐵匠',schedule:['smith','smith','smith','inn'],civil:true},
 physician:{name:'許藥師',attrs:[24,62,25,48,50],skill:'文書',xp:300,trait:'溫厚・仔細',pref:'書',roles:'醫者',schedule:['clinic','clinic','clinic','clinic'],civil:true},
 farmer:{name:'田阿伯',attrs:[38,35,25,48,44],skill:'農政',xp:300,trait:'勤懇・惜糧',pref:'糧',roles:'村中農人',schedule:['liuxi','liuxi','liuxi','liuxi'],civil:true},
 carter:{name:'馬車伕',attrs:[42,36,33,26,42],skill:'情報',xp:100,trait:'健談・識路',pref:'酒',roles:'行旅',schedule:['road','road','road','road'],civil:true},
 scribe:{name:'鄭書佐',attrs:[22,58,28,60,36],skill:'文書',xp:300,trait:'寡言・守信',pref:'書',roles:'官署書佐',schedule:['office','office','office','inn'],civil:true},
 steward:{name:'陶管事',attrs:[30,50,35,54,46],skill:'口才',xp:100,trait:'謹慎・重分寸',pref:'書',roles:'宅邸管事',schedule:['manor','manor','manor','manor'],civil:true}
});
for(const id of ['merchant','innkeeper','traveler'])NPCS[id].civil=true;
Object.assign(ITEMS,{spear:{name:'普通長槍',price:22,type:'weapon',quality:'普通',weight:'中'},straw:{name:'粗製草鞋',price:2,type:'clothing',quality:'粗製',weight:'輕',shops:[]},clothes:{name:'粗製衣物',price:3,type:'clothing',quality:'粗製',weight:'輕',shops:[]}});
for(const [id,item] of Object.entries(ITEMS)){item.shops??=(['knife','bow','armor','spear'].includes(id)?['market','smith']:id==='wine'?['market','tavern']:id==='book'?['market','inn']:['market']);}

NPCS.host={name:'江酒家',attrs:[32,43,27,35,53],skill:'口才',xp:300,trait:'熱絡・識人',pref:'酒',roles:'酒肆主人',schedule:['tavern','tavern','tavern','tavern'],civil:true};
