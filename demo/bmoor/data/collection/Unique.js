;(function(){
/** bmoor-data v0.0.1 **/
bMoor.make("bmoor.data.collection.Unique",["bmoor.extender.Decorator","bmoor.data.Collection",function(o,t){"use strict";return{parent:o,properties:{_canInsert:function(o){var t=bMoor.data.setUid(o);return this._$memory||(this._$memory={}),this._$memory[t]?(this._$memory[t]++,!1):this.$old(o)?(this._$memory[t]=1,!0):void 0},_canRemove:function(o){var t=bMoor.data.getUid(o);return this._$memory||(this._$memory={}),this._$memory[t]--,this.$old(o)&&!this._$memory[t]}}}}]);
}());