export function random(s){let x=s.rng>>>0;x^=x<<13;x^=x>>>17;x^=x<<5;s.rng=x>>>0;return s.rng/4294967296;}
export const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
// Keep the conserved 250-point budget, with a visible strength even after a -5 origin modifier.
export function fate(s){const a=[20,20,20,20,20],peak=Math.floor(random(s)*5);a[peak]=75+Math.floor(random(s)*6);let left=250-a.reduce((x,y)=>x+y,0);const order=[0,1,2,3,4].filter(i=>i!==peak);for(let i=order.length-1;i>0;i--){const j=Math.floor(random(s)*(i+1));[order[i],order[j]]=[order[j],order[i]];}for(let n=0;n<order.length;n++){const remaining=order.length-n-1,lo=Math.max(0,left-remaining*60),hi=Math.min(60,left);const gain=n===order.length-1?left:lo+Math.floor(random(s)*(hi-lo+1));a[order[n]]+=gain;left-=gain;}return a;}

export function digest(str){let h=2166136261;for(let i=0;i<str.length;i++)h=Math.imul(h^str.charCodeAt(i),16777619);return (h>>>0).toString(16).padStart(8,'0');}
