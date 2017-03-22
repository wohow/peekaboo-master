
var SceneManager = require('SceneManager');
var net = require('net');
var consts = require('consts');
var Player = require('Player');
var GameData = require('GameData');
var Tip = require('Tip');

cc.Class({
    extends: cc.Component,

    properties: {
        nicknameEditbox: cc.EditBox,
    },

    // use this for initialization
    onLoad: function () {
        net.connect(consts.connectorAddress, function(){
        });
        net.onDisconnect(function () {
            Tip().showMessage('服务器断开');
        });
    },

    // 点击开始按钮
    onClickStart: function(){
        var nickname = this.nicknameEditbox.string;
        nickname = nickname.trim();
        if(nickname === ''){
            Tip().showMessage('名字不能为空');
            return;
        }
        net.send('connector.entryHandler.entry', {nickname: nickname}, function(data){
            if(data.code === 200){
                Player.init(data.user);
                GameData.players = data.users;
                GameData.captainUid = data.captainUid;
                GameData.isStart = data.isStart;
                SceneManager.load('room');
            } else {
                Tip().showMessage(data.error);
            }
        })
    }
});
