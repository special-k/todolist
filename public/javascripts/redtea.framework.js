(function(){var t,e,o,r={}.hasOwnProperty,n=function(t,e){function o(){this.constructor=t}for(var n in e)r.call(e,n)&&(t[n]=e[n]);return o.prototype=e.prototype,t.prototype=new o,t.__super__=e.prototype,t};t=function(e){return e.isWidget?t(e.dom):e},glob.ImageAnimator=function(){function t(t,e,o,r,n){this.loader=t,this.animHash=e,this.w=o,this.h=r,this.delta=null!=n?n:0,this.startTime=(new Date).getTime(),this.images=this.loader.images,this.requiredImages=[],this.usingImages=this.imagesList(this.animHash)}var e,o,r,n;return e="canvas",n="string",o="2d",r=root.create(e),t.prototype.isRequiresLoaded=!1,t.prototype.isRequiresLoading=!1,t.prototype.imagesList=function(t,e){var o,r,s,i;for(null==e&&(e=[]),i=t.images,r=0,s=i.length;s>r;r++)o=i[r],typeof o===n?e.push(o):this.imagesList(o,e);return e},t.prototype.doLoadRequires=function(){var t,e,o,r,n;for(this.isRequiresLoading=!0,this.isRequiresLoaded=!0,r=this.usingImages,n=[],e=0,o=r.length;o>e;e++)t=r[e],null==this.loader.loaded[t]?(this.isRequiresLoaded=!1,this.requiredImages.push(t),n.push(this.loader.load(t,this.onLoad,this))):n.push(void 0);return n},t.prototype.onLoad=function(t,e){var o;return o=this.requiredImages.indexOf(e),this.requiredImages.splice(o,1),0===this.requiredImages.length?this.isRequiresLoaded=!0:void 0},t.prototype.image=function(){return this.isRequiresLoaded?(this.timeLost=(new Date).getTime()-this.startTime,this.parseAnimHash(this.animHash)):(this.isRequiresLoading||this.doLoadRequires(),r)},t.prototype.parseAnimHash=function(t){var r,s,i,a,u,h,l,p,g;if(r=root.create(e),r.width=this.w,r.height=this.h,s=r.getContext(o),s.translate(this.w/2,this.h/2),null!=t.transforms){g=t.transforms;for(u in g)h=g[u],s[u].apply(s,h)}if(a=null!=t.anim?(null==t.period?t.period=1e3:void 0,t.images[Math.floor((this.timeLost+this.delta)%(t.images.length*t.period)/t.period)]):t.images,typeof a!==n&&null!=a.length)for(l=0,p=a.length;p>l;l++)i=a[l],this.drawImageOrParseHash(i,s);else this.drawImageOrParseHash(a,s);return r},t.prototype.drawImageOrParseHash=function(t,e){var o;return o=typeof t===n?this.images[t]:this.parseAnimHash(t),e.drawImage(o,-o.width/2,-o.height/2,o.width,o.height)},t}(),RT.Stratum=function(t){function e(){this.managers={}}return n(e,t),e.prototype.addManager=function(t,e){if(null!=this.managers[t])throw"object with this name already added";return e.init(this,t),this.fire("onAddManager:"+t,e),this.fire("onAddManager",e),this.managers[t]=e},e.prototype.updateManager=function(){},e.prototype.removeManager=function(t){if(null==this.managers[t.name])throw"object with this name not added";return t.destroy(),delete this.managers[name]},e.prototype.setBaseControls=function(){return this.managers.controlsGenerator.clear(),this.managers.controlsManager.clear(),this.baseControls()},e}(RT.Observable),RT.BaseManager=function(t){function o(){return e=o.__super__.constructor.apply(this,arguments)}return n(o,t),o.prototype.managers=[],o.prototype.init=function(t,e){return this.stratum=t,this.name=e,this.setManagers(),this.setListeners()},o.prototype.setManagers=function(){var t,e,o,r,n,s;for(n=this.managers,s=[],o=0,r=n.length;r>o;o++)e=n[o],t=this.stratum.managers[e],null!=t?this.initManager(this.stratum,t):this.stratum.bi("onAddManager:"+e,this.initManager,{context:this}),s.push(this.stratum.bi("onUpdateManager"+e,this.initManager,{context:this}));return s},o.prototype.initManager=function(t,e){var o;return this.stratum=t,this[e.name]=e,o=this[""+e.name+"Loaded"],null!=o&&o.call(this),this.fire(""+e.name+"Loaded",e)},o.prototype.setListeners=function(){},o}(RT.Observable),RT.ImagesLoaderManager=function(t){function e(t,e){this.imageDir=t,this.imageFormat=null!=e?e:"png",this.images={},this.loading={},this.loaded={}}var o;return n(e,t),o="onload",e.prototype.load=function(t,e,r){var n,s=this;return null==this.loading[t]&&(n=new Image,this.images[t]=n,this.loading[t]=1,n.onload=function(){return s.loaded[t]=1,s.fire(o,n),s.fire(""+o+t,n)},n.onerror=this.onError,n.src=""+this.imageDir+"/"+t+"."+this.imageFormat),null!=e?this.bi(""+o+t,e,{context:r,maxCount:1}):void 0},e.prototype.onError=function(t){return console.log("LoadError"),console.log(t.target.src),console.log(t)},e}(RT.BaseManager),RT.ControlsKitManager=function(t){function e(){this.kits={}}return n(e,t),e.prototype.managers=["controlsManager","controlsGenerator"],e.prototype.setListeners=function(){},e.prototype.addKit=function(t,e){return this.kits[t]=e},e.prototype.setKit=function(t){return this.controlsGenerator.clear(),this.controlsManager.clear(),this.kits[t](this.controlsManager,this.controlsGenerator)},e}(RT.BaseManager),RT.ControlsGenerator=function(t){function e(){this.controlsNames=[]}return n(e,t),e.prototype.managers=["controlsManager"],e.prototype.setListeners=function(){},e.prototype.addControlName=function(t){if(this.controlsNames.push(t),!Control[t].isUsingGenerator)throw"isBelongsToFeature should be true for features controls"},e.prototype.removeControlName=function(t){return this.controlsNames.splice(this.controlsNames.indexOf(t),1)},e.prototype.clear=function(){var t;for(t=[];this.controlsNames.length>0;)t.push(this.removeControlName(this.controlsNames[0]));return t},e}(RT.BaseManager),RT.ControlsManager=function(t){function e(){this.controls=[],this.toggleGroups={}}return n(e,t),e.prototype.setListeners=function(){},e.prototype.addControl=function(t){return this.controls.push(t),this.setToggleGroup(t),t.init(this.stratum)},e.prototype.removeControl=function(t){return this.controls.splice(this.controls.indexOf(t),1),this.unsetToggleGroup(t),t.destroy()},e.prototype.setToggleGroup=function(t){return null!=t.toggleGroupeName&&(t.toggleGroupe=this.getToggleGroup(t.toggleGroupeName),t.toggleGroupe.bi("onDeactivate",t.deactivate,{context:t}),t.isDefaultToggleControl)?t.toggleGroupe.bi("onActivateDefault",t.activate,{context:t}):void 0},e.prototype.unsetToggleGroup=function(t){return null!=t.toggleGroupeName&&(t.toggleGroupe.unbi("onDeactivate",t.deactivate,t),t.isDefaultToggleControl)?t.toggleGroupe.unbi("onActivateDefault",t.activate,t):void 0},e.prototype.getToggleGroup=function(t){return null!=this.toggleGroups[t]?this.toggleGroups[t]:this.toggleGroups[t]=new Observer(this)},e.prototype.clear=function(){var t;for(t=[];this.controls.length>0;)t.push(this.removeControl(this.controls[0]));return t},e}(RT.BaseManager),RT.ControlsPanelsManager=function(e){function o(){o.__super__.constructor.apply(this,arguments),this.widgets={}}var r,s;return n(o,e),r="added",s="Event",o.prototype.setPanel=function(t,e){return this[t]=e,this.widgets[t]=[]},o.prototype.showIn=function(t,e){return this[t].remChilds(),this.widgets[t].length=0,this.append(t,e)},o.prototype.clear=function(t){return this[t].remChilds(),this.widgets[t].length=0},o.prototype.append=function(e,o,n){var i,a;return a=this[e],a.add(o,n),this.widgets[e].push(o),i=document.createEvent(s),i.initEvent(r,!0,!0),t(o).dispatchEvent(i)},o}(RT.BaseManager),RT.BaseControl=function(t){function e(t){var e,o;if(null!=t)for(e in t)o=t[e],this[e]=o;this.doms=[]}return n(e,t),e.isUsingGenerator=!1,e.prototype.managers=["controlsPanelsManager"],e.prototype.addElements=function(){var t,e,o,r,n;for(r=this.doms,n=[],e=0,o=r.length;o>e;e++)t=r[e],n.push(this.stratum.managers.controlsPanelsManager[this.panel].add(t));return n},e.prototype.controlsPanelsManagerLoaded=function(){return this.bindElements(),this.constructor.isUsingGenerator?void 0:this.addElements()},e.prototype.active=!1,e.prototype.strategies=[],e.prototype.activate=function(){throw"You should implement method activate"},e.prototype.deactivate=function(){throw"You should implement method deactivate"},e.prototype.bindElements=function(){throw"You should implement method bindElements"},e.prototype.setListeners=function(){},e.prototype.destroy=function(){var t,e,o,r;for(r=this.doms,e=0,o=r.length;o>e;e++)t=r[e],t.removeSelf();return delete this.doms,delete this.imageAnimator},e.prototype.update=function(){throw"You should implement method update"},e.prototype.draw=function(){},e}(RT.BaseManager),RT.SimpleControl=function(t){function e(){return o=e.__super__.constructor.apply(this,arguments)}var r,s;return n(e,t),e.prototype.buttonClass="controlButton",e.prototype.iconClass="standart",e.prototype.toggleGroupeName=null,e.prototype.activateOnStart=!1,r="onActivateDefault",s="onDeactivate",e.prototype.bindElements=function(){return this.doms.push(RT.delayButton({classes:[this.buttonClass,this.iconClass]}).bi(RTC.CLICK,"toggleActive",{context:this}))},e.prototype.activate=function(){return this.toggleGroupe&&this.toggleGroupe.fire(s),this.active=!0,this.doms[0].addCls(RTC.ON)},e.prototype.deactivate=function(){return this.active=!1,this.doms[0].remCls(RTC.ON)},e.prototype.toggleActive=function(t,e){return this.active?null!=this.toggleGroupe?this.toggleGroupe.fire(r):this.deactivate(t,e):this.activate(t,e),e.stopPropagation(),e.preventDefault()},e.prototype.destroy=function(){return this.doms[0].unbi(RTC.CLICK,"toggleActive",{context:this}),e.__super__.destroy.apply(this,arguments)},e}(RT.BaseControl),RT.Storage=function(){function t(){}return t.getObjectsByPath=function(t){var e,o,r;o=[];for(e in localStorage)r=localStorage[e],e.substring(0,t.length+1)===""+t+"/"&&o.push([e,r]);return o.sort(function(e,o){return parseInt(e[0].substring(t.length+1,e[0].length))-parseInt(o[0].substring(t.length+1,o[0].length))}).map(function(t){return JSON.parse(t[1])})},t.pushObject=function(t,e){var o,r;return o=new Date,r=""+t+"/"+(new Date).getTime(),e.id=r,localStorage.setItem(r,JSON.stringify(e))},t.set=function(t,e){return localStorage.setItem(t,JSON.stringify(e))},t["delete"]=function(t){return localStorage.removeItem(t)},t}()}).call(this);
