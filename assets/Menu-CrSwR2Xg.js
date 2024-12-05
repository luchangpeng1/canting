import{_ as le,g as p,ay as Z,x as i,y as d,k as b,n as s,q as l,v as D,w as a,aL as L,aq as he,S as _e,A as j,z as I,aC as ye,B as u,a$ as ke,J as be,I as E,E as m,Y as we,a1 as Y,af as ee}from"./index-CjeFGtzt.js";const Ve={class:"dish-content"},Ce={class:"dish-header"},$e={class:"dish-name"},Ue={class:"dish-image"},xe={class:"image-loading"},Oe={class:"image-placeholder"},De={class:"dish-info"},ze={class:"dish-meta"},Be={class:"dish-price"},Se={class:"dish-stock"},Ie={key:0,class:"sold-out-tag"},Me={class:"dish-actions"},Fe={class:"stock-input"},je={class:"dialog-footer"},Ee={__name:"DishCard",props:{dish:{type:Object,required:!0},selectedDishes:{type:Array,required:!0}},emits:["update:selected","toggle-sold-out","update-stock","update-image"],setup(r,{emit:T}){const y=r,v=T,M=p(null),_=p(!1),z=p(0);Z(()=>y.dish.stock,w=>{z.value=w},{immediate:!0});const P=()=>{if(z.value===y.dish.stock){_.value=!1;return}v("update-stock",{...y.dish,stock:z.value}),_.value=!1,m.success("库存更新成功")},R=p(!1);Z(()=>y.selectedDishes,w=>{R.value=w.includes(y.dish.id)},{immediate:!0});const q=()=>{M.value.click()},N=async w=>{const n=w.target.files[0];if(n){if(!n.type.startsWith("image/")){m.error("请选择图片文件");return}if(n.size>2*1024*1024){m.error("图片大小不能超过2MB");return}try{const C=new FormData;C.append("image",n),C.append("dishId",y.dish.id),v("update-image",{dishId:y.dish.id,formData:C}),w.target.value=""}catch(C){m.error("上传图片失败"),console.error("上传图片错误:",C)}}};return(w,n)=>{const C=i("el-checkbox"),$=i("el-icon"),f=i("el-image"),V=i("el-button"),U=i("el-input-number"),x=i("el-dialog");return d(),b(E,null,[s("div",{class:be(["dish-card",{"sold-out":r.dish.soldOut}])},[s("div",Ve,[s("div",Ce,[s("div",{class:"checkbox-wrapper",onClick:n[0]||(n[0]=g=>w.$emit("update:selected",r.dish.id))},[l(C,{"model-value":r.selectedDishes.includes(r.dish.id),class:"dish-checkbox"},null,8,["model-value"])]),s("h4",$e,D(r.dish.name),1)]),s("div",Ue,[l(f,{src:r.dish.image_url,fit:"cover",lazy:"",loading:"lazy","preview-src-list":[r.dish.image_url],"initial-index":0,"zoom-rate":1.2,"preview-teleported":!0},{placeholder:a(()=>[s("div",xe,[l($,{class:"loading-icon"},{default:a(()=>[l(L(he))]),_:1}),n[6]||(n[6]=s("span",null,"加载中...",-1))])]),error:a(()=>[s("div",Oe,[l($,null,{default:a(()=>[l(L(_e))]),_:1}),n[7]||(n[7]=s("span",null,"暂无图片",-1))])]),_:1},8,["src","preview-src-list"])]),s("div",De,[s("div",ze,[s("span",Be,"¥"+D(r.dish.price),1),s("span",Se,"剩余: "+D(r.dish.stock),1),r.dish.soldOut?(d(),b("span",Ie,"已售罄")):j("",!0)]),s("div",Me,[l(V,{type:"danger",size:"small",plain:!r.dish.soldOut,onClick:n[1]||(n[1]=g=>w.$emit("toggle-sold-out",r.dish))},{default:a(()=>[l($,null,{default:a(()=>[(d(),I(ye(r.dish.soldOut?"CircleCheck":"CircleClose")))]),_:1}),u(" "+D(r.dish.soldOut?"恢复供应":"标记售罄"),1)]),_:1},8,["plain"]),l(V,{type:"primary",size:"small",plain:"",onClick:n[2]||(n[2]=g=>_.value=!0)},{default:a(()=>n[8]||(n[8]=[u(" 修改库存 ")])),_:1}),l(V,{type:"success",size:"small",plain:"",onClick:q},{default:a(()=>[l($,null,{default:a(()=>[l(L(ke))]),_:1}),n[9]||(n[9]=u(" 更换图片 "))]),_:1}),s("input",{type:"file",ref_key:"fileInput",ref:M,style:{display:"none"},accept:"image/*",onChange:N},null,544)])])])],2),l(x,{modelValue:_.value,"onUpdate:modelValue":n[5]||(n[5]=g=>_.value=g),title:`修改 ${r.dish.name} 的库存`,width:"90%","show-close":!1,"align-center":"",class:"stock-dialog"},{footer:a(()=>[s("div",je,[l(V,{onClick:n[4]||(n[4]=g=>_.value=!1),size:"large"},{default:a(()=>n[10]||(n[10]=[u("取消")])),_:1}),l(V,{type:"primary",onClick:P,size:"large"},{default:a(()=>n[11]||(n[11]=[u("确定")])),_:1})])]),default:a(()=>[s("div",Fe,[l(U,{modelValue:z.value,"onUpdate:modelValue":n[3]||(n[3]=g=>z.value=g),min:0,max:999,size:"large","controls-position":"right",style:{width:"100%"}},null,8,["modelValue"])])]),_:1},8,["modelValue","title"])],64)}}},Te=le(Ee,[["__scopeId","data-v-f8cdbdd7"]]),Ye={class:"menu-container"},Pe={class:"mobile-menu"},Re={class:"page-header"},qe={class:"header-actions"},Ne={class:"date-picker"},Ae={class:"category-tags"},Le={class:"dishes-grid"},We={key:0,class:"upload-area"},Je={key:0,class:"upload-actions"},Ge={key:1,class:"preview-area"},He={class:"preview-header"},Ke={class:"batch-actions"},Qe={class:"preview-grid"},Xe={class:"preview-image"},Ze={class:"preview-form"},el={class:"dialog-footer"},ll={class:"dialog-footer"},tl={__name:"Menu",setup(r){const T=p(new Date),y=p("all"),v=p([]),M=[{label:"大荤",value:"main"},{label:"小荤",value:"side"},{label:"素菜",value:"vegetable"},{label:"汤类",value:"soup"}],_=p([{id:1,name:"红烧肉",price:15,stock:50,category:"main",soldOut:!1,image_url:"https://example.com/dish1.jpg"},{id:2,name:"糖醋排骨",price:16,stock:40,category:"main",soldOut:!1,image_url:"https://example.com/dish2.jpg"},{id:3,name:"回锅肉",price:14,stock:45,category:"main",soldOut:!1,image_url:"https://example.com/dish3.jpg"},{id:4,name:"宫保鸡丁",price:13,stock:30,category:"side",soldOut:!1,image_url:"https://example.com/dish4.jpg"},{id:5,name:"麻婆豆腐",price:10,stock:35,category:"side",soldOut:!1,image_url:"https://example.com/dish5.jpg"},{id:6,name:"炒青菜",price:8,stock:60,category:"vegetable",soldOut:!1,image_url:"https://example.com/dish6.jpg"},{id:7,name:"土豆丝",price:8,stock:55,category:"vegetable",soldOut:!1,image_url:"https://example.com/dish7.jpg"},{id:8,name:"紫菜蛋花汤",price:5,stock:100,category:"soup",soldOut:!1,image_url:"https://example.com/dish8.jpg"},{id:9,name:"番茄蛋汤",price:5,stock:100,category:"soup",soldOut:!1,image_url:"https://example.com/dish9.jpg"}]),z=we(()=>y.value==="all"?_.value:_.value.filter(t=>t.category===y.value)),P=async t=>{try{await ee.confirm(`确定要${t.soldOut?"恢复供应":"标记售罄"}该菜品吗？`,"提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:t.soldOut?"success":"warning"}),t.soldOut=!t.soldOut,t.soldOut&&(v.value=v.value.filter(e=>e!==t.id)),m.success(`${t.name}已${t.soldOut?"售罄":"恢复供应"}`)}catch{}},R=async()=>{try{await ee.confirm(`确定要将选中的 ${v.value.length} 个菜品标记为售罄吗？`,"警告",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}),_.value.forEach(t=>{v.value.includes(t.id)&&(t.soldOut=!0)}),v.value=[],m.success("已批量标记售罄")}catch{}},q=async t=>{try{const e=_.value.findIndex(h=>h.id===t.id);e!==-1&&(_.value[e].stock=t.stock)}catch{m.error("更新库存失败")}},N=t=>t.getTime()<Date.now()-864e5,w=t=>{v.value.indexOf(t)===-1?v.value=[...v.value,t]:v.value=v.value.filter(h=>h!==t)},n=async({dishId:t,formData:e})=>{try{if(!(await fetch("/api/dishes/upload-image",{method:"POST",body:e})).ok)throw new Error("上传失败");m.success("图片上传成功")}catch(h){m.error("图片上传失败"),console.error("上传错误:",h)}},C=p(null),$=p(!1),f=p([]),V=p(!1),U=p([]),x=p(!1),g=p(""),B=p({category:"",price:0}),te=()=>{$.value=!0},ae=t=>{if(t)return t.raw.type.startsWith("image/")?t.size>2*1024*1024?(m.error("图片大小不能超过2MB"),!1):(U.value.push(t),!0):(m.error("请选择图片文件"),!1)},oe=t=>{U.value=U.value.filter(e=>e.uid!==t.uid)},se=()=>{m.warning("最多只能上传50个文件")},ne=async()=>{f.value=[];for(const t of U.value)await new Promise(e=>{const h=new FileReader;h.onload=O=>{f.value.push({file:t.raw,imageUrl:O.target.result,name:"",price:0,category:"",stock:100}),e()},h.readAsDataURL(t.raw)})},ie=()=>{g.value="category",x.value=!0},de=()=>{g.value="price",x.value=!0},ue=()=>{g.value==="category"?f.value.forEach(t=>{t.category=B.value.category}):g.value==="price"&&f.value.forEach(t=>{t.price=B.value.price}),x.value=!1,m.success("批量设置成功")},W=()=>{var t;$.value=!1,f.value=[],U.value=[],(t=uploadRef.value)==null||t.clearFiles()},re=async()=>{if(f.value.filter(e=>!e.name||!e.category||e.price<=0).length){m.error("请完整填写所有菜品信息");return}V.value=!0;try{const e=new FormData;e.append("date",T.value),f.value.forEach((c,S)=>{e.append(`dishes[${S}][image]`,c.file),e.append(`dishes[${S}][name]`,c.name),e.append(`dishes[${S}][price]`,c.price),e.append(`dishes[${S}][category]`,c.category),e.append(`dishes[${S}][stock]`,c.stock)});const h=await fetch("/api/menu/batch-upload",{method:"POST",body:e});if(!h.ok)throw new Error("上传失败");const O=await h.json();O.dishes&&(_.value=O.dishes),m.success("菜单上传成功"),W()}catch(e){m.error("菜单上传失败"),console.error("上传菜单错误:",e)}finally{V.value=!1}};return(t,e)=>{const h=i("CircleClose"),O=i("el-icon"),c=i("el-button"),S=i("Upload"),ce=i("el-date-picker"),J=i("el-radio-button"),pe=i("el-radio-group"),me=i("upload-filled"),ve=i("el-upload"),fe=i("el-image"),ge=i("el-input"),F=i("el-form-item"),A=i("el-input-number"),G=i("el-option"),H=i("el-select"),K=i("el-form"),Q=i("el-dialog");return d(),b("div",Ye,[s("div",Pe,[s("div",Re,[e[10]||(e[10]=s("h2",{class:"page-title"},"菜单管理",-1)),s("div",qe,[v.value.length?(d(),I(c,{key:0,type:"primary",size:"small",onClick:R},{default:a(()=>[l(O,null,{default:a(()=>[l(h)]),_:1}),e[8]||(e[8]=u("批量售罄 "))]),_:1})):j("",!0),l(c,{type:"primary",size:"small",onClick:te},{default:a(()=>[l(O,null,{default:a(()=>[l(S)]),_:1}),e[9]||(e[9]=u("上传菜单 "))]),_:1}),s("input",{type:"file",ref_key:"menuFileInput",ref:C,style:{display:"none"},accept:".xlsx,.xls",onChange:e[0]||(e[0]=(...o)=>t.handleMenuFileChange&&t.handleMenuFileChange(...o))},null,544)])]),s("div",Ne,[l(ce,{modelValue:T.value,"onUpdate:modelValue":e[1]||(e[1]=o=>T.value=o),type:"date",placeholder:"选择日期",format:"YYYY-MM-DD","value-format":"YYYY-MM-DD","disabled-date":N,style:{width:"100%"},size:"small"},null,8,["modelValue"])]),s("div",Ae,[l(pe,{modelValue:y.value,"onUpdate:modelValue":e[2]||(e[2]=o=>y.value=o),size:"small"},{default:a(()=>[l(J,{value:"all"},{default:a(()=>e[11]||(e[11]=[u("全部")])),_:1}),(d(),b(E,null,Y(M,o=>l(J,{key:o.value,value:o.value},{default:a(()=>[u(D(o.label),1)]),_:2},1032,["value"])),64))]),_:1},8,["modelValue"])]),s("div",Le,[(d(!0),b(E,null,Y(z.value,o=>(d(),I(Te,{key:o.id,dish:o,"selected-dishes":v.value,"onUpdate:selected":w,onToggleSoldOut:P,onUpdateStock:q,onUpdateImage:n},null,8,["dish","selected-dishes"]))),128))])]),l(Q,{modelValue:$.value,"onUpdate:modelValue":e[3]||(e[3]=o=>$.value=o),title:"批量上传菜品",width:"90%"},{footer:a(()=>[s("div",el,[l(c,{onClick:W},{default:a(()=>e[17]||(e[17]=[u("取消")])),_:1}),l(c,{type:"primary",onClick:re,loading:V.value,disabled:!f.value.length},{default:a(()=>[u(D(V.value?"上传中...":"确认上传"),1)]),_:1},8,["loading","disabled"])])]),default:a(()=>[f.value.length?(d(),b("div",Ge,[s("div",He,[s("h3",null,"批量编辑菜品信息 ("+D(f.value.length)+"个)",1),s("div",Ke,[f.value.length>1?(d(),I(c,{key:0,size:"small",onClick:ie},{default:a(()=>e[14]||(e[14]=[u(" 批量设置分类 ")])),_:1})):j("",!0),f.value.length>1?(d(),I(c,{key:1,size:"small",onClick:de},{default:a(()=>e[15]||(e[15]=[u(" 批量设置价格 ")])),_:1})):j("",!0)])]),s("div",Qe,[(d(!0),b(E,null,Y(f.value,(o,X)=>(d(),b("div",{key:X,class:"preview-item"},[s("div",Xe,[l(fe,{src:o.imageUrl,fit:"cover","preview-src-list":[o.imageUrl]},null,8,["src","preview-src-list"])]),s("div",Ze,[l(K,{model:o,"label-position":"top",size:"small"},{default:a(()=>[l(F,{label:"菜品名称"},{default:a(()=>[l(ge,{modelValue:o.name,"onUpdate:modelValue":k=>o.name=k,placeholder:"请输入菜品名称"},null,8,["modelValue","onUpdate:modelValue"])]),_:2},1024),l(F,{label:"价格"},{default:a(()=>[l(A,{modelValue:o.price,"onUpdate:modelValue":k=>o.price=k,min:0,precision:2,step:.1},null,8,["modelValue","onUpdate:modelValue"])]),_:2},1024),l(F,{label:"分类"},{default:a(()=>[l(H,{modelValue:o.category,"onUpdate:modelValue":k=>o.category=k,placeholder:"选择分类"},{default:a(()=>[(d(),b(E,null,Y(M,k=>l(G,{key:k.value,label:k.label,value:k.value},null,8,["label","value"])),64))]),_:2},1032,["modelValue","onUpdate:modelValue"])]),_:2},1024),l(F,{label:"初始库存"},{default:a(()=>[l(A,{modelValue:o.stock,"onUpdate:modelValue":k=>o.stock=k,min:0,precision:0,step:1},null,8,["modelValue","onUpdate:modelValue"])]),_:2},1024)]),_:2},1032,["model"]),l(c,{type:"danger",size:"small",onClick:k=>t.removePreviewItem(X)},{default:a(()=>e[16]||(e[16]=[u(" 删除 ")])),_:2},1032,["onClick"])])]))),128))])])):(d(),b("div",We,[l(ve,{ref:"uploadRef",class:"menu-uploader","auto-upload":!1,"show-file-list":!0,multiple:!0,limit:50,accept:"image/*","on-change":ae,"on-exceed":se,"on-remove":oe,drag:""},{tip:a(()=>e[12]||(e[12]=[s("div",{class:"el-upload__tip"}," 支持批量上传jpg/png图片，每个文件不超过2MB，最多可选择50个文件 ",-1)])),default:a(()=>[l(O,{class:"el-icon--upload"},{default:a(()=>[l(me)]),_:1}),e[13]||(e[13]=s("div",{class:"el-upload__text"},[u(" 拖拽多个文件到此处或 "),s("em",null,"点击上传")],-1))]),_:1},512),U.value.length?(d(),b("div",Je,[l(c,{type:"primary",onClick:ne},{default:a(()=>[u(" 开始编辑 "+D(U.value.length)+" 个菜品信息 ",1)]),_:1})])):j("",!0)]))]),_:1},8,["modelValue"]),l(Q,{modelValue:x.value,"onUpdate:modelValue":e[7]||(e[7]=o=>x.value=o),title:"批量设置",width:"90%","append-to-body":""},{footer:a(()=>[s("div",ll,[l(c,{onClick:e[6]||(e[6]=o=>x.value=!1)},{default:a(()=>e[18]||(e[18]=[u("取消")])),_:1}),l(c,{type:"primary",onClick:ue},{default:a(()=>e[19]||(e[19]=[u("确定")])),_:1})])]),default:a(()=>[l(K,{model:B.value,"label-width":"80px"},{default:a(()=>[g.value==="category"?(d(),I(F,{key:0,label:"分类"},{default:a(()=>[l(H,{modelValue:B.value.category,"onUpdate:modelValue":e[4]||(e[4]=o=>B.value.category=o),placeholder:"选择分类"},{default:a(()=>[(d(),b(E,null,Y(M,o=>l(G,{key:o.value,label:o.label,value:o.value},null,8,["label","value"])),64))]),_:1},8,["modelValue"])]),_:1})):g.value==="price"?(d(),I(F,{key:1,label:"价格"},{default:a(()=>[l(A,{modelValue:B.value.price,"onUpdate:modelValue":e[5]||(e[5]=o=>B.value.price=o),min:0,precision:2,step:.1},null,8,["modelValue"])]),_:1})):j("",!0)]),_:1},8,["model"])]),_:1},8,["modelValue"])])}}},ol=le(tl,[["__scopeId","data-v-24ea4061"]]);export{ol as default};