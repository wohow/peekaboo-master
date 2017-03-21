
var MapInfo = require('MapInfo');
var AtlasStorage = require('AtlasStorage');
var utils = require('utils');
var consts = require('consts');

/**
 * 角色
 * 在里面控制移动
 */
cc.Class({
    extends: cc.Component,

    properties: {
        entity: null,// 实体类
    },

    onLoad: function(){
    },

    init: function(data, entity){
        this.speed = data.speed;
        this.uid = data.uid;
        this.camp = data.camp;
        this.entity = entity;
        this.entity.setNickname(data.nickname);
    },

    startEvent: function () {
        // this.schedule(this.smoothMove, 0.01);
    },

    stopEvent: function () {
        // this.unschedule(this.smoothMove);
    },

    //
    nicknameColor: function() {
        this.entity.nicknameColor();
    },

    // 设置方向
    setFlipX: function(dir){
        if(!this.entity.body){
            return;
        }
        if( (dir < 0 && this.entity.body.scaleX < 0) || (dir > 0 && this.entity.body.scaleX > 0) ){
            this.entity.body.scaleX *= -1;
        }
    },

    playAnim: function(animName){
        var anim = this.entity.animation;
        if(!this.entity.animation)
            return;
        var animState = anim.getAnimationState(animName);
        if(!animState.isPlaying){
            anim.play(animName);
        }
    },

    // 开火
    fire: function (startPos, targetPos) {
        this.isPlayFireAnim = true;
        var anim = this.entity.animation;
        anim.stop('role_attack');
        anim.play('role_attack');
        // 扣除子弹
        this.entity.deductBulletCount(1);
        // 改变角色方向
        this.setFlipX(targetPos.x - startPos.x);
        // 创建一个子弹
        var prefab = AtlasStorage().createrBullet();
        MapInfo().addBullet(prefab);// 加入地图
        // 开始移动
        var bin = prefab.getComponent('binBullet');
        bin.move(this.entity, startPos, targetPos);
    },

    // 更新开火
    updateFire: function (startPos, targetPos) {
        this.fire(startPos, targetPos);
    },

    applyMove: function (pressTime) {
        this.setFlipX(pressTime.x);
        this.node.x += pressTime.x*this.speed;
        this.node.y += pressTime.y*this.speed;
    },

    isCanMove: function (pressTime) {
        var pos = MapInfo().isWallCollide(this.node.position, {x: pressTime.x*this.speed, y: pressTime.y*this.speed});
        var x = (pos.x - this.node.x)/this.speed;
        var y = (pos.y - this.node.y)/this.speed;
        return {x: x, y: y};
    },

    update: function () {
        if(!this.isPlayFireAnim){
            return;
        }
        var anim = this.entity.animation;
        var animState = anim.getAnimationState('role_attack');
        if(!animState.isPlaying){
            this.isPlayFireAnim = false;
        }
    }

});
