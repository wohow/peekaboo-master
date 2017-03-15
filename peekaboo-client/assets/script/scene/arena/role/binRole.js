
var MapInfo = require('MapInfo');

/**
 * 角色
 * 在里面控制移动
 */
cc.Class({
    extends: cc.Component,

    properties: {
        entity: null,// 实体类
    },

    onLoad: function(){
    },

    init: function(data, entity){
        this.entity = entity;
        this.entity.setNickname(data.nickname);
    },

    move: function(direction){
        // var nextPos = cc.p(this.node.x+pos.x, this.node.y+pos.y);
        // var pos = MapInfo().isWallCollide(this.node.position, nextPos);
        // this.node.position = pos;
        this.node.position = MapInfo().isWallCollide(this.node.position, direction);
    },

    update: function(dt){
    }

});
