
var Player = require('Player');
const MapControl = require('MapControl');

/**
 * 竞技场管理中心
 * 1.准备阶段
 * 2.躲阶段 20秒倒计时 开始躲
 * 3.找阶段 120秒倒计时 开始找
 * 
 */
cc.Class({
    extends: cc.Component,

    properties: {
        mapControl: MapControl,
    },

    onLoad: function () {
        this.status = 1;// 当前状态 1.准备阶段 2.躲阶段 3.找阶段
    },

    start: function(){
        this.mapControl.init();

    },

    // 躲阶段 躲全亮 找全黑
    dodgeStage: function(){
        if(Player.profession === 1){

        }
    }
});
