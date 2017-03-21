cc.Class({
    extends: cc.Component,

    properties: {
        nicknameTxt: cc.Label
    },

    init: function (uid, nickname) {
        this.uid = uid;
        this.nicknameTxt.string = nickname;
    },

    // 移动
    applyMove: function (pressTime) {
        this.node.x += pressTime.x*100.0;
        this.node.y += pressTime.y*100.0;
    },
    
    
});
