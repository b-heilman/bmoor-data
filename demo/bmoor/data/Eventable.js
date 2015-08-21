;(function(){
/** bmoor-data v0.0.1 **/
bMoor.make("bmoor.data.Eventable",["bmoor.extender.Mixin",function(e){return{parent:e,properties:{$on:function(e,t){return this._$listeners||(this._$listeners={}),this._$listeners[e]||(this._$listeners[e]=[]),this._$listeners[e].push(t),function(){bMoor.array.remove(this.$$listeners[e],t)}},$trigger:function(e,t){var r,s,i;if(this._$listeners&&(r=this._$listeners[e]))for(s=0,i=r.length;i>s;s++)r[s](t)}}}}]);
}());