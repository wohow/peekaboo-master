
// 这个只对tilemap有效
cc.macro.FIX_ARTIFACTS_BY_STRECHING_TEXEL = 1;

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // use this for initialization
    onLoad: function () {
    	// 关闭抗锯齿 设置一次就可以了
        cc.view.enableAntiAlias(false);
    },
});
