/*
This is redTea v0.3 - js library

TERMS OF USE redtea

Open source under the BSD License. 

Copyright © 2013 Kirill Jakovlev
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, 
are permitted provided that the following conditions are met:

Redistributions of source code must retain the above copyright notice, this list of 
conditions and the following disclaimer.
Redistributions in binary form must reproduce the above copyright notice, this list 
of conditions and the following disclaimer in the documentation and/or other materials 
provided with the distribution.

Neither the name of the author nor the names of contributors may be used to endorse
or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
OF THE POSSIBILITY OF SUCH DAMAGE.
*/
(function(){var t,e,n,i,s,r,o,u,l,h,a,c,p,d,f,g,m,y,_,v,b,T,C,E,w,R,A,k,N,x,H,D,W,L,O,S,M,U,B,I,P,F,K,Y,G,j,q,V,z,X,J,Q,Z,$,te={}.hasOwnProperty,ee=function(t,e){function n(){this.constructor=t}for(var i in e)te.call(e,i)&&(t[i]=e[i]);return n.prototype=e.prototype,t.prototype=new n,t.__super__=e.prototype,t},ne=[].indexOf||function(t){for(var e=0,n=this.length;n>e;e++)if(e in this&&this[e]===t)return e;return-1};for(window.glob=window,glob.root=glob.document,glob.RedTea={},glob.RT=RedTea,RedTea.rtid=0,RedTea.genid=function(){return this.rtid+=1},l=function(){function t(){}return t}(),h||(h=function(t){function e(){return P=e.__super__.constructor.apply(this,arguments)}return ee(e,t),e}(l)),u||(u=function(t){function e(){return F=e.__super__.constructor.apply(this,arguments)}return ee(e,t),e}(l)),"undefined"!=typeof MozWebSocket&&(glob.WebSocket=MozWebSocket),"undefined"==typeof HTMLDocument&&(glob.HTMLDocument=Document),"Microsoft Internet Explorer"===navigator.appName&&Object.defineProperty(Function.prototype,"name",{get:function(){var t;return t=this.toString().match(/^function\s*([^\s(]+)/)[1],Object.defineProperty(this,"name",{enumerable:!1,value:t}),t},enumerable:!1,configurable:!0}),n=function(t){return t.isWidget?n(t.dom):t},t="all",glob.RTC={ON_CLASS:"on",ON:"on",FUNCTION_TYPE:"function",STRING_TYPE:"string",UNDEFINED_TYPE:"undefined",KEYDOWN:"keydown",CLICK:"click",READYSTATECHANGE:"readystatechange",CLICK:"click",DBLCLICK:"dblclick",MOUSEDOWN:"mousedown",MOUSEUP:"mouseup",MOUSEMOVE:"mousemove",TOUCHSTART:"touchstart",TOUCHEND:"touchend",TOUCHMOVE:"touchmove",DRAGSTART:"dragstart",KEYDOWN:"keydown",DBLCLICK:"dblclick",CHANGE:"change",KEYPRESS:"keypress",KEYUP:"keyup",FOCUS:"focus",PROGRESS:"progress",MOUSEWHEEL:"mousewheel",HASHCHANGE:"hashchange",BEFOREUNLOAD:"beforeunload",MOUSELEAVE:"mouseleave",GET:"get",POST:"post",PUT:"put",DELETE:"delete",TEXTNODENAME:"#text",BR:"BR",CLASS:"class",C2D:"2d",EMPTY_HREF:"#",BLANK_TARGET:"_blank"},e="function",r="object",o="string",i="mousedown",s="mouseup",RedTea.moduleKeywords=["extended","included"],RedTea.Base=function(){function t(){}return t.extend=function(t){var e,n,i,s;t.classes||(t.classes=[]),t.classes.push(this),this["extends"]||(this["extends"]=[]),this["extends"].push(t),i=t.prototype;for(e in i)n=i[e],ne.call(RedTea.moduleKeywords,e)<0&&null==this[e]&&(this[e]=n);return null!=(s=t.prototype.extended)&&s.call(this),this},t.include=function(t){var e,n,i,s;t.classes||(t.classes=[]),t.classes.push(this),this.includes||(this.includes=[]),this.includes.push(t),i=t.prototype;for(e in i)n=i[e],ne.call(RedTea.moduleKeywords,e)<0&&null==this.prototype[e]&&(this.prototype[e]=n);return null!=(s=t.prototype.included)&&s.call(this),this},t}(),RT.Anticipant=function(){function t(){this._rtid=RT.genid()}return t.prototype.isItTime=!1,t.prototype.isRemoving=!1,t.prototype.priority=0,t.prototype.binded=function(){},t.prototype.fire=function(){},t}(),RT.DoOnce={isItTime:!0,isRemoving:!0,priority:0,_rtid:RT.genid(),constructor:function(){},binded:function(){},fire:function(){}},RT.CountAnticipant=function(t){function e(t){this.maxCount=t,this.count=0,this.events={},e.__super__.constructor.apply(this,arguments)}return ee(e,t),e.prototype.isItTime=!0,e.prototype.binded=function(t,e){return this.event=e},e.prototype.fire=function(t,e){return e===this.event&&(this.count+=1),this.count>=this.maxCount?this.isRemoving=!0:void 0},e}(RT.Anticipant),RT.SimpleSyncAnticipant=function(t){function e(){this.events=[],this.eventsChecks={},e.__super__.constructor.apply(this,arguments)}return ee(e,t),e.prototype.binded=function(t,e){return this.events.push(e)},e.prototype.fire=function(t,e){var n=this;return this.isItTime&&(this.eventsChecks={},this.isItTime=!1),this.eventsChecks[e]=!0,this.events.every(function(t){return n.eventsChecks[t]})?this.isItTime=!0:void 0},e}(RT.Anticipant),RT.PeriodSyncAnticipant=function(t){function e(t){this.period=t,this.events=[],this.eventsChecks={},e.__super__.constructor.apply(this,arguments)}return ee(e,t),e.prototype.binded=function(t,e){return this.events.push(e)},e.prototype.fire=function(t,e){var n,i,s=this;return this.isItTime&&(this.eventsChecks={},this.isItTime=!1),i=(new Date).getTime(),n=this.period,this.eventsChecks[e]=i,this.events.every(function(t){return null!=s.eventsChecks[t]&&i-s.eventsChecks[t]<n})?this.isItTime=!0:void 0},e}(RT.Anticipant),RT.OnceInPeriodAnticipant=function(t){function e(t){this.period=t,e.__super__.constructor.apply(this,arguments)}return ee(e,t),e.prototype.binded=function(){},e.prototype.fire=function(){return null==this.lastFireTime||(new Date).getTime()-this.lastFireTime>this.period?(this.lastFireTime=(new Date).getTime(),this.isItTime=!0):this.isItTime=!1},e}(RT.Anticipant),RT.Observer=function(){function t(t,e){this.owner=null!=t?t:{},this.callbacks=e,this.__listenersHash={},this.contexts={},this.funcs={},this.anticipants={},this.__contextsUsingCounts={},this.__funcsUsingCounts={},this.__eventsUsingCounts={},this.__cachedListeners={},this.__cachedListeners={},this.__cachedAnticipants=null,null!=this.callbacks&&(this.callbacksContext=null!=this.callbacks.context?this.callbacks.context:this.owner)}return t.prototype.fire=function(t){var n,i,s,r,o,u,l,h,a,c,p,d,f,g,m,y,_,v,b,T;if(null!=this.__listenersHash[t]&&this.__eventsUsingCounts[t]>0){if(u=this.__cachedListeners[t],null==u){u=[],this.__cachedListeners[t]=u,T=this.__listenersHash[t];for(a in T){h=T[a];for(l in h){s=h[l];for(n in s)g=s[n],u.push([this.funcs[a],this.contexts[l],g])}}u.sort(function(t,e){return t[2].priority-e[2].priority})}for(o=this.__cachedAnticipants,null==o&&(o=Object.values(this.anticipants),this.__cachedAnticipants=o,o.sort(function(t,e){return t.priority-e.priority})),y=0,v=o.length;v>y;y++)i=o[y],i.fire(this,t,arguments);for(_=0,b=u.length;b>_;_++){if(p=u[_],f=p[0],d=p[1],g=p[2],m=g.through,null!=m?(c=m.isItTime,n=m._rtid):n=m,null==m||c)switch(g.callCount+=1,arguments.length){case 1:typeof f===e?f.call(d,this.owner):d[f](this.owner);break;case 2:typeof f===e?f.call(d,this.owner,arguments[1]):d[f](this.owner,arguments[1]);break;case 3:typeof f===e?f.call(d,this.owner,arguments[1],arguments[2]):d[f](this.owner,arguments[1],arguments[2]);break;case 4:typeof f===e?f.call(d,this.owner,arguments[1],arguments[2],arguments[3]):d[f](this.owner,arguments[1],arguments[2],arguments[3]);break;default:r=Array.prototype.slice.call(arguments),r[0]=this.owner,typeof f===e?f.apply(d,r):d[f].apply(d,r)}null!=m&&m.isRemoving&&(typeof f===e?this.unbiById(t,f._rtid,d._rtid,n):this.unbiById(t,f,d._rtid,n))}}return this.owner||this},t.prototype.bi=function(t,n,i){var s,o,u,l,h,a,c;if(null==n)throw"empty function for "+t+" bind";if(a=i||{},u=a.context||this.owner,null==this.__listenersHash[t]&&(this.__listenersHash[t]={},this.__eventsUsingCounts[t]=0),typeof n===e)h=n._rtid,null==h&&(h=RedTea.genid(),n._rtid=h);else if(h=n,null==u[h])throw"empty function for "+t+" bind";if(l=u._rtid,null==l&&(l=RT.genid(),u._rtid=l),s=a.through,o=typeof s===r?s._rtid:s,null==this.funcs[h]&&(this.funcs[h]=n,this.__funcsUsingCounts[l]=0),null==this.contexts[l]&&(this.contexts[l]=u,this.__contextsUsingCounts[l]=0),null!=s&&(null==this.anticipants[o]&&(this.anticipants[o]=s,delete this.__cachedAnticipants),s.binded(this,t,n,u)),null==this.__listenersHash[t][h]&&(this.__listenersHash[t][h]={}),null==this.__listenersHash[t][h][l]&&(this.__listenersHash[t][h][l]={}),null!=this.__listenersHash[t][h][l][o])throw"listener with this parameters already added for "+t;return this.__eventsUsingCounts[t]<1&&null!=this.callbacks&&null!=this.callbacks.onAddEvent&&this.callbacks.onAddEvent.call(this.callbacksContext,t),this.__funcsUsingCounts[l]+=1,this.__contextsUsingCounts[l]+=1,this.__eventsUsingCounts[t]+=1,this.__listenersHash[t][h][l][o]=a,a.callCount||(a.callCount=0),a.priority||(a.priority=0),c=a.through,delete this.__cachedListeners[t],this.owner||this},t.prototype.unbiById=function(t,e,n,i){return null!=this.__listenersHash[t]&&null!=this.__listenersHash[t][e]&&null!=this.__listenersHash[t][e][n]&&null!=this.__listenersHash[t][e][n][i]&&(null!=this.__cachedListeners[t]&&delete this.__cachedListeners[t],this.removeAnticipants(i),delete this.__listenersHash[t][e][n][i],this.__eventsUsingCounts[t]-=1,this.__contextsUsingCounts[n]-=1,this.__contextsUsingCounts[n]<1&&delete this.contexts[n],this.__funcsUsingCounts[e]-=1,this.__funcsUsingCounts[e]<1&&delete this.funcs[e],this.__eventsUsingCounts[t]<1&&null!=this.callbacks&&null!=this.callbacks.onDeleteEvent)?this.callbacks.onDeleteEvent.call(this.callbacksContext,t):void 0},t.prototype.unbi=function(t,n,i){var s,o,u,l;return l=typeof n===e?n._rtid:n,null!=i?(s=i.through,o=typeof s===r?s._rtid:s,u=i.context):o=void 0,u||(u=this.owner),this.unbiById(t,l,u._rtid,o),this.owner||this},t.prototype.removeAnticipants=function(t){return null!=t?(delete this.anticipants[t],delete this.__cachedAnticipants):void 0},t}(),RT.Observable=function(t){function e(){return j=e.__super__.constructor.apply(this,arguments)}return ee(e,t),e.prototype.fire=function(){return null!=this.observer?this.observer.fire.apply(this.observer,arguments):void 0},e.prototype.bi=function(t,e,n){return null==this.observer&&(this.observer=new RT.Observer(this)),this.observer.bi(t,e,n)},e.prototype.unbi=function(t,e,n){return null!=this.observer?this.observer.unbi(t,e,n):void 0},e.prototype.doOnce=function(t,e){return null==this.observer&&(this.observer=new RT.Observer(this)),this.observer.doOnce(t,e)},e}(RedTea.Base),d=[],q=[glob,HTMLElement.prototype,u.prototype,XMLHttpRequest.prototype,h.prototype],v=0,E=q.length;E>v;v++)p=q[v],p.bi=function(t,e,n){var i=this;return null==this.observer&&(this._funcs={},this.observer=new RT.Observer(this,{onAddEvent:function(t){return i._funcs[t]=function(e){return this.observer.fire(t,e)},i.addEventListener(t,i._funcs[t])},onDeleteEvent:function(t){return i.removeEventListener(t,i._funcs[t]),i._funcs[t]=null}})),this.observer.bi(t,e,n),this},p.on=p.bi,p.unbi=function(t,e,n){return null!=this.observer&&this.observer.unbi(t,e,n),this},p.fire=function(){return null!=this.observer?this.observer.fire.apply(this.observer,arguments):void 0},p.doOnce=function(t,e){return this.bi(t,e,{through:RT.DoOnce}),this};for(V=[glob,HTMLElement.prototype,u.prototype],b=0,w=V.length;w>b;b++)p=V[b],p.stopProp=function(){var t,e,n;for(e=0,n=arguments.length;n>e;e++)t=arguments[e],this.bi(t,this._stopProp);return this},p.prevDef=function(){var t,e,n;for(e=0,n=arguments.length;n>e;e++)t=arguments[e],this.bi(t,this._prevDef);return this},p.stopPropAndDef=function(){var t,e,n;for(e=0,n=arguments.length;n>e;e++)t=arguments[e],this.bi(t,this._stopPropAndDef);return this},p.notClickTimout=function(t){return this._notClickTimeout=t,this.bi(i,_notClickMouseDown,{context:this}),this.bi(s,_notClickMouseUp,{context:this})},p._notClickMouseDown=function(){return this._mouseDownTime=(new Date).getTime()},p._notClickMouseUp=function(){return this.notClick=(new Date).getTime()-this._mouseDownTime>this._notClickTimeout},p._stopProp=function(t,e){return e.stopPropagation()},p._prevDef=function(t,e){return e.preventDefault()},p._stopPropAndDef=function(t,e){return e.preventDefault(),e.stopPropagation()};for(glob.RedTeaWidget=function(t){function i(t,n){var i,s;if(this.preinit(t),typeof t===r){this.defaultParams=t;for(i in t)s=t[i],this[i]=s;this.createDom(this,t)}(null==t||typeof t===e)&&this.createDom(this),typeof t===e&&this.add(t),null!=n&&this.add(n),this.init(t)}var s,u;return ee(i,t),s=function(t,n,i){var s,r;if(s=t.constructor,r=Object.create(t),r.widget=r,r.isMain?r.mainWidget=r:null!=i&&(r.mainWidget=i),null!=s)switch(n.length){case 0:s.call(r);break;case 1:typeof n[0]===e?(s.call(r),r.add(n[0])):s.call(r,n[0]);break;case 2:s.call(r,n[0],n[1]);break;case 3:s.call(r,n[0],n[1],n[2]);break;case 4:s.call(r,n[0],n[1],n[2],n[3]);break;default:s.apply(r,n)}return r},i.register=function(t){var e;if(e=this.prototype,null!=RedTea[t]||null!=i.prototype[t]||null!=HTMLElement.prototype[t])throw"name '"+t+"' alrady used?";return RedTea[t]=function(){return s(e,arguments,this.mainWidget)},i.prototype[t]=function(){var t;return t=s(e,arguments,this.mainWidget),null!=this.dom?this.dom.add(t):this.dom=t,t},HTMLElement.prototype[t]=function(){var t;return t=s(e,arguments,this.mainWidget),this.appendChild(n(t)),t}},i.prototype.isMain=!1,i.prototype.isWidget=!0,i.prototype.dom=null,i.prototype.createDom=function(){},i.prototype.preinit=function(){},i.prototype.init=function(){},i.prototype.isAdded=function(){return this.dom.isAdded()},i.prototype.add=function(t,e){return this.addHelper(this,t,e)},i.prototype.append=function(t,e){return this.addHelper(this,t,e)},i.prototype.addHelper=function(t,i,s){return typeof i===e?i.call(t):n(t).add(i,s),this},i.prototype.removeSelf=function(){return this.dom.removeSelf()},i.prototype.remChilds=function(){return this.dom.remChilds()},i.prototype.hasCls=function(t){return this.dom.hasCls(t)},i.prototype.addCls=function(t){return this.dom.addCls(t),this},i.prototype.remCls=function(t){return this.dom.remCls(t),this},i.prototype.togCls=function(t){return this.dom.togCls(t),this},i.prototype.destroy=function(){return this.removeSelf(),delete this.dom},u=" ",i.prototype.withParamsClasses=function(t){return this.classes||(this.classes=[]),typeof this.classes===o?(""+this.classes+" "+t).trim():(""+this.classes.join(u)+" "+t).trim()},i.prototype.sprm=function(t,e){return this[t]=e,this},i.prototype.prm=function(t){return this[t]},i.prototype.ins=function(t){return this.dom.ins(t)},i.prototype.preadd=function(t,e){return console.log("preadd is deprecated"),this.dom.preadd(t,e),this},i.prototype.replaceBy=function(t){return console.log("replaceBy is deprecated"),this.dom.replaceBy(t)},i.prototype.addAfter=function(t){return console.log("addAfter is deprecated"),this.dom.addAfter(t)},i}(RT.Observable),glob.RTW=RedTeaWidget,root.create=root.createElement,root.one=root.getElementById,root.byName=root.getElementsByName,z=[HTMLDocument.prototype,HTMLElement.prototype,u.prototype],T=0,A=z.length;A>T;T++)c=z[T],c.tags=function(t){return this.getElementsByTagName(t)},c.tag=function(t){return this.getElementsByTagName(t)[0]},c.byClass=function(t){return this.getElementsByClassName(t)},c.firstByClass=function(t){return this.getElementsByClassName(t)[0]};for(X=[HTMLElement.prototype,u.prototype],C=0,k=X.length;k>C;C++)c=X[C],c.sprm=function(t,e){return this[t]=e,this},c.prm=function(t){return this[t]},c.atr=HTMLElement.prototype.getAttribute,c.intAtr=function(t){return parseInt(this.getAttribute(t))},c.floatAtr=function(t){return parseFloat(this.getAttribute(t))},c.satr=function(t,e){return this.setAttribute(t,e),this},c.satrs=function(t){var e,n,i;i=[];for(e in t)n=t[e],i.push(this.setAttribute(e,n));return i},c.addCls=function(t){return this.classList.add(t),this},c.remCls=function(t){return this.classList.remove(t),this},c.hasCls=function(t){return this.classList.contains(t)},c.togCls=function(t){return this.classList.toggle(t),this},c.remove=c.removeChild,c.remChilds=function(){var t;for(t=[];this.hasChildNodes();)t.push(this.remove(this.firstChild));return t},c.sliceChildNodes=function(){return Array.prototype.slice.call(this.childNodes)},c.setWigets=function(t){return t.isWidget||t.widget||(t.widget=this.widget),null!=this.mainWidget?t.mainWidget=this.mainWidget:void 0},c.append=function(t,i){var s,r,o;return typeof t===e?t.call(this):(o=n(t),null!=i?null!=i.after?(s=n(i.after),null!=s.nextSibling?this.insertBefore(o,s.nextSibling):this.appendChild(o)):null!=i.before?this.insertBefore(o,n(i.before)):null!=i.beforeAt?(r=this.childNodes[i.beforeAt],null!=r?this.insertBefore(o,r):this.appendChild(o)):this.appendChild(o):this.appendChild(o)),this.setWigets(t),this},c.add=c.append,c.removeSelf=function(){return null!=this.parentElement?this.parentElement.remove(this):void 0},c.insert=function(t){return this.appendChild(t.isWidget?t.dom:t),this.setWigets(t),t},c.ins=c.insert,c.preadd=function(t,e){return console.log("preadd is deprecated"),null!=this.firstChild?(t=t.isWidget?t.dom:t,e=null!=e?e.isWidget?e.dom:e:this.firstChild,this.insertBefore(t,e)):this.add(t),this},c.replaceBy=function(t){return console.log("replaceBy is deprecated"),t.isWidget?this.parentNode.insertBefore(t.dom,this):this.parentNode.insertBefore(t,this),this.removeSelf(),this},c.addAfter=function(t){return console.log("addAfter is deprecated"),this.parentNode.insertBefore(t,this.nextSibling)},c.addBefore=function(t){return console.log("addBefore is deprecated"),this.parentNode.insertBefore(t,this)};for(J=[HTMLDocument.prototype,HTMLElement.prototype,u.prototype,RedTeaWidget.prototype,Text.prototype],O=0,N=J.length;N>O;O++)c=J[O],c.setas=function(t,e){return null!=e?e[t]=this:this.mainWidget[t]=this,this},c.setta=c.setas;for(Q=[HTMLDocument.prototype,HTMLElement.prototype,u.prototype,Text.prototype],S=0,x=Q.length;x>S;S++)c=Q[S],c.isAdded=function(){return null!=this.parentNode},c.isAddedToDom=function(){var t;if(null==this.parentNode)return!1;for(;t=this.parentNode;)if(this.parentNode===root)return!0;return!1};for(Z=[Text.prototype],M=0,H=Z.length;H>M;M++)c=Z[M],c.removeSelf=function(){return null!=this.parentElement?this.parentElement.remove(this):void 0};for(g=["script","meta","link","div","p","span","a","img","br","hr","em","strong","button","table","tr","th","td","thead","tbody","tfoot","ul","ol","li","dl","dt","dd","h1","h2","h3","h4","h5","h6","h7","form","fieldset","input","textarea","label","select","option","canvas","footer","aside","section","pre","code","noscript"],a=function(t,n,i){var s,r;if(null!=n)if(typeof n===e)n.call(t);else for(s in n)r=n[s],s=s.split("_").join("-"),t.setAttribute(s,r);return null!=i&&i.call(t),t},m=function(t){return HTMLElement.prototype[t]=function(e,n){var i,s;return s=root.create(t),s.widget||(s.widget=this.widget),null!=this.mainWidget&&(s.mainWidget=this.mainWidget),i=a(s,e,n),this.appendChild(i),i},glob.RedTea[t]=function(e,n){return a(root.create(t),e,n)},glob.RedTeaWidget.prototype[t]=function(e,n){var i,s;return s=root.create(t),s.widget||(s.widget=this),null!=this.mainWidget&&(s.mainWidget=this.mainWidget),i=a(s,e,n),null!=this.dom?this.dom.appendChild(i):this.dom=i,i}},U=0,D=g.length;D>U;U++)f=g[U],m(f);for(glob.RedTea.textNode=function(t){return root.createTextNode(t)},glob.RedTea.tn=glob.RedTea.textNode,glob.RedTeaWidget.prototype.textNode=function(t){var e;return e=root.createTextNode(t),e.widget||(e.widget=this),null!=this.mainWidget&&(e.mainWidget=this.mainWidget),null!=this.dom?this.dom.appendChild(e):this.dom=e,e},glob.RedTeaWidget.prototype.tn=glob.RedTeaWidget.prototype.textNode,K=[HTMLElement.prototype,u.prototype],B=0,W=K.length;W>B;B++)c=K[B],c.textNode=function(t){var e;return e=root.createTextNode(t),e.widget=this.widget,e.mainWidget=this.mainWidget,this.appendChild(e),e},c.tn=HTMLElement.prototype.textNode;for(Y=["svg"],y=function(t){return HTMLElement.prototype[t]=function(e,n){var i;return i=root.createElementNS("http://www.w3.org/2000/svg",t),a(i,e,n),this.appendChild(i),i}},I=0,L=Y.length;L>I;I++)f=Y[I],y(f);for(G=["svg","path","rect","text","tspan"],_=function(t){return u.prototype[t]=function(e,n){var i;return i=root.createElementNS("http://www.w3.org/2000/svg",t),a(i,e,n),this.appendChild(i),i},glob.RedTea[t]=function(){return a(root.createElementNS("http://www.w3.org/2000/svg",t),p1,p2)}},$=0,R=G.length;R>$;$++)f=G[$],_(f);f=RT.div(),f.satr("ontouchstart","return;"),glob.isTouchDevice=typeof f.ontouchstart===RTC.FUNCTION_TYPE,glob.isWebKit=ne.call(document.documentElement.style,"WebkitAppearance")>=0,glob.isFirefox=navigator.userAgent.toLowerCase().indexOf("firefox")>-1,RT.onRequestOk=function(t){return 4===t.target.readyState&&200===t.target.status},RT.onRequestNotOk=function(t){return 4===t.target.readyState&&200!==t.target.status},RT.onRequestFinish=function(t){return 4===t.target.readyState}}).call(this);
