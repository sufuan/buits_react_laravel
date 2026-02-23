import{x as B,J as O,r as p,U as M,j as e,S as W}from"./app-B2X1XaNm.js";import{R as _}from"./quill.snow-DeWFzGli.js";import{t as u}from"./index-pGmX7T_0.js";/* empty css              */import{A as Y}from"./AdminAuthenticatedLayout-DmT34SZ2.js";import{C as K,a as X,b as Z,d as $}from"./card-D0yoLS0z.js";import{L as s}from"./label-C2vcgzi5.js";import{I as f}from"./input-CyZ6UkXs.js";import{B as F}from"./button-P6T1_vgc.js";import{S as x,a as v,b,c as y,d as m}from"./select-DWhZBClm.js";import{S as D}from"./scroll-area-DLlKOtrU.js";import"./alert-Cqo9NthT.js";import{S as ee}from"./breadcrumb-BMrtP8Y-.js";import"./index-xyJr9NLp.js";import"./badge-DQBy8s_m.js";import"./index-CmZkezez.js";import"./clsx-B-dksMZM.js";import"./index-OFpzrNI9.js";import"./createLucideIcon-MQLet3rE.js";import"./index-DT6XUJuj.js";import"./index-Cy2A0VGf.js";import"./chevron-right-SzdI6zVD.js";import"./avatar-ByM5K8x2.js";import"./calendar-CzTV-1KN.js";import"./award-esGGQCAZ.js";import"./index-BdQq_4o_.js";import"./index-BoljUbX9.js";import"./index-D5LfO9Z3.js";import"./index-BGkcqJUm.js";_.Quill;const le=`
  /* Font Family Styles */
  .ql-font-arial { font-family: Arial, sans-serif; }
  .ql-font-times-new-roman { font-family: "Times New Roman", Times, serif; }
  .ql-font-georgia { font-family: Georgia, serif; }
  .ql-font-verdana { font-family: Ver                    <div>
                      <ReactQuill
                        ref={quillRef}
                        theme="snow"
                        value={data.content}
                        onChange={value => setData('content', value)}
                        modules={quillModules}
                        formats={quillFormats}
                        className="bg-white rounded-md h-[300px]"
                        style={{
                          height: '300px',
                        }}
                        placeholder="Enter certificate content..."
                      />
                    </div>rif; }
  .ql-font-helvetica { fon                    <div ref={quillRef}>
                      <ReactQuill
                        theme="snow"
                        value={data.content}
                        onChange={value => setData('content', value)}
                        modules={quillModules}
                        formats={quillFormats}
                        className="bg-white rounded-md h-[300px]"
                        style={{
                          height: '300px',
                        }}
                        placeholder="Enter certificate content..."
                      />
                    </div>vetica, sans-serif; }
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
`;if(typeof document<"u"){const h=document.createElement("style");h.type="text/css",h.textContent=le,document.head.appendChild(h)}function Ee({auth:h,types:w=[],editData:r=null,canAdd:N=!0}){var S,T;const{data:t,setData:n,post:E,processing:R,errors:a}=B({id:(r==null?void 0:r.id)||"",name:(r==null?void 0:r.name)||"",type_id:(r==null?void 0:r.certificate_type_id)||"",layout:(r==null?void 0:r.layout)||"",height:((S=r==null?void 0:r.height)==null?void 0:S.replace("mm",""))||"",width:((T=r==null?void 0:r.width)==null?void 0:T.replace("mm",""))||"",status:(r==null?void 0:r.status)||1,qr_code_student:r!=null&&r.qr_code?JSON.parse(r.qr_code):["member_id"],qr_code_staff:r!=null&&r.qr_code?JSON.parse(r.qr_code):["staff_id"],user_photo_style:(r==null?void 0:r.user_photo_style)??0,user_image_size:(r==null?void 0:r.user_image_size)||"100",qr_image_size:(r==null?void 0:r.qr_image_size)||"100",content:(r==null?void 0:r.content)||"",background_image:null,signature_image:null,logo_image:null}),{flash:c}=O().props;p.useEffect(()=>{c!=null&&c.success&&u.success(c.success),c!=null&&c.error&&u.error(c.error)},[c]);const[A,C]=p.useState(!1),[re,z]=p.useState(!1),[G,g]=p.useState([]);p.useEffect(()=>{const l=w.find(i=>i.id===Number(t.type_id));l?(C(!0),z(!1),Q(l.id)):(C(!0),z(!1),g([]))},[t.type_id,w]);function Q(l){if(!l){g([]);return}axios.post(route("admin.certificate.templates.type"),{type_id:l}).then(i=>{i.data&&i.data.status==="success"?g(i.data.data||[]):(console.error("Failed to fetch tags:",i.data.message),g([]))}).catch(i=>{console.error("Error fetching tags:",i),g([])})}function k(l){const i=l.target.files[0];i&&n(l.target.name,i)}const j=M.useRef(null),[d,V]=p.useState(null);p.useEffect(()=>{j.current&&V(j.current.getEditor())},[]);function P(l){if(d){const i=d.getSelection(!0);if(i)d.insertText(i.index,l),d.setSelection(i.index+l.length);else{const o=d.getLength();d.insertText(o-1,l),d.setSelection(o-1+l.length)}d.focus()}}function I(l){const i=l.target.value;n("layout",i),i==="1"?(n("height","297"),n("width","210")):i==="2"?(n("height","210"),n("width","297")):(n("height",""),n("width",""))}p.useEffect(()=>{},[t.user_photo_style]);function L(l){if(l.preventDefault(),!t.content||t.content.trim()===""||t.content==="<p><br></p>"){u.error("Certificate content is required");return}if(!t.type_id){u.error("Certificate type is required");return}if(!t.name||t.name.trim()===""){u.error("Certificate name is required");return}const i=new FormData;Object.keys(t).forEach(o=>{o==="qr_code_student"||o==="qr_code_staff"?t[o]&&t[o].length>0&&i.append(o,JSON.stringify(t[o])):o==="background_image"||o==="signature_image"||o==="logo_image"?t[o]instanceof File&&i.append(o,t[o]):i.append(o,t[o]===null?"":t[o])}),E(route("admin.certificate.templates.store"),i,{forceFormData:!0,preserveScroll:!0,onSuccess:()=>{u.success("Certificate template saved successfully!"),W.visit(route("admin.certificate.templates.index"))},onError:o=>{console.error("Form submission errors:",o),u.error("Failed to save template. Please check the form and try again.")}})}function q(l){return l?typeof l=="string"?l:l.name||"":""}const H={toolbar:[[{font:["arial","times-new-roman","georgia","verdana","helvetica","garamond","tahoma","courier-new","pinyon-script"]}],[{size:["12","14","18","24","36"]}],["bold","italic","underline","strike"],[{color:[]},{background:[]}],[{list:"ordered"},{list:"bullet"}],[{align:[]}],["clean"]],clipboard:{matchVisual:!1},keyboard:{bindings:{tab:!1,"tab shift":!1}}},U=["font","size","bold","italic","underline","strike","color","background","list","bullet","align"];if(typeof window<"u"){const l=_.Quill,i=l.import("formats/font");i.whitelist=["arial","times-new-roman","georgia","verdana","helvetica","garamond","tahoma","courier-new","pinyon-script"],l.register(i,!0)}return e.jsx(Y,{user:h.user,children:e.jsx("div",{className:"container mx-auto py-6 px-4",children:e.jsxs(K,{children:[e.jsxs(X,{children:[e.jsx(Z,{className:"text-2xl font-bold",children:r?"Edit Certificate Template":"Create Certificate Template"}),e.jsx(ee,{className:"my-4"})]}),e.jsx($,{children:e.jsxs("form",{onSubmit:L,encType:"multipart/form-data",id:"certificate_form",children:[e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsxs(s,{htmlFor:"name",children:["Name ",e.jsx("span",{className:"text-red-500",children:"*"})]}),e.jsx(f,{id:"name",type:"text",name:"name",value:t.name,onChange:l=>n("name",l.target.value),className:a.name?"border-red-500":"",placeholder:"Certificate Name",autoComplete:"off"}),a.name&&e.jsx("p",{className:"text-red-500 text-sm",children:a.name})]}),e.jsx("input",{type:"hidden",name:"id",value:t.id}),e.jsxs("div",{className:"space-y-2",children:[e.jsxs(s,{htmlFor:"type_id",children:["Certificate Type ",e.jsx("span",{className:"text-red-500",children:"*"})]}),e.jsxs(x,{value:t.type_id,onValueChange:l=>n("type_id",l),children:[e.jsx(v,{className:a.type_id?"border-red-500":"",children:e.jsx(b,{placeholder:"Select Certificate Type"})}),e.jsx(y,{children:w.map(l=>e.jsx(m,{value:l.id.toString(),children:l.name},l.id))})]}),a.type_id&&e.jsx("p",{className:"text-red-500 text-sm",children:a.type_id})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsxs(s,{htmlFor:"layout",children:["Page Layout ",e.jsx("span",{className:"text-red-500",children:"*"})]}),e.jsxs(x,{value:t.layout,onValueChange:l=>I({target:{value:l}}),children:[e.jsx(v,{className:a.layout?"border-red-500":"",children:e.jsx(b,{placeholder:"Select Page Layout"})}),e.jsxs(y,{children:[e.jsx(m,{value:"1",children:"A4 (Portrait)"}),e.jsx(m,{value:"2",children:"A4 (Landscape)"}),e.jsx(m,{value:"3",children:"Custom"})]})]}),a.layout&&e.jsx("p",{className:"text-red-500 text-sm",children:a.layout})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsxs(s,{htmlFor:"height",children:["Height (mm) ",e.jsx("span",{className:"text-red-500",children:"*"})]}),e.jsx(f,{id:"height",type:"text",name:"height",value:t.height,onChange:l=>n("height",l.target.value),className:a.height?"border-red-500":"",placeholder:"Enter height",autoComplete:"off"}),a.height&&e.jsx("p",{className:"text-red-500 text-sm",children:a.height})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsxs(s,{htmlFor:"width",children:["Width (mm) ",e.jsx("span",{className:"text-red-500",children:"*"})]}),e.jsx(f,{id:"width",type:"text",name:"width",value:t.width,onChange:l=>n("width",l.target.value),className:a.width?"border-red-500":"",placeholder:"Enter width",autoComplete:"off"}),a.width&&e.jsx("p",{className:"text-red-500 text-sm",children:a.width})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsxs(s,{htmlFor:"status",children:["Status ",e.jsx("span",{className:"text-red-500",children:"*"})]}),e.jsxs(x,{value:t.status.toString(),onValueChange:l=>n("status",l),children:[e.jsx(v,{className:a.status?"border-red-500":"",children:e.jsx(b,{placeholder:"Select Status"})}),e.jsxs(y,{children:[e.jsx(m,{value:"1",children:"Active"}),e.jsx(m,{value:"2",children:"Inactive"})]})]}),a.status&&e.jsx("p",{className:"text-red-500 text-sm",children:a.status})]})]}),A&&e.jsxs("div",{className:"mt-6",children:[e.jsxs(s,{children:["QR Code Text ",e.jsx("span",{className:"text-red-500",children:"*"})]}),e.jsx(D,{className:"h-[200px] w-full border rounded-md p-4",children:e.jsx("div",{className:"space-y-2",children:["member_id","created_at","certificate_number","link"].map(l=>e.jsxs("label",{className:"flex items-center space-x-2",children:[e.jsx("input",{type:"checkbox",checked:t.qr_code_student.includes(l),onChange:i=>{const o=i.target.checked?[...t.qr_code_student,l]:t.qr_code_student.filter(J=>J!==l);n("qr_code_student",o)},className:"rounded border-gray-300"}),e.jsx("span",{className:"capitalize",children:l==="created_at"?"Joining Date":l.replace(/_/g," ")})]},l))})}),a.qr_code_student&&e.jsx("p",{className:"text-red-500 text-sm mt-1",children:a.qr_code_student})]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(s,{htmlFor:"user_photo_style",children:"User Image Shape"}),e.jsxs(x,{value:t.user_photo_style.toString(),onValueChange:l=>{const i=Number(l);n("user_photo_style",i),i===0&&n("user_image_size","100")},children:[e.jsx(v,{children:e.jsx(b,{placeholder:"Select photo style",children:t.user_photo_style===0?"No Photo":t.user_photo_style===1?"Circle":"Square"})}),e.jsxs(y,{children:[e.jsx(m,{value:"0",children:"No Photo"}),e.jsx(m,{value:"1",children:"Circle"}),e.jsx(m,{value:"2",children:"Square"})]})]})]}),Number(t.user_photo_style)>0&&e.jsxs("div",{className:"space-y-2",children:[e.jsx(s,{htmlFor:"user_image_size",children:"User Image Size (px)"}),e.jsx(f,{type:"number",value:t.user_image_size,onChange:l=>n("user_image_size",l.target.value),min:"0",placeholder:"Enter user image size"})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(s,{htmlFor:"qr_image_size",children:"QR Image Size (px)"}),e.jsx(f,{type:"number",value:t.qr_image_size,onChange:l=>n("qr_image_size",l.target.value),min:"100",placeholder:"Enter QR code image size (minimum 100)"})]})]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(s,{children:"Background Image"}),e.jsx(f,{type:"file",name:"background_image",onChange:k,accept:"image/*",className:"cursor-pointer"}),q(t.background_image)&&e.jsx("p",{className:"text-sm text-gray-500",children:q(t.background_image)})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(s,{children:"Signature Image"}),e.jsx(f,{type:"file",name:"signature_image",onChange:k,accept:"image/*",className:"cursor-pointer"}),q(t.signature_image)&&e.jsx("p",{className:"text-sm text-gray-500",children:q(t.signature_image)})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(s,{children:"Logo Image"}),e.jsx(f,{type:"file",name:"logo_image",onChange:k,accept:"image/*",className:"cursor-pointer"}),q(t.logo_image)&&e.jsx("p",{className:"text-sm text-gray-500",children:q(t.logo_image)})]})]}),e.jsxs("div",{className:"mt-6 space-y-2",children:[e.jsxs(s,{children:["Certificate Body ",e.jsx("span",{className:"text-red-500",children:"*"})]}),e.jsxs("div",{className:"bg-gray-50 p-4 rounded-md",children:[e.jsx("div",{className:"flex flex-wrap gap-2 mb-4",children:G.map(l=>e.jsx(F,{type:"button",variant:"outline",size:"sm",onClick:()=>P(l),children:l},l))}),e.jsx("div",{className:"quill-editor-container",style:{minHeight:"400px"},children:e.jsx(_,{ref:j,theme:"snow",value:t.content,onChange:l=>n("content",l),modules:H,formats:U,className:"bg-white rounded-md h-[300px]",style:{height:"300px"},placeholder:"Enter certificate content..."})}),e.jsx("style",{children:`
                    @import url('https://fonts.googleapis.com/css2?family=Pinyon+Script&display=swap');
                    .quill-editor-container .ql-container {
                      height: calc(300px - 42px); /* 42px is the toolbar height */
                      font-size: 16px;
                      font-family: Arial, sans-serif;
                    }
                    .ql-font-arial { font-family: Arial, sans-serif; }
                    .ql-font-times-new-roman { font-family: 'Times New Roman', Times, serif; }
                    .ql-font-georgia { font-family: Georgia, serif; }
                    .ql-font-verdana { font-family: Verdana, Geneva, sans-serif; }
                    .ql-font-helvetica { font-family: Helvetica, Arial, sans-serif; }
                    .ql-font-garamond { font-family: Garamond, serif; }
                    .ql-font-tahoma { font-family: Tahoma, Geneva, sans-serif; }
                    .ql-font-courier-new { font-family: 'Courier New', Courier, monospace; }
                    
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

                    .quill-editor-container .ql-toolbar {
                      border-top-left-radius: 0.375rem;
                      border-top-right-radius: 0.375rem;
                      background-color: #f9fafb;
                      border-color: #e5e7eb;
                    }
                    .quill-editor-container .ql-container {
                      border-bottom-left-radius: 0.375rem;
                      border-bottom-right-radius: 0.375rem;
                      border-color: #e5e7eb;
                    }
                    .quill-editor-container .ql-editor {
                      min-height: 100%;
                      font-size: 16px;
                      line-height: 1.5;
                      padding: 1rem;
                    }
                    .quill-editor-container .ql-snow .ql-picker.ql-size .ql-picker-label::before,
                    .quill-editor-container .ql-snow .ql-picker.ql-size .ql-picker-item::before {
                      content: attr(data-value) !important;
                    }
                    .quill-editor-container .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="12"]::before,
                    .quill-editor-container .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="12"]::before {
                      content: '12px' !important;
                    }
                    .quill-editor-container .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="14"]::before,
                    .quill-editor-container .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="14"]::before {
                      content: '14px' !important;
                    }
                    .quill-editor-container .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="18"]::before,
                    .quill-editor-container .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="18"]::before {
                      content: '18px' !important;
                    }
                    .quill-editor-container .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="24"]::before,
                    .quill-editor-container .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="24"]::before {
                      content: '24px' !important;
                    }
                    .quill-editor-container .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="36"]::before,
                    .quill-editor-container .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="36"]::before {
                      content: '36px' !important;
                    }
                    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="12"]::before { font-size: 12px; }
                    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="14"]::before { font-size: 14px; }
                    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="18"]::before { font-size: 18px; }
                    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="24"]::before { font-size: 24px; }
                    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="36"]::before { font-size: 36px; }
                    .ql-snow .ql-size-12 { font-size: 12px; }
                    .ql-snow .ql-size-14 { font-size: 14px; }
                    .ql-snow .ql-size-18 { font-size: 18px; }
                    .ql-snow .ql-size-24 { font-size: 24px; }
                    .ql-snow .ql-size-36 { font-size: 36px; }
                  `})]}),a.content&&e.jsx("p",{className:"text-red-500 text-sm",children:a.content})]}),e.jsx("div",{className:"mt-6",children:e.jsx(F,{type:"submit",className:"w-full md:w-auto",disabled:!N||R,title:N?"":"You don't have permission to add",children:r?"Update Template":"Create Template"})})]})})]})})})}export{Ee as default};
