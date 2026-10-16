export const ZONES=['晨一','晨二','晨三','日一','日二','日三','暮一','暮二','暮三','夜一','夜二','夜三'];
export const EPOCH=184, START=720;
export function at(year,month,day,zone=0){return ((year-EPOCH)*360+(month-1)*30+day-1)*12+zone;}
export function date(tick){const days=Math.floor(tick/12);return {year:EPOCH+Math.floor(days/360),month:Math.floor((days%360)/30)+1,day:days%30+1,zone:tick%12};}
export function stamp(tick){const d=date(tick);return `${d.year}年・${d.month}月${d.day}日・${ZONES[d.zone]}`;}
export function councilAfter(tick){let d=Math.floor(tick/12)+1;while(![1,11,21].includes(d%30+1))d++;return d*12;}
export function nextMorning(tick,n=1){return (Math.floor(tick/12)+n)*12;}
export function age(p,tick){const d=date(tick);return d.year-p.birthDate.year-(d.month<p.birthDate.month||(d.month===p.birthDate.month&&d.day<p.birthDate.day)?1:0);}
