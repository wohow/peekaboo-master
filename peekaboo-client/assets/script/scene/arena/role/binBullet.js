
var Tween = require('TweenLite');
var utils = require('utils');
const range = 300;

/**
* 子弹
*/
cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad: function () {
    },

    // 移动到目标位置
    move: function(startPos, targetPos){
        this.node.rotation = 90 - utils.rotation(startPos, targetPos);
        this.node.position = startPos;
        var distance = cc.pDistance(startPos, targetPos);
        var ratio = range / distance;
        var rx = (targetPos.x - startPos.x) * ratio;
        var ry = (targetPos.y - startPos.y) * ratio;
        var nx = rx + startPos.x;
        var ny = ry + startPos.y;

        Tween.to(this.node, 0.4, {x: nx, y: ny, onComplete: ()=>{
            this.toDestroy();
        }});
    },

    toDestroy: function(){
        Tween.killTweensOf(this.node, false);
        Tween.to(this.node, 0.5, {opacity: 0, onComplete: ()=>{
            this.node.destroy();
        }});
    },

    // 碰撞
    onCollisionEnter: function (other, self) {
        if(other.node.group === 'role'){
            // console.log('on collision role');
            var bin = other.node.getComponent('DodgeRole');
            bin.wasfound();

        } else if(other.node.group === 'wall'){
            // console.log('on collision wall');
        }
        this.toDestroy();
    }
});
