
const MapControl = require('MapControl');
var Player = require('Player');
var net = require('net');
var EventDispatcher = require('EventDispatcher');
var EventType = require('EventType');
var consts = require('consts');

/**
 * 竞技场管理中心
 * 1.准备阶段
 * 2.躲阶段 20秒倒计时 开始躲
 * 3.找阶段 120秒倒计时 开始找
 * 
 */
cc.Class({
    extends: cc.Component,

    properties: {
        rttTxt: cc.Label,
        mapControl: MapControl,
    },

    onLoad: function () {
        this.status = 1;// 当前状态 1.准备阶段 2.躲阶段 3.找阶段
        this.rttTxt.string = consts.rtt + ' ms';

        // 开启碰撞
        cc.director.getCollisionManager().enabled = true;
        // cc.director.getCollisionManager().enabledDebugDraw = true;

        // 下面监听事件
        var self = this;
        // 位置
        self.syncpositionCallback = function(data){
            self.mapControl.syncPosition(data);
        };
        EventDispatcher.listen(EventType.SYNC_POSITION, self.syncpositionCallback);
        // 开火
        self.syncfireCallback = function(data){
            self.mapControl.syncFire(data);
        };
        EventDispatcher.listen(EventType.SYNC_FIRE, self.syncfireCallback);
    },

    onDestroy: function () {
        cc.director.getCollisionManager().enabled = false;
        EventDispatcher.remove(EventType.SYNC_POSITION, self.syncpositionCallback);
        EventDispatcher.remove(EventType.SYNC_FIRE, self.syncfireCallback);
    },

    start: function(){
        this.mapControl.init();

        var self = this;
        // 这里开始做rtt
        self.schedule(function(){
            net.send('connector.entryHandler.rtt', {time: new Date().getTime()}, function(data){
                var now = new Date().getTime();
                self.rttTxt.string = (now-data.time) + ' ms';
            });
        }, 10);
    },

    // 躲阶段 躲全亮 找全黑
    dodgeStage: function(){
        if(Player.profession === 1){

        }
    }
});
