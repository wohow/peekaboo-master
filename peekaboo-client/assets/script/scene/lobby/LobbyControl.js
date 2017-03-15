
var SceneManager = require('SceneManager');

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
        // SceneManager.load('arena');
        SceneManager.load(function(cb){

            setTimeout(function(){
                cb('arena');
            }, 4000)
        });
    }
});
