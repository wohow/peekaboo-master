
const MapControl = require('MapControl');
var Player = require('Player');
var net = require('net');
var EventDispatcher = require('EventDispatcher');
var EventType = require('EventType');

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
        mapControl: MapControl,
    },

    onLoad: function () {
        this.status = 1;// 当前状态 1.准备阶段 2.躲阶段 3.找阶段

        cc.director.getCollisionManager().enabled = true;
        // cc.director.getCollisionManager().enabledDebugDraw = true;
        var self = this;
        self.syncpositionCallback = function(data){
            self.mapControl.syncPosition(data);
        };
        EventDispatcher.listen(EventType.SYNC_POSITION, self.syncpositionCallback);
    },

    onDestroy: function () {
        cc.director.getCollisionManager().enabled = false;
        EventDispatcher.remove(EventType.SYNC_POSITION, self.syncpositionCallback);
    },

    start: function(){
        this.mapControl.init();

        // 这里开始做rtt
        this.schedule(function(){
            net.send('connector.entryHandler.rtt', {time: new Date().getTime()}, function(data){
                var now = new Date().getTime();
                console.log('rtt：', now-data.time);
            });
        }, 30);
    },

    // 躲阶段 躲全亮 找全黑
    dodgeStage: function(){
        if(Player.profession === 1){

        }
    }
});
