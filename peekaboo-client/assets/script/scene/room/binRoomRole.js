
cc.Class({
    extends: cc.Component,

    properties: {
        isCaptainNode: cc.Node,
        nicknameTxt: cc.Label
    },

    onLoad: function() {
        this.isCaptainNode.active = false;
    },

    init: function (player, isMe) {
        this.uid = player.uid;
        this.camp = player.camp;
        this.nicknameTxt.string = player.nickname;
        this.nicknameTxt.node.color = isMe ? cc.Color.GREEN : cc.Color.WHITE;
    },

    setCaptain: function(isCaptain){
        this.isCaptainNode.active = isCaptain;
    },
});
