

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
            GameData.removePlayer(data.uid);
            if(data.newCaptainUid){
                GameData.captainUid = data.newCaptainUid;
            }
            EventDispatcher.dispatch(EventType.SYNC_USERLEAVE, data);
        });

        // 同步玩家进入房间
        net.on('onEntryRoom', function(data) {
            GameData.players.push(data.user);
            EventDispatcher.dispatch(EventType.SYNC_ENTRYROOM, data);
        });

        // 同步选择阵营
        net.on('onSyncSelectCamp', function(data){
            var player = GameData.getPlayer(data.uid);
            player.camp = data.camp;
            EventDispatcher.dispatch(EventType.SYNC_SELECTCAMP, data);
        });

        // 聊天
        net.on('onChatMsg', function(data) {
            EventDispatcher.dispatch(EventType.SYNC_CHATMSG, data);
        });


        // 同步开始游戏了
        net.on('onStartGame', function(data) {
            GameData.isStart = true;
            GameData.hideItemIndexs = data.hideItemIndexs;
            GameData.generateItemIndexs = data.generateItemIndexs;
            GameData.prepareTime = data.prepareTime;
            GameData.searchTime = data.searchTime;

            var isCanInGame = false;
            GameData.CanSatrtGamePlayers = [];
            for (var i = data.gamePlayers.length - 1; i >= 0; i--) {
                var gp = data.gamePlayers[i];
                var player = GameData.getPlayer(gp.uid);
                player.itemId = gp.itemId;
                player.camp = gp.camp;
                player.isInGame = true;
                player.position = gp.position;
                player.speed = gp.speed;
                if(player.uid === Player.uid){
                    Player.itemId = gp.itemId;
                    Player.camp = gp.camp;
                    Player.isInGame = true;
                    isCanInGame = true;
                }
                GameData.CanSatrtGamePlayers.push(player.uid);
            }
            if(isCanInGame){
                SceneManager.load('arena');
            }
        });

        // 开始寻找
        net.on('onStartSearch', function (data) {
            EventDispatcher.dispatch(EventType.SYNC_STARTSEARCH, data);
        });

        // 开火
        net.on('onFire', function (data) {
            EventDispatcher.dispatch(EventType.SYNC_FIRE, data);
        })

        // 每回合玩家的操作指令
        net.on('onReveal', function(data) {
            EventDispatcher.dispatch(EventType.SYNC_REVEAL, data);
        });

        // 被发现
        net.on('onWasfound', function(data) {
            EventDispatcher.dispatch(EventType.SYNC_WASFOUND, data);
        });

        // 游戏结束
        net.on('onGameOver', function (data) {
            GameData.isStart = false;
            EventDispatcher.dispatch(EventType.SYNC_GAMEOVER, data);
        });

        // 退出游戏
        net.on('onExitGame', function (data) {
            var player = GameData.getPlayer(data.uid);
            player.isInGame = false;
            EventDispatcher.dispatch(EventType.SYNC_EXITGAME, data);
        });
    }
});
