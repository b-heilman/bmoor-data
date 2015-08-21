;(function(){
/** bmoor-data v0.0.1 **/
bMoor.make("bmoor.data.collection.Sortable",["bmoor.extender.Decorator","bmoor.flow.Regulator",function(t,o){return{parent:t,construct:function(t){this.$sorter=t},properties:{_$extend:function(o){this.$sorter&&(o.$sorter=this.$sorter),t.prototype._$extend.call(this,o)},_insert:function(t){return this.$sort||(this.$sort=new o(5,200,function(t){t.$sorter&&t.sort(t.$sorter)})),this.$sort(this),this.$old(t)}}}}]);
}());