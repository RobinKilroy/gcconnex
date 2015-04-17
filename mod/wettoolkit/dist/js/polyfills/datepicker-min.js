/*!
 *
 * Web Experience Toolkit (WET) / Boîte à outils de l'expérience Web (BOEW)
 * wet-boew.github.io/wet-boew/License-en.html / wet-boew.github.io/wet-boew/Licence-fr.html
 *
 * Version: v3.1.5-development Build: 2013-10-23 01:14 PM EDT
 *
 */
(function(b){var a;b.fn.datepicker=function(){return b(this).each(function(){var n,s,m=pe.fn.calendar,e,v=new Date(),t="YYYY-MM-DD",l,i,u,r,j,f,w=v.getMonth(),c,q,p,k=v.getFullYear(),h=pe.dic.get("%datepicker-show"),x=pe.dic.get("%datepicker-hide"),g=pe.dic.get("%interword-space"),o=pe.dic.get("%datepicker-selected"),d=b(this);if(d.hasClass("picker-field")){return}d.addClass("picker-field");e=function(y){var z=b('label[for="'+y+'"]').text(),A=b('<a id="'+y+'-picker-toggle" class="picker-toggle-hidden wb-invisible" href="javascript:;"><img class="image-actual" src="'+pe.add.liblocation+'images/datepicker/calendar-month.png" alt="'+h+g+z+'"/></a>');A.on("click vclick touchstart",function(C){var B=C.button;if(typeof B==="undefined"||B===pe.leftMouseButton){p(y);return false}});d.after(A);a.slideUp(0);setTimeout(function(){A.removeClass("wb-invisible")},10)};n=function(C,E,D,H,B,z,G){var F=b("#"+pe.string.jqescape(C)),A,y;if(F.attr("min")!==undefined){B=F.attr("min")}else{B="1800-01-01"}if(F.attr("max")!==undefined){z=F.attr("max")}else{z="2100-01-01"}B=pe.date.from_iso_format(B);z=pe.date.from_iso_format(z);A=(E===B.getFullYear()&&D===B.getMonth());y=(E===z.getFullYear()&&D===z.getMonth());H.each(function(I,L){if((!A&&!y)||(A===true&&I>=B.getDate())||(y===true&&I<=z.getDate())){var M=b(L).children("div"),K=b('<a href="javascript:;"></a>'),J=M.parent();J.empty();K.append(M.html());K.appendTo(J);K.on("keydown",function(P){var N=b(this).closest(".cal-container"),O=N.attr("id");if(!(P.ctrlKey||P.altKey||P.metaKey)){switch(P.keyCode){case 27:p(C);return false;case 32:b(this).trigger("click");return false;case 33:if(P.shiftKey){c(O,E,D,B,z,new Date(E-1,D,I+1))}else{c(O,E,D,B,z,new Date(E,D-1,I+1))}return false;case 34:if(P.shiftKey){c(O,E,D,B,z,new Date(E+1,D,I+1))}else{c(O,E,D,B,z,new Date(E,D+1,I+1))}return false;case 35:pe.focus(b(this).closest("ol").children("li").children("a").last());return false;case 36:pe.focus(b(this).closest("ol").children("li").children("a").first());return false;case 37:c(O,E,D,B,z,new Date(E,D,I));return false;case 38:c(O,E,D,B,z,new Date(E,D,I-6));return false;case 39:c(O,E,D,B,z,new Date(E,D,I+2));return false;case 40:c(O,E,D,B,z,new Date(E,D,I+8));return false}}else{if(P.ctrlKey&&!(P.altKey||P.metaKey)){switch(P.keyCode){case 35:c(O,E,D,B,z,new Date(E,11,31));return false;case 36:c(O,E,D,B,z,new Date(E,0,1));return false}}}});K.on("click vclick touchstart",{fieldid:C,year:E,month:D,day:I+1,days:H,format:G},function(P){var O,Q,N=P.button;if(typeof N==="undefined"||N===pe.leftMouseButton){O=b("#"+P.data.fieldid);Q=O.val();s(P.data.fieldid,P.data.year,P.data.month+1,P.data.day,P.data.format);if(Q!==O.val()){O.trigger("change")}q(P.data.fieldid,P.data.year,P.data.month,P.data.days,P.data.format);p(P.data.fieldid);return false}})}})};c=function(y,A,C,B,D,z){if(z.getTime()<B.getTime()){z=B;z.setDate(z.getDate()+1)}else{if(z.getTime()>D.getTime()){z=D;z.setDate(z.getDate()+1)}}if(z.getMonth()!==C||z.getFullYear()!==A){m.create(y,z.getFullYear(),z.getMonth(),true,B,D)}pe.focus(a.find(".cal-day-list").children("li:eq("+(z.getDate()-1)+")").children("a"))};q=function(A,E,C,H,G){var D,y,z,F;b(H).removeClass("datepicker-selected");b(H).find(".datepicker-selected-text").detach();G=G.replace("DD","(?<a> [0-9]{2})");G=G.replace("D","(?<a> [0-9] )");G=G.replace("MM","(?<b> [0-9]{2})");G=G.replace("M","(?<b> [0-9])");G=G.replace("YYYY","(?<c> [0-9]{4})");G=G.replace("YY","(?<c /> [0-9]{2})");D="^"+G+"$";y=b("#"+pe.string.jqescape(A)).val();F=new XRegExp(D,"x");try{if(y!==""){z=b.parseJSON(y.replace(F,'{"year":"$1", "month":"$2", "day":"$3"}'));if(parseInt(z.year,10)===E&&parseInt(z.month,10)===C+1){b(H[z.day-1]).addClass("datepicker-selected");b(H[z.day-1]).children("a").append('<span class="wb-invisible datepicker-selected-text"> ['+o+"]</span>")}}}catch(B){}};s=function(y,A,C,z,B){a.parent().find("#"+pe.string.jqescape(y)).val(l(A,C,z,B))};p=function(z){var C=pe.string.jqescape(z),B=b("#"+C),D=B.parent(),y=D.find("#"+C+"-picker-toggle"),A=pe.date.from_iso_format(B.val());y.toggleClass("picker-toggle-hidden picker-toggle-visible");if(B.attr("min")!==undefined){f=B.attr("min")}else{f="1800-01-01"}if(B.attr("max")!==undefined){j=B.attr("max")}else{j="2100-01-01"}a.attr({"aria-labelledby":z+"-picker-toggle","aria-controls":z});m.create("wb-picker",k,w,true,f,j);B.after(a);a.unbind("focusout.calendar");a.unbind("focusin.calendar");if(y.hasClass("picker-toggle-visible")){u(z);a.find("a").attr("tabindex",0);a.slideDown("fast",function(){r(b(this))});a.attr("aria-hidden","false");y.children("a").children("span").text(x);if(A!==null){A.setDate(A.getDate()+1);c("wb-picker",k,w,pe.date.from_iso_format(f),pe.date.from_iso_format(j),A)}else{if(a.find(".cal-prevmonth a").length!==0){pe.focus(a.find(".cal-prevmonth a"))}else{if(a.find(".cal-nextmonth a").length!==0){pe.focus(a.find(".cal-nextmonth a"))}else{pe.focus(a.find(".cal-goto a"))}}}}else{i(b("#"+C));pe.focus(D.find("#"+C))}};u=function(y){b(".picker-field").each(function(){if(b(this).attr("id")!==y){i(b(this))}})};i=function(B){var z,y,A;z=B.attr("id");y=b("#"+pe.string.jqescape(z)+"-picker-toggle");A=b('label[for="'+z+'"]').text();a.find("a").attr("tabindex","-1");a.slideUp("fast",function(){r(b(this))});a.attr("aria-hidden","true");m.hideGoToForm("wb-picker");y.children("a").children("span").text(h+g+A);y.removeClass("picker-toggle-visible");y.addClass("picker-toggle-hidden")};r=function(y){var z=b("#wb-main-in"),A;if(pe.ie===7){A=y.height()+y.offset().top-z.offset().top+50;if(z.height()>=A){z.css("min-height","")}else{if(z.height()<A){z.css("min-height",A)}}}else{if(pe.preIE7){A=y.height()+y.offset().top-z.offset().top+50;if(z.height()>=A){z.css("height","")}else{if(z.height()<A){z.css("height",A)}}}}};l=function(A,C,z,B){var y=B;y=y.replace("DD",pe.string.pad(z,2));y=y.replace("D",z);y=y.replace("MM",pe.string.pad(C,2));y=y.replace("M",C);y=y.replace("YYYY",A);y=y.replace("YY",A.toString().substr(2,2));return y};if(a===undefined){a=b('<div id="wb-picker" class="picker-overlay" role="dialog" aria-hidden="true"></div>');a.on("keyup",function(y){if(y.keyCode===27){u();pe.focus(a.parent().find("#"+a.attr("aria-controls")))}});a.on("calendarDisplayed",function(C,z,B,D){var A=b(this),y=A.attr("aria-controls");n(y,z,B,D,f,j,t);q(y,z,B,D,t);A.on("click vclick touchstart focusin",function(F){var E=F.button;if(typeof E==="undefined"||E===pe.leftMouseButton){if(F.stopPropagation){F.stopImmediatePropagation()}else{F.cancelBubble=true}}})});pe.document.on("click vclick touchstart focusin",function(z){var y=z.button;if(typeof y==="undefined"||y===pe.leftMouseButton){if(a.attr("aria-hidden")==="false"){i(a.parent().find("#"+pe.string.jqescape(a.attr("aria-controls"))));return false}}});b('<a class="picker-close" role="button" href="javascript:;"><img src="'+pe.add.liblocation+'images/datepicker/cross-button.png" alt="'+x+'" class="image-actual" /></a>').appendTo(a).click(function(z){var y=z.button;if(typeof y==="undefined"||y===pe.leftMouseButton){p(a.attr("aria-controls"))}});a.find("a").attr("tabindex","-1");pe.bodydiv.after(a)}if(d.attr("id")!==undefined){e(d.attr("id"))}})};b('input[type="date"]').datepicker()}(jQuery));