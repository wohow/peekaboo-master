
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
    move: function(startPos, targetPos, dir){
        this.node.rotation = dir;
        this.node.position = startPos;
        var distance = cc.pDistance(startPos, targetPos);
        var ratio = range / distance;
        var rx = (targetPos.x - startPos.x) * ratio;
        var ry = (targetPos.y - startPos.y) * ratio;
        var nx = rx + startPos.x;
        var ny = ry + startPos.y;
        var act1 = cc.moveTo(0.4, nx, ny);
        var act2 = cc.callFunc(()=>{
            this.toDestroy();
        });
        this.node.runAction(cc.sequence(act1, act2));
    },

    toDestroy: function(){
        this.node.stopAllActions();
        var act1 = cc.fadeTo(0.5, 0);
        var act2 = cc.callFunc(()=>{
            this.node.destroy();
        });
        this.node.runAction(cc.sequence(act1, act2));
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
