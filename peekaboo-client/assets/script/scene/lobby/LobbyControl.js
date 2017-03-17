
var SceneManager = require('SceneManager');
var net = require('net');
var consts = require('consts');
var Player = require('Player');
var GameData = require('GameData');

cc.Class({
    extends: cc.Component,

    properties: {
        nicknameEditbox: cc.EditBox,
    },

    // use this for initialization
    onLoad: function () {
    },

    // 点击开始按钮
    onClickStart: function(){
        var nickname = this.nicknameEditbox.string;

        SceneManager.load(function(cb){

            net.connect(consts.connectorAddress, function(){
                net.send('connector.entryHandler.entry', {nickname: nickname}, function(data){
                    if(data.code === 200){
                        Player.init(data.user);
                        GameData.players = data.users;
                        setTimeout(function(){
                            // cb('room');
                            cb('arena');
                        }, 100);
                    } else {
                        console.log(data.error);
                    }
                })
            });
        });
    }
});
