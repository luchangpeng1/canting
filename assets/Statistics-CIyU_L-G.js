import{i as T}from"./index-CUeaqhHS.js";import{_ as P,g as _,o as X,j as H,k as O,q as t,w as a,x as n,y as v,B as s,I as K,a1 as Q,z as V,n as o,au as W,aC as S,v as u,J as A,aL as Y,ab as Z}from"./index-CjeFGtzt.js";const $={class:"statistics-container"},I={class:"stat-item"},ee={class:"stat-info"},te={class:"stat-title"},ae={class:"stat-value"},le={class:"chart-header"},oe={class:"detail-header"},ne={__name:"Statistics",setup(re){const c=_({dateRange:[],type:"revenue"}),L=[{text:"最近一周",value:()=>{const r=new Date,e=new Date;return e.setTime(e.getTime()-3600*1e3*24*7),[e,r]}},{text:"最近一月",value:()=>{const r=new Date,e=new Date;return e.setTime(e.getTime()-3600*1e3*24*30),[e,r]}},{text:"最近三月",value:()=>{const r=new Date,e=new Date;return e.setTime(e.getTime()-3600*1e3*24*90),[e,r]}}],B=_([{title:"总营业额",value:"¥128,960",trend:12.5,icon:"Money",color:"#409EFF"},{title:"总订单数",value:"1,286",trend:8.2,icon:"ShoppingCart",color:"#67C23A"},{title:"总客流量",value:"3,862",trend:-3.5,icon:"User",color:"#E6A23C"}]),C=_("week"),f=_(null),g=_(null);let d=null,i=null;const E=_([{date:"2024-03-20",revenue:15680,orders:186,customers:560,avgOrder:84.3,trend:12.5},{date:"2024-03-19",revenue:14520,orders:165,customers:495,avgOrder:88,trend:-5.2},{date:"2024-03-18",revenue:16890,orders:198,customers:594,avgOrder:85.3,trend:8.7}]),U=()=>{if(!f.value)return;d=T(f.value);const r={tooltip:{trigger:"axis"},legend:{data:["营业额","订单量"]},grid:{left:"3%",right:"4%",bottom:"3%",containLabel:!0},xAxis:{type:"category",boundaryGap:!1,data:["周一","周二","周三","周四","周五","周六","周日"]},yAxis:[{type:"value",name:"营业额",axisLabel:{formatter:"¥{value}"}},{type:"value",name:"订单量",axisLabel:{formatter:"{value}单"}}],series:[{name:"营业额",type:"line",smooth:!0,data:[15200,14800,16300,15800,17200,18500,17800]},{name:"订单量",type:"line",smooth:!0,yAxisIndex:1,data:[180,165,190,185,200,220,210]}]};d.setOption(r)},F=()=>{if(!g.value)return;i=T(g.value);const r={tooltip:{trigger:"item",formatter:"{b}: {c} ({d}%)"},legend:{orient:"vertical",left:"left"},series:[{type:"pie",radius:"70%",data:[{value:45600,name:"堂食"},{value:38200,name:"外卖"},{value:25800,name:"预订"},{value:19360,name:"其他"}],emphasis:{itemStyle:{shadowBlur:10,shadowOffsetX:0,shadowColor:"rgba(0, 0, 0, 0.5)"}}}]};i.setOption(r)},R=()=>{console.log("搜索条件：",c.value)},M=()=>{console.log("导出报表")},D=()=>{d==null||d.resize(),i==null||i.resize()};return X(()=>{U(),F(),window.addEventListener("resize",D)}),H(()=>{window.removeEventListener("resize",D),d==null||d.dispose(),i==null||i.dispose()}),(r,e)=>{const N=n("el-date-picker"),b=n("el-form-item"),w=n("el-option"),j=n("el-select"),y=n("el-button"),q=n("el-form"),m=n("el-card"),h=n("el-icon"),x=n("el-col"),z=n("el-row"),k=n("el-radio-button"),G=n("el-radio-group"),p=n("el-table-column"),J=n("el-table");return v(),O("div",$,[t(m,{class:"filter-card"},{default:a(()=>[t(q,{inline:!0,model:c.value},{default:a(()=>[t(b,{label:"统计时间"},{default:a(()=>[t(N,{modelValue:c.value.dateRange,"onUpdate:modelValue":e[0]||(e[0]=l=>c.value.dateRange=l),type:"daterange","range-separator":"至","start-placeholder":"开始日期","end-placeholder":"结束日期",shortcuts:L},null,8,["modelValue"])]),_:1}),t(b,{label:"统计类型"},{default:a(()=>[t(j,{modelValue:c.value.type,"onUpdate:modelValue":e[1]||(e[1]=l=>c.value.type=l)},{default:a(()=>[t(w,{label:"营业额",value:"revenue"}),t(w,{label:"订单量",value:"orders"}),t(w,{label:"客流量",value:"customers"})]),_:1},8,["modelValue"])]),_:1}),t(b,null,{default:a(()=>[t(y,{type:"primary",onClick:R},{default:a(()=>e[3]||(e[3]=[s("查询")])),_:1}),t(y,{onClick:M},{default:a(()=>e[4]||(e[4]=[s("导出报表")])),_:1})]),_:1})]),_:1},8,["model"])]),_:1}),t(z,{gutter:20,class:"stat-cards"},{default:a(()=>[(v(!0),O(K,null,Q(B.value,l=>(v(),V(x,{span:8,key:l.title},{default:a(()=>[t(m,{shadow:"hover"},{default:a(()=>[o("div",I,[o("div",{class:"stat-icon",style:W({background:l.color})},[t(h,null,{default:a(()=>[(v(),V(S(l.icon)))]),_:2},1024)],4),o("div",ee,[o("div",te,u(l.title),1),o("div",ae,u(l.value),1),o("div",{class:A(["stat-trend",{up:l.trend>0,down:l.trend<0}])},[t(h,null,{default:a(()=>[(v(),V(S(l.trend>0?"ArrowUp":"ArrowDown")))]),_:2},1024),s(" "+u(Math.abs(l.trend))+"% ",1)],2)])])]),_:2},1024)]),_:2},1024))),128))]),_:1}),t(z,{gutter:20,class:"chart-row"},{default:a(()=>[t(x,{span:16},{default:a(()=>[t(m,{class:"chart-card"},{header:a(()=>[o("div",le,[e[8]||(e[8]=o("span",null,"营业趋势分析",-1)),t(G,{modelValue:C.value,"onUpdate:modelValue":e[2]||(e[2]=l=>C.value=l),size:"small"},{default:a(()=>[t(k,{label:"day"},{default:a(()=>e[5]||(e[5]=[s("日视图")])),_:1}),t(k,{label:"week"},{default:a(()=>e[6]||(e[6]=[s("周视图")])),_:1}),t(k,{label:"month"},{default:a(()=>e[7]||(e[7]=[s("月视图")])),_:1})]),_:1},8,["modelValue"])])]),default:a(()=>[o("div",{ref_key:"trendChart",ref:f,class:"chart"},null,512)]),_:1})]),_:1}),t(x,{span:8},{default:a(()=>[t(m,{class:"chart-card"},{header:a(()=>e[9]||(e[9]=[o("div",{class:"chart-header"},[o("span",null,"收入构成")],-1)])),default:a(()=>[o("div",{ref_key:"pieChart",ref:g,class:"chart"},null,512)]),_:1})]),_:1})]),_:1}),t(m,{class:"detail-card"},{header:a(()=>[o("div",oe,[e[11]||(e[11]=o("span",null,"营业明细",-1)),t(y,{type:"primary",link:""},{default:a(()=>[e[10]||(e[10]=s(" 查看更多")),t(h,{class:"el-icon--right"},{default:a(()=>[t(Y(Z))]),_:1})]),_:1})])]),default:a(()=>[t(J,{data:E.value,stripe:"",style:{width:"100%"}},{default:a(()=>[t(p,{prop:"date",label:"日期",width:"180"}),t(p,{prop:"revenue",label:"营业额",width:"150"},{default:a(({row:l})=>[s(" ¥"+u(l.revenue),1)]),_:1}),t(p,{prop:"orders",label:"订单数",width:"120"}),t(p,{prop:"customers",label:"客流量",width:"120"}),t(p,{prop:"avgOrder",label:"客单价",width:"120"},{default:a(({row:l})=>[s(" ¥"+u(l.avgOrder),1)]),_:1}),t(p,{prop:"trend",label:"同比"},{default:a(({row:l})=>[o("span",{class:A(l.trend>=0?"trend-up":"trend-down")},u(l.trend>=0?"+":"")+u(l.trend)+"% ",3)]),_:1})]),_:1},8,["data"])]),_:1})])}}},ie=P(ne,[["__scopeId","data-v-75b49623"]]);export{ie as default};
