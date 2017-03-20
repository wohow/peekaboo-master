
var net = require('net');
var Player = require('Player');
var EventDispatcher = require('EventDispatcher');
var EventType = require('EventType');

var MSG_ID = 0;

function getMsgId(){
    return Player.uid + (++MSG_ID);
}

cc.Class({
    extends: cc.Component,

    properties: {
        msgPrefab: cc.Prefab,
        content: cc.Node,

        editBox: cc.EditBox,
    },

    onLoad: function () {
        this.lastMsg = {};

        var self = this;
        self.chatmsgCallback = function (data) {
            if(data.id === self.lastMsg.id){
                self.lastMsg.setColor(cc.Color.WHITE);
                self.lastMsg = {};
            } else {
                self.addMsg(data.id, data.nickname, data.content);
            }
        };
        EventDispatcher.listen(EventType.SYNC_CHATMSG, self.chatmsgCallback);

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    onDestroy: function() {
        EventDispatcher.remove(EventType.SYNC_CHATMSG, this.chatmsgCallback);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    addMsg: function(id, name, msg){
        var prefab = cc.instantiate(this.msgPrefab);
        prefab.parent = this.content;
        var bin = prefab.getComponent('binChatMsg');
        bin.init(id, name, msg);
        this.content.y = Math.max((this.content.height + bin.node.height) - 370, 380);
        return bin;
    },

    onKeyUp: function (event) {
        if(event.keyCode == cc.KEY.enter){
            this.onClickSend();
        }
    },

    onClickSend: function () {
        var msg = this.editBox.string;
        this.editBox.string = '';
        var msgId = getMsgId();
        this.lastMsg = this.addMsg(msgId, Player.nickname, msg);
        this.lastMsg.setColor(cc.Color.GRAY);
        net.send('connector.roomHandler.sendChat', {id: msgId, content: msg});
    }

});
