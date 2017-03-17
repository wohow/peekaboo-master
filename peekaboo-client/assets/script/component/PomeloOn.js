

var net = require('net');
var code = require('code');
var EventDispatcher = require('EventDispatcher');
var EventType = require('EventType');
var SceneManager = require('SceneManager');
var GameData = require('GameData');
var Player = require('Player');

/**
 * pomele 监听
 */
cc.Class({
    extends: cc.Component,

    properties: {
    },

    // use this for initialization
    onLoad: function () {
        cc.game.addPersistRootNode(this.node);
    },

    start: function(){

        // 有玩家离线
        net.on('onUserLeave', function(data) {
            EventDispatcher.dispatch(EventType.SYNC_USERLEAVE, data);
        });

        // 同步玩家进入房间
        net.on('onEntryRoom', function(data) {
            EventDispatcher.dispatch(EventType.SYNC_ENTRYROOM, data);
        });

        // 同步选择阵营
        net.on('onSyncSelectCamp', function(data){
            EventDispatcher.dispatch(EventType.SYNC_SELECTCAMP, data);
        });

        // 同步开始游戏了
        net.on('onStartGame', function(data) {
            GameData.hideItemIndexs = data.hideItemIndexs;
            GameData.generateItemIndexs = data.generateItemIndexs;
            GameData.isStart = true;
            for (var i = data.dodges.length - 1; i >= 0; i--) {
                var dodge = data.dodges[i];
                var player = GameData.getPlayer(dodge.uid);
                player.itemId = dodge.itemId;
                if(player.uid === Player.uid){
                    Player.itemId = dodge.itemId;
                }
            }
            SceneManager.load('arena');
        });

        // 同步方向
        net.on('onSyncDirection', function(data){
            EventDispatcher.dispatch(EventType.SYNC_DIRECTION, data);
        });

        // 开火
        net.on('onFire', function (data) {
            EventDispatcher.dispatch(EventType.SYNC_FIRE, data);
        })


    }
});
