
var SceneManager = require('SceneManager');
var net = require('net');
var global = require('global');

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

        net.connect({host: '192.168.1.148',port: 8800}, function(){
            net.send('connector.testHandler.login', {nickname: nickname}, function(data){

                global.uid = data.uid;
                global.nickname = data.nickname;
                SceneManager.load('arena');
            });
        });
    }
});
