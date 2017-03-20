
var utils = require('utils');
var net = require('net');
var consts = require('consts');

const moveSpeed = 16;// 移动速度
var direction = cc.p(0,0);// 方向
var lastDirection = {};// 上一次的方向

var indicatorDir;

/**
 * 角色控制器 - 找
 * 主要是接收键盘事件
 */
cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad: function () {
        this.roleClass = this.node.getComponent('binRole');
    },

    init: function(){
        direction = cc.p(0,0);
        lastDirection = {};
        this.indicatorPos = 0; // 指示器方向的位置
        this.roleClass.entity.isShowIndicator(true);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        this.schedule(this.commitMove, 0.15);
    },

    stopAllEvent: function() {
        this.unschedule(this.commitMove);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    onMouseDown: function (event) {
        if(this.roleClass.entity.bulletIsEmpty())
            return;// 子弹空了 就直接返回
        if(!this.roleClass.entity.isCanFire)
            return;// 换弹中
        var startPos = {x: this.node.x, y: this.node.y};
        var targetPos = {x: this.indicatorPos.x, y: this.indicatorPos.y};
        net.send('connector.gameHandler.applyFire', {startPos: startPos, targetPos: targetPos});
    },

    onMouseMove: function (event) {
        this.indicatorPos = event.getLocation();
    },

    onKeyDown: function(event){
        this.move(event, moveSpeed);
    },

    onKeyUp: function(event){
        this.move(event, 0);
    },

    move: function(event, speed){
        switch(event.keyCode) {
            case cc.KEY.a:
            case cc.KEY.left: // 左
                direction.x = -1 * speed;
                break;
            case cc.KEY.d:
            case cc.KEY.right:// 右
                direction.x = 1 * speed;
                break;
            case cc.KEY.w:
            case cc.KEY.up: // 上
                direction.y = 1 * speed;
                break;
            case cc.KEY.s:
            case cc.KEY.down:// 下
                direction.y = -1 * speed;
                break;
        }
    },

    // 提交移动指令
    commitMove: function () {
        if(direction.x === 0 && direction.y === 0 && lastDirection.x === 0 && lastDirection.y === 0)
            return;
        if(this.roleClass.isPlayFireAnim)
            return;
        if(consts.sIsRC)
            return;
        consts.sIsRC = true;

        lastDirection = {x: direction.x, y: direction.y};
        // 提交信息
        net.send('connector.gameHandler.commitInstructions', {
            direction: lastDirection, 
            position: {x: this.roleClass.expectPosition.x, y: this.roleClass.expectPosition.y}
        });
    },

    update: function (dt) {
        // 刷新指示器
        indicatorDir = 90 - utils.rotation(this.node.position, this.indicatorPos);
        this.roleClass.entity.updateIndicator(indicatorDir);
    },

});
