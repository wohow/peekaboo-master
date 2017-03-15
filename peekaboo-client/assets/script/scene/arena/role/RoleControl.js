
var utils = require('utils');

/**
 * 角色控制器 
 * 主要是接收键盘事件
 */
cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad: function () {
        this.roleClass = this.node.getComponent('binRole');
        this.direction = cc.p(0,0);
        this.speed = 3;

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    onDestroy () {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },


    onKeyDown: function(event){
        if(event.keyCode === cc.KEY.shift){
            this.speed = 0.5;
            this.direction.x = utils.cTo1(this.direction.x) * this.speed;
            this.direction.y = utils.cTo1(this.direction.y) * this.speed;
        } else {
            this.move(event, this.speed);
        }
    },

    onKeyUp: function(event){
        if(event.keyCode === cc.KEY.shift){
            this.speed = 3;
            this.direction.x = utils.cTo1(this.direction.x) * this.speed;
            this.direction.y = utils.cTo1(this.direction.y) * this.speed;
        } else {
            this.move(event, 0);
        }
    },

    move: function(event, speed){
        switch(event.keyCode) {
            case cc.KEY.a:
            case cc.KEY.left: // 左
                this.direction.x = -1 * speed;
                break;
            case cc.KEY.d:
            case cc.KEY.right:// 右
                this.direction.x = 1 * speed;
                break;
            case cc.KEY.w:
            case cc.KEY.up: // 上
                this.direction.y = 1 * speed;
                break;
            case cc.KEY.s:
            case cc.KEY.down:
                this.direction.y = -1 * speed;
                break;
            default:
                return;
        }
    },

    update: function (dt) {
        if(this.direction.x === 0 && this.direction.y === 0)
            return;
        this.roleClass.move(this.direction);
    },

});
