import{_ as _e,g,V as k,h as ve,o as fe,k as v,n as o,q as a,w as s,z as R,A as U,H as O,X as D,v as p,E as S,x as i,y as m,B as d,ah as $,C as ge,R as he,U as ke}from"./index-eMRJYRn7.js";const ye={class:"cart-page"},Ce={class:"cart-header"},Ve={class:"header-left"},be={class:"header-right"},xe={class:"cart-content"},Se={class:"cart-window-header"},qe={class:"window-header-left"},Ee={class:"cart-items-list"},Te={class:"image-placeholder"},Ue={class:"cart-item-info"},Oe={class:"cart-item-name"},De={class:"cart-item-price"},je={class:"cart-item-actions"},Fe={class:"window-cart-footer"},Ne={class:"window-total-info"},we={class:"total-price"},ze={key:1,class:"empty-cart"},Be={key:0,class:"cart-footer"},We={class:"footer-left"},Ae={class:"total-info"},Re={class:"total-price"},$e={class:"checkout-content"},Ie={class:"checkout-items"},Je={class:"item-name"},Pe={class:"item-quantity"},Le={class:"item-price"},Me={class:"checkout-form"},He={__name:"CartPage",setup(Qe){const j=ge(),n=g(JSON.parse(localStorage.getItem("cartData")||"{}")),q=k(()=>Object.values(n.value).some(t=>t.length>0)),I=k(()=>n.value),h=g(!1),E=g(null),F=g(null);k(()=>n.value[F.value]||[]);const f=ve({diningTime:"",diningType:"dine_in",remark:""}),J={diningTime:[{required:!0,message:"请选择就餐时间",trigger:"change"}],diningType:[{required:!0,message:"请选择就餐方式",trigger:"change"}]},y=g(!1),V=g({}),C=g([]),P=k(()=>{let t=0;return Object.entries(n.value).forEach(([e,l])=>{l.forEach(u=>{u.selected&&(t+=u.price*u.quantity)})}),t}),N=k(()=>{let t=0;return Object.values(n.value).forEach(e=>{e.forEach(l=>{l.selected&&(t+=l.quantity)})}),t}),L=k(()=>N.value>0),M=t=>`窗口 ${t}`,H=t=>t.reduce((e,l)=>e+l.price*l.quantity,0),Q=t=>t.reduce((e,l)=>e+l.quantity,0),X=(t,e)=>{t.quantity===0&&(n.value[e]=n.value[e].filter(l=>l.id!==t.id),n.value[e].length===0&&delete n.value[e]),b()},G=t=>{delete n.value[t],b(),S.success("已清空该窗口购物车")},K=()=>{n.value={},b(),S.success("购物车已清空")},Y=t=>{F.value=t,h.value=!0},Z=async()=>{if(E.value)try{await E.value.validate();const t={items:C.value,...f};S.success("下单成功"),h.value=!1,C.value.forEach(e=>{const l=e.windowId;n.value[l]=n.value[l].filter(u=>!u.selected),n.value[l].length===0&&delete n.value[l]}),b(),j.push("/student/orders")}catch(t){console.error("下单失败:",t),S.error("下单失败")}},b=()=>{localStorage.setItem("cartData",JSON.stringify(n.value))},w=()=>{j.back()},ee=()=>{const t=JSON.parse(localStorage.getItem("cartData")||"{}");Object.entries(t).forEach(([e,l])=>{t[e]=l.map(u=>({...u,selected:!1}))}),n.value=t};fe(()=>{ee()});const z=t=>{Object.keys(n.value).forEach(e=>{V.value[e]=t,n.value[e].forEach(l=>{l.selected=t})})},te=(t,e)=>{n.value[e].forEach(l=>{l.selected=t}),B()},le=(t,e)=>{const l=n.value[e].every(u=>u.selected);V.value[e]=l,B()},B=()=>{y.value=Object.values(n.value).every(t=>t.every(e=>e.selected))},ae=()=>{C.value=[],Object.entries(n.value).forEach(([t,e])=>{const l=e.filter(u=>u.selected);l.length>0&&C.value.push(...l)}),h.value=!0};return(t,e)=>{const l=i("el-button"),u=i("el-checkbox"),oe=i("el-tag"),W=i("el-icon"),se=i("el-image"),ne=i("el-input-number"),ce=i("el-empty"),re=i("el-divider"),ue=i("el-time-select"),T=i("el-form-item"),A=i("el-radio"),ie=i("el-radio-group"),de=i("el-input"),me=i("el-form"),pe=i("el-dialog");return m(),v("div",ye,[o("div",Ce,[o("div",Ve,[a(l,{onClick:w,icon:"ArrowLeft",text:"",class:"back-button"},{default:s(()=>e[7]||(e[7]=[d(" 返回 ")])),_:1}),e[8]||(e[8]=o("h2",null,"购物车",-1))]),o("div",be,[q.value?(m(),R(u,{key:0,modelValue:y.value,"onUpdate:modelValue":e[0]||(e[0]=c=>y.value=c),onChange:z,class:"select-all"},{default:s(()=>e[9]||(e[9]=[d(" 全选 ")])),_:1},8,["modelValue"])):U("",!0),Object.keys(n.value).length>0?(m(),R(l,{key:1,type:"danger",plain:"",size:"small",onClick:K},{default:s(()=>e[10]||(e[10]=[d(" 清空购物车 ")])),_:1})):U("",!0)])]),o("div",xe,[q.value?(m(!0),v(O,{key:0},D(I.value,(c,_)=>(m(),v("div",{key:_,class:"cart-window-group"},[o("div",Se,[o("div",qe,[a(u,{modelValue:V.value[_],"onUpdate:modelValue":r=>V.value[_]=r,onChange:r=>te(r,_),class:"window-checkbox"},null,8,["modelValue","onUpdate:modelValue","onChange"]),a(oe,{size:"small"},{default:s(()=>[d(p(M(_)),1)]),_:2},1024)]),a(l,{type:"danger",plain:"",size:"small",onClick:r=>G(_)},{default:s(()=>e[11]||(e[11]=[d(" 清空 ")])),_:2},1032,["onClick"])]),o("div",Ee,[(m(!0),v(O,null,D(c,r=>(m(),v("div",{key:r.id,class:"cart-item"},[a(u,{modelValue:r.selected,"onUpdate:modelValue":x=>r.selected=x,onChange:()=>le(r,_),class:"item-checkbox"},null,8,["modelValue","onUpdate:modelValue","onChange"]),a(se,{src:r.image_url,class:"cart-item-image",fit:"cover"},{error:s(()=>[o("div",Te,[a(W,null,{default:s(()=>[a($(he))]),_:1})])]),_:2},1032,["src"]),o("div",Ue,[o("div",Oe,p(r.name),1),o("div",De,"¥"+p((r.price*r.quantity).toFixed(2)),1)]),o("div",je,[a(ne,{modelValue:r.quantity,"onUpdate:modelValue":x=>r.quantity=x,min:0,max:r.stock,size:"small",onChange:x=>X(r,_),"controls-position":"right"},null,8,["modelValue","onUpdate:modelValue","max","onChange"])])]))),128)),o("div",Fe,[o("div",Ne,[e[12]||(e[12]=o("span",{class:"total-label"},"小计:",-1)),o("span",we,"¥"+p(H(c).toFixed(2)),1)]),a(l,{type:"primary",size:"small",onClick:r=>Y(_)},{default:s(()=>[d(" 结算 ("+p(Q(c))+"件) ",1)]),_:2},1032,["onClick"])])])]))),128)):(m(),v("div",ze,[a(ce,{description:"购物车是空的"},{image:s(()=>[a(W,{size:60,class:"empty-cart-icon"},{default:s(()=>[a($(ke))]),_:1})]),default:s(()=>[a(l,{type:"primary",onClick:w},{default:s(()=>e[13]||(e[13]=[d("返回点餐")])),_:1})]),_:1})]))]),q.value?(m(),v("div",Be,[o("div",We,[a(u,{modelValue:y.value,"onUpdate:modelValue":e[1]||(e[1]=c=>y.value=c),onChange:z},{default:s(()=>e[14]||(e[14]=[d(" 全选 ")])),_:1},8,["modelValue"]),o("div",Ae,[e[15]||(e[15]=o("span",null,"合计:",-1)),o("span",Re,"¥"+p(P.value.toFixed(2)),1)])]),a(l,{type:"primary",disabled:!L.value,onClick:ae},{default:s(()=>[d(" 结算("+p(N.value)+"件) ",1)]),_:1},8,["disabled"])])):U("",!0),a(pe,{modelValue:h.value,"onUpdate:modelValue":e[6]||(e[6]=c=>h.value=c),title:"确认订单",width:"400px"},{footer:s(()=>[a(l,{onClick:e[5]||(e[5]=c=>h.value=!1)},{default:s(()=>e[18]||(e[18]=[d("取消")])),_:1}),a(l,{type:"primary",onClick:Z},{default:s(()=>e[19]||(e[19]=[d("提交订单")])),_:1})]),default:s(()=>[o("div",$e,[o("div",Ie,[(m(!0),v(O,null,D(C.value,c=>(m(),v("div",{key:c.id,class:"checkout-item"},[o("span",Je,p(c.name),1),o("span",Pe,"x"+p(c.quantity),1),o("span",Le,"¥"+p(c.price*c.quantity),1)]))),128))]),a(re),o("div",Me,[a(me,{model:f,rules:J,ref_key:"checkoutFormRef",ref:E},{default:s(()=>[a(T,{label:"就餐时间",prop:"diningTime"},{default:s(()=>[a(ue,{modelValue:f.diningTime,"onUpdate:modelValue":e[2]||(e[2]=c=>f.diningTime=c),"picker-options":{start:"10:30",step:"00:15",end:"20:00"},placeholder:"选择就餐时间"},null,8,["modelValue"])]),_:1}),a(T,{label:"就餐方式",prop:"diningType"},{default:s(()=>[a(ie,{modelValue:f.diningType,"onUpdate:modelValue":e[3]||(e[3]=c=>f.diningType=c)},{default:s(()=>[a(A,{label:"dine_in"},{default:s(()=>e[16]||(e[16]=[d("堂食")])),_:1}),a(A,{label:"take_out"},{default:s(()=>e[17]||(e[17]=[d("打包")])),_:1})]),_:1},8,["modelValue"])]),_:1}),a(T,{label:"备注",prop:"remark"},{default:s(()=>[a(de,{modelValue:f.remark,"onUpdate:modelValue":e[4]||(e[4]=c=>f.remark=c),type:"textarea",placeholder:"请输入备注信息"},null,8,["modelValue"])]),_:1})]),_:1},8,["model"])])])]),_:1},8,["modelValue"])])}}},Ge=_e(He,[["__scopeId","data-v-0ef76c48"]]);export{Ge as default};
