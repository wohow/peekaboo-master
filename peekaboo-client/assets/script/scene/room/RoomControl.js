
var consts = require('consts');
var GameData = require('GameData');
var EventDispatcher = require('EventDispatcher');
var EventType = require('EventType');
var net = require('net');
var Player = require('Player');
var Tip = require('Tip');

var curSelectCamp = 0;

// 房间
cc.Class({
    extends: cc.Component,

    properties: {
        roomRolePrefab: cc.Prefab,

        contents: [cc.Node],
        inGameContent: cc.Node,
        
        startBtn: cc.Node,

        explainTxt: cc.Label
    },

    onLoad: function () {
        this.roles = [];

        var self = this;
        // 进入房间
        self.entryroomCallback = function (data) {
            self.addRole(data.user);
        };
        EventDispatcher.listen(EventType.SYNC_ENTRYROOM, self.entryroomCallback);
        // 有玩家从游戏界面进入房间
        self.exitgameCallback = function (data) {
            var player = GameData.getPlayer(data.uid);
            self.setCamp(data.uid, player.camp);
        };
        EventDispatcher.listen(EventType.SYNC_EXITGAME, self.exitgameCallback);
        // 选择阵营
        self.selectcampCallback = function(data){
            self.setCamp(data.uid, data.camp);
        };
        EventDispatcher.listen(EventType.SYNC_SELECTCAMP, self.selectcampCallback);
        // 游戏结束了
        self.gameoverCallback = function(data){
            self.explainTxt.string = '请选择一个你想玩的'
        };
        EventDispatcher.listen(EventType.SYNC_GAMEOVER, self.gameoverCallback);
        // 玩家离线
        self.userleaveCallback = function(data){
            var role = self.getRole(data.uid);
            role.node.removeFromParent();
            role.destroy();
            if(data.newCaptainUid){
                self.updateCaptain();
            }
        };
        EventDispatcher.listen(EventType.SYNC_USERLEAVE, self.userleaveCallback);
    },

    onDestroy: function () {
        EventDispatcher.remove(EventType.SYNC_ENTRYROOM, this.entryroomCallback);
        EventDispatcher.remove(EventType.SYNC_SELECTCAMP, this.selectcampCallback);
        EventDispatcher.remove(EventType.SYNC_USERLEAVE, this.userleaveCallback);
        EventDispatcher.remove(EventType.SYNC_GAMEOVER, this.gameoverCallback);
        EventDispatcher.remove(EventType.SYNC_EXITGAME, this.exitgameCallback);
    },

    start: function () {
        curSelectCamp = Player.camp;
        // 初始化当前角色
        for (var i = GameData.players.length - 1; i >= 0; i--) {
            this.addRole(GameData.players[i]);
        }
        
        if(GameData.isStart){
            this.explainTxt.string = '游戏已经开始，请等待下一局'
        } else {
            this.explainTxt.string = '请选择一个你想玩的'
        }
        // 刷新队长
        this.updateCaptain();
        // 这里做一次rtt
        net.send('connector.entryHandler.rtt', {time: new Date().getTime()}, function(data){
            var now = new Date().getTime();
            consts.rtt = now - data.time;
        });
    },

    addRole: function(player){
        var prefab = cc.instantiate(this.roomRolePrefab);
        var bin = prefab.getComponent('binRoomRole');
        bin.init(player);
        if(player.isInGame){
            prefab.parent = this.inGameContent;
        } else {
            prefab.parent = this.contents[player.camp];
        }
        if(player.uid === Player.uid){
            bin.setColor(cc.Color.GREEN);
        }
        this.roles.push(bin);
    },

    getRole: function (uid) {
        var arr = this.roles.filter((m)=> m.uid === uid);
        return arr.length === 0 ? null : arr[0];
    },

    // 刷新队长
    updateCaptain: function() {
        // 设置按钮是否显示
        this.startBtn.active = (Player.uid === GameData.captainUid);
        // 设置成队长
        var role = this.getRole(GameData.captainUid);
        role.setCaptain(true);
    },

    // 改变阵营
    setCamp: function(uid, camp){
        var role = this.getRole(uid);
        role.node.removeFromParent();
        role.camp = camp;
        role.node.position = cc.p(0,0);
        role.node.parent = this.contents[camp];
    },

    // 点击选择阵营
    onClickSelectCamp: function (event, data) {
        var camp = parseInt(data);
        if(curSelectCamp === camp)
            return;
        curSelectCamp = camp;
        net.send('connector.roomHandler.selectCamp', {camp: camp}, function(data) {
            Player.camp = data.camp;
        });
    },

    // 点击开始游戏
    onClickStartGame: function () {
        var self = this;
        self.startBtn.getComponent(cc.Button).instantiate = false;
        net.send('connector.roomHandler.startGame', {}, function(data) {
            if(data.code === 200){
                // Tip().showMessage('即将开始游戏');
            } else {
                self.startBtn.getComponent(cc.Button).instantiate = true;
                Tip().showMessage(data.error);
            }
        });
    }

});
