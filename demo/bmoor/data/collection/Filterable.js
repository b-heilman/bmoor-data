;(function(){
/** bmoor-data v0.0.1 **/
bMoor.make("bmoor.data.collection.Filterable",["bmoor.extender.Decorator",function(t){"use strict";return{parent:t,construct:function(t){this.$filter=t},properties:{_$extend:function(e){this.$filter&&(e.$filter=this.$filter),t.prototype._$extend.call(this,e)},_canInsert:function(t){return this.$filter(t)?this.$old(t):void 0}}}}]);
}());