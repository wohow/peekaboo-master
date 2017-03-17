
var Tween = require('TweenLite');

/**
 * Tip
 * 提示框
 */
var instance = null;
module.exports = function(){
    return instance;
};

cc.Class({
    extends: cc.Component,

    properties: {
        bgNode: cc.Node,
        contetTxt: cc.Label,
        hidePos: 0,
        showPos: 0,
    },

    onLoad: function () {
        cc.game.addPersistRootNode(this.node);
        instance = this;
        this.bgNode.y = this.hidePos;
    },

    showMessage: function (msg) {
        this.contetTxt.string = msg;
        this.bgNode.y = this.hidePos;
        this.unscheduleAllCallbacks();
        Tween.killTweensOf(this.bgNode);
        Tween.to(this.bgNode, 0.5, {y: this.showPos});
        this.scheduleOnce(() => {
             Tween.to(this.bgNode, 0.5, {y: this.hidePos});
        }, 1.5);
    }
});
