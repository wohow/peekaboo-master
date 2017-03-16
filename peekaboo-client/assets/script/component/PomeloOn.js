

var net = require('net');
var code = require('code');
var EventDispatcher = require('EventDispatcher');
var EventType = require('EventType');

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

        // 同步位置
        net.on('onSyncPosition', function(data){
            EventDispatcher.dispatch(EventType.SYNC_POSITION, data);
        });

        // 开火
        net.on('onFire', function (data) {
            EventDispatcher.dispatch(EventType.SYNC_FIRE, data);
        })
    }
});
