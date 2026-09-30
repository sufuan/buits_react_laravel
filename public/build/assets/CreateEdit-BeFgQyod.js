import{x as B,J as O,r as d,a as M,R as W,j as e,S as F}from"./app-DhUIDkFA.js";import{R as j}from"./quill.snow-BhhYVbg2.js";import{t as f}from"./index-DnHaLvM7.js";/* empty css              */import{A as Y}from"./AdminAuthenticatedLayout-Cpxk5fm3.js";import{C as K,a as X,b as Z,d as $}from"./card-9IZhbV4O.js";import{L as n}from"./label-CBTYW6qC.js";import{I as p}from"./input-Dabu79MU.js";import{B as R}from"./button-BoU6Sicx.js";import{S as x,a as v,b as y,c as b,d as c}from"./select-DJkhhZ_E.js";import{S as D}from"./scroll-area-C5bf59UR.js";import"./alert-rt5feSBl.js";import{S as ee}from"./breadcrumb-TevhgjrP.js";import"./isObjectLike-BHE1J5i5.js";import"./index-hQOcoTH2.js";import"./badge-XJKsfo9Y.js";import"./index-N2W_ob3r.js";import"./clsx-B-dksMZM.js";import"./index-Ccmxa2v1.js";import"./index-BBI1I087.js";import"./index-CafPuv8P.js";import"./index-D0bDekGs.js";import"./createLucideIcon-12YFJf9k.js";import"./chevron-right-Cx-NyAz_.js";import"./avatar-DiFKgprN.js";import"./shield-DpXw0IhG.js";import"./shield-check-YSF92Wpk.js";import"./calendar-MfgrhRge.js";import"./award-DVzfO9ee.js";import"./index-BdQq_4o_.js";import"./index-C4AUs0za.js";import"./index-Dh6EDD2b.js";import"./index-DtwRTA5z.js";j.Quill;const le=`
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
`;if(typeof document<"u"){const h=document.createElement("style");h.type="text/css",h.textContent=le,document.head.appendChild(h)}function Ve({auth:h,types:_=[],editData:i=null,canAdd:N=!0}){var S,T;const{data:t,setData:o,post:te,processing:E,errors:a}=B({id:(i==null?void 0:i.id)||"",name:(i==null?void 0:i.name)||"",type_id:(i==null?void 0:i.certificate_type_id)||"",layout:(i==null?void 0:i.layout)||"",height:((S=i==null?void 0:i.height)==null?void 0:S.replace("mm",""))||"",width:((T=i==null?void 0:i.width)==null?void 0:T.replace("mm",""))||"",status:(i==null?void 0:i.status)||1,qr_code_student:i!=null&&i.qr_code?JSON.parse(i.qr_code):["member_id"],qr_code_staff:i!=null&&i.qr_code?JSON.parse(i.qr_code):["staff_id"],user_photo_style:(i==null?void 0:i.user_photo_style)??0,user_image_size:(i==null?void 0:i.user_image_size)||"100",qr_image_size:(i==null?void 0:i.qr_image_size)||"100",content:(i==null?void 0:i.content)||"",background_image:null,signature_image:null,logo_image:null}),{flash:s}=O().props;d.useEffect(()=>{s!=null&&s.success&&f.success(s.success),s!=null&&s.error&&f.error(s.error)},[s]);const[A,z]=d.useState(!1),[re,C]=d.useState(!1),[G,g]=d.useState([]);d.useEffect(()=>{const l=_.find(r=>r.id===Number(t.type_id));l?(z(!0),C(!1),Q(l.id)):(z(!0),C(!1),g([]))},[t.type_id,_]);function Q(l){if(!l){g([]);return}M.post(route("admin.certificate.templates.type"),{type_id:l}).then(r=>{r.data&&r.data.status==="success"?g(r.data.data||[]):(console.error("Failed to fetch tags:",r.data.message),g([]))}).catch(r=>{console.error("Error fetching tags:",r),g([])})}function k(l){const r=l.target.files[0];r&&o(l.target.name,r)}const w=W.useRef(null),[m,V]=d.useState(null);d.useEffect(()=>{w.current&&V(w.current.getEditor())},[]);function P(l){if(m){const r=m.getSelection(!0);if(r)m.insertText(r.index,l),m.setSelection(r.index+l.length);else{const q=m.getLength();m.insertText(q-1,l),m.setSelection(q-1+l.length)}m.focus()}}function I(l){const r=l.target.value;o("layout",r),r==="1"?(o("height","297"),o("width","210")):r==="2"?(o("height","210"),o("width","297")):(o("height",""),o("width",""))}d.useEffect(()=>{},[t.user_photo_style]);function L(l){if(l.preventDefault(),!t.content||t.content.trim()===""||t.content==="<p><br></p>"){f.error("Certificate content is required");return}if(!t.type_id){f.error("Certificate type is required");return}if(!t.name||t.name.trim()===""){f.error("Certificate name is required");return}const r=new FormData;r.append("id",t.id||""),r.append("name",t.name),r.append("type_id",t.type_id),r.append("layout",t.layout),r.append("height",t.height),r.append("width",t.width),r.append("status",t.status),r.append("user_photo_style",t.user_photo_style),r.append("user_image_size",t.user_image_size||""),r.append("qr_image_size",t.qr_image_size),r.append("content",t.content),t.qr_code_student&&t.qr_code_student.length>0&&r.append("qr_code_student",JSON.stringify(t.qr_code_student)),t.qr_code_staff&&t.qr_code_staff.length>0&&r.append("qr_code_staff",JSON.stringify(t.qr_code_staff)),t.background_image instanceof File&&r.append("background_image",t.background_image),t.signature_image instanceof File&&r.append("signature_image",t.signature_image),t.logo_image instanceof File&&r.append("logo_image",t.logo_image),F.post(route("admin.certificate.templates.store"),r,{preserveScroll:!0,onSuccess:()=>{f.success("Certificate template saved successfully!"),F.visit(route("admin.certificate.templates.index"))},onError:q=>{console.error("Form submission errors:",q),f.error("Failed to save template. Please check the form and try again.")}})}function u(l){return l?typeof l=="string"?l:l.name||"":""}const H={toolbar:[[{font:["arial","times-new-roman","georgia","verdana","helvetica","garamond","tahoma","courier-new","pinyon-script"]}],[{size:["12","14","18","24","36"]}],["bold","italic","underline","strike"],[{color:[]},{background:[]}],[{list:"ordered"},{list:"bullet"}],[{align:[]}],["clean"]],clipboard:{matchVisual:!1},keyboard:{bindings:{tab:!1,"tab shift":!1}}},J=["font","size","bold","italic","underline","strike","color","background","list","bullet","align"];if(typeof window<"u"){const l=j.Quill,r=l.import("formats/font");r.whitelist=["arial","times-new-roman","georgia","verdana","helvetica","garamond","tahoma","courier-new","pinyon-script"],l.register(r,!0)}return e.jsx(Y,{user:h.user,children:e.jsx("div",{className:"container mx-auto py-6 px-4",children:e.jsxs(K,{children:[e.jsxs(X,{children:[e.jsx(Z,{className:"text-2xl font-bold",children:i?"Edit Certificate Template":"Create Certificate Template"}),e.jsx(ee,{className:"my-4"})]}),e.jsx($,{children:e.jsxs("form",{onSubmit:L,encType:"multipart/form-data",id:"certificate_form",children:[e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsxs(n,{htmlFor:"name",children:["Name ",e.jsx("span",{className:"text-red-500",children:"*"})]}),e.jsx(p,{id:"name",type:"text",name:"name",value:t.name,onChange:l=>o("name",l.target.value),className:a.name?"border-red-500":"",placeholder:"Certificate Name",autoComplete:"off"}),a.name&&e.jsx("p",{className:"text-red-500 text-sm",children:a.name})]}),e.jsx("input",{type:"hidden",name:"id",value:t.id}),e.jsxs("div",{className:"space-y-2",children:[e.jsxs(n,{htmlFor:"type_id",children:["Certificate Type ",e.jsx("span",{className:"text-red-500",children:"*"})]}),e.jsxs(x,{value:t.type_id,onValueChange:l=>o("type_id",l),children:[e.jsx(v,{className:a.type_id?"border-red-500":"",children:e.jsx(y,{placeholder:"Select Certificate Type"})}),e.jsx(b,{children:_.map(l=>e.jsx(c,{value:l.id.toString(),children:l.name},l.id))})]}),a.type_id&&e.jsx("p",{className:"text-red-500 text-sm",children:a.type_id})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsxs(n,{htmlFor:"layout",children:["Page Layout ",e.jsx("span",{className:"text-red-500",children:"*"})]}),e.jsxs(x,{value:t.layout,onValueChange:l=>I({target:{value:l}}),children:[e.jsx(v,{className:a.layout?"border-red-500":"",children:e.jsx(y,{placeholder:"Select Page Layout"})}),e.jsxs(b,{children:[e.jsx(c,{value:"1",children:"A4 (Portrait)"}),e.jsx(c,{value:"2",children:"A4 (Landscape)"}),e.jsx(c,{value:"3",children:"Custom"})]})]}),a.layout&&e.jsx("p",{className:"text-red-500 text-sm",children:a.layout})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsxs(n,{htmlFor:"height",children:["Height (mm) ",e.jsx("span",{className:"text-red-500",children:"*"})]}),e.jsx(p,{id:"height",type:"text",name:"height",value:t.height,onChange:l=>o("height",l.target.value),className:a.height?"border-red-500":"",placeholder:"Enter height",autoComplete:"off"}),a.height&&e.jsx("p",{className:"text-red-500 text-sm",children:a.height})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsxs(n,{htmlFor:"width",children:["Width (mm) ",e.jsx("span",{className:"text-red-500",children:"*"})]}),e.jsx(p,{id:"width",type:"text",name:"width",value:t.width,onChange:l=>o("width",l.target.value),className:a.width?"border-red-500":"",placeholder:"Enter width",autoComplete:"off"}),a.width&&e.jsx("p",{className:"text-red-500 text-sm",children:a.width})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsxs(n,{htmlFor:"status",children:["Status ",e.jsx("span",{className:"text-red-500",children:"*"})]}),e.jsxs(x,{value:t.status.toString(),onValueChange:l=>o("status",l),children:[e.jsx(v,{className:a.status?"border-red-500":"",children:e.jsx(y,{placeholder:"Select Status"})}),e.jsxs(b,{children:[e.jsx(c,{value:"1",children:"Active"}),e.jsx(c,{value:"2",children:"Inactive"})]})]}),a.status&&e.jsx("p",{className:"text-red-500 text-sm",children:a.status})]})]}),A&&e.jsxs("div",{className:"mt-6",children:[e.jsxs(n,{children:["QR Code Text ",e.jsx("span",{className:"text-red-500",children:"*"})]}),e.jsx(D,{className:"h-[200px] w-full border rounded-md p-4",children:e.jsx("div",{className:"space-y-2",children:["member_id","created_at","certificate_number","link"].map(l=>e.jsxs("label",{className:"flex items-center space-x-2",children:[e.jsx("input",{type:"checkbox",checked:t.qr_code_student.includes(l),onChange:r=>{const q=r.target.checked?[...t.qr_code_student,l]:t.qr_code_student.filter(U=>U!==l);o("qr_code_student",q)},className:"rounded border-gray-300"}),e.jsx("span",{className:"capitalize",children:l==="created_at"?"Joining Date":l.replace(/_/g," ")})]},l))})}),a.qr_code_student&&e.jsx("p",{className:"text-red-500 text-sm mt-1",children:a.qr_code_student})]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(n,{htmlFor:"user_photo_style",children:"User Image Shape"}),e.jsxs(x,{value:t.user_photo_style.toString(),onValueChange:l=>{const r=Number(l);o("user_photo_style",r),r===0&&o("user_image_size","100")},children:[e.jsx(v,{children:e.jsx(y,{placeholder:"Select photo style",children:t.user_photo_style===0?"No Photo":t.user_photo_style===1?"Circle":"Square"})}),e.jsxs(b,{children:[e.jsx(c,{value:"0",children:"No Photo"}),e.jsx(c,{value:"1",children:"Circle"}),e.jsx(c,{value:"2",children:"Square"})]})]})]}),Number(t.user_photo_style)>0&&e.jsxs("div",{className:"space-y-2",children:[e.jsx(n,{htmlFor:"user_image_size",children:"User Image Size (px)"}),e.jsx(p,{type:"number",value:t.user_image_size,onChange:l=>o("user_image_size",l.target.value),min:"0",placeholder:"Enter user image size"})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(n,{htmlFor:"qr_image_size",children:"QR Image Size (px)"}),e.jsx(p,{type:"number",value:t.qr_image_size,onChange:l=>o("qr_image_size",l.target.value),min:"100",placeholder:"Enter QR code image size (minimum 100)"})]})]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(n,{children:"Background Image"}),e.jsx(p,{type:"file",name:"background_image",onChange:k,accept:"image/*",className:"cursor-pointer"}),u(t.background_image)&&e.jsx("p",{className:"text-sm text-gray-500",children:u(t.background_image)})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(n,{children:"Signature Image"}),e.jsx(p,{type:"file",name:"signature_image",onChange:k,accept:"image/*",className:"cursor-pointer"}),u(t.signature_image)&&e.jsx("p",{className:"text-sm text-gray-500",children:u(t.signature_image)})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(n,{children:"Logo Image"}),e.jsx(p,{type:"file",name:"logo_image",onChange:k,accept:"image/*",className:"cursor-pointer"}),u(t.logo_image)&&e.jsx("p",{className:"text-sm text-gray-500",children:u(t.logo_image)})]})]}),e.jsxs("div",{className:"mt-6 space-y-2",children:[e.jsxs(n,{children:["Certificate Body ",e.jsx("span",{className:"text-red-500",children:"*"})]}),e.jsxs("div",{className:"bg-gray-50 p-4 rounded-md",children:[e.jsx("div",{className:"flex flex-wrap gap-2 mb-4",children:G.map(l=>e.jsx(R,{type:"button",variant:"outline",size:"sm",onClick:()=>P(l),children:l},l))}),e.jsx("div",{className:"quill-editor-container",style:{minHeight:"400px"},children:e.jsx(j,{ref:w,theme:"snow",value:t.content,onChange:l=>o("content",l),modules:H,formats:J,className:"bg-white rounded-md h-[300px]",style:{height:"300px"},placeholder:"Enter certificate content..."})}),e.jsx("style",{children:`
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
                  `})]}),a.content&&e.jsx("p",{className:"text-red-500 text-sm",children:a.content})]}),e.jsx("div",{className:"mt-6",children:e.jsx(R,{type:"submit",className:"w-full md:w-auto",disabled:!N||E,title:N?"":"You don't have permission to add",children:i?"Update Template":"Create Template"})})]})})]})})})}export{Ve as default};
