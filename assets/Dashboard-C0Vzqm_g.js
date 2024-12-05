import{_ as Y,g as v,Y as R,o as $,j as K,k as r,q as d,w as t,n,E as Q,x as u,y as o,I as h,a1 as f,z as _,aC as x,v as i,J as D,B as I,C as X}from"./index-CjeFGtzt.js";import"./index-CUeaqhHS.js";const Z={class:"dashboard-container"},ee={class:"stat-content"},ae={class:"stat-info"},ne={class:"stat-title"},le={class:"stat-value"},te={class:"filter-container"},de={class:"chart-header"},oe={class:"header-left"},se={class:"canteen-header"},ie={class:"canteen-name"},re={key:1,class:"performance-normal"},ue={class:"canteen-details"},ce={class:"detail-item"},ve={class:"value"},me={class:"detail-item"},_e={class:"value"},pe={class:"detail-item"},ye={class:"value"},he={class:"chart-header"},fe={class:"rank-number"},Re={class:"window-info"},Ie={class:"window-name"},be={class:"window-canteen"},ge={class:"window-revenue"},we={class:"amount"},Ce={class:"orders"},ke={__name:"Dashboard",setup(Ve){X();const E=v("week"),z=v("today"),p=v(""),V=v(""),b=v(""),g=v([{id:"1",name:"第一餐厅",location:"A区"},{id:"2",name:"第二餐厅",location:"B区"},{id:"3",name:"第三餐厅",location:"C区"},{id:"4",name:"第四餐厅",location:"D区"},{id:"5",name:"第五餐厅",location:"E区"},{id:"6",name:"教工餐厅",location:"F区"},{id:"7",name:"研究生餐厅",location:"G区"}]),w=v([{id:"101",name:"川湘菜",canteenId:"1",dailyRevenue:3200},{id:"102",name:"粤式炒饭",canteenId:"1",dailyRevenue:2800},{id:"103",name:"面食档口",canteenId:"1",dailyRevenue:2500},{id:"104",name:"特色小炒",canteenId:"1",dailyRevenue:3100},{id:"105",name:"烧腊饭",canteenId:"1",dailyRevenue:3400},{id:"201",name:"东北菜",canteenId:"2",dailyRevenue:3500},{id:"202",name:"清真档口",canteenId:"2",dailyRevenue:2900},{id:"203",name:"特色小炒",canteenId:"2",dailyRevenue:3100},{id:"204",name:"麻辣烫",canteenId:"2",dailyRevenue:3800},{id:"205",name:"快餐套餐",canteenId:"2",dailyRevenue:2600},{id:"301",name:"江浙菜",canteenId:"3",dailyRevenue:3300},{id:"302",name:"火锅档口",canteenId:"3",dailyRevenue:4200},{id:"303",name:"快餐套餐",canteenId:"3",dailyRevenue:2700},{id:"304",name:"日式料理",canteenId:"3",dailyRevenue:3900},{id:"305",name:"韩式料理",canteenId:"3",dailyRevenue:3600},{id:"401",name:"湘菜档口",canteenId:"4",dailyRevenue:3700},{id:"402",name:"粤式烧腊",canteenId:"4",dailyRevenue:4100},{id:"403",name:"面食档口",canteenId:"4",dailyRevenue:2800},{id:"404",name:"特色炒饭",canteenId:"4",dailyRevenue:3200},{id:"405",name:"快餐套餐",canteenId:"4",dailyRevenue:2500},{id:"501",name:"川菜档口",canteenId:"5",dailyRevenue:3800},{id:"502",name:"东北菜",canteenId:"5",dailyRevenue:3400},{id:"503",name:"清真美食",canteenId:"5",dailyRevenue:3100},{id:"504",name:"面食档口",canteenId:"5",dailyRevenue:2700},{id:"505",name:"快餐套餐",canteenId:"5",dailyRevenue:2400},{id:"601",name:"精品炒菜",canteenId:"6",dailyRevenue:4500},{id:"602",name:"营养套餐",canteenId:"6",dailyRevenue:3900},{id:"603",name:"特色面点",canteenId:"6",dailyRevenue:3200},{id:"604",name:"粤式烧腊",canteenId:"6",dailyRevenue:4300},{id:"605",name:"日韩料理",canteenId:"6",dailyRevenue:4e3},{id:"701",name:"自选快餐",canteenId:"7",dailyRevenue:3700},{id:"702",name:"特色小炒",canteenId:"7",dailyRevenue:3400},{id:"703",name:"面食档口",canteenId:"7",dailyRevenue:2900},{id:"704",name:"火锅档口",canteenId:"7",dailyRevenue:4100},{id:"705",name:"麻辣烫",canteenId:"7",dailyRevenue:3500}]),A=v({1:[15800,16200,14900,16500,17200,12500,13800],2:[16500,17200,15800,16900,18200,13500,14200],3:[17200,16800,16200,17500,18800,14200,15100]}),F=v([{title:"总营业额",value:"¥0",trend:0,icon:"Money",color:"#409EFF"},{title:"总订单数",value:"0",trend:0,icon:"ShoppingCart",color:"#67C23A"},{title:"餐厅数量",value:"0",trend:0,icon:"House",color:"#E6A23C"},{title:"窗口总数",value:"0",trend:0,icon:"Shop",color:"#F56C6C"}]),W=R(()=>p.value?w.value.filter(l=>l.canteenId===p.value).map(l=>({label:l.name,value:l.id})):[]),U=R(()=>g.value.map(l=>({label:l.name,value:l.id}))),L=R(()=>g.value.map(l=>{const s=w.value.filter(c=>c.canteenId===l.id).reduce((c,C)=>c+C.dailyRevenue,0),m=Math.floor(s/25);return{id:l.id,name:l.name,revenue:s.toLocaleString(),orderCount:m,avgOrder:Math.round(s/m).toLocaleString(),performance:s>9e3?"优秀":s>7e3?"良好":"一般",trend:Math.floor(Math.random()*20)-10}})),T=R(()=>w.value.map(l=>{var a;return{...l,canteenName:(a=g.value.find(s=>s.id===l.canteenId))==null?void 0:a.name,revenue:l.dailyRevenue.toLocaleString(),orderCount:Math.floor(l.dailyRevenue/25)}}).sort((l,a)=>a.dailyRevenue-l.dailyRevenue)),j=R(()=>b.value?L.value.filter(l=>l.id===b.value):L.value),H=l=>l==="优秀"?"success":l==="良好"?"info":l==="一般"?"warning":"info",q=l=>{V.value="",S()},G=()=>{S()},B=()=>{},S=async()=>{try{const l=p.value?A.value[p.value]:Object.values(A.value).reduce((a,s)=>s.map((m,c)=>(a[c]||0)+m),[]);F.value=[{title:"总营业额",value:`¥${l.reduce((a,s)=>a+s,0).toLocaleString()}`,trend:12.5,icon:"Money",color:"#409EFF"},{title:"总订单数",value:Math.floor(l.reduce((a,s)=>a+s,0)/25).toString(),trend:8.2,icon:"ShoppingCart",color:"#67C23A"},{title:"餐厅数量",value:g.value.length.toString(),trend:0,icon:"House",color:"#E6A23C"},{title:"窗口总数",value:w.value.length.toString(),trend:4.8,icon:"Shop",color:"#F56C6C"}]}catch(l){console.error("更新数据失败:",l),Q.error("更新数据失败")}};return $(()=>{S(),window.addEventListener("resize",B)}),K(()=>{window.removeEventListener("resize",B)}),(l,a)=>{const s=u("el-icon"),m=u("el-card"),c=u("el-col"),C=u("el-row"),y=u("el-option"),k=u("el-select"),M=u("el-radio-button"),J=u("el-radio-group"),P=u("el-tag"),N=u("el-scrollbar");return o(),r("div",Z,[d(C,{gutter:20,class:"dashboard-header"},{default:t(()=>[(o(!0),r(h,null,f(F.value,e=>(o(),_(c,{span:6,key:e.title},{default:t(()=>[d(m,{shadow:"hover",class:"stat-card"},{default:t(()=>[n("div",ee,[d(s,{size:24,color:e.color},{default:t(()=>[(o(),_(x(e.icon)))]),_:2},1032,["color"]),n("div",ae,[n("div",ne,i(e.title),1),n("div",le,i(e.value),1),n("div",{class:D(["stat-trend",{up:e.trend>0,down:e.trend<0}])},[d(s,null,{default:t(()=>[(o(),_(x(e.trend>0?"ArrowUp":"ArrowDown")))]),_:2},1024),I(" "+i(Math.abs(e.trend))+"% ",1)],2)])])]),_:2},1024)]),_:2},1024))),128))]),_:1}),n("div",te,[d(k,{modelValue:p.value,"onUpdate:modelValue":a[0]||(a[0]=e=>p.value=e),placeholder:"选择餐厅",clearable:"",onChange:q,style:{width:"120px"}},{default:t(()=>[(o(!0),r(h,null,f(U.value,e=>(o(),_(y,{key:e.value,label:e.label,value:e.value},null,8,["label","value"]))),128))]),_:1},8,["modelValue"]),d(k,{modelValue:V.value,"onUpdate:modelValue":a[1]||(a[1]=e=>V.value=e),placeholder:"选择窗口",clearable:"",disabled:!p.value,onChange:G,style:{width:"120px"}},{default:t(()=>[(o(!0),r(h,null,f(W.value,e=>(o(),_(y,{key:e.value,label:e.label,value:e.value},null,8,["label","value"]))),128))]),_:1},8,["modelValue","disabled"])]),d(C,{gutter:20,class:"chart-row"},{default:t(()=>[d(c,{span:12},{default:t(()=>[d(m,{class:"chart-card"},{header:t(()=>[n("div",de,[n("div",oe,[a[8]||(a[8]=n("span",{class:"title"},"餐厅营业情况",-1)),d(J,{modelValue:E.value,"onUpdate:modelValue":a[2]||(a[2]=e=>E.value=e),size:"small"},{default:t(()=>[d(M,{value:"week"},{default:t(()=>a[5]||(a[5]=[I("本周")])),_:1}),d(M,{value:"month"},{default:t(()=>a[6]||(a[6]=[I("本月")])),_:1}),d(M,{value:"year"},{default:t(()=>a[7]||(a[7]=[I("全年")])),_:1})]),_:1},8,["modelValue"])]),d(k,{modelValue:b.value,"onUpdate:modelValue":a[3]||(a[3]=e=>b.value=e),placeholder:"选择餐厅查看",clearable:"",size:"small",style:{width:"120px"}},{default:t(()=>[(o(!0),r(h,null,f(U.value,e=>(o(),_(y,{key:e.value,label:e.label,value:e.value},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])])]),default:t(()=>[d(N,{height:"350px",class:"canteen-stats"},{default:t(()=>[(o(!0),r(h,null,f(j.value,e=>(o(),r("div",{key:e.id,class:"canteen-item"},[n("div",se,[n("span",ie,i(e.name),1),e.performance!=="良好"?(o(),_(P,{key:0,type:H(e.performance)},{default:t(()=>[I(i(e.performance),1)]),_:2},1032,["type"])):(o(),r("span",re,i(e.performance),1))]),n("div",ue,[n("div",ce,[a[9]||(a[9]=n("span",{class:"label"},"营业额",-1)),n("span",ve,"¥"+i(e.revenue),1)]),n("div",me,[a[10]||(a[10]=n("span",{class:"label"},"订单数",-1)),n("span",_e,i(e.orderCount),1)]),n("div",pe,[a[11]||(a[11]=n("span",{class:"label"},"客单价",-1)),n("span",ye,"¥"+i(e.avgOrder),1)])]),n("div",{class:D(["trend-indicator",e.trend>0?"up":"down"])},[d(s,null,{default:t(()=>[(o(),_(x(e.trend>0?"ArrowUp":"ArrowDown")))]),_:2},1024),n("span",null,i(Math.abs(e.trend))+"%",1)],2)]))),128))]),_:1})]),_:1})]),_:1}),d(c,{span:12},{default:t(()=>[d(m,{class:"chart-card"},{header:t(()=>[n("div",he,[a[12]||(a[12]=n("div",{class:"header-left"},[n("span",{class:"title"},"热门窗口排行")],-1)),d(k,{modelValue:z.value,"onUpdate:modelValue":a[4]||(a[4]=e=>z.value=e),size:"small",style:{width:"100px"}},{default:t(()=>[d(y,{label:"今日",value:"today"}),d(y,{label:"本周",value:"week"}),d(y,{label:"本月",value:"month"})]),_:1},8,["modelValue"])])]),default:t(()=>[d(N,{height:"350px",class:"window-ranking"},{default:t(()=>[(o(!0),r(h,null,f(T.value,(e,O)=>(o(),r("div",{key:e.id,class:D(["window-item",{"top-three":O<3}])},[n("div",fe,i(O+1),1),n("div",Re,[n("div",Ie,i(e.name),1),n("div",be,i(e.canteenName),1)]),n("div",ge,[n("div",we,"¥"+i(e.revenue),1),n("div",Ce,i(e.orderCount)+"单",1)])],2))),128))]),_:1})]),_:1})]),_:1})]),_:1})])}}},xe=Y(ke,[["__scopeId","data-v-b8c454af"]]);export{xe as default};
