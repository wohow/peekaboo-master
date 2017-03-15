
/**
 * 一个排行节点
 */
cc.Class({
    extends: cc.Component,

    properties: {
        nicknameTxt: cc.Label,
        dieNode: cc.Node,
        scoreTxt: cc.Label
    },

    init: function (data) {
        this.nicknameTxt.string = data.nickname;
        this.dieNode.active = false;
        this.scoreTxt.string = data.score;
    }
    
    
});
