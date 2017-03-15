
var utils = require('utils');

var moveSpeed = 2;// 移动速度
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
        this.direction = cc.p(0,0);
        this.indicatorPos = 0; // 指示器方向的位置

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    onDestroy () {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    onMouseDown: function (event) {
        this.roleClass.fire(this.indicatorPos);
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
        }
    },

    update: function (dt) {
        if(this.direction.x !== 0 || this.direction.y !== 0){
            this.roleClass.move(this.direction);
        }
        // 刷新指示器
        indicatorDir = 90 - utils.rotation(this.node.position, this.indicatorPos);
        this.roleClass.entity.updateIndicator(indicatorDir);
    },
});
