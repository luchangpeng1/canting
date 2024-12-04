import{_ as Z,L as $,S as ee,R as le,aX as ae,aY as oe,V as N,g as m,h as G,k,n as f,z as y,w as n,A as K,q as o,E as u,aa as ne,x as i,y as r,B as p,H as T,X as I,v as O,C as te}from"./index-1A1V_OG6.js";import"./request-CH9P5VK3.js";const ie={name:"DishManagement",components:{Plus:$,Search:ee,Picture:le,Upload:ae,UploadFilled:oe},setup(){te();const _=N(()=>{const t=localStorage.getItem("verifiedInfo");return t?JSON.parse(t):null}),a=t=>_.value?_.value.window.id===t:!1,R=N(()=>_.value!==null),e=()=>{if(!_.value){u.warning("请先完成身份验证");return}S.value="add",Object.assign(v,{name:"",category:"",price:0,window_id:_.value.window.id,image_url:"",description:"",status:1}),w.value=!0},X=N(()=>_.value?U.value.filter(t=>t.id===_.value.window.id):U.value),H=[{id:1,name:"中央食堂"},{id:2,name:"沁园餐厅"},{id:3,name:"馨园餐厅"}],E=[{id:101,name:"大荤窗口",canteen:"中央食堂",location:"一楼"},{id:102,name:"特色炒菜",canteen:"中央食堂",location:"一楼"},{id:201,name:"面食窗口",canteen:"沁园餐厅",location:"二楼"},{id:301,name:"快餐窗口",canteen:"馨园餐厅",location:"一楼"}],V=[{id:1,name:"红烧肉",category:"大荤",price:15,window:"大荤窗口",window_id:101,status:1,image_url:"https://example.com/dishes/hongshaorou.jpg",description:"经典红烧肉，肥而不腻"},{id:2,name:"清炒时蔬",category:"素菜",price:8,window:"特色炒菜",window_id:102,status:1,image_url:"https://example.com/dishes/qingcao.jpg",description:"新鲜时令蔬菜"},{id:3,name:"牛肉面",category:"面食",price:16,window:"面食窗口",window_id:201,status:0,image_url:"https://example.com/dishes/noodles.jpg",description:"清汤牛肉面"}],c=m(""),M=m(""),z=m(""),x=m(1),C=m(10),F=m(V.length),B=m(!1),w=m(!1),P=m(!1),S=m("add"),A=m(!1),v=G({name:"",category:"",price:0,window_id:"",image_url:"",description:"",status:1}),j=G({date:"",windowId:"",stock:0}),Q={name:[{required:!0,message:"请输入菜品名称",trigger:"blur"},{min:2,max:20,message:"长度在 2 到 20 个字符",trigger:"blur"}],category:[{required:!0,message:"请选择菜品类别",trigger:"change"}],price:[{required:!0,message:"请输入价格",trigger:"blur"}],window_id:[{required:!0,message:"请选择所属窗口",trigger:"change"}]},W=["主食","大荤","小荤","素菜","汤品","特色炒菜","面食","饮品","水果","小吃"],h=m(H),U=m(E),b=m(V),q=N(()=>b.value.filter(t=>{const s=t.name.toLowerCase().includes(c.value.toLowerCase()),d=!M.value||t.category===M.value,D=!z.value||t.window_id===z.value;return s&&d&&D}));return{searchQuery:c,categoryFilter:M,windowFilter:z,currentPage:x,pageSize:C,total:F,loading:B,dialogVisible:w,importDialogVisible:P,dialogType:S,dishForm:v,rules:Q,categories:W,canteens:h,windows:U,filteredDishes:q,uploadUrl:"https://api.example.com/upload",showAddDialog:e,editDish:t=>{S.value="edit",Object.assign(v,t),w.value=!0},saveDish:async()=>{var t,s;B.value=!0;try{if(await new Promise(d=>setTimeout(d,1e3)),S.value==="add"){const d={id:b.value.length+1,...v,window:(t=U.value.find(D=>D.id===v.window_id))==null?void 0:t.name};b.value.push(d),u.success("添加成功")}else{const d=b.value.findIndex(D=>D.id===v.id);d>-1&&(b.value[d]={...b.value[d],...v,window:(s=U.value.find(D=>D.id===v.window_id))==null?void 0:s.name}),u.success("更新成功")}w.value=!1}catch{u.error("操作失败")}finally{B.value=!1}},deleteDish:async t=>{try{await ne.confirm(`确定要删除 ${t.name} 吗？`,"提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}),await new Promise(d=>setTimeout(d,500));const s=b.value.findIndex(d=>d.id===t.id);s>-1&&b.value.splice(s,1),u.success("删除成功")}catch(s){s!=="cancel"&&u.error("删除失败")}},handleStatusChange:async t=>{try{await new Promise(s=>setTimeout(s,300)),u.success(`${t.name} 状态已更新`)}catch{u.error("状态更新失败"),t.status=t.status===1?0:1}},showBatchImport:()=>{P.value=!0},handleImportSuccess:t=>{u.success("导入成功"),P.value=!1},beforeImportUpload:t=>{const s=t.type==="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"||t.type==="application/vnd.ms-excel",d=t.size/1024/1024<5;return s||u.error("只能上传 Excel 文件!"),d||u.error("文件大小不能超过 5MB!"),s&&d},downloadTemplate:()=>{u.success("模板下载中...")},getCategoryType:t=>({主食:"info",大荤:"danger",小荤:"warning",素菜:"success",汤品:"info",特色炒菜:"primary",面食:"info",饮品:"info",水果:"success",小吃:"warning"})[t]||"info",handleSizeChange:t=>{C.value=t,x.value=1},handleCurrentChange:t=>{x.value=t},handleUploadSuccess:t=>{v.image_url=t.url,u.success("图片上传成功")},beforeUpload:t=>{const s=/^image\//.test(t.type),d=t.size/1024/1024<2;return s||u.error("只能上传图片文件!"),d||u.error("图片大小不能超过 2MB!"),s&&d},addToMenu:t=>{A.value=!0,Object.assign(j,{date:"",windowId:t.window_id,stock:0})},addToMenuVisible:A,menuForm:j,disabledDate:t=>t.getTime()<Date.now(),hasPermission:a,showAddButton:R,availableWindows:X,userVerification:_}}},de={class:"dish-management"},se={class:"top-actions"},re={class:"left"},ue={class:"right"},ce={class:"dish-info"},me={class:"image-placeholder"},pe={class:"price"},ge={class:"pagination"},fe=["src"],_e={class:"import-container"},we={class:"template-download"};function ve(_,a,R,e,X,H){const E=i("Plus"),V=i("el-icon"),c=i("el-button"),M=i("Upload"),z=i("Search"),x=i("el-input"),C=i("el-option"),F=i("el-select"),B=i("el-option-group"),w=i("el-table-column"),P=i("Picture"),S=i("el-image"),A=i("el-tag"),v=i("el-switch"),j=i("el-table"),Q=i("el-pagination"),W=i("el-card"),h=i("el-form-item"),U=i("el-upload"),b=i("el-input-number"),q=i("el-form"),L=i("el-dialog"),J=i("upload-filled"),Y=i("el-date-picker");return r(),k("div",de,[f("div",se,[f("div",re,[e.showAddButton?(r(),y(c,{key:0,type:"primary",onClick:e.showAddDialog},{default:n(()=>[o(V,null,{default:n(()=>[o(E)]),_:1}),a[18]||(a[18]=p("新增菜品 "))]),_:1},8,["onClick"])):K("",!0),e.showAddButton?(r(),y(c,{key:1,type:"success",plain:"",onClick:e.showBatchImport},{default:n(()=>[o(V,null,{default:n(()=>[o(M)]),_:1}),a[19]||(a[19]=p("批量导入 "))]),_:1},8,["onClick"])):K("",!0)]),f("div",ue,[o(x,{modelValue:e.searchQuery,"onUpdate:modelValue":a[0]||(a[0]=l=>e.searchQuery=l),placeholder:"搜索菜品",clearable:"",class:"search-input"},{prefix:n(()=>[o(V,null,{default:n(()=>[o(z)]),_:1})]),_:1},8,["modelValue"]),o(F,{modelValue:e.categoryFilter,"onUpdate:modelValue":a[1]||(a[1]=l=>e.categoryFilter=l),placeholder:"菜品类别",clearable:"",class:"filter-item"},{default:n(()=>[(r(!0),k(T,null,I(e.categories,l=>(r(),y(C,{key:l,label:l,value:l},null,8,["label","value"]))),128))]),_:1},8,["modelValue"]),o(F,{modelValue:e.windowFilter,"onUpdate:modelValue":a[2]||(a[2]=l=>e.windowFilter=l),placeholder:"所属窗口",clearable:"",class:"filter-item"},{default:n(()=>[(r(!0),k(T,null,I(e.canteens,l=>(r(),y(B,{key:l.id,label:l.name},{default:n(()=>[(r(!0),k(T,null,I(e.windows.filter(g=>g.canteen===l.name),g=>(r(),y(C,{key:g.id,label:g.name,value:g.id},null,8,["label","value"]))),128))]),_:2},1032,["label"]))),128))]),_:1},8,["modelValue"])])]),o(W,{class:"dish-list"},{default:n(()=>[o(j,{data:e.filteredDishes,style:{width:"100%"},"header-cell-style":{background:"#f5f7fa"}},{default:n(()=>[o(w,{type:"selection",width:"55"}),o(w,{prop:"name",label:"菜品名称"},{default:n(({row:l})=>[f("div",ce,[o(S,{src:l.image_url,"preview-src-list":[l.image_url],class:"dish-image"},{error:n(()=>[f("div",me,[o(V,null,{default:n(()=>[o(P)]),_:1})])]),_:2},1032,["src","preview-src-list"]),f("span",null,O(l.name),1)])]),_:1}),o(w,{prop:"category",label:"类别",width:"120"},{default:n(({row:l})=>[o(A,{type:e.getCategoryType(l.category),size:"small"},{default:n(()=>[p(O(l.category),1)]),_:2},1032,["type"])]),_:1}),o(w,{prop:"price",label:"价格",width:"120"},{default:n(({row:l})=>[f("span",pe,"¥"+O(l.price),1)]),_:1}),o(w,{prop:"window",label:"所属窗口",width:"180"},{default:n(({row:l})=>[o(A,{size:"small",type:"info",effect:"plain"},{default:n(()=>[p(O(l.window),1)]),_:2},1024)]),_:1}),o(w,{prop:"status",label:"状态",width:"100"},{default:n(({row:l})=>[o(v,{modelValue:l.status,"onUpdate:modelValue":g=>l.status=g,"active-value":1,"inactive-value":0,onChange:g=>e.handleStatusChange(l)},null,8,["modelValue","onUpdate:modelValue","onChange"])]),_:1}),o(w,{label:"操作",width:"250",fixed:"right"},{default:n(({row:l})=>[e.hasPermission(l.window_id)?(r(),k(T,{key:0},[o(c,{type:"primary",link:"",onClick:g=>e.editDish(l)},{default:n(()=>a[20]||(a[20]=[p(" 编辑 ")])),_:2},1032,["onClick"]),o(c,{type:"success",link:"",onClick:g=>e.addToMenu(l)},{default:n(()=>a[21]||(a[21]=[p(" 添加到菜单 ")])),_:2},1032,["onClick"]),o(c,{type:"danger",link:"",onClick:g=>e.deleteDish(l)},{default:n(()=>a[22]||(a[22]=[p(" 删除 ")])),_:2},1032,["onClick"])],64)):(r(),y(c,{key:1,type:"info",link:"",onClick:g=>_.viewDish(l)},{default:n(()=>a[23]||(a[23]=[p(" 查看 ")])),_:2},1032,["onClick"]))]),_:1})]),_:1},8,["data"]),f("div",ge,[o(Q,{"current-page":e.currentPage,"onUpdate:currentPage":a[3]||(a[3]=l=>e.currentPage=l),"page-size":e.pageSize,"onUpdate:pageSize":a[4]||(a[4]=l=>e.pageSize=l),"page-sizes":[10,20,50,100],total:e.total,layout:"total, sizes, prev, pager, next",onSizeChange:e.handleSizeChange,onCurrentChange:e.handleCurrentChange},null,8,["current-page","page-size","total","onSizeChange","onCurrentChange"])])]),_:1}),o(L,{title:e.dialogType==="add"?"新增菜品":e.dialogType==="edit"?"编辑菜品":"查看菜品",modelValue:e.dialogVisible,"onUpdate:modelValue":a[11]||(a[11]=l=>e.dialogVisible=l),width:"50%"},{footer:n(()=>[o(c,{onClick:a[10]||(a[10]=l=>e.dialogVisible=!1)},{default:n(()=>a[24]||(a[24]=[p("取消")])),_:1}),o(c,{type:"primary",onClick:e.saveDish,loading:e.loading},{default:n(()=>a[25]||(a[25]=[p(" 确定 ")])),_:1},8,["onClick","loading"])]),default:n(()=>[o(q,{ref:"dishForm",model:e.dishForm,rules:e.rules,disabled:e.dialogType==="view","label-width":"100px"},{default:n(()=>[o(h,{label:"菜品名称",prop:"name"},{default:n(()=>[o(x,{modelValue:e.dishForm.name,"onUpdate:modelValue":a[5]||(a[5]=l=>e.dishForm.name=l),placeholder:"请输入菜品名称"},null,8,["modelValue"])]),_:1}),o(h,{label:"菜品图片",prop:"image"},{default:n(()=>[o(U,{class:"dish-uploader",action:e.uploadUrl,"show-file-list":!1,"on-success":e.handleUploadSuccess,"before-upload":e.beforeUpload},{default:n(()=>[e.dishForm.image_url?(r(),k("img",{key:0,src:e.dishForm.image_url,class:"uploaded-image"},null,8,fe)):(r(),y(V,{key:1,class:"uploader-icon"},{default:n(()=>[o(E)]),_:1}))]),_:1},8,["action","on-success","before-upload"])]),_:1}),o(h,{label:"菜品类别",prop:"category"},{default:n(()=>[o(F,{modelValue:e.dishForm.category,"onUpdate:modelValue":a[6]||(a[6]=l=>e.dishForm.category=l),placeholder:"请选择类别"},{default:n(()=>[(r(!0),k(T,null,I(e.categories,l=>(r(),y(C,{key:l,label:l,value:l},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])]),_:1}),o(h,{label:"价格",prop:"price"},{default:n(()=>[o(b,{modelValue:e.dishForm.price,"onUpdate:modelValue":a[7]||(a[7]=l=>e.dishForm.price=l),precision:2,step:.1,min:0},null,8,["modelValue"])]),_:1}),o(h,{label:"所属窗口",prop:"window_id"},{default:n(()=>[o(F,{modelValue:e.dishForm.window_id,"onUpdate:modelValue":a[8]||(a[8]=l=>e.dishForm.window_id=l),placeholder:"请选择窗口",disabled:e.dialogType==="edit"||e.userVerification},{default:n(()=>[(r(!0),k(T,null,I(e.availableWindows,l=>(r(),y(C,{key:l.id,label:l.name,value:l.id},null,8,["label","value"]))),128))]),_:1},8,["modelValue","disabled"])]),_:1}),o(h,{label:"描述",prop:"description"},{default:n(()=>[o(x,{modelValue:e.dishForm.description,"onUpdate:modelValue":a[9]||(a[9]=l=>e.dishForm.description=l),type:"textarea",rows:3,placeholder:"请输入菜品描述"},null,8,["modelValue"])]),_:1})]),_:1},8,["model","rules","disabled"])]),_:1},8,["title","modelValue"]),o(L,{title:"批量导入菜品",modelValue:e.importDialogVisible,"onUpdate:modelValue":a[12]||(a[12]=l=>e.importDialogVisible=l),width:"40%"},{default:n(()=>[f("div",_e,[o(U,{class:"upload-excel",drag:"",action:_.importUrl,"on-success":e.handleImportSuccess,"before-upload":e.beforeImportUpload,accept:".xlsx, .xls"},{tip:n(()=>a[26]||(a[26]=[f("div",{class:"el-upload__tip"}," 请上传 Excel 文件，且文件大小不超过 5MB ",-1)])),default:n(()=>[o(V,{class:"el-icon--upload"},{default:n(()=>[o(J)]),_:1}),a[27]||(a[27]=f("div",{class:"el-upload__text"},[p(" 将文件拖到此处，或"),f("em",null,"点击上传")],-1))]),_:1},8,["action","on-success","before-upload"]),f("div",we,[o(c,{type:"primary",link:"",onClick:e.downloadTemplate},{default:n(()=>a[28]||(a[28]=[p(" 下载导入模板 ")])),_:1},8,["onClick"])])])]),_:1},8,["modelValue"]),o(L,{title:"添加到菜单",modelValue:e.addToMenuVisible,"onUpdate:modelValue":a[17]||(a[17]=l=>e.addToMenuVisible=l),width:"500px"},{footer:n(()=>[o(c,{onClick:a[16]||(a[16]=l=>e.addToMenuVisible=!1)},{default:n(()=>a[29]||(a[29]=[p("取消")])),_:1}),o(c,{type:"primary",onClick:_.confirmAddToMenu},{default:n(()=>a[30]||(a[30]=[p("确定")])),_:1},8,["onClick"])]),default:n(()=>[o(q,{model:e.menuForm,"label-width":"100px"},{default:n(()=>[o(h,{label:"选择日期"},{default:n(()=>[o(Y,{modelValue:e.menuForm.date,"onUpdate:modelValue":a[13]||(a[13]=l=>e.menuForm.date=l),type:"date",placeholder:"选择日期","disabled-date":e.disabledDate},null,8,["modelValue","disabled-date"])]),_:1}),o(h,{label:"选择窗口"},{default:n(()=>[o(F,{modelValue:e.menuForm.windowId,"onUpdate:modelValue":a[14]||(a[14]=l=>e.menuForm.windowId=l),placeholder:"请选择窗口"},{default:n(()=>[(r(!0),k(T,null,I(e.windows,l=>(r(),y(C,{key:l.id,label:l.name,value:l.id},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])]),_:1}),o(h,{label:"初始库存"},{default:n(()=>[o(b,{modelValue:e.menuForm.stock,"onUpdate:modelValue":a[15]||(a[15]=l=>e.menuForm.stock=l),min:0,max:999},null,8,["modelValue"])]),_:1})]),_:1},8,["model"])]),_:1},8,["modelValue"])])}const Me=Z(ie,[["render",ve],["__scopeId","data-v-b1e8dbd8"]]);export{Me as default};