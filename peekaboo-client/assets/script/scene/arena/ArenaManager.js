
const MapControl = require('MapControl');
var Player = require('Player');
var GameData = require('GameData');
var net = require('net');
var EventDispatcher = require('EventDispatcher');
var EventType = require('EventType');
var consts = require('consts');
var Tween = require('TweenLite');

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
        maskNode: cc.Node,
        countdownTxt: cc.Label,
        prepareCountdown: 10,
        searchCountdown: 60
    },

    onLoad: function () {
        this.status = 1;// 当前状态 1.准备阶段 2.找阶段
        this.rttTxt.string = consts.rtt + ' ms';
        // this.rttTxt.node.color = consts.rtt > 40 ? cc.Color.RED : cc.Color.WHITE;

        // 开启碰撞
        cc.director.getCollisionManager().enabled = true;
        // cc.director.getCollisionManager().enabledDebugDraw = true;

        // 下面监听事件
        var self = this;
        // 位置
        self.syncdirectionCallback = function(data){
            self.mapControl.syncDirection(data);
        };
        EventDispatcher.listen(EventType.SYNC_DIRECTION, self.syncdirectionCallback);
        // 开火
        self.syncfireCallback = function(data){
            self.mapControl.syncFire(data);
        };
        EventDispatcher.listen(EventType.SYNC_FIRE, self.syncfireCallback);
        // 玩家离线
        self.userleaveCallback = function(data){
            GameData.removePlayer(data.uid);
            if(data.newCaptainUid){
                GameData.captainUid = data.newCaptainUid;
            }
            self.mapControl.removeRole(data.uid);
        };
        EventDispatcher.listen(EventType.SYNC_USERLEAVE, self.userleaveCallback);
    },

    onDestroy: function () {
        cc.director.getCollisionManager().enabled = false;
        EventDispatcher.remove(EventType.SYNC_DIRECTION, this.syncdirectionCallback);
        EventDispatcher.remove(EventType.SYNC_FIRE, this.syncfireCallback);
        EventDispatcher.remove(EventType.SYNC_USERLEAVE, this.userleaveCallback);
    },

    start: function(){
        this.status = 1;
        // 显示遮罩
        this.dodgeStage();
        // 初始化地图
        this.mapControl.init();
        // 这里开始做rtt
        this.startRtt();
        // 开始倒计时
        this.startCountdown(this.prepareCountdown);
    },

    // 躲阶段 躲全亮 找全黑
    dodgeStage: function(){
        if(Player.camp === 1){
            this.maskNode.active = true;
        }
        // 打开门
        this.mapControl.openDoor(true);
    },

    // 
    startCountdown: function(countdown) {
        var self = this;
        self.countdownTxt.string = countdown;
        var callback = function () {
            self.countdownTxt.node.scale = 1;
            self.countdownTxt.string = --countdown;
            if(countdown <= 0){
                switch(self.status){
                    case 1:
                    {
                        self.status = 2;
                        countdown = self.searchCountdown+1;
                        self.mapControl.openDoor(false);
                        self.maskNode.active = false;
                    }
                    break;
                    case 2:
                    {
                        self.unschedule(callback);
                        console.log('游戏结束');
                    }
                    break;
                }
            } else if(countdown <= 10) {
                // Tween.to(self.countdownTxt.node, 0.9, {scale: 1.3});
            }
        };
        self.schedule(callback, 1);
    },


    //
    startRtt: function () {
        var self = this;
        self.schedule(function(){
            net.send('connector.entryHandler.rtt', {time: new Date().getTime()}, function(data){
                var now = new Date().getTime();
                var rtt = now - data.time;
                self.rttTxt.string = rtt + ' ms';
                // self.rttTxt.node.color = rtt > 40 ? cc.Color.RED : cc.Color.WHITE;
            });
        }, 5);
    }

});
