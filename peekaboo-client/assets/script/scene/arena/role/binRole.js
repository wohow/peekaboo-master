
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
        this.direction = cc.p(0,0);
        this.isMove = false;
    },

    init: function(data, entity){
        this.uid = data.uid;
        this.camp = data.camp;
        this.speed = (data.camp+1) * 2;
        this.entity = entity;
        this.entity.setNickname(data.nickname);
        // 期望位置
        this.expectPosition = this.node.position;
    },

    startEvent: function () {
        this.schedule(this.smoothMove, 0.01);
    },

    stopEvent: function () {
        this.unschedule(this.smoothMove);
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
        this.expectPosition = this.node.position;
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

    // 更新移动
    updateMove: function (direction, position) {
        consts.sIsRC = false;
        if(this.isPlayFireAnim)
            return;
        if(direction.x === 0 && direction.y === 0){
            this.playAnim('role_idle');
            return;
        }
        this.setFlipX(direction.x);
        this.playAnim('role_run');

        this.expectPosition = MapInfo().isWallCollide(position, direction);
    },

    smoothMove: function () {
        if(this.isPlayFireAnim){
            var animState = this.entity.animation.getAnimationState('role_attack');
            if(!animState.isPlaying){
                this.isPlayFireAnim = false;
                this.playAnim('role_idle');
            }
        } else if(this.expectPosition.x != this.node.x || this.expectPosition.y != this.node.y){
            var x = utils.cTo1(this.expectPosition.x - this.node.x);
            var y = utils.cTo1(this.expectPosition.y - this.node.y);
            this.node.x += (2 * x);
            this.node.y += (2 * y);
        }
    },

});
