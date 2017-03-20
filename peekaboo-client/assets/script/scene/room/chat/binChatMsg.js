cc.Class({
    extends: cc.Component,

    properties: {
        msgTxt: cc.RichText
    },

    init: function (id, name, msg) {
    	this.id = id;
        this.msgTxt.string = '<color=#0fffff>'+name+'：</color>' + msg;
    },

    setColor: function (color) {
    	this.msgTxt.node.color = color;
    }
});
