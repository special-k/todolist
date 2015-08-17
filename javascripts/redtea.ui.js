/*
This is RedTea v0.3 - js library

TERMS OF USE RedTea

RedTea is licensed under a commercial and CC BY-SA-NC licenses.

I want to make sure that you are fully aware of
the license types of RedTea and which is the correct one to
use based on your development project. 
It is important that you are in the know of the requirements of developing under CC BY-SA-NC.
Learn about the CC BY-SA-NC requirements here http://creativecommons.org/licenses/by-nc-sa/3.0/deed.ru

Questions about the RedTea commercial license?
I recommend contact with me special-k@li.com for more information on the RedTea commercial license, 
what it enables and how you can start developing with it.

Copyright © 2012-2015 Kirill Jakovlev
*/
(function(){var t,e,i,s,o,n,r,l={}.hasOwnProperty,h=function(t,e){function i(){this.constructor=t}for(var s in e)l.call(e,s)&&(t[s]=e[s]);return i.prototype=e.prototype,t.prototype=new i,t.__super__=e.prototype,t};glob.RedTeaUI||(glob.RedTeaUI={}),RedTeaUI.BaseWidget=function(t){function e(t){var e,i;if(null!=t)for(e in t)i=t[e],this[e]=i}return h(e,t),e.prototype.destroy=function(){return this.removeSelf(),delete this.dom},e}(RedTeaWidget),RedTeaUI.VeriField=function(t){function e(){e.__super__.constructor.apply(this,arguments),this.classes||(this.classes=[]),this.classes.push(n),this.classes.push(r),this.classes.push(i),this.field=this.input({"class":this.classes.join(o)}).bi(RTC.KEYUP,this.onKeyUp,{context:this}).bi(RTC.FOCUS,this.onFocus,{context:this}),this.loadedResults={}}var i,s,o,n,r;return h(e,t),s="onResult",e.prototype.dir="/field/verification",e.prototype.timeout=1e3,e.prototype.isSaving=!1,e.prototype.reqSending=!1,e.prototype.isChecking=!1,e.prototype.lastValue="",e.prototype.alreadyFocused=!1,n="ui",r="veriField",i="notFocused",o=" ",e.register(r),e.prototype.onKeyUp=function(){return this.lastValue!==this.field.value&&this.checksThroughDelay(),this.lastValue=this.field.value},e.prototype.onFocus=function(){return this.alreadyFocused?void 0:(this.alreadyFocused=!0,this.field.remCls(i))},e.prototype.checksThroughDelay=function(){var t=this;return this.reqSending||this.isChecking?void 0:(this.isChecking=!0,setTimeout(function(){return t.isChecking=!1,t.sendedValue!==t.field.value?t.startChecks():void 0},this.timeout))},e.prototype.onComlete=function(t,e){var i;return 4===e.target.readyState&&200===e.target.status&&(this.reqSending=!1,i=JSON.parse(e.target.responseText),this.loadedResults[this.sendedValue]=i,this.action(i,this.sendedValue)),4===e.target.readyState&&200!==e.target.status&&(this.reqSending=!1,this.field.value!==this.sendedValue)?this.startChecks():void 0},e.prototype.action=function(t,e){return this.fire(s,t,e)},e.prototype.startChecks=function(){var t,e;return t=this.field.value,this.sendedValue=t,null!=this.loadedResults[t]?this.action(this.loadedResults[t],t):this.parse(t)?(this.reqSending=!0,e=new XMLHttpRequest,e.bi(RTC.READYSTATECHANGE,this.onComlete,{context:this}),e.open(RTC.GET,""+this.dir+"/"+t),e.send()):void 0},e.prototype.parse=function(){return!0},e}(RedTeaUI.BaseWidget),RedTeaUI.Mask=function(e){function i(){return t=i.__super__.constructor.apply(this,arguments)}var s,o;return h(i,e),o="ui",s="mask",i.register(s),i.prototype.timeInterval=100,i.prototype.moveX=!0,i.prototype.moveY=!0,i.prototype.createDom=function(){return this.div({"class":this.withParamsClasses(""+o+" "+s)})},i.prototype.init=function(){return glob.isTouchDevice?(this.dom.bi(RTC.TOUCHSTART,this.onmousedown,{context:this}),glob.bi(RTC.TOUCHEND,this.onmouseup,{context:this})):(this.dom.bi(RTC.MOUSEDOWN,this.onmousedown,{context:this}),glob.bi(RTC.MOUSEUP,this.onmouseup,{context:this}))},i.prototype.onmousedown=function(t,e){var i,s=this;return null==this.movablePanel&&this.setMovablePanel(),null!=this.intervalId&&clearInterval(this.intervalId),null!=e.touches&&(e=e.touches[0]),glob.isTouchDevice?glob.bi(RTC.TOUCHMOVE,this.onmousemove,{context:this}):glob.bi(RTC.MOUSEMOVE,this.onmousemove,{context:this}),i=this.movablePanel.getBoundingClientRect(),this.movablePanelWidth=i.width,this.movablePanelHeight=i.height,i=this.dom.getBoundingClientRect(),this.maskWidth=i.width,this.maskHeight=i.height,this.x=e.clientX,this.y=e.clientY,this.clientX=this.x,this.clientY=this.y,this.elX=parseFloat(this.movablePanel.style.marginLeft)||0,this.elY=parseFloat(this.movablePanel.style.marginTop)||0,this.intervalId=setInterval(function(){return s.setPosition()},this.timeInterval)},i.prototype.onmouseup=function(){return clearInterval(this.intervalId),delete this.intervalId,glob.isTouchDevice?glob.unbi(RTC.TOUCHMOVE,this.onmousemove,{context:this}):glob.unbi(RTC.MOUSEMOVE,this.onmousemove,{context:this})},i.prototype.onmousemove=function(t,e){return e.preventDefault(),null!=e.touches&&(e=e.touches[0]),this.newClientX=e.clientX,this.newClientY=e.clientY},i.prototype.coordCorrect=function(t,e,i,s,o,n){var r;return r=t+s-e,0>r&&n>r+o?o>n?e+s-i:e:r>0&&r+o>n&&o>n?e+s-i:e},i.prototype.clientCorrect=function(t,e,i,s,o,n){var r;return r=t+s-e,0>r&&r+o>n?s:0>r&&n>r+o?o>n?e-t-o+n:e-t:r>0&&n>r+o?s:r>0&&r+o>n?o>n?e-t:e-t+n-o:o===n?e-t:s},i.prototype.setMovablePanel=function(){return this.movablePanel=this.dom.firstChild,this.movablePanelStyle=this.movablePanel.style},i.prototype.unsetMovablePanel=function(){return delete this.movablePanel,delete this.movablePanelStyle},i.prototype.setPosition=function(){var t;return t=!1,this.moveX?this.newClientX!==this.oldClientX&&(t=!0,this.oldClientX=this.newClientX,this.clientX=this.clientCorrect(this.elX,this.x,this.clientX,this.newClientX,this.movablePanelWidth,this.maskWidth)):this.clientX=this.x,this.moveY?this.newClientY!==this.oldClientY&&(t=!0,this.oldClientY=this.newClientY,this.clientY=this.clientCorrect(this.elY,this.y,this.clientY,this.newClientY,this.movablePanelHeight,this.maskHeight)):this.clientY=this.y,t?this.movablePanelStyle.margin=""+(this.elY+this.clientY-this.y)+"px 0 0 "+(this.elX+this.clientX-this.x)+"px":void 0},i}(RedTeaWidget),RedTeaUI.DelayButton=function(t){function i(){return e=i.__super__.constructor.apply(this,arguments)}var s,o,n,r,l;return h(i,t),l="ui",s="delayButton",n="onClick",o="disabled",r="pressed",i.register(s),i.prototype.isPressed=!1,i.prototype.isDisabled=!1,i.prototype.isStateful=!1,i.prototype.timeout=200,i.prototype.createDom=function(){return this.a({href:RTC.EMPTY_HREF,"class":this.withParamsClasses(""+l+" "+s)}).bi(RTC.CLICK,this.onClick,{context:this}).notClickTimout(this.timeout)},i.prototype.onClick=function(t,e){return e.preventDefault(),t.notClick||this.isDisabled?void 0:(this.isStateful&&(this.isPressed?this.unpress():this.press()),this.fire(n))},i.prototype.enable=function(){return this.dom.remCls(o),this.isDisabled=!1},i.prototype.disable=function(){return this.dom.addCls(o),this.isDisabled=!0},i.prototype.press=function(){return this.dom.addCls(r),this.isPressed=!0},i.prototype.unpress=function(){return this.dom.remCls(r),this.isPressed=!1},i}(RedTeaWidget),RedTeaUI.DelayDivButton=function(t){function e(){return i=e.__super__.constructor.apply(this,arguments)}var s,o;return h(e,t),o="ui",s="delayDivButton",e.register(s),e.prototype.createDom=function(){return this.div({"class":this.withParamsClasses(""+o+" "+s)}).bi(RTC.CLICK,this.onClick,{context:this}).notClickTimout(this.timeout)},e}(RedTeaUI.DelayButton),RedTeaUI.LinkButton=function(t){function e(){return s=e.__super__.constructor.apply(this,arguments)}var i,o,n;return h(e,t),n="ui",i="linkButton",o="onClick",e.register(i),e.prototype.createDom=function(){return this.a({href:RTC.EMPTY_HREF,"class":this.withParamsClasses(""+n+" "+i)}).bi(RTC.CLICK,this.onClick,{context:this})},e.prototype.onClick=function(t,e){return e.preventDefault(),this.isDisabled?void 0:(this.isStateful&&(this.isPressed?this.unpress():this.press()),this.fire(o))},e}(RedTeaUI.DelayButton),RedTeaUI.SlideCounter=function(t){function e(){return o=e.__super__.constructor.apply(this,arguments)}var i,s,n,r;return h(e,t),n="ui",s="slideCounter",i="onValue",r="valueEl",e.register(s),e.prototype.value=0,e.prototype.preciseValue=0,e.prototype.interval=100,e.prototype.oldValue=0,e.prototype.lock=!1,e.prototype.wait=!1,e.prototype.waitTimeout=3e3,e.prototype.speedKoef=1,e.prototype.step=1,e.prototype.createDom=function(t){return this.div({"class":this.withParamsClasses(""+n+" "+s)},function(){return this.span(function(){return this.tn(t.value).setta(r,t)})})},e.prototype.init=function(){return this.preciseValue=this.value,glob.isTouchDevice?(this.dom.bi(RTC.TOUCHSTART,"start",{context:this}),glob.bi(RTC.TOUCHEND,"stop",{context:this})):(this.dom.bi(RTC.MOUSEDOWN,"start",{context:this}),glob.bi(RTC.MOUSEUP,"stop",{context:this}))},e.prototype.start=function(t,e){var i=this;return e.stopPropagation(),e.preventDefault(),this.lock=!0,this.wait=!1,null!=e.touches&&(e=e.touches[0]),glob.isTouchDevice?glob.bi(RTC.TOUCHMOVE,"move",{context:this}):glob.bi(RTC.MOUSEMOVE,"move",{context:this}),this.y=e.clientY,this.newY=e.clientY,this.intervalId=setInterval(function(){return i.calculate()},this.interval)},e.prototype.stop=function(){var t=this;return this.lock?(this.lock=!1,clearInterval(this.intervalId),delete this.intervalId,glob.isTouchDevice?glob.unbi(RTC.TOUCHMOVE,"move",{context:this}):glob.unbi(RTC.MOUSEMOVE,"move",{context:this}),this.wait=!0,setTimeout(function(){return t.wait&&t.oldValue!==t.value&&(t.oldValue=t.value,t.fire(i,t.value)),t.wait=!1},this.waitTimeout)):void 0},e.prototype.move=function(t,e){return null!=e.touches&&(e=e.touches[0]),this.newY=e.clientY},e.prototype.calculate=function(){var t,e;return t=this.newY-this.y,this.y=this.newY,e=0!==t?t/Math.abs(t):1,this.speed=e*t*t/50*this.speedKoef,this.preciseValue-=this.speed,null!=this.minValue&&this.preciseValue<this.minValue&&(this.preciseValue=this.minValue),null!=this.maxValue&&this.preciseValue>this.maxValue&&(this.preciseValue=this.maxValue),this.value=Math.round(this.preciseValue/this.step)*this.step,this.valueEl.nodeValue=this.value},e.prototype.update=function(t){return this.lock||this.wait?void 0:(this.preciseValue=t,this.value=t,this.oldValue=t,this.valueEl.nodeValue=this.value)},e.prototype.setValue=function(t){return this.value=t,this.preciseValue=this.value,this.valueEl.nodeValue=this.value,this.fire(i,this.value)},e}(RedTeaWidget),RedTeaUI.RadioGroup=function(t){function e(){return n=e.__super__.constructor.apply(this,arguments)}var i,s,o,r,l;return h(e,t),l="ui",r="radioGroup",o="radio",s="onClick",i="onCheck",e.register(r),e.prototype.createDom=function(){return this.div({"class":this.withParamsClasses(""+l+" "+r)})},e.prototype.isFirstChildUpdate=!0,e.prototype.init=function(){return this.buttons=[],this.value=this.defaultValue},e.prototype.add=function(t){return this.addHelper(this.dom,t),this.updateChildren()},e.prototype.updateChildren=function(){var t,e,n,r,l;for(l=this.dom.childNodes,n=0,r=l.length;r>n;n++)t=l[n],e=t.widget,null!=t.hasCls&&t.hasCls(o)&&(this.isFirstChildUpdate||-1===this.buttons.indexOf(e))&&(t.widget.bi(s,i,{context:this}),this.buttons.push(e),this.value===e.value&&this.onCheck(e));return this.isFirstChildUpdate=!1},e.prototype.onCheck=function(t){return null!=this.selectedButton&&this.selectedButton.unpress(),this.selectedButton=t,this.value=t.value,t.press(),this.fire(i,this.value)},e.prototype.getValue=function(){return this.value},e.prototype.drop=function(){var t,e,i,s,o;for(this.value=this.defaultValue,s=this.buttons,o=[],e=0,i=s.length;i>e;e++){if(t=s[e],t.value===this.value){this.onCheck(t);break}o.push(void 0)}return o},e}(RedTeaWidget),RedTeaUI.Dropdown=function(t){function e(){return r=e.__super__.constructor.apply(this,arguments)}var i,s,o,n,l,a,u,c,p,d,v,y,f;return h(e,t),s="dropdown",f="ui",a="onClick",u="onToggleShowPanel",c="onGlobalHidePanel",o="hidePanel",n="itemName",i="arrow",v="panel",y="showPanel",l="nameEl",p="onHidePanel",d="onShowPanel",e.register("dropdown"),e.prototype.withArrow=!0,e.prototype.name="",e.prototype.init=function(){return window.bi(c,o,{context:this}),window.bi(RTC.CLICK,c,{context:this}),window.bi(RTC.BEFOREUNLOAD,o,{context:this})},e.prototype.createDom=function(t){return this.div({"class":this.withParamsClasses(s)},function(){return this.delayButton({classes:n}).bi(a,u,{context:t}).add(function(){return this.tn(t.name).setas(l,t),t.withArrow?this.div({"class":i}):void 0}),this.div({"class":v}).setas(v,t)})},e.prototype.add=function(t){return this.addHelper(this.panel,t)},e.prototype.onToggleShowPanel=function(){return this.hasCls(y)?this.hidePanel():this.showPanel()},e.prototype.hidePanel=function(){return this.hasCls(y)?(this.dom.remCls(y),this.fire(p)):void 0},e.prototype.showPanel=function(){return this.hasCls(y)?void 0:(this.dom.addCls(y),this.fire(d))},e.prototype.onGlobalHidePanel=function(t,e){return this.dom.contains(e.target)?void 0:this.hidePanel()},e.prototype.setName=function(t){return this.name=t,this.nameEl.nodeValue=t},e}(RedTeaWidget)}).call(this);