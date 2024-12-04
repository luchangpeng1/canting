import{_ as J,ab as K,F as Q,ac as Y,ad as Z,ae as $,e as ee,a7 as le,s as ne,i as oe,L as ae,a6 as te,G as se,af as ie,ag as de,ah as re,ai as ue,V as me,g as f,k as y,n as l,q as n,w as t,v as m,E as r,x as s,y as p,B as u,H as B,X as A,I as ce,z as M,A as fe,C as ve,aj as _e}from"./index-1A1V_OG6.js";const pe={name:"UserProfile",components:{WalletFilled:K,List:Q,StarFilled:Y,ChatDotSquare:Z,EditPen:$,Message:ee,Bell:le,Setting:ne,InfoFilled:oe,Plus:ae,ArrowRight:te,ChatSquare:se,Edit:ie,Medal:de,Document:re,Present:ue},setup(){const D=ve(),e=_e(),k=me(()=>e.getters["user/userInfo"]),o=f(!1),C=f({amount:50}),R=f(!1),h=f({canteen:"",window:"",type:"",content:"",images:[]}),L=[{id:1,name:"中央食堂"},{id:2,name:"沁园餐厅"}],i=d=>[{id:1,name:"特色炒菜"},{id:2,name:"食档口"}],v=()=>{o.value=!0},q=()=>{if(!C.value.amount||C.value.amount<=0){r.warning("请输入有效的充值金额");return}e.dispatch("user/updateBalance",k.value.balance+C.value.amount),r.success(`成功充值 ${C.value.amount} 元`),o.value=!1},W=()=>{R.value=!0},g=d=>{h.value.images.push(d)},N=()=>{if(!h.value.type){r.warning("请选择建议类型");return}if(!h.value.content||h.value.content.trim()===""){r.warning("请填写建议内容");return}r.success("感谢您的建议，我们会认真考虑"),R.value=!1,h.value={canteen:"",window:"",type:"",content:"",images:[]}},z=()=>{r({message:"校园食堂点餐系统 v1.0.0",type:"info"})},T=()=>{localStorage.removeItem("user"),r.success("已退出登录"),D.push("/login")},_=d=>{try{d.startsWith("/student/")||(d="/student/"+d.replace(/^\//,"")),console.log("Navigating to:",d),D.push(d)}catch(a){console.error("Navigation error:",a),r.error("页面跳转失败")}},j=d=>{try{switch(d){case"wallet":_("wallet");break;case"transactions":_("transactions");break;case"favorites":_("favorites");break;case"reviews":_("reviews");break;case"notification-settings":_("notification-settings");break;case"preferences":_("preferences");break;case"my-feedbacks":_("feedback-list");break;case"points":_("points-history");break;default:console.warn(`未处理的菜单命令: ${d}`);break}}catch(a){console.error("Menu click error:",a),r.error("操作失败")}},x=f(!1),b=f({avatar:"",name:"",phone:"",email:""}),G=f({name:[{required:!0,message:"请输入姓名",trigger:"blur"},{min:2,max:20,message:"长度在 2 到 20 个字符",trigger:"blur"}],phone:[{pattern:/^1[3-9]\d{9}$/,message:"请输入正确的手机号码",trigger:"blur"}],email:[{type:"email",message:"请输入正确的邮箱地址",trigger:"blur"}]}),P=f(null),I=f(!1),U=()=>{b.value={avatar:k.value.avatar,name:k.value.name,phone:k.value.phone||"",email:k.value.email||""},x.value=!0},H=d=>{const a=d.raw.type.startsWith("image/"),X=d.raw.size/1024/1024<2;if(!a){r.error("只能上传图片文件!");return}if(!X){r.error("图片大小不能超过 2MB!");return}b.value.avatar=URL.createObjectURL(d.raw)},c=async()=>{if(P.value)try{await P.value.validate(),I.value=!0,await e.dispatch("user/updateUserInfo",{...k.value,avatar:b.value.avatar,name:b.value.name,phone:b.value.phone,email:b.value.email}),r.success("个人信息更新成功"),x.value=!1}catch(d){console.error("更新个人信息失败:",d),r.error("更新失败，请重试")}finally{I.value=!1}},F=f(!1),V=f(!1),w=f([{id:1,name:"5元代金券",description:"可用于抵扣订单金额",points:500,image:"/images/voucher.png"},{id:2,name:"10元代金券",description:"可用于抵扣订单金额",points:1e3,image:"/images/voucher.png"},{id:3,name:"免配送费券",description:"单次订单免配送费",points:200,image:"/images/delivery.png"}]);return{userInfo:k,rechargeVisible:o,rechargeForm:C,feedbackVisible:R,feedbackForm:h,canteens:L,showRecharge:v,handleRecharge:q,showFeedbackDialog:W,handleImageChange:g,submitFeedback:N,showAbout:z,handleLogout:T,getWindows:i,navigateToPage:_,handleMenuClick:j,profileEditVisible:x,profileForm:b,showEditProfile:U,handleAvatarChange:H,updateProfile:c,profileFormRef:P,profileFormRules:G,isUpdatingProfile:I,pointsRulesVisible:F,pointsExchangeVisible:V,exchangeItems:w,showPointsRules:()=>{F.value=!0},showPointsExchange:()=>{V.value=!0},handleExchange:async d=>{try{await e.dispatch("user/exchangePoints",{itemId:d.id,points:d.points}),r.success("兑换成功")}catch{r.error("兑换失败，请重试")}}}}},ge={class:"user-profile"},be={class:"user-info-card"},ke={class:"user-info"},he={class:"info-content"},Ve={class:"name-wrapper"},we={class:"balance-info"},Ce={class:"amount"},Fe={class:"amount"},ye={class:"menu-list"},xe={class:"menu-icon"},Pe={class:"menu-content"},Ie={class:"menu-value"},Ee={class:"menu-icon"},Me={class:"menu-content"},Re={class:"menu-icon"},Ue={class:"menu-content"},Se={class:"menu-value"},Be={class:"menu-icon"},Ae={class:"menu-content"},De={class:"menu-icon"},Le={class:"menu-content"},qe={class:"menu-icon"},We={class:"menu-content"},Ne={class:"menu-value"},ze={class:"menu-icon"},Te={class:"menu-content"},je={class:"menu-icon"},Ge={class:"menu-content"},He={class:"menu-icon"},Oe={class:"menu-content"},Xe={class:"menu-icon"},Je={class:"menu-content"},Ke={class:"menu-value"},Qe={class:"menu-icon"},Ye={class:"menu-content"},Ze={class:"menu-icon"},$e={class:"menu-content"},el={class:"logout-button"},ll={class:"recharge-options"},nl=["onClick"],ol=["src"],al={class:"exchange-list"},tl={class:"exchange-content"},sl=["src","alt"],il={class:"exchange-info"},dl={class:"exchange-points"},rl={class:"points-value"};function ul(D,e,k,o,C,R){const h=s("el-avatar"),L=s("Edit"),i=s("el-icon"),v=s("el-button"),q=s("WalletFilled"),W=s("List"),g=s("ArrowRight"),N=s("StarFilled"),z=s("ChatDotSquare"),T=s("EditPen"),_=s("Message"),j=s("Bell"),x=s("Setting"),b=s("InfoFilled"),G=s("Medal"),P=s("Document"),I=s("Present"),U=s("el-card"),H=s("el-input-number"),c=s("el-form-item"),F=s("el-form"),V=s("el-dialog"),w=s("el-option"),S=s("el-select"),E=s("el-input"),O=s("Plus"),d=s("el-upload");return p(),y("div",ge,[l("div",be,[l("div",ke,[n(h,{size:64,src:o.userInfo.avatar},{default:t(()=>[u(m(o.userInfo.name.charAt(0)),1)]),_:1},8,["src"]),l("div",he,[l("div",Ve,[l("h3",null,m(o.userInfo.name),1),n(v,{class:"edit-btn",type:"primary",link:"",onClick:o.showEditProfile,title:"编辑个人信息"},{default:t(()=>[n(i,null,{default:t(()=>[n(L)]),_:1}),e[30]||(e[30]=l("span",{class:"edit-text"},"编辑资料",-1))]),_:1},8,["onClick"])]),l("p",null,m(o.userInfo.studentId),1)])]),l("div",we,[l("div",{class:"balance-item",onClick:e[0]||(e[0]=a=>o.handleMenuClick("wallet")),style:{cursor:"pointer"}},[l("span",Ce,"¥"+m(o.userInfo.balance),1),e[31]||(e[31]=l("span",{class:"label"},"余额",-1))]),l("div",{class:"balance-item",onClick:e[1]||(e[1]=a=>o.navigateToPage("points-history")),style:{cursor:"pointer"}},[l("span",Fe,m(o.userInfo.points),1),e[32]||(e[32]=l("span",{class:"label"},"积分",-1))])])]),l("div",ye,[n(U,{class:"menu-card"},{default:t(()=>[l("div",{class:"menu-item",onClick:e[2]||(e[2]=a=>o.handleMenuClick("wallet"))},[l("div",xe,[n(i,null,{default:t(()=>[n(q)]),_:1})]),l("div",Pe,[e[33]||(e[33]=l("span",null,"我的钱包",-1)),l("span",Ie,"¥"+m(o.userInfo.balance),1)])]),l("div",{class:"menu-item",onClick:e[3]||(e[3]=a=>o.navigateToPage("/transactions"))},[l("div",Ee,[n(i,null,{default:t(()=>[n(W)]),_:1})]),l("div",Me,[e[34]||(e[34]=l("span",null,"消费记录",-1)),n(i,null,{default:t(()=>[n(g)]),_:1})])]),l("div",{class:"menu-item",onClick:e[4]||(e[4]=a=>o.handleMenuClick("favorites"))},[l("div",Re,[n(i,null,{default:t(()=>[n(N)]),_:1})]),l("div",Ue,[e[35]||(e[35]=l("span",null,"我的收藏",-1)),l("span",Se,m(o.userInfo.favorites)+"个菜品",1)])]),l("div",{class:"menu-item",onClick:e[5]||(e[5]=a=>o.handleMenuClick("reviews"))},[l("div",Be,[n(i,null,{default:t(()=>[n(z)]),_:1})]),l("div",Ae,[e[36]||(e[36]=l("span",null,"历史评价",-1)),n(i,null,{default:t(()=>[n(g)]),_:1})])]),l("div",{class:"menu-item",onClick:e[6]||(e[6]=(...a)=>o.showFeedbackDialog&&o.showFeedbackDialog(...a))},[l("div",De,[n(i,null,{default:t(()=>[n(T)]),_:1})]),l("div",Le,[e[37]||(e[37]=l("span",null,"提交建议",-1)),n(i,null,{default:t(()=>[n(g)]),_:1})])]),l("div",{class:"menu-item",onClick:e[7]||(e[7]=a=>o.handleMenuClick("my-feedbacks"))},[l("div",qe,[n(i,null,{default:t(()=>[n(_)]),_:1})]),l("div",We,[e[38]||(e[38]=l("span",null,"我的建议",-1)),l("span",Ne,m(o.userInfo.feedbacks)+"条",1)])]),l("div",{class:"menu-item",onClick:e[8]||(e[8]=a=>o.handleMenuClick("notification-settings"))},[l("div",ze,[n(i,null,{default:t(()=>[n(j)]),_:1})]),l("div",Te,[e[39]||(e[39]=l("span",null,"通知设置",-1)),n(i,null,{default:t(()=>[n(g)]),_:1})])]),l("div",{class:"menu-item",onClick:e[9]||(e[9]=a=>o.handleMenuClick("preferences"))},[l("div",je,[n(i,null,{default:t(()=>[n(x)]),_:1})]),l("div",Ge,[e[40]||(e[40]=l("span",null,"偏好设置",-1)),n(i,null,{default:t(()=>[n(g)]),_:1})])]),l("div",{class:"menu-item",onClick:e[10]||(e[10]=(...a)=>o.showAbout&&o.showAbout(...a))},[l("div",He,[n(i,null,{default:t(()=>[n(b)]),_:1})]),l("div",Oe,[e[41]||(e[41]=l("span",null,"关于我们",-1)),n(i,null,{default:t(()=>[n(g)]),_:1})])]),l("div",{class:"menu-item",onClick:e[11]||(e[11]=a=>o.handleMenuClick("points"))},[l("div",Xe,[n(i,null,{default:t(()=>[n(G)]),_:1})]),l("div",Je,[e[42]||(e[42]=l("span",null,"我的积分",-1)),l("span",Ke,m(o.userInfo.points)+"分",1)])]),l("div",{class:"menu-item",onClick:e[12]||(e[12]=(...a)=>o.showPointsRules&&o.showPointsRules(...a))},[l("div",Qe,[n(i,null,{default:t(()=>[n(P)]),_:1})]),l("div",Ye,[e[43]||(e[43]=l("span",null,"积分规则",-1)),n(i,null,{default:t(()=>[n(g)]),_:1})])]),l("div",{class:"menu-item",onClick:e[13]||(e[13]=(...a)=>o.showPointsExchange&&o.showPointsExchange(...a))},[l("div",Ze,[n(i,null,{default:t(()=>[n(I)]),_:1})]),l("div",$e,[e[44]||(e[44]=l("span",null,"积分兑换",-1)),n(i,null,{default:t(()=>[n(g)]),_:1})])])]),_:1}),l("div",el,[n(v,{type:"danger",plain:"",onClick:o.handleLogout},{default:t(()=>e[45]||(e[45]=[u("退出登录")])),_:1},8,["onClick"])])]),n(V,{modelValue:o.rechargeVisible,"onUpdate:modelValue":e[16]||(e[16]=a=>o.rechargeVisible=a),title:"余额充值",width:"90%"},{footer:t(()=>[n(v,{onClick:e[15]||(e[15]=a=>o.rechargeVisible=!1)},{default:t(()=>e[46]||(e[46]=[u("取消")])),_:1}),n(v,{type:"primary",onClick:o.handleRecharge},{default:t(()=>e[47]||(e[47]=[u("确认充值")])),_:1},8,["onClick"])]),default:t(()=>[l("div",ll,[(p(),y(B,null,A([20,50,100,200],a=>l("div",{key:a,class:ce(["recharge-option",{active:o.rechargeForm.amount===a}]),onClick:X=>o.rechargeForm.amount=a}," ¥"+m(a),11,nl)),64))]),n(F,{model:o.rechargeForm,"label-width":"80px"},{default:t(()=>[n(c,{label:"其他金额"},{default:t(()=>[n(H,{modelValue:o.rechargeForm.amount,"onUpdate:modelValue":e[14]||(e[14]=a=>o.rechargeForm.amount=a),min:0,step:10},null,8,["modelValue"])]),_:1})]),_:1},8,["model"])]),_:1},8,["modelValue"]),n(V,{modelValue:o.feedbackVisible,"onUpdate:modelValue":e[22]||(e[22]=a=>o.feedbackVisible=a),title:"提交建议",width:"90%"},{footer:t(()=>[n(v,{onClick:e[21]||(e[21]=a=>o.feedbackVisible=!1)},{default:t(()=>e[48]||(e[48]=[u("取消")])),_:1}),n(v,{type:"primary",onClick:o.submitFeedback},{default:t(()=>e[49]||(e[49]=[u("提交建议")])),_:1},8,["onClick"])]),default:t(()=>[n(F,{model:o.feedbackForm,"label-width":"80px"},{default:t(()=>[n(c,{label:"食堂"},{default:t(()=>[n(S,{modelValue:o.feedbackForm.canteen,"onUpdate:modelValue":e[17]||(e[17]=a=>o.feedbackForm.canteen=a),placeholder:"请选择食堂"},{default:t(()=>[(p(!0),y(B,null,A(o.canteens,a=>(p(),M(w,{key:a.id,label:a.name,value:a.id},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])]),_:1}),o.feedbackForm.canteen?(p(),M(c,{key:0,label:"窗口"},{default:t(()=>[n(S,{modelValue:o.feedbackForm.window,"onUpdate:modelValue":e[18]||(e[18]=a=>o.feedbackForm.window=a),placeholder:"请选择窗口"},{default:t(()=>[(p(!0),y(B,null,A(o.getWindows(o.feedbackForm.canteen),a=>(p(),M(w,{key:a.id,label:a.name,value:a.id},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])]),_:1})):fe("",!0),n(c,{label:"建议类型"},{default:t(()=>[n(S,{modelValue:o.feedbackForm.type,"onUpdate:modelValue":e[19]||(e[19]=a=>o.feedbackForm.type=a),placeholder:"请选择建议类型"},{default:t(()=>[n(w,{label:"菜品建议",value:"dish"}),n(w,{label:"服务建议",value:"service"}),n(w,{label:"环境建议",value:"environment"}),n(w,{label:"其他建议",value:"other"})]),_:1},8,["modelValue"])]),_:1}),n(c,{label:"建议内容"},{default:t(()=>[n(E,{modelValue:o.feedbackForm.content,"onUpdate:modelValue":e[20]||(e[20]=a=>o.feedbackForm.content=a),type:"textarea",rows:4,placeholder:"请详细描述您的建议..."},null,8,["modelValue"])]),_:1}),n(c,{label:"图片"},{default:t(()=>[n(d,{action:"#","list-type":"picture-card","auto-upload":!1,"on-change":o.handleImageChange},{default:t(()=>[n(i,null,{default:t(()=>[n(O)]),_:1})]),_:1},8,["on-change"])]),_:1})]),_:1},8,["model"])]),_:1},8,["modelValue"]),n(V,{modelValue:o.profileEditVisible,"onUpdate:modelValue":e[27]||(e[27]=a=>o.profileEditVisible=a),title:"编辑个人信息",width:"90%","close-on-click-modal":!1},{footer:t(()=>[n(v,{onClick:e[26]||(e[26]=a=>o.profileEditVisible=!1)},{default:t(()=>e[51]||(e[51]=[u("取消")])),_:1}),n(v,{type:"primary",onClick:o.updateProfile,loading:o.isUpdatingProfile},{default:t(()=>e[52]||(e[52]=[u(" 保存 ")])),_:1},8,["onClick","loading"])]),default:t(()=>[n(F,{ref:"profileFormRef",model:o.profileForm,rules:o.profileFormRules,"label-width":"80px"},{default:t(()=>[n(c,{label:"头像"},{default:t(()=>[n(d,{class:"avatar-uploader",action:"#","show-file-list":!1,"auto-upload":!1,"on-change":o.handleAvatarChange,accept:"image/*"},{default:t(()=>[o.profileForm.avatar?(p(),y("img",{key:0,src:o.profileForm.avatar,class:"avatar"},null,8,ol)):(p(),M(i,{key:1,class:"avatar-uploader-icon"},{default:t(()=>[n(O)]),_:1}))]),_:1},8,["on-change"]),e[50]||(e[50]=l("div",{class:"upload-tip"},"支持 jpg、png 格式，大小不超过 2MB",-1))]),_:1}),n(c,{label:"姓名",prop:"name"},{default:t(()=>[n(E,{modelValue:o.profileForm.name,"onUpdate:modelValue":e[23]||(e[23]=a=>o.profileForm.name=a),maxlength:"20","show-word-limit":""},null,8,["modelValue"])]),_:1}),n(c,{label:"手机号码",prop:"phone"},{default:t(()=>[n(E,{modelValue:o.profileForm.phone,"onUpdate:modelValue":e[24]||(e[24]=a=>o.profileForm.phone=a),maxlength:"11"},null,8,["modelValue"])]),_:1}),n(c,{label:"邮箱",prop:"email"},{default:t(()=>[n(E,{modelValue:o.profileForm.email,"onUpdate:modelValue":e[25]||(e[25]=a=>o.profileForm.email=a)},null,8,["modelValue"])]),_:1})]),_:1},8,["model","rules"])]),_:1},8,["modelValue"]),n(V,{modelValue:o.pointsRulesVisible,"onUpdate:modelValue":e[28]||(e[28]=a=>o.pointsRulesVisible=a),title:"积分规则",width:"90%"},{default:t(()=>e[53]||(e[53]=[l("div",{class:"points-rules"},[l("h4",null,"获取积分"),l("ul",null,[l("li",null,[u("完成订单："),l("span",{class:"points-value"},"+2分")]),l("li",null,[u("评价订单："),l("span",{class:"points-value"},"+3分")]),l("li",null,[u("首次使用："),l("span",{class:"points-value"},"+10分")]),l("li",null,[u("每日签到："),l("span",{class:"points-value"},"+1分")])]),l("h4",null,"积分等级"),l("ul",null,[l("li",null,"普通会员：0-100分"),l("li",null,"白银会员：101-500分"),l("li",null,"黄金会员：501-1000分"),l("li",null,"钻石会员：1000分以上")]),l("h4",null,"会员特权"),l("ul",null,[l("li",null,"白银会员：订单享95折"),l("li",null,"黄金会员：订单享9折"),l("li",null,"钻石会员：订单享85折")])],-1)])),_:1},8,["modelValue"]),n(V,{modelValue:o.pointsExchangeVisible,"onUpdate:modelValue":e[29]||(e[29]=a=>o.pointsExchangeVisible=a),title:"积分兑换",width:"90%"},{default:t(()=>[l("div",al,[(p(!0),y(B,null,A(o.exchangeItems,a=>(p(),M(U,{key:a.id,class:"exchange-item"},{default:t(()=>[l("div",tl,[l("img",{src:a.image,alt:a.name,class:"exchange-image"},null,8,sl),l("div",il,[l("h3",null,m(a.name),1),l("p",null,m(a.description),1),l("div",dl,[e[54]||(e[54]=u(" 需要 ")),l("span",rl,m(a.points),1),e[55]||(e[55]=u(" 积分 "))])])]),n(v,{type:"primary",onClick:X=>o.handleExchange(a),disabled:o.userInfo.points<a.points},{default:t(()=>e[56]||(e[56]=[u(" 立即兑换 ")])),_:2},1032,["onClick","disabled"])]),_:2},1024))),128))])]),_:1},8,["modelValue"])])}const cl=J(pe,[["render",ul],["__scopeId","data-v-87983483"]]);export{cl as default};
