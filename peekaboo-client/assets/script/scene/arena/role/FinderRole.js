
var utils = require('utils');
var Tween = require('TweenLite');
var Timeline = require('TimelineLite');

const BULLET_COUNT = 15;// 子弹数量

/**
 * 找 角色
 */
cc.Class({
    extends: cc.Component,

    properties: {
        nicknameTxt: cc.Label,
        indicatorNode: cc.Node,// 指示器 
        body: cc.Node,
        bulletCountTxt: cc.Label,// 子弹数
        bulletCountTxt1: cc.Label,// 子弹数
        reloadBulletNode: cc.Node,// 换弹

        addBulletTxt: cc.Label,

    },

    onLoad: function () {
        this.indicatorNode.active = false;
        this.animation = this.body.getComponent(cc.Animation);
        this.isInfiniteBullet = false;
        this.isCanFire = true;
    },

    setNickname: function(nickname){
        this.nicknameTxt.string = nickname;
    },

    // 设置颜色
    nicknameColor: function () {
        this.nicknameTxt.node.color = cc.Color.GREEN;
    },

    setItemSpr: function (id) {  
    },
    death: function () {
    },

    // 是否显示指示器
    isShowIndicator: function (isShow) {
        this.indicatorNode.active = isShow;
    },

    // 旋转指示器
    updateIndicator: function(dir){
        Tween.killTweensOf(this.indicatorNode, false);
        Tween.to(this.indicatorNode, 0.01, {rotation: dir});
    },

    // 刷新子弹数量
    updateBulletCount: function () {
        this.bulletCountTxt.string = this.curBulletCount;
        this.bulletCountTxt1.string = this.curBulletCount;
    },

    // 扣除子弹数量
    deductBulletCount: function (count) {
        this.curBulletCount -= count;
        this.updateBulletCount();

        this.isCanFire = false;
        this.reloadBulletNode.height = 14;
        Tween.to(this.reloadBulletNode, 0.8, {height: 0, onComplete: ()=> {
            this.isCanFire = true;
            // 如果开启的无限子弹
            if(this.isInfiniteBullet){
                this.curBulletCount = Math.min(this.curBulletCount+1, BULLET_COUNT);
                this.updateBulletCount();
            }
        }});
    },

    // 子弹是否为空
    bulletIsEmpty: function () {
        return this.curBulletCount === 0;
    },

    // 无限子弹
    infiniteBullet: function (isOpen) {
        this.isInfiniteBullet = isOpen;
        this.curBulletCount = BULLET_COUNT;
        this.updateBulletCount();
    },

    // 获取子弹
    addBullet: function (count) {
        this.addBulletTxt.node.x = 45;
        this.addBulletTxt.node.opacity = 255;
        this.addBulletTxt.string = '+' + count;
        this.deductBulletCount(-count);
        // 缓动 动画
        var tl = new Timeline();
        tl.add([
            Tween.to(this.addBulletTxt.node, 0.3, {x: 30}),
            Tween.to(this.addBulletTxt.node, 0.5, {opacity: 0, delay: 1}),
            ], '', 'sequence');
        tl.play();
    }

});
