
var utils = require('utils');
var net = require('net');

var moveSpeed = 6;// 移动速度
var direction = cc.p(0,0);// 方向
var lastDirection = cc.p(0,0);// 上一次的方向

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

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    start: function(){
        // this.roleClass.entity.setItemSpr(utils.random(1, 12));
    },

    onDestroy () {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    onMouseDown: function (event) {
    },
    onMouseMove: function (event) {
    },

    onKeyDown: function(event){
        if(event.keyCode === cc.KEY.shift){
            moveSpeed = 1;
            direction.x = utils.cTo1(direction.x) * moveSpeed;
            direction.y = utils.cTo1(direction.y) * moveSpeed;
            this.commitDirection();
        } else {
            this.move(event, moveSpeed);
        }
    },

    onKeyUp: function(event){
        if(event.keyCode === cc.KEY.shift){
            moveSpeed = 6;
            direction.x = utils.cTo1(direction.x) * moveSpeed;
            direction.y = utils.cTo1(direction.y) * moveSpeed;
            this.commitDirection();
        } else {
            this.move(event, 0);
        }
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
        this.commitDirection();
    },

    // 提交自己的方向
    commitDirection: function() {
        if(lastDirection.x === direction.x && lastDirection.y === direction.y){
            return;
        }
        lastDirection = {x: direction.x, y: direction.y};
        var position = {x: this.node.x, y: this.node.y};
        net.send('connector.syncHandler.commitDirection', {direction: lastDirection, position: position});
    },

    update: function (dt) {
    },

});
