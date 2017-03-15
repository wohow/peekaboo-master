
/**
 * AtlasStorage 
 * 图集
 */
var instance = null;

module.exports = function(){
    return instance;
};

cc.Class({
    extends: cc.Component,

    properties: {
        itemAtlas: cc.SpriteAtlas,
    },

    onLoad: function () {
        instance = this;
    },

    // 获取道具图片
    getItemSprite: function(id){
        return this.itemAtlas._spriteFrames['item_'+id];
    }
});
