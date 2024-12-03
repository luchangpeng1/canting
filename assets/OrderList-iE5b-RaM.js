import{_ as B,$ as S,g as b,o as q,k as u,n as s,q as c,w as l,x as r,y as o,B as g,z as i,A as y,H as T,X as h,v as p,C as z}from"./index-eMRJYRn7.js";const H={name:"OrderList",components:{Calendar:S},setup(){const _=z(),t=b("ongoing"),f=b([]),n=b([]),v=[{id:1,windowName:"特色炒菜",status:"pending",dishes:[{id:1,name:"宫保鸡丁",quantity:1,price:15},{id:2,name:"青椒肉丝",quantity:1,price:12}],totalPrice:27,createTime:"2024-01-20 12:30:00"}],O=a=>({pending:"warning",preparing:"primary",ready:"success",completed:"info",cancelled:"danger"})[a]||"info",k=a=>({pending:"待接单",preparing:"制作中",ready:"待取餐",completed:"已完成",cancelled:"已取消"})[a]||"未知状态",C=()=>{_.push("/student/order-history")};return q(()=>{f.value=v.filter(a=>["pending","preparing","ready"].includes(a.status)),n.value=v.filter(a=>["completed","cancelled"].includes(a.status))}),{activeTab:t,ongoingOrders:f,completedOrders:n,getStatusType:O,getStatusText:k,goToHistory:C}}},L={class:"order-list"},P={class:"page-header"},R={class:"order-header"},A={class:"window-name"},D={class:"order-content"},E={class:"dish-list"},F={class:"order-footer"},I={class:"total-price"},M={class:"actions"};function U(_,t,f,n,v,O){const k=r("Calendar"),C=r("el-icon"),a=r("el-button"),m=r("el-empty"),V=r("el-tag"),w=r("el-card"),x=r("el-tab-pane"),N=r("el-tabs");return o(),u("div",L,[s("div",P,[t[2]||(t[2]=s("h2",{class:"page-title"},"我的订单",-1)),c(a,{type:"primary",class:"history-btn",onClick:n.goToHistory},{default:l(()=>[c(C,null,{default:l(()=>[c(k)]),_:1}),t[1]||(t[1]=g(" 历史订单 "))]),_:1},8,["onClick"])]),c(N,{modelValue:n.activeTab,"onUpdate:modelValue":t[0]||(t[0]=e=>n.activeTab=e)},{default:l(()=>[c(x,{label:"进行中",name:"ongoing"},{default:l(()=>[n.ongoingOrders.length===0?(o(),i(m,{key:0,description:"暂无进行中的订单"})):y("",!0),(o(!0),u(T,null,h(n.ongoingOrders,e=>(o(),i(w,{key:e.id,class:"order-card"},{default:l(()=>[s("div",R,[s("span",A,p(e.windowName),1),c(V,{type:n.getStatusType(e.status)},{default:l(()=>[g(p(n.getStatusText(e.status)),1)]),_:2},1032,["type"])]),s("div",D,[s("div",E,[(o(!0),u(T,null,h(e.dishes,d=>(o(),u("div",{key:d.id,class:"dish-item"},[s("span",null,p(d.name),1),s("span",null,"x"+p(d.quantity),1),s("span",null,"¥"+p(d.price),1)]))),128))]),s("div",F,[s("span",I,"合计：¥"+p(e.totalPrice),1),s("div",M,[e.status==="pending"?(o(),i(a,{key:0,type:"primary",size:"small",onClick:d=>_.cancelOrder(e)},{default:l(()=>t[3]||(t[3]=[g(" 取消订单 ")])),_:2},1032,["onClick"])):y("",!0),e.status==="ready"?(o(),i(a,{key:1,type:"success",size:"small",onClick:d=>_.confirmReceived(e)},{default:l(()=>t[4]||(t[4]=[g(" 确认取餐 ")])),_:2},1032,["onClick"])):y("",!0)])])])]),_:2},1024))),128))]),_:1}),c(x,{label:"已完成",name:"completed"},{default:l(()=>[n.completedOrders.length===0?(o(),i(m,{key:0,description:"暂无已完成订单"})):y("",!0),(o(!0),u(T,null,h(n.completedOrders,e=>(o(),i(w,{key:e.id,class:"order-card"}))),128))]),_:1})]),_:1},8,["modelValue"])])}const j=B(H,[["render",U],["__scopeId","data-v-a7dc0696"]]);export{j as default};
