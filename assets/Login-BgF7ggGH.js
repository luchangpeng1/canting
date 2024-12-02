import{_ as z,u as A,s as G,m as D,d as O,a as W,b as j,p as J,l as Y,c as K,t as X,i as Z,r as H,e as $,f as ee,g as h,h as oe,o as le,j as se,k as I,n as o,q as l,w as n,T as ne,v as c,x as i,y as _,z as q,A as b,B as C,C as ae,E as S}from"./index-DxkRXB23.js";import{h as N}from"./request-HzNHAJSM.js";const te=[{username:"student001",password:"123456",userType:"student",realName:"测试学生"},{username:"admin001",password:"123456",userType:"admin",realName:"测试管理员"}],re={name:"Login",components:{User:A,Setting:G,Monitor:D,DataLine:O,Service:W,Shop:j,Promotion:J,Location:Y,School:K,Trophy:X,InfoFilled:Z,Refresh:H,Message:$,Lock:ee},setup(){const x=ae(),e=h(null),k=h(!0),s=h(!1),u=oe({username:"",password:"",confirmPassword:"",userType:""}),M={username:[{required:!0,message:"请输入用户名",trigger:"blur"},{min:3,max:20,message:"长度在 3 到 20 个字符",trigger:"blur"},{pattern:/^[a-zA-Z0-9_]+$/,message:"只能包含字母、数字和下划线",trigger:"blur"}],password:[{required:!0,message:"请输入密码",trigger:"blur"},{min:6,max:20,message:"长度在 6 到 20 个字符",trigger:"blur"}],confirmPassword:[{required:!0,message:"请确认密码",trigger:"blur",validator:(a,d,p)=>{d!==u.password?p(new Error("两次输入的密码不一致")):p()}}],userType:[{required:!0,message:"请选择登录身份",trigger:"change"}]},L=()=>{k.value=!k.value,u.username="",u.password="",u.confirmPassword="",e.value&&e.value.clearValidate()},r=async a=>{try{s.value=!0;const d=te.find(w=>w.username===a.username&&w.userType===a.userType);if(d){if(d.password===a.password){const w={username:d.username,userType:d.userType,realName:d.realName};localStorage.setItem("user",JSON.stringify(w)),localStorage.setItem("token","test-token"),S.success("登录成功"),x.push(d.userType==="admin"?"/admin/dishes":"/student/home");return}S.error("密码错误");return}const p=await N.post("/auth/login",{username:a.username,password:a.password,userType:a.userType});if(p.code===200){localStorage.setItem("token",p.data.token),localStorage.setItem("refreshToken",p.data.refreshToken),localStorage.setItem("user",JSON.stringify(p.data.userInfo)),S.success("登录成功");const w=x.currentRoute.value.query.redirect||(p.data.userInfo.userType==="admin"?"/admin/dishes":"/student/home");x.push(w)}}catch(d){S.error(d.message||"登录失败，请重试")}finally{s.value=!1}},f=async a=>{try{s.value=!0,(await N.post("/auth/register",{username:a.username,password:a.password,userType:a.userType})).code===200&&(S.success("注册成功，请登录"),k.value=!0,u.username="",u.password="",u.confirmPassword="",u.userType="")}catch(d){console.error("注册失败:",d),S.error(d.message||"注册失败，请重试")}finally{s.value=!1}},V=async()=>{if(e.value)try{await e.value.validate();const a={username:u.username,password:u.password,userType:u.userType};k.value?await r(a):await f(a)}catch(a){console.error("表单验证失败:",a)}},y=["智慧校园，美食相伴","科技创新，服务师生","便捷订餐，品质生活"],m=h(y[0]);le(()=>{let a=0;setInterval(()=>{a=(a+1)%y.length,m.value=y[a]},3e3)});const g=h(!1),v=h(""),T=h("等待扫码");let R=null;const U=async()=>{g.value=!0,T.value="等待扫码";try{v.value="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=WeChat_Login_GUET"}catch(a){console.error("显示二维码失败:",a)}},P=async()=>{clearInterval(R),T.value="等待扫码",await U()};return se(()=>{}),{formRef:e,isLogin:k,form:u,rules:M,loading:s,toggleMode:L,handleSubmit:V,currentSlogan:m,qrDialogVisible:g,qrCodeUrl:v,qrStatus:T,showQRCode:U,refreshQRCode:P}}},ie={class:"login-container"},de={class:"login-box"},ue={class:"school-info"},me={class:"mobile-login"},ce={class:"login-header"},fe={class:"subtitle"},pe={class:"select-option"},_e={class:"select-option"},ge={class:"select-option"},ve={class:"select-option"},ye={class:"form-actions"},we={class:"toggle-mode"},be={key:0,class:"qr-login"},he={class:"bottom-section"},ke={class:"school-features"},Le={class:"feature-item"},Ve={class:"feature-item"},Te={class:"feature-item"},qe={class:"guet-features"},Ce={class:"feature-card"},Se={class:"feature-card"},Ue={class:"feature-card"},xe={class:"slogan-container"},Re={class:"login-header"},Ie={class:"subtitle"},Pe={class:"select-option"},Me={class:"select-option"},Ne={class:"select-option"},Ee={class:"select-option"},Fe={class:"form-actions"},Be={class:"toggle-mode"},Qe={key:0,class:"qr-login"},ze={class:"footer"},Ae={class:"footer-content"},Ge={class:"qr-container"},De={class:"qr-wrapper"},Oe=["src"],We={class:"qr-overlay"},je={class:"qr-status"},Je={class:"qr-help"};function Ye(x,e,k,s,u,M){const L=i("User"),r=i("el-icon"),f=i("el-option"),V=i("Setting"),y=i("el-select"),m=i("el-form-item"),g=i("el-input"),v=i("el-button"),T=i("el-form"),R=i("Promotion"),U=i("el-card"),P=i("Monitor"),a=i("DataLine"),d=i("Service"),p=i("Location"),w=i("School"),E=i("Trophy"),F=i("Refresh"),B=i("InfoFilled"),Q=i("el-dialog");return _(),I("div",ie,[e[38]||(e[38]=o("div",{class:"bg-decoration"},[o("div",{class:"circle circle-1"}),o("div",{class:"circle circle-2"}),o("div",{class:"circle circle-3"})],-1)),o("div",de,[o("div",ue,[e[27]||(e[27]=o("div",{class:"top-section"},[o("img",{src:"https://ts1.cn.mm.bing.net/th/id/R-C.01105e6f89184c277c662f33cd977751?rik=yt%2btmFKbjD8EVg&riu=http%3a%2f%2ftqedu.net%2fUploadFiles%2f2020%2f12%2f202012101555445729.png&ehk=%2fViGN%2b4wOxRaLLnLMUSFsczf60lAW2Ycm8qzXmB7MWQ%3d&risl=&pid=ImgRaw&r=0",alt:"桂林电子科技大学",class:"school-logo"}),o("h1",{class:"school-name"},"桂林电子科技大学"),o("h2",{class:"system-name"},"智慧食堂管理系统")],-1)),o("div",me,[l(U,{class:"login-card"},{default:n(()=>[o("div",ce,[o("h2",null,c(s.isLogin?"账号登录":"注册新用户"),1),o("p",fe,c(s.isLogin?"GUET智慧食堂":"欢迎加入智慧食堂"),1)]),l(T,{model:s.form,"label-position":"top",class:"login-form",rules:s.rules,ref:"formRef"},{default:n(()=>[s.isLogin?(_(),q(m,{key:0,label:"登录身份",prop:"userType"},{default:n(()=>[l(y,{modelValue:s.form.userType,"onUpdate:modelValue":e[0]||(e[0]=t=>s.form.userType=t),placeholder:"请选择登录身份",class:"user-type-select"},{default:n(()=>[l(f,{label:"学生",value:"student"},{default:n(()=>[o("div",pe,[l(r,null,{default:n(()=>[l(L)]),_:1}),e[11]||(e[11]=o("span",null,"学生",-1))])]),_:1}),l(f,{label:"食堂管理员",value:"admin"},{default:n(()=>[o("div",_e,[l(r,null,{default:n(()=>[l(V)]),_:1}),e[12]||(e[12]=o("span",null,"食堂管理员",-1))])]),_:1})]),_:1},8,["modelValue"])]),_:1})):b("",!0),s.isLogin?b("",!0):(_(),q(m,{key:1,label:"选择身份",prop:"userType"},{default:n(()=>[l(y,{modelValue:s.form.userType,"onUpdate:modelValue":e[1]||(e[1]=t=>s.form.userType=t),placeholder:"请选择您的身份",class:"user-type-select"},{default:n(()=>[l(f,{label:"学生",value:"student"},{default:n(()=>[o("div",ge,[l(r,null,{default:n(()=>[l(L)]),_:1}),e[13]||(e[13]=o("span",null,"学生",-1))])]),_:1}),l(f,{label:"食堂管理员",value:"admin"},{default:n(()=>[o("div",ve,[l(r,null,{default:n(()=>[l(V)]),_:1}),e[14]||(e[14]=o("span",null,"食堂管理员",-1))])]),_:1})]),_:1},8,["modelValue"])]),_:1})),l(m,{label:s.isLogin?"学号/工号":"请输入学号/工号",prop:"username"},{default:n(()=>[l(g,{modelValue:s.form.username,"onUpdate:modelValue":e[2]||(e[2]=t=>s.form.username=t),placeholder:s.isLogin?"请输入学号/工号":"学号为8位数字，工号为5位数字","prefix-icon":"User"},null,8,["modelValue","placeholder"])]),_:1},8,["label"]),l(m,{label:s.isLogin?"密码":"设置密码",prop:"password"},{default:n(()=>[l(g,{modelValue:s.form.password,"onUpdate:modelValue":e[3]||(e[3]=t=>s.form.password=t),type:"password",placeholder:s.isLogin?"请输入密码":"密码长度不少于6位","prefix-icon":"Lock","show-password":""},null,8,["modelValue","placeholder"])]),_:1},8,["label"]),s.isLogin?b("",!0):(_(),q(m,{key:2,label:"确认密码",prop:"confirmPassword"},{default:n(()=>[l(g,{modelValue:s.form.confirmPassword,"onUpdate:modelValue":e[4]||(e[4]=t=>s.form.confirmPassword=t),type:"password",placeholder:"请再次输入密码","prefix-icon":"Lock","show-password":""},null,8,["modelValue"])]),_:1})),o("div",ye,[l(v,{type:"primary",onClick:s.handleSubmit,loading:s.loading,class:"submit-btn"},{default:n(()=>[C(c(s.isLogin?"登 录":"注 册"),1)]),_:1},8,["onClick","loading"]),o("div",we,[l(v,{link:"",onClick:s.toggleMode,class:"toggle-btn"},{default:n(()=>[C(c(s.isLogin?"没有账号？去注册":"已有账号？去登录"),1)]),_:1},8,["onClick"])])])]),_:1},8,["model","rules"]),s.isLogin?(_(),I("div",be,[e[16]||(e[16]=o("div",{class:"divider"},[o("span",null,"或")],-1)),l(v,{class:"qr-btn",plain:"",onClick:s.showQRCode},{default:n(()=>[l(r,null,{default:n(()=>[l(R)]),_:1}),e[15]||(e[15]=C(" 扫码登录 "))]),_:1},8,["onClick"])])):b("",!0)]),_:1})]),o("div",he,[o("div",ke,[o("div",Le,[l(r,null,{default:n(()=>[l(P)]),_:1}),e[17]||(e[17]=o("span",null,"信息化管理",-1))]),o("div",Ve,[l(r,null,{default:n(()=>[l(a)]),_:1}),e[18]||(e[18]=o("span",null,"智能分析",-1))]),o("div",Te,[l(r,null,{default:n(()=>[l(d)]),_:1}),e[19]||(e[19]=o("span",null,"便捷服务",-1))])]),o("div",qe,[o("div",Ce,[l(r,null,{default:n(()=>[l(p)]),_:1}),e[20]||(e[20]=o("span",null,"金鸡岭校区",-1)),e[21]||(e[21]=o("small",null,"桂林市七星区金鸡路1号",-1))]),o("div",Se,[l(r,null,{default:n(()=>[l(w)]),_:1}),e[22]||(e[22]=o("span",null,"花江校区",-1)),e[23]||(e[23]=o("small",null,"灵川县",-1))]),o("div",Ue,[l(r,null,{default:n(()=>[l(E)]),_:1}),e[24]||(e[24]=o("span",null,"双一流建设高校",-1)),e[25]||(e[25]=o("small",null,"电子信息特色鲜明",-1))])]),e[26]||(e[26]=o("div",{class:"school-motto"},[o("h3",null,"厚德、博学、求是、创新")],-1)),o("div",xe,[l(ne,{name:"fade",mode:"out-in"},{default:n(()=>[(_(),I("p",{key:s.currentSlogan,class:"slogan"},c(s.currentSlogan),1))]),_:1})])])]),l(U,{class:"login-card"},{default:n(()=>[o("div",Re,[o("h2",null,c(s.isLogin?"账号登录":"注册新用户"),1),o("p",Ie,c(s.isLogin?"GUET智慧食堂":"欢迎加入智慧食堂"),1)]),l(T,{model:s.form,"label-position":"top",class:"login-form",rules:s.rules,ref:"formRef"},{default:n(()=>[s.isLogin?(_(),q(m,{key:0,label:"登录身份",prop:"userType"},{default:n(()=>[l(y,{modelValue:s.form.userType,"onUpdate:modelValue":e[5]||(e[5]=t=>s.form.userType=t),placeholder:"请选择登录身份",class:"user-type-select"},{default:n(()=>[l(f,{label:"学生",value:"student"},{default:n(()=>[o("div",Pe,[l(r,null,{default:n(()=>[l(L)]),_:1}),e[28]||(e[28]=o("span",null,"学生",-1))])]),_:1}),l(f,{label:"食堂管理员",value:"admin"},{default:n(()=>[o("div",Me,[l(r,null,{default:n(()=>[l(V)]),_:1}),e[29]||(e[29]=o("span",null,"食堂管理员",-1))])]),_:1})]),_:1},8,["modelValue"])]),_:1})):b("",!0),s.isLogin?b("",!0):(_(),q(m,{key:1,label:"选择身份",prop:"userType"},{default:n(()=>[l(y,{modelValue:s.form.userType,"onUpdate:modelValue":e[6]||(e[6]=t=>s.form.userType=t),placeholder:"请选择您的身份",class:"user-type-select"},{default:n(()=>[l(f,{label:"学生",value:"student"},{default:n(()=>[o("div",Ne,[l(r,null,{default:n(()=>[l(L)]),_:1}),e[30]||(e[30]=o("span",null,"学生",-1))])]),_:1}),l(f,{label:"食堂管理员",value:"admin"},{default:n(()=>[o("div",Ee,[l(r,null,{default:n(()=>[l(V)]),_:1}),e[31]||(e[31]=o("span",null,"食堂管理员",-1))])]),_:1})]),_:1},8,["modelValue"])]),_:1})),l(m,{label:s.isLogin?"学号/工号":"请输入学号/工号",prop:"username"},{default:n(()=>[l(g,{modelValue:s.form.username,"onUpdate:modelValue":e[7]||(e[7]=t=>s.form.username=t),placeholder:s.isLogin?"请输入学号/工号":"学号为8位数字，工号为5位数字","prefix-icon":"User"},null,8,["modelValue","placeholder"])]),_:1},8,["label"]),l(m,{label:s.isLogin?"密码":"设置密码",prop:"password"},{default:n(()=>[l(g,{modelValue:s.form.password,"onUpdate:modelValue":e[8]||(e[8]=t=>s.form.password=t),type:"password",placeholder:s.isLogin?"请输入密码":"密码长度不少于6位","prefix-icon":"Lock","show-password":""},null,8,["modelValue","placeholder"])]),_:1},8,["label"]),s.isLogin?b("",!0):(_(),q(m,{key:2,label:"确认密码",prop:"confirmPassword"},{default:n(()=>[l(g,{modelValue:s.form.confirmPassword,"onUpdate:modelValue":e[9]||(e[9]=t=>s.form.confirmPassword=t),type:"password",placeholder:"请再次输入密码","prefix-icon":"Lock","show-password":""},null,8,["modelValue"])]),_:1})),o("div",Fe,[l(v,{type:"primary",onClick:s.handleSubmit,loading:s.loading,class:"submit-btn"},{default:n(()=>[C(c(s.isLogin?"登 录":"注 册"),1)]),_:1},8,["onClick","loading"]),o("div",Be,[l(v,{link:"",onClick:s.toggleMode,class:"toggle-btn"},{default:n(()=>[C(c(s.isLogin?"没有账号？去注册":"已有账号？去登录"),1)]),_:1},8,["onClick"])])])]),_:1},8,["model","rules"]),s.isLogin?(_(),I("div",Qe,[e[33]||(e[33]=o("div",{class:"divider"},[o("span",null,"或")],-1)),l(v,{class:"qr-btn",plain:"",onClick:s.showQRCode},{default:n(()=>[l(r,null,{default:n(()=>[l(R)]),_:1}),e[32]||(e[32]=C(" 扫码登录 "))]),_:1},8,["onClick"])])):b("",!0)]),_:1})]),o("div",ze,[o("div",Ae,[o("p",null,"Copyright © "+c(new Date().getFullYear())+" 桂林电子科技大学",1),e[34]||(e[34]=o("p",null,"地址:桂林市七星区金鸡路1号",-1))])]),l(Q,{modelValue:s.qrDialogVisible,"onUpdate:modelValue":e[10]||(e[10]=t=>s.qrDialogVisible=t),title:"微信扫码登录",width:"400px","align-center":"","show-close":!0,class:"qr-dialog","close-on-click-modal":!1},{default:n(()=>[o("div",Ge,[o("div",De,[o("img",{src:s.qrCodeUrl,alt:"微信扫码登录",class:"qr-image"},null,8,Oe),o("div",We,[l(r,{class:"refresh-icon",onClick:s.refreshQRCode},{default:n(()=>[l(F)]),_:1},8,["onClick"]),e[35]||(e[35]=o("span",null,"点击刷新二维码",-1))])]),e[37]||(e[37]=o("p",{class:"qr-tip"},"请使用微信扫一扫登录",-1)),o("p",je,c(s.qrStatus),1),o("div",Je,[l(r,null,{default:n(()=>[l(B)]),_:1}),e[36]||(e[36]=o("span",null,"首次使用需要绑定微信账号",-1))])])]),_:1},8,["modelValue"])])}const Ze=z(re,[["render",Ye],["__scopeId","data-v-c0b861ee"]]);export{Ze as default};
