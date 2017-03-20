
var utils = require('utils');
var net = require('net');
var consts = require('consts');

var moveSpeed = 8;// 移动速度
var direction = cc.p(0,0);// 方向
var lastDirection = {};// 上一次的方向


/**
 * 角色控制器 - 躲
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
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        this.schedule(this.commitMove, 0.06);
    },

    stopAllEvent: function() {
        this.unschedule(this.commitMove);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    onMouseDown: function (event) {
    },
    onMouseMove: function (event) {
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
        if(direction.x === 0 && direction.y === 0 && lastDirection.x === 0 && lastDirection.y === 0){
            return;
        }

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
    },

});
