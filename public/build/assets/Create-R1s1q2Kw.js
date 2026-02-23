import{J as I,r as m,x as P,U as G,j as e}from"./app-ur8gLKMw.js";import{t as w}from"./index-Bp2sKc1x.js";import{R as U}from"./quill.snow-DN3ISbi6.js";/* empty css              */import{A as H}from"./AdminAuthenticatedLayout-UIYhMvKq.js";import{C as D,a as J,b as B,d as O}from"./card-BZlpZjXg.js";import{L as s}from"./label-ZK0uxj3h.js";import{I as d}from"./input-ULwqptrg.js";import{B as p}from"./button-ChUzZ8zb.js";import{S as g,a as x,b as q,c as j,d as u}from"./select-DGUS3pid.js";import{S as M}from"./scroll-area-DUGIG96I.js";import"./alert-Z7vwZjXY.js";import"./breadcrumb-hlfmIue3.js";import"./index-BwxDyt-w.js";import"./badge-rf3gfiDh.js";import"./index-CkuwFcTu.js";import"./clsx-B-dksMZM.js";import"./index-BA6J_WX0.js";import"./createLucideIcon-DyPvElEa.js";import"./index-BWAIAPHE.js";import"./index-D7P83s25.js";import"./chevron-right-BdTzXGzL.js";import"./avatar-BCaHodwN.js";import"./calendar-46kMZv84.js";import"./award-BrO-inEt.js";import"./index-BdQq_4o_.js";import"./index-K7ErFWWW.js";import"./index-8qH9zaOg.js";import"./index-oJ4mOwLq.js";const W=`
  /* Font Family Styles */
  .ql-font-arial { font-family: Arial, sans-serif; }
  .ql-font-times-new-roman { font-family: "Times New Roman", Times, serif; }
  .ql-font-georgia { font-family: Georgia, serif; }
  .ql-font-verdana { font-family: Verdana, sans-serif; }
  .ql-font-helvetica { font-family: Helvetica, sans-serif; }
  .ql-font-garamond { font-family: Garamond, serif; }
  .ql-font-tahoma { font-family: Tahoma, sans-serif; }
  .ql-font-courier-new { font-family: "Courier New", Courier, monospace; }
  .ql-font-pinyon-script { font-family: "Pinyon Script", cursive; }

  /* Font picker dropdown styling */
  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="arial"]::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="arial"]::before {
    content: 'Arial';
    font-family: 'Arial';
  }
  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="times-new-roman"]::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="times-new-roman"]::before {
    content: 'Times New Roman';
    font-family: 'Times New Roman';
  }
  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="georgia"]::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="georgia"]::before {
    content: 'Georgia';
    font-family: 'Georgia';
  }
  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="verdana"]::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="verdana"]::before {
    content: 'Verdana';
    font-family: 'Verdana';
  }
  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="helvetica"]::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="helvetica"]::before {
    content: 'Helvetica';
    font-family: 'Helvetica';
  }
  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="garamond"]::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="garamond"]::before {
    content: 'Garamond';
    font-family: 'Garamond';
  }
  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="tahoma"]::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="tahoma"]::before {
    content: 'Tahoma';
    font-family: 'Tahoma';
  }
  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="courier-new"]::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="courier-new"]::before {
    content: 'Courier New';
    font-family: 'Courier New';
  }
  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="pinyon-script"]::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="pinyon-script"]::before {
    content: 'Pinyon Script';
    font-family: 'Pinyon Script', cursive;
  }

  /* Editor content styling */
  .ql-editor {
    min-height: 300px;
    font-size: 14px;
  }

  /* Font picker dropdown improvements */
  .ql-snow .ql-picker.ql-font {
    width: 150px;
  }
  .ql-snow .ql-picker.ql-font .ql-picker-options {
    width: 150px;
  }
`;if(typeof document<"u"){const f=document.createElement("style");f.type="text/css",f.textContent=W,document.head.appendChild(f)}function Ce({auth:f,types:_=[],canAdd:K=!0}){const{flash:o}=I().props;m.useEffect(()=>{o!=null&&o.success&&w.success(o.success),o!=null&&o.error&&w.error(o.error)},[o]);const{data:a,setData:r,post:C,processing:b,errors:i}=P({id:"",name:"",type_id:"",layout:"",height:"",width:"",status:1,status:1,qr_code_student:["member_id"],qr_code_staff:["staff_id"],user_photo_style:0,user_image_size:"100",qr_image_size:"100",content:"",background_image:null,signature_image:null,logo_image:null}),[N,y]=m.useState(!1),[X,v]=m.useState(!1),[S,k]=m.useState([]),h=G.useRef(null),[c,T]=m.useState(null);m.useEffect(()=>{h.current&&T(h.current.getEditor())},[]);function z(t){r("type_id",t);const l=_.find(n=>n.id==t);l?(y(!0),v(!1),R(l.id)):(y(!1),v(!1),k([]))}function R(t){k({1:["{{student_name}}","{{course_name}}","{{certificate_date}}","{{admission_no}}","{{roll_no}}"],2:["{{staff_name}}","{{designation}}","{{certificate_date}}","{{staff_id}}","{{joining_date}}"]}[t]||["{{default_tag}}"])}function F(t){if(c){const l=c.getSelection(!0);if(l)c.insertText(l.index,t),c.setSelection(l.index+t.length);else{const n=c.getLength();c.insertText(n-1,t),c.setSelection(n-1+t.length)}c.focus()}}function E(t){r("layout",t),t==="1"?r(l=>({...l,width:"210",height:"297"})):t==="2"&&r(l=>({...l,width:"297",height:"210"}))}m.useEffect(()=>{},[a.user_photo_style]);function V(t){t.preventDefault(),console.log("Form data before submission:",a),console.log("Content field specifically:",a.content),console.log("Content length:",a.content?a.content.length:"undefined");const l={...a,qr_code_student:JSON.stringify(a.qr_code_student),qr_code_staff:JSON.stringify(a.qr_code_staff),background_image:null,signature_image:null,logo_image:null};console.log("Submit data:",l),C(route("admin.certificate.templates.store"),{data:l,preserveScroll:!0,onSuccess:n=>{console.log("Template created successfully",n),console.log("Current URL after success:",window.location.href)},onError:n=>{console.error("Validation errors:",n)},onFinish:()=>{console.log("Request finished")}})}const A={toolbar:[[{font:["arial","times-new-roman","georgia","verdana","helvetica","garamond","tahoma","courier-new","pinyon-script"]}],[{size:["small",!1,"large","huge"]}],["bold","italic","underline","strike"],[{color:[]},{background:[]}],[{script:"sub"},{script:"super"}],[{header:1},{header:2},"blockquote"],[{list:"ordered"},{list:"bullet"},{indent:"-1"},{indent:"+1"}],[{direction:"rtl"},{align:[]}],["link","image"],["clean"]],clipboard:{matchVisual:!1},keyboard:{bindings:{tab:!1,"tab shift":!1}}},L=["font","size","bold","italic","underline","strike","color","background","script","header","blockquote","code-block","list","bullet","indent","direction","align","link","image","video"];return e.jsx(H,{user:f.user,header:e.jsx("h2",{className:"font-semibold text-xl text-gray-800 leading-tight",children:"Create Certificate Template"}),children:e.jsx("div",{className:"py-12",children:e.jsx("div",{className:"max-w-7xl mx-auto sm:px-6 lg:px-8",children:e.jsxs(D,{children:[e.jsx(J,{children:e.jsx(B,{children:"Create New Certificate Template"})}),e.jsx(O,{children:e.jsxs("form",{onSubmit:V,className:"space-y-6",children:[e.jsxs("div",{children:[e.jsxs(s,{htmlFor:"name",children:["Template Name ",e.jsx("span",{className:"text-red-500",children:"*"})]}),e.jsx(d,{id:"name",type:"text",value:a.name,onChange:t=>r("name",t.target.value),className:i.name?"border-red-500":""}),i.name&&e.jsx("p",{className:"text-red-500 text-sm mt-1",children:i.name})]}),e.jsxs("div",{children:[e.jsxs(s,{children:["Certificate Type ",e.jsx("span",{className:"text-red-500",children:"*"})]}),e.jsxs(g,{onValueChange:z,children:[e.jsx(x,{className:i.type_id?"border-red-500":"",children:e.jsx(q,{placeholder:"Select certificate type"})}),e.jsx(j,{children:_.map(t=>e.jsx(u,{value:t.id.toString(),children:t.name},t.id))})]}),i.type_id&&e.jsx("p",{className:"text-red-500 text-sm mt-1",children:i.type_id})]}),e.jsxs("div",{children:[e.jsxs(s,{children:["Layout ",e.jsx("span",{className:"text-red-500",children:"*"})]}),e.jsxs(g,{onValueChange:E,children:[e.jsx(x,{className:i.layout?"border-red-500":"",children:e.jsx(q,{placeholder:"Select layout"})}),e.jsxs(j,{children:[e.jsx(u,{value:"1",children:"A4 Portrait"}),e.jsx(u,{value:"2",children:"A4 Landscape"}),e.jsx(u,{value:"3",children:"Custom"})]})]}),i.layout&&e.jsx("p",{className:"text-red-500 text-sm mt-1",children:i.layout})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsxs(s,{htmlFor:"width",children:["Width (mm) ",e.jsx("span",{className:"text-red-500",children:"*"})]}),e.jsx(d,{id:"width",type:"number",value:a.width,onChange:t=>r("width",t.target.value),className:i.width?"border-red-500":""}),i.width&&e.jsx("p",{className:"text-red-500 text-sm mt-1",children:i.width})]}),e.jsxs("div",{children:[e.jsxs(s,{htmlFor:"height",children:["Height (mm) ",e.jsx("span",{className:"text-red-500",children:"*"})]}),e.jsx(d,{id:"height",type:"number",value:a.height,onChange:t=>r("height",t.target.value),className:i.height?"border-red-500":""}),i.height&&e.jsx("p",{className:"text-red-500 text-sm mt-1",children:i.height})]})]}),e.jsxs("div",{children:[e.jsx(s,{children:"User Photo Style"}),e.jsxs(g,{defaultValue:"0",value:a.user_photo_style.toString(),onValueChange:t=>r("user_photo_style",Number(t)),children:[e.jsx(x,{children:e.jsx(q,{children:"No Photo"})}),e.jsxs(j,{children:[e.jsx(u,{value:"0",children:"No Photo"}),e.jsx(u,{value:"1",children:"Circle"}),e.jsx(u,{value:"2",children:"Square"})]})]})]}),e.jsxs("div",{children:[e.jsx(s,{htmlFor:"user_image_size",children:"User Image Size (px)"}),e.jsx(d,{id:"user_image_size",type:"number",value:a.user_image_size,onChange:t=>r("user_image_size",t.target.value),disabled:a.user_photo_style===0})]}),e.jsxs("div",{children:[e.jsx(s,{htmlFor:"qr_image_size",children:"QR Code Size (px)"}),e.jsx(d,{id:"qr_image_size",type:"number",value:a.qr_image_size,onChange:t=>r("qr_image_size",t.target.value),min:"100"})]}),N&&e.jsxs("div",{className:"mt-6",children:[e.jsxs(s,{children:["QR Code Text ",e.jsx("span",{className:"text-red-500",children:"*"})]}),e.jsx(M,{className:"h-[200px] w-full border rounded-md p-4",children:e.jsx("div",{className:"space-y-2",children:["member_id","created_at","certificate_number","link"].map(t=>e.jsxs("label",{className:"flex items-center space-x-2",children:[e.jsx("input",{type:"checkbox",checked:a.qr_code_student.includes(t),onChange:l=>{const n=l.target.checked?[...a.qr_code_student,t]:a.qr_code_student.filter(Q=>Q!==t);r("qr_code_student",n)},className:"rounded border-gray-300"}),e.jsx("span",{className:"capitalize",children:t==="created_at"?"Joining Date":t.replace(/_/g," ")})]},t))})})]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-4",children:[e.jsxs("div",{children:[e.jsx(s,{htmlFor:"background_image",children:"Background Image"}),e.jsx(d,{id:"background_image",type:"file",accept:"image/*",onChange:t=>r("background_image",t.target.files[0])})]}),e.jsxs("div",{children:[e.jsx(s,{htmlFor:"logo_image",children:"Logo Image"}),e.jsx(d,{id:"logo_image",type:"file",accept:"image/*",onChange:t=>r("logo_image",t.target.files[0])})]}),e.jsxs("div",{children:[e.jsx(s,{htmlFor:"signature_image",children:"Signature Image"}),e.jsx(d,{id:"signature_image",type:"file",accept:"image/*",onChange:t=>r("signature_image",t.target.files[0])})]})]}),e.jsxs("div",{children:[e.jsxs(s,{htmlFor:"content",children:["Content ",e.jsx("span",{className:"text-red-500",children:"*"})]}),e.jsxs("div",{className:"bg-gray-50 p-4 rounded-md",children:[e.jsx("div",{className:"flex flex-wrap gap-2 mb-4",children:S.map(t=>e.jsx(p,{type:"button",variant:"outline",size:"sm",onClick:()=>F(t),children:t},t))}),e.jsx(U,{ref:h,theme:"snow",value:a.content,onChange:t=>{console.log("ReactQuill onChange:",t),r("content",t)},modules:A,formats:L,className:i.content?"border-red-500":"",placeholder:"Enter certificate content..."})]}),i.content&&e.jsx("p",{className:"text-red-500 text-sm mt-1",children:i.content})]}),e.jsxs("div",{className:"flex justify-end space-x-4",children:[e.jsx(p,{type:"button",variant:"outline",onClick:()=>window.history.back(),children:"Cancel"}),e.jsx(p,{type:"submit",disabled:b,children:b?"Creating...":"Create Template"})]})]})})]})})})})}export{Ce as default};
