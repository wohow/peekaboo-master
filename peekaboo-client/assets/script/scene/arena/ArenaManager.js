
const OverUI = require('OverUI');
const MapControl = require('MapControl');
var Player = require('Player');
var GameData = require('GameData');
var net = require('net');
var EventDispatcher = require('EventDispatcher');
var EventType = require('EventType');
var consts = require('consts');
var Tween = require('TweenLite');
var Tip = require('Tip');


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

        dodgeNumberTxt: cc.Label,
        finderNumberTxt: cc.Label,
        foundTxt: cc.Label,

        overUI: OverUI,
    },

    onLoad: function () {
        this.status = 1;// 当前状态 1.准备阶段 2.找阶段
        this.rttTxt.string = consts.rtt + ' ms';
        // this.rttTxt.node.color = consts.rtt > 40 ? cc.Color.RED : cc.Color.WHITE;
        this.countdown = 0;

        // 开启碰撞
        cc.director.getCollisionManager().enabled = true;
        // cc.director.getCollisionManager().enabledDebugDraw = true;

        // 下面监听事件
        var self = this;
        // 开始寻找
        self.startsearchCallback = function(data){
            self.status = 2;
            self.mapControl.openDoor(false);
            self.mapControl.roleInfiniteBullet(false);
            self.maskNode.active = false;
            self.startCountdown(GameData.searchTime);
        };
        EventDispatcher.listen(EventType.SYNC_STARTSEARCH, self.startsearchCallback);
        // 开火
        self.syncfireCallback = function(data){
            self.mapControl.syncFire(data);
        };
        EventDispatcher.listen(EventType.SYNC_FIRE, self.syncfireCallback);
        // 
        self.revealCallback = function (data) {
            self.mapControl.turnReveal(data);
        };
        EventDispatcher.listen(EventType.SYNC_REVEAL, self.revealCallback);
        // 玩家离线
        self.userleaveCallback = function(data){
            self.mapControl.removeRole(data.uid);
        };
        EventDispatcher.listen(EventType.SYNC_USERLEAVE, self.userleaveCallback);
        // 被找到了
        self.wasfoundCallback = function(data){
            self.foundTxt.string = '已经找到 '+data.curfoundCount+' 个';
            self.mapControl.wasfound(data.uid);
        };
        EventDispatcher.listen(EventType.SYNC_WASFOUND, self.wasfoundCallback);
        // 游戏结束
        self.gameoverCallback = function(data){
            self.unschedule(self.countdownTick);
            self.countdownTxt.string = '';
            self.stopAllEvent();
            self.mapControl.stopAllEvent();
            // 把全部的藏显示出来
            self.mapControl.showAllDodge();
            // self.scheduleOnce(function(){
            // }, 2);
            setTimeout(function(){
                self.overUI.open(Player.camp === data.camp);
            }, 2000);
        };
        EventDispatcher.listen(EventType.SYNC_GAMEOVER, self.gameoverCallback);
    },

    stopAllEvent: function () {
        cc.director.getCollisionManager().enabled = false;
        EventDispatcher.remove(EventType.SYNC_STARTSEARCH, this.startsearchCallback);
        EventDispatcher.remove(EventType.SYNC_FIRE, this.syncfireCallback);
        EventDispatcher.remove(EventType.SYNC_REVEAL, this.revealCallback);
        EventDispatcher.remove(EventType.SYNC_USERLEAVE, this.userleaveCallback);
        EventDispatcher.remove(EventType.SYNC_WASFOUND, this.wasfoundCallback);
        EventDispatcher.remove(EventType.SYNC_GAMEOVER, this.gameoverCallback);
    },

    start: function(){
        this.status = 1;
        var counts = GameData.getCampCount();
        this.dodgeNumberTxt.string = counts[0];
        this.finderNumberTxt.string = counts[1];
        this.foundCount = 0;
        this.foundTxt.string = '已经找到 0 个';
        // 这里开始做rtt
        this.startRtt();
        // 显示遮罩
        this.dodgeStage();
        // 初始化地图
        this.mapControl.init();
        // 开始倒计时
        this.startCountdown(GameData.prepareTime);
        // 开始
        this.mapControl.startAllEvent();
        // 开启无线子弹
        this.mapControl.roleInfiniteBullet(true);
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
        this.countdown = countdown;
        this.countdownTxt.string = this.countdown;
        this.unschedule(this.countdownTick);
        this.schedule(this.countdownTick, 1);
    },

    countdownTick: function(){
        this.countdownTxt.string = --this.countdown;
        if(this.countdown <= 0){
            this.unschedule(this.countdownTick);
        } else if(this.countdown === 30 && this.status === 2) {
            Tip().showMessage('疯狂模式开启');
            this.mapControl.roleInfiniteBullet(true);
        }
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
