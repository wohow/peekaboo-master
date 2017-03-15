
var AtlasStorage = require('AtlasStorage');

/**
 * 躲 角色
 */
cc.Class({
    extends: cc.Component,

    properties: {
        itemSpr: cc.Sprite,
        nicknameTxt: cc.Label
    },

    onLoad: function(){
    },

    setNickname: function(nickname){
        this.nicknameTxt.string = nickname;
    },

    // 设置精灵
    setItemSpr: function (id) {
        this.itemSpr.spriteFrame = AtlasStorage().getItemSprite(id);
    },

});
