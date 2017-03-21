cc.Class({
    extends: cc.Component,

    properties: {
        nicknameTxt: cc.Label
    },

    init: function (uid, nickname) {
        this.uid = uid;
        this.nicknameTxt.string = nickname;
    },

    move: function (){

    }
});
