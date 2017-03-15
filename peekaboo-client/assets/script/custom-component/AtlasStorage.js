
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
        bulletPrefab: cc.Prefab,// 子弹预制体
    },

    onLoad: function () {
        instance = this;
    },

    // 获取道具图片
    getItemSprite: function(id){
        return this.itemAtlas._spriteFrames['item_'+id];
    },

    // 创建一个子弹
    createrBullet: function () {
        return cc.instantiate(this.bulletPrefab);
    }
    
});
