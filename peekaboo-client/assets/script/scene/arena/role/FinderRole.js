
/**
 * 找 角色
 */
cc.Class({
    extends: cc.Component,

    properties: {
        nicknameTxt: cc.Label
    },

    onLoad: function () {

    },

    setNickname: function(nickname){
        this.nicknameTxt.string = nickname;
    },

    // 设置精灵
    setItemSpr: function (id) {
    },
});
