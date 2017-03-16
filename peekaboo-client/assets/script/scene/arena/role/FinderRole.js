
var utils = require('utils');

/**
 * 找 角色
 */
cc.Class({
    extends: cc.Component,

    properties: {
        nicknameTxt: cc.Label,
        indicatorNode: cc.Node,// 指示器 
        body: cc.Node,
    },

    onLoad: function () {
        this.indicatorNode.active = false;
        this.animation = this.body.getComponent(cc.Animation);
    },

    setNickname: function(nickname){
        this.nicknameTxt.string = nickname;
    },

    // setItemSpr: function (id) {  
    // },

    // 是否显示指示器
    isShowIndicator: function (isShow) {
        this.indicatorNode.active = isShow;
    },

    // 旋转指示器
    updateIndicator: function(dir){
        this.indicatorNode.rotation = dir;
    },


});
