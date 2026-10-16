const task=(id,name,channel,work,deadline,money,merit,location,skill,extra=1)=>({id,name,channel,work,deadline,money,merit,location,skill,extra,eventIllustration:null,provenance:'fictional',policy:'hard'});
export const TASKS={
resettle_guard:task('resettle_guard','地方安置與承接','正式評議',2,36,0,0,'camp','文書',0),
civ_carry:task('civ_carry','市場搬運','商販',3,36,15,0,'market','農政'),
civ_copy:task('civ_copy','抄寫帳單','客舍掌櫃',3,36,10,0,'inn','文書'),
civ_find:task('civ_find','尋回行囊','旅人',2,48,10,0,'gate','情報',2),
liuxi_recon:task('liuxi_recon','柳溪偵察','正式評議',2,72,15,35,'liuxi','情報',2),
road_cover:task('road_cover','驛路救援','正式評議',0,48,15,35,'road','帶隊',0),
routine_patrol:task('routine_patrol','例行巡查','正式評議',4,'council',10,20,'camp','帶隊',2),
routine_supply:task('routine_supply','軍需盤點','正式評議',3,'council',10,20,'supply','文書'),
practice_self:task('practice_self','營地點驗','正式評議',3,120,5,0,'camp','帶隊',0),
practice_delegate:task('practice_delegate','路段巡查','正式評議',4,120,5,0,'camp','帶隊',0),
practice_joint:task('practice_joint','協同短護送','正式評議',4,120,5,0,'camp','帶隊',0)};
export const PRACTICE=['practice_self','practice_delegate','practice_joint'];

const commission=(id,name,personId,channel,work,deadline,money,location,skill,text)=>({...task(id,name,channel,work,deadline,money,0,location,skill,0),personId,description:text,encounter:true});
Object.assign(TASKS,{
 civ_accounts:commission('civ_accounts','核對市價','merchant','商販',2,24,12,'market','經商','兩批貨的價錢不一致，商販請你核對帳目。'),
 civ_stall:commission('civ_stall','代看攤位','merchant','商販',2,24,11,'market','口才','守著貨攤招呼客人，留意有人殺價或退換。'),
 civ_forge:commission('civ_forge','鍛爐助手','smith','石鐵生',3,36,16,'smith','槍','替鐵匠照料爐火、分類鐵料；急躁容易誤事。'),
 civ_tools:commission('civ_tools','清點農具','smith','石鐵生',2,24,12,'smith','文書','一批農具待交付，先把數量與記號逐件對清。'),
 civ_herbs:commission('civ_herbs','分揀藥材','physician','許藥師',3,36,13,'clinic','文書','藥草形貌相近，醫者希望你仔細分揀。'),
 civ_guest:commission('civ_guest','安頓旅客','innkeeper','客舍掌櫃',2,24,12,'inn','口才','客舍住進新旅客，房間安排起了爭執。'),
 civ_rumor:commission('civ_rumor','辨明商路消息','traveler','旅人',2,36,12,'tavern','情報','幾桌行旅對道路說法不同，分辨哪條消息可靠。'),
 civ_register:commission('civ_register','謄錄鄉籍','scribe','鄭書佐',3,48,14,'office','文書','舊籍有幾行模糊，書佐請你重新謄清。'),
 civ_fields:commission('civ_fields','疏通田渠','farmer','田阿伯',3,36,15,'liuxi','農政','水渠被泥沙堵住，村人正為分水發愁。'),
 civ_wagon:commission('civ_wagon','整備行囊','carter','馬車伕',2,24,13,'road','情報','車上物件鬆動，要趕在下一程前固定妥當。'),
 civ_house:commission('civ_house','核收宅中貨單','steward','陶管事',3,36,16,'manor','經商','替管事核收貨物；帳目與實物都要對得上。')
});
export const WORK_CHOICES=[
 {id:'careful',name:'穩妥處理',detail:'多花1時辰，報酬多4錢',extra:1,bonus:4},
 {id:'clever',name:'依所長應變',detail:'不加時間；熟練足夠多6錢，否則照原報酬',extra:0,bonus:6},
 {id:'rush',name:'趕緊辦完',detail:'不加時間；有失誤風險，可能少3錢',extra:0,bonus:2}
];

TASKS.civ_rumor.personId='host';TASKS.civ_rumor.channel='江酒家';
TASKS.civ_stock=commission('civ_stock','清點糧袋','luan','陸安',2,24,12,'supply','文書','替軍需處核對糧袋數目，做好後領取日酬，不計軍功。');
