
var net = require('net');
var SceneManager = require('SceneManager');
var Player = require('Player');
var GameData = require('GameData');

// 游戏结束面板
cc.Class({
    extends: cc.Component,

    properties: {
        labelTxt: cc.Label
    },

    open: function (isWin) {
        this.node.active = true;
        this.labelTxt.string = isWin ? '胜 利' : '失 败';
        this.labelTxt.node.color = isWin ? cc.Color.GREEN : cc.Color.RED;
    },

    onClick: function() {
        net.send('connector.gameHandler.exitGame', {}, function(data){
            Player.isInGame = false;
            SceneManager.load('room');
        });
    }

});
