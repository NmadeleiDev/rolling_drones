(this.webpackJsonprolling_drones_front=this.webpackJsonprolling_drones_front||[]).push([[0],{141:function(e,t){},171:function(e,t,n){},307:function(e,t){},308:function(e,t){},311:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),o=n(9),c=n.n(o),i=n(362),l=n(363),s=(n(171),n(14)),d=n(347),u=n(349),f=n(13),b=n(49),j=n(79),p=n.n(j),h=n(3),m=Object(d.a)((function(e){return{root:{position:"fixed",left:0,top:60,minHeight:"100vh",width:165,padding:"1rem",paddingTop:"0.5rem"},link:{color:e.palette.text.secondary,textDecoration:"none",fontWeight:700,textTransform:"uppercase",textAlign:"start",cursor:"pointer",margin:"1rem","&:hover":{color:e.palette.text.primary,textShadow:"0 0 3px #fff"}},active:{color:e.palette.text.primary,textShadow:"0 0 3px #fff"}}})),x=[{to:"upload",name:"\u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044c \u0434\u0430\u043d\u043d\u044b\u0435"},{to:"report",name:"\u043e\u0442\u0447\u0451\u0442"},{to:"settings",name:"\u043d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0438"}];var g=function(){var e=m(),t=Object(f.h)();return Object(h.jsx)(u.a,{container:!0,direction:"column",justifyContent:"flex-start",alignItems:"flex-start",className:e.root,children:x.map((function(n){return Object(h.jsx)(b.b,{className:t.pathname.match(n.to)?p()(e.link,e.active):e.link,to:n.to,children:n.name},n.name)}))})},O=n(351),v="#2d3268",y="#1a1f4b",w=Object(O.a)({palette:{primary:{light:"#DAF7A6",main:"#BFD891",dark:"#A4B97D",contrastText:"#000"},secondary:{light:"#FF5733",main:"#BF4126",dark:"#802B1A",contrastText:"#fff"},text:{primary:"#fff",secondary:"#dadada",disabled:"#444",hint:"#dadada"}},overrides:{MuiTextField:{root:{width:"100%"}},MuiContainer:{root:{display:"flex",justifyContent:"center"}}},shape:{borderRadius:30},props:{MuiButton:{variant:"outlined",color:"primary",size:"large"},MuiTextField:{variant:"outlined"}}}),C=n(35),k=n.n(C),N=n(53),S=n(28),I=n(353),F=n(154),_=Object(d.a)((function(e){return{root:{},card:{border:"1px solid #ffffff0f",borderRadius:15,overflow:"hidden",position:"relative",fontSize:"2rem",padding:30,margin:30,width:700,height:400,backdropFilter:"blur(10px) saturate(120%)"},header:{fontSize:"1rem"}}})),T={green:"#DAF7A6",orange:"#FFC300",red:"#FF5733",brown:"#C70039"},B={labels:[1,2,3,4],datasets:[{label:"Income",backgroundColor:T.orange,borderColor:T.orange,data:[2,8,5,4],cubicInterpolationMode:"monotone"},{label:"Revenue",backgroundColor:T.green,borderColor:T.green,data:[4,7,2,3],cubicInterpolationMode:"monotone"}]};var A=function(e){var t=_();return console.log("[Chart] props:",e),Object(h.jsxs)("div",{className:t.root,children:[Object(h.jsxs)("h2",{className:t.header,children:[e.title,e.year&&" for ".concat(e.year)]}),Object(h.jsx)("div",{className:t.card,children:Object(h.jsx)(F.a,{options:{responsive:!0},data:function(t){var n=e.data||B;return console.log("[getChartData] data:",n),n.datasets&&n.datasets.forEach((function(e,n){e.backgroundColor=function(e,t){var n,a=null===(n=e.getContext("2d"))||void 0===n?void 0:n.createLinearGradient(0,0,400,0);return null===a||void 0===a||a.addColorStop(0,t),null===a||void 0===a||a.addColorStop(1,"#ffffff"),a}(t,T[0==n?"green":"orange"]),e.borderColor=T[0==n?"green":"orange"],e.borderWidth=2})),n},className:"canvas"})})]})},R=n(352),D=Object(d.a)((function(e){return{container:{padding:"0 50px 0 120px",display:"flex",flexDirection:"column",justifyContent:"flex-start",alignItems:"center"}}}));var E=function(e){var t=e.children,n=D();return Object(h.jsx)(R.a,{className:n.container,children:t})},W=n(153),z=n.n(W).a.create({baseURL:"/api",withCredentials:!0,validateStatus:function(e){return e>=200&&e<500}}),M=n(55),q=n(87),J=n.n(q),L=Object(d.a)((function(e){return{root:{}}})),U=[1,2,3,4,5,6,7,8,9,10,11,12],G=function(e){console.log(Object.entries(e));var t=[],n=Object.entries(e).map((function(e){var n=e[0],a=function(e){var t=[],n=[];for(var a in console.log(e),e)for(var r=0;r<U.length;r++)t.push("".concat(a,"-").concat(U[r])),n.push(e[a][r]);return{labels:t,data:n}}(e[1]);return t=a.labels,{label:n,data:a.data,cubicInterpolationMode:"monotone"}}));return console.log(n),{labels:t,datasets:n}};var H=function(){L();var e,t=Object(f.h)(),n=Object(a.useState)(),r=Object(S.a)(n,2),o=r[0],c=r[1],i=Object(M.b)().enqueueSnackbar,l=null===(e=t.search.match(/year=(\d{4})/))||void 0===e?void 0:e[1];return console.log(l),Object(a.useEffect)((function(){(function(){var e=Object(N.a)(k.a.mark((function e(){var t,n;return k.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,z("/ml/predict",{params:{year:l}});case 3:t=e.sent,console.log(t.data),n=G(t.data.data),console.log(n),c(n),e.next=13;break;case 10:e.prev=10,e.t0=e.catch(0),i("\u041e\u0448\u0438\u0431\u043a\u0430 \u043f\u043e\u043b\u0443\u0447\u0435\u043d\u0438\u044f \u043f\u0440\u0435\u0434\u0438\u043a\u0442\u0430",{variant:"error"});case 13:case"end":return e.stop()}}),e,null,[[0,10]])})));return function(){return e.apply(this,arguments)}})()()}),[]),Object(h.jsxs)(E,{children:[Object(h.jsx)(A,{title:"Income",year:l,data:o}),Object(h.jsx)(I.a,{onClick:function(){var e=J.a.utils.book_new(),t=[(null===o||void 0===o?void 0:o.labels)||[],(null===o||void 0===o?void 0:o.datasets)||[]];console.log(t);J.a.utils.aoa_to_sheet(t);J.a.writeFile(e,"out.xlsb")},children:"\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c \u043f\u0440\u043e\u0433\u043d\u043e\u0437"})]})},P=n(17),K=n(359),Q=n(361),V=n(355),X=n(358),Y=n(360),Z=n(354),$=n(26),ee=n(107),te=n.n(ee),ne=n(108),ae=n.n(ne),re=Object(d.a)({table:{minWidth:650},button:{fontSize:"0.7rem",margin:10},cell:{textAlign:"center",width:150,padding:0,borderBottom:"none"},row:{position:"relative",borderBottom:"1px solid #ffffff44"}});var oe=function(e){var t=e.row,n=e.updateRows,r=re(),o=Object(a.useState)({file_forecast:"",file_fact:""}),c=Object(S.a)(o,2),i=c[0],l=c[1],d=Object(M.b)().enqueueSnackbar,u=Object(f.g)(),b=function(){var e=Object(N.a)(k.a.mark((function e(a,r){var o,c;return k.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(console.log(a,r),"string"!==typeof a){e.next=3;break}return e.abrupt("return");case 3:return(o=new FormData).append("year","".concat(t.year)),o.append(r,a),e.prev=6,e.next=9,z.post("/dataloader/data",o,{headers:{"Content-Type":"multipart/form-data"}});case 9:if(c=e.sent,console.log(c),!c.data.error){e.next=13;break}throw new Error(c.data.data);case 13:e.next=20;break;case 15:return e.prev=15,e.t0=e.catch(6),console.error(e.t0),d("\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044c \u0444\u0430\u0439\u043b",{variant:"error"}),e.abrupt("return",!1);case 20:return e.prev=20,i[r]="",n(Object($.a)(Object($.a)({},t),{},Object(s.a)({},r.split("_")[1],!0))),e.finish(20);case 24:case"end":return e.stop()}}),e,null,[[6,15,20,24]])})));return function(t,n){return e.apply(this,arguments)}}();return Object(h.jsxs)(Z.a,{children:[Object(h.jsx)(V.a,{className:r.cell,children:t.year}),Object(h.jsx)(V.a,{className:r.cell,children:Object(h.jsxs)(I.a,{className:r.button,component:"label",color:t.forecast?"primary":"secondary",onChange:function(e){if(e.target){var n=e.currentTarget;if(console.dir(n.control.files),n.control.files&&0!==n.control.files.length){if(!n.control.files[0].name.match(+t.year+1))return d("\u041d\u0435\u043f\u0440\u0430\u0432\u0438\u043b\u044c\u043d\u043e\u0435 \u0438\u043c\u044f \u0444\u0430\u0439\u043b\u0430: "+n.control.files[0].name,{variant:"error"});l((function(e){return Object($.a)(Object($.a)({},e),{},{file_forecast:n.control.files[0]})})),b(n.control.files[0],"file_forecast")}}},endIcon:t.forecast?Object(h.jsx)(te.a,{}):Object(h.jsx)(ae.a,{}),children:[t.forecast?"\u041e\u0431\u043d\u043e\u0432\u0438\u0442\u044c":"\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044c",Object(h.jsx)("input",{type:"file",style:{display:"none"}})]})}),Object(h.jsx)(V.a,{className:r.cell,children:Object(h.jsxs)(I.a,{className:r.button,component:"label",color:t.fact?"primary":"secondary",onChange:function(e){if(e.target){var n=e.currentTarget;if(console.dir(n.control.files),n.control.files&&0!==n.control.files.length){if(!n.control.files[0].name.match(t.year)&&n.control.files[0].name.match(/\d+\-\d+/))return d("\u041d\u0435\u043f\u0440\u0430\u0432\u0438\u043b\u044c\u043d\u043e\u0435 \u0438\u043c\u044f \u0444\u0430\u0439\u043b\u0430: "+n.control.files[0].name,{variant:"error"});l((function(e){return Object($.a)(Object($.a)({},e),{},{file_fact:n.control.files[0]})})),b(n.control.files[0],"file_fact")}}},endIcon:t.fact?Object(h.jsx)(te.a,{}):Object(h.jsx)(ae.a,{}),children:[t.fact?"\u041e\u0431\u043d\u043e\u0432\u0438\u0442\u044c":"\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044c",Object(h.jsx)("input",{type:"file",style:{display:"none"}})]})}),Object(h.jsx)(V.a,{className:r.cell,children:Object(h.jsx)(I.a,{className:r.button,onClick:function(){return u.push("/report?year=".concat(t.year))},disabled:!t.forecast||!t.fact,children:"\u041f\u043e\u043b\u0443\u0447\u0438\u0442\u044c \u043f\u0440\u043e\u0433\u043d\u043e\u0437"})})]},t.year)},ce=n(366),ie=n(367),le=n(364),se=n(357),de=Object(d.a)((function(e){return{table:{minWidth:650,paddingTop:30,marginBottom:30},button:{fontSize:"0.7rem",margin:10},cell:{textAlign:"center",width:150,padding:0,borderBottom:"none"},row:{position:"relative",borderBottom:"1px solid #ffffff44"},hover:{position:"relative",paddingBottom:6,"& .p":{display:"none",width:400,fontSize:"0.7rem",position:"absolute",top:0,left:0,border:"1px solid #fff",borderRadius:e.shape.borderRadius,backgroundColor:v,padding:5,zIndex:4,transition:"0.3s"},"&:hover .p":{display:"block"}},listItem:{color:"#000"},dialog:{padding:30},select:{margin:10,padding:3},selectEmpty:{marginTop:e.spacing(2),color:"#000"},formControl:{padding:30,minWidth:300}}}));function ue(e){var t=de(),n=e.onClose,r=e.rows,o=e.open,c=Object(a.useState)(""),i=Object(S.a)(c,2),l=i[0],s=i[1],d=function(e){if(console.dir(e),""===l)return n(null);n({year:l,forecast:!1,fact:!1}),s("")};return Object(h.jsxs)(ce.a,{className:t.dialog,onClose:d,"aria-labelledby":"simple-dialog-title",open:o,children:[Object(h.jsx)(se.a,{className:t.formControl,children:Object(h.jsxs)(le.a,{value:l,onChange:function(e){console.dir(e.currentTarget);var t=e.currentTarget.textContent;if(!t)return n(null);s(t)},displayEmpty:!0,className:t.selectEmpty,inputProps:{"aria-label":"Without label"},children:[Object(h.jsx)(ie.a,{style:{color:"black"},value:"",disabled:!0,children:"\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u0433\u043e\u0434"}),new Array(30).fill(0).map((function(e,t){return t+2010})).filter((function(e){return!r.find((function(t){return+t.year===+e}))})).map((function(e){return Object(h.jsx)(ie.a,{value:"".concat(e),className:t.listItem,children:"".concat(e)},e)}))]})}),Object(h.jsx)(I.a,{className:t.button,onClick:d,children:"\u0412\u044b\u0431\u0440\u0430\u0442\u044c"})]})}var fe=function(){var e=de(),t=Object(a.useState)([]),n=Object(S.a)(t,2),r=n[0],o=n[1],c=Object(a.useState)(!1),i=Object(S.a)(c,2),l=i[0],s=i[1],d=function(e){var t=r.findIndex((function(t){return+t.year===+e.year}));console.log(t),o(t>=0?r.slice(0,t).concat([e]).concat(r.slice(t+1)):[].concat(Object(P.a)(r),[e]).sort((function(e,t){return+e.year-+t.year})))},f=function(){var e=Object(N.a)(k.a.mark((function e(){var t;return k.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,z("/dataloader/data");case 3:t=e.sent,console.log(t.data),t.data.error?console.error(t.data):o(t.data.data.sort((function(e,t){return+e.year-+t.year}))),e.next=11;break;case 8:e.prev=8,e.t0=e.catch(0),console.log(e.t0);case 11:case"end":return e.stop()}}),e,null,[[0,8]])})));return function(){return e.apply(this,arguments)}}();return Object(a.useEffect)((function(){console.log("[Upload] useEffect"),f()}),[]),Object(h.jsxs)(u.a,{container:!0,direction:"column",justifyContent:"flex-start",alignItems:"center",children:[Object(h.jsx)(X.a,{component:"div",children:Object(h.jsxs)(K.a,{className:e.table,size:"small","aria-label":"simple table",children:[Object(h.jsx)(Y.a,{children:Object(h.jsxs)(Z.a,{className:e.row,children:[Object(h.jsxs)(V.a,{className:p()(e.hover,e.cell),children:["\u0411\u044e\u0434\u0436\u0435\u0442\u043d\u044b\u0439 \u0433\u043e\u0434",Object(h.jsx)("sup",{children:"*"}),Object(h.jsxs)("p",{className:"p",children:["\u0413\u043e\u0434, \u043f\u043e\u0441\u043b\u0435 \u043a\u043e\u0442\u043e\u0440\u043e\u0433\u043e \u0431\u0443\u0434\u0435\u0442 \u0440\u0430\u0441\u0441\u0447\u0438\u0442\u044b\u0432\u0430\u0442\u044c\u0441\u044f \u043f\u0440\u043e\u0433\u043d\u043e\u0437 \u0431\u044e\u0434\u0436\u0435\u0442\u0430.",Object(h.jsx)("br",{}),"\u0414\u043b\u044f \u044d\u0442\u043e\u0433\u043e \u0433\u043e\u0434\u0430 \u043d\u0443\u0436\u043d\u044b \u0434\u0430\u043d\u043d\u044b\u0435 \u0421\u042d\u0420 \u0438 \u0431\u044e\u0434\u0436\u0435\u0442\u0430."]})]}),Object(h.jsx)(V.a,{className:e.cell,children:"\u041f\u0440\u043e\u0433\u043d\u043e\u0437 \u0421\u042d\u0420"}),Object(h.jsx)(V.a,{className:e.cell,children:"\u0411\u044e\u0434\u0436\u0435\u0442"}),Object(h.jsx)(V.a,{className:e.cell,children:"\u041f\u0440\u043e\u0433\u043d\u043e\u0437 \u0431\u044e\u0434\u0436\u0435\u0442\u0430"})]})}),Object(h.jsx)(Q.a,{children:r.map((function(e){return Object(h.jsx)(oe,{row:e,updateRows:d},e.year)}))})]})}),Object(h.jsx)(I.a,{variant:"text",onClick:function(){!l&&s(!0)},children:"\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u0433\u043e\u0434"}),Object(h.jsx)(ue,{rows:r,open:l,onClose:function(e){s(!1),e&&d(e)}})]})};var be=function(){return Object(h.jsx)(E,{children:Object(h.jsx)(fe,{})})},je=Object(d.a)((function(e){return{root:{}}}));var pe=function(){return je(),Object(h.jsx)(E,{children:Object(h.jsx)(fe,{})})},he=Object(d.a)((function(e){return{root:{width:"100vw",height:60,padding:"1rem"},img:{height:"100%",marginRight:10},logo:{height:"100%",width:200,alignItems:"center"}}}));var me=function(){var e=he();return Object(h.jsx)(u.a,{container:!0,justifyContent:"space-between",className:e.root,children:Object(h.jsxs)(u.a,{container:!0,className:e.logo,children:[Object(h.jsx)("img",{className:e.img,src:"logo512.png",alt:"logo"}),"Rolling Drones"]})})},xe=Object(d.a)((function(e){return{grid:{position:"relative",minWidth:900,height:"100vh",padding:"1rem",background:"linear-gradient(125deg, ".concat(v,", ").concat(y,")"),textAlign:"center",color:e.palette.text.primary},root:Object(s.a)({maxWidth:"100%",minWidth:500,margin:0},e.breakpoints.down("xs"),{padding:0})}}));var ge=function(){var e=xe();return Object(h.jsxs)(u.a,{container:!0,direction:"column",alignItems:"flex-start",className:e.grid,children:[Object(h.jsx)(me,{}),Object(h.jsx)(b.a,{children:Object(h.jsxs)(M.a,{maxSnack:3,classes:{containerRoot:e.root},children:[Object(h.jsx)(g,{}),Object(h.jsxs)(f.d,{children:[Object(h.jsx)(f.b,{path:"/upload",children:Object(h.jsx)(be,{})}),Object(h.jsx)(f.b,{path:"/report",children:Object(h.jsx)(H,{})}),Object(h.jsx)(f.b,{path:"/settings",children:Object(h.jsx)(pe,{})}),Object(h.jsx)(f.a,{from:"/",to:"/upload"})]})]})})]})};c.a.render(Object(h.jsx)(r.a.StrictMode,{children:Object(h.jsxs)(i.a,{theme:w,children:[Object(h.jsx)(l.a,{}),Object(h.jsx)(ge,{})]})}),document.getElementById("root"))}},[[311,1,2]]]);
//# sourceMappingURL=main.645cbf57.chunk.js.map