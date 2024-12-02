import{_ as A,D as T,F as W,u as F,G as k,g as d,o as B,k as q,n,q as s,w as i,H as S,C as D,x as r,y as O,I as c,J as U,K as l}from"./index-DxkRXB23.js";const E={name:"StudentLayout",components:{Food:T,List:W,User:F,ChatSquare:k},setup(){const v=D(),e=U(),b=d(v.currentRoute.value.path),a=d({中央食堂:!0,沁园餐厅:!0,馨园餐厅:!1,仲园餐厅:!0,雅园餐厅:!0,服务点:!1}),H=d({中央食堂:{1:[{id:1,name:"特色炒菜",operatingHours:"10:30-13:30, 16:30-19:00",status:!0},{id:2,name:"面食档口",operatingHours:"10:30-13:30, 16:30-19:00",status:!0},{id:3,name:"盖浇饭",operatingHours:"10:30-13:30, 16:30-19:00",status:!1}],2:[{id:4,name:"清真档口",operatingHours:"10:30-13:30, 16:30-19:00",status:!0},{id:5,name:"粥品档口",operatingHours:"07:00-09:00",status:!1}],3:[{id:6,name:"自选档口",operatingHours:"10:30-13:30, 16:30-19:00",status:!0}]},沁园餐厅:{1:[{id:7,name:"快餐",operatingHours:"10:30-13:30, 16:30-19:00",status:!0},{id:8,name:"小炒",operatingHours:"10:30-13:30, 16:30-19:00",status:!0}],2:[{id:9,name:"面档",operatingHours:"10:30-13:30, 16:30-19:00",status:!0}]}}),m=d({中央食堂:{type:"warning",text:"较拥挤"},沁园餐厅:{type:"success",text:"空闲"},馨园餐厅:{type:"info",text:"已打烊"},仲园餐厅:{type:"danger",text:"拥挤"},雅园餐厅:{type:"success",text:"空闲"},服务点:{type:"info",text:"已打烊"}}),p=d({1:15,2:8,3:12,4:10,5:6,6:20,7:8,8:12,9:5}),f=t=>a.value[(t==null?void 0:t.name)||t]||!1,_=(t,o)=>{var L;return((L=H.value[t])==null?void 0:L[o])||[]},g=t=>(t==null?void 0:t.status)??!1,u=t=>{var o;return((o=m.value[t])==null?void 0:o.type)||"info"},x=t=>{var o;return((o=m.value[t])==null?void 0:o.text)||"未知"},C=t=>p.value[t]||0;l("isCanteenOpen",f),l("getFloorWindows",_),l("isWindowOpen",g),l("getCrowdLevelType",u),l("getCrowdLevelText",x),l("getWindowDishCount",C);const y=t=>(t.startsWith("/student/")||(t="/student"+t),e.path===t),w=t=>{t.startsWith("/student/")||(t="/student"+t),v.push(t)};return B(()=>{const t=window.statusBarHeight||0;document.documentElement.style.setProperty("--status-bar-height",`${t}px`);const o=window.safeAreaInsetBottom||0;document.documentElement.style.setProperty("--safe-area-inset-bottom",`${o}px`)}),{isActive:y,navigateTo:w,activeTab:b,Food:T,List:W,User:F,ChatSquare:k}}},I={class:"student-layout"},R={class:"nav-buttons"};function h(v,e,b,a,H,m){const p=r("el-header"),f=r("router-view"),_=r("el-main"),g=r("Food"),u=r("el-icon"),x=r("ChatSquare"),C=r("List"),y=r("User"),w=r("el-footer"),t=r("el-container");return O(),q(S,null,[e[9]||(e[9]=n("div",{class:"status-bar"},null,-1)),n("div",I,[s(t,null,{default:i(()=>[s(p,null,{default:i(()=>e[4]||(e[4]=[n("div",{class:"header-title"},"校园食堂",-1)])),_:1}),s(_,null,{default:i(()=>[s(f)]),_:1}),s(w,{height:"55px",class:"footer"},{default:i(()=>[n("div",R,[n("div",{class:c(["nav-button",{active:a.isActive("/home")}]),onClick:e[0]||(e[0]=o=>a.navigateTo("/home"))},[s(u,null,{default:i(()=>[s(g)]),_:1}),e[5]||(e[5]=n("div",{class:"button-text"},"首页",-1))],2),n("div",{class:c(["nav-button",{active:a.isActive("/recommendations")}]),onClick:e[1]||(e[1]=o=>a.navigateTo("/recommendations"))},[s(u,null,{default:i(()=>[s(x)]),_:1}),e[6]||(e[6]=n("div",{class:"button-text"},"推荐广场",-1))],2),n("div",{class:c(["nav-button",{active:a.isActive("/orders")}]),onClick:e[2]||(e[2]=o=>a.navigateTo("/orders"))},[s(u,null,{default:i(()=>[s(C)]),_:1}),e[7]||(e[7]=n("div",{class:"button-text"},"订单",-1))],2),n("div",{class:c(["nav-button",{active:a.isActive("/profile")}]),onClick:e[3]||(e[3]=o=>a.navigateTo("/profile"))},[s(u,null,{default:i(()=>[s(y)]),_:1}),e[8]||(e[8]=n("div",{class:"button-text"},"我的",-1))],2)])]),_:1})]),_:1})])],64)}const P=A(E,[["render",h],["__scopeId","data-v-5e730e6d"]]);export{P as default};
