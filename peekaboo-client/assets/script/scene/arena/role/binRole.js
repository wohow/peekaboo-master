
var MapInfo = require('MapInfo');
var AtlasStorage = require('AtlasStorage');

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

    // 移动
    move: function(direction){
        var pos = MapInfo().isWallCollide(this.node.position, direction);
        this.directMove(pos);
    },
    directMove: function (position) {
        this.node.position = position;
    },

    // 开火
    fire: function (targetPos) {
        var prefab = AtlasStorage().createrBullet();
        MapInfo().addBullet(prefab);// 加入地图
        prefab.position = this.node.position;
        prefab.rotation = this.entity.indicatorNode.rotation;
        prefab.runAction(cc.moveTo(2, targetPos));
    },

    update: function(dt){
    }

});
