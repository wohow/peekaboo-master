
var AtlasStorage = require('AtlasStorage');
var Tween = require('TweenLite');
var Timeline = require('TimelineLite');

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
        this.animation = null;
    },

    setNickname: function(nickname){
        this.nicknameTxt.string = nickname;
    },

    // 设置精灵
    setItemSpr: function (id) {
        this.itemSpr.spriteFrame = AtlasStorage().getItemSprite(id);
    },

    // 被发现
    wasfound: function (argument) {
        var role = this.node.parent.getComponent('binRole');
        if(role.isWasfound){
            return;
        }
        // console.log(this.nicknameTxt.string, ' 被发现');
        role.isWasfound = true;
        // 把碰撞关掉
        var collider = this.node.getComponent(cc.BoxCollider);
        collider.enabled = false;
        // 播放动画
        var self = this;
        let tl = new Timeline();
        tl.add([
            Tween.to(self.itemSpr.node, 0.3, {scale: 0, onComplete: function(){
                self.setItemSpr(0);
            }}),
            Tween.to(self.itemSpr.node, 0.3, {scale: 1.2}),
            Tween.to(self.itemSpr.node, 0.3, {scale: 1}),
            ], '', 'sequence');
        tl.play();
    }

});
