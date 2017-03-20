
cc.Class({
    extends: cc.Component,

    properties: {
        isCaptainNode: cc.Node,
        nicknameTxt: cc.Label
    },

    onLoad: function() {
        this.isCaptainNode.active = false;
    },

    init: function (player) {
        this.uid = player.uid;
        this.camp = player.camp;
        this.nicknameTxt.string = player.nickname;
    },

    setColor: function(color) {
        this.nicknameTxt.node.color = color;
    },

    setCaptain: function(isCaptain){
        this.isCaptainNode.active = isCaptain;
    },
});
