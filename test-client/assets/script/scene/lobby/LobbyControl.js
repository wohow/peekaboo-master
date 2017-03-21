
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

        net.connect({host: '192.168.1.103',port: 8000}, function(){
            net.send('connector.testHandler.login', {nickname: nickname}, function(data){

                global.uid = data.uid;
                global.entities = data.entities;
                SceneManager.load('arena');
            });
        });
    }
});
