
var MapInfo = require('MapInfo');
var AtlasStorage = require('AtlasStorage');
var utils = require('utils');
var Tween = require('TweenLite');
// var EasePack = require('EasePack');

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
        this.isWasfound = false;
        this.isMove = false;
    },

    init: function(data, entity){
        this.uid = data.uid;
        this.entity = entity;
        this.entity.setNickname(data.nickname);
    },

    //
    nicknameColor: function() {
        this.entity.nicknameColor();
    },

    // 设置方向
    setFlipX: function(dir){
        if( (dir < 0 && this.entity.body.scaleX < 0) || (dir > 0 && this.entity.body.scaleX > 0) ){
            this.entity.body.scaleX *= -1;
        }
    },

    // 开火
    fire: function (startPos, targetPos) {
        var anim = this.entity.animation;
        anim.stop('role_attack');
        anim.play('role_attack');
        this.isPlayFireAnim = true;
        // 改变角色方向
        this.setFlipX(targetPos.x - startPos.x);
        // 创建一个子弹
        var prefab = AtlasStorage().createrBullet();
        MapInfo().addBullet(prefab);// 加入地图
        // 开始移动
        var bin = prefab.getComponent('binBullet');
        bin.move(startPos, targetPos);
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

    // 移动
    move: function(direction, isNoCheckCollide){
        if(this.entity.body){
            this.setFlipX(direction.x);
        }
        var pos = MapInfo().isWallCollide(this.node.position, direction);
        // this.node.position = pos;
        this.isMove = true;
        Tween.to(this.node, 0.05, {x: pos.x, y: pos.y, onComplete: ()=> {
            this.isMove = false;
        }});
    },

    update: function(dt){
        if(this.entity === null || this.isWasfound)
            return;
        if(this.isPlayFireAnim){
            var animState = this.entity.animation.getAnimationState('role_attack');
            if(!animState.isPlaying){
                this.isPlayFireAnim = false;
            }
        } else if(this.direction.x === 0 && this.direction.y === 0){
            this.playAnim('role_idle');
        } else {
            this.playAnim('role_run');
            if(!this.isMove){
                this.move(this.direction);
            }
        }
    },

});
