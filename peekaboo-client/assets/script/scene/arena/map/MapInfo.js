
var utils = require('utils');
var AtlasStorage = require('AtlasStorage');

// 单列
var instance = null;
module.exports = function(){
    return instance;
};

/**
 * 地图信息
 */
cc.Class({
    extends: cc.Component,

    properties: {
        randomItemPrefab: cc.Prefab,// 随机道具 预制体
        randomItemNode: cc.Node,// 随机道具 
        roleNode: cc.Node,// 角色层
    },

    onLoad: function () {
        instance = this;
        this.tiledMap = this.node.getComponent(cc.TiledMap);
        this.groundNode = this.tiledMap.getLayer('ground');
        this.wallNode = this.tiledMap.getLayer('wall');
        this.itemNode = this.tiledMap.getLayer('item');
        // 格子大小
        this.girdSize = this.groundNode.getLayerSize();
        console.log(this.girdSize);
        // tile大小
        this.tileSize = this.groundNode.getMapTileSize();
        this.tielSizeHalf = cc.p(this.tileSize.width*0.5, this.tileSize.height*0.5);

        // 所有空地
        this.emptyGrounds = [];
        // 内墙精灵
        this.wallSprites = [];
        for (var x = 1; x < this.girdSize.width-1; x++) {
            for (var y = 1; y < this.girdSize.height-1; y++) {
                if(this.itemNode.getTileGIDAt(x, y)){
                    var tile = this.itemNode.getTileAt(x, y);
                    this.wallSprites.push(tile);
                    continue;
                }
                if(this.wallNode.getTileGIDAt(x, y)){
                    continue;
                }
                this.emptyGrounds.push(cc.p(x, this.girdSize.height-1-y));
            }
        }
    },

    // 随机隐藏道具
    randomHideItem: function(count){
        var indexs = utils.randomIndex(this.wallSprites.length, count);
        for (var i = 0; i < indexs.length; i++) {
            this.wallSprites[indexs[i]].visible = false;
            // this.wallSprites[i].opacity = 0;
        }
    },

    // 随机生成道具
    randomGenerateItem: function(count){
        var indexs = utils.randomIndex(this.emptyGrounds.length, count);
        for (var i = 0; i < indexs.length; i++) {
            var point = this.emptyGrounds[indexs[i]];
            // console.log(point);
            var item = cc.instantiate(this.randomItemPrefab);
            item.getComponent(cc.Sprite).spriteFrame = AtlasStorage().getItemSprite(8);
            item.position = cc.p(point.x*this.tileSize.width, point.y*this.tileSize.height);
            this.randomItemNode.addChild(item);
        }
    },

    // 添加一个角色
    addRole: function(node){
        this.roleNode.addChild(node);
        // 设置位置
        node.position = cc.p(1*this.tileSize.width + this.tielSizeHalf.x, 2*this.tileSize.height + this.tielSizeHalf.y);
    },

    isCollide: function(x, y){
        y = this.girdSize.height-1-y;
        if(x === 0 || y === 0 || x >= this.girdSize.width-1 || y >= this.girdSize.height-1)
            return true;
        return !!this.wallNode.getTileGIDAt(x, y);
    },

    // 是否和墙发生碰撞
    isWallCollide: function(position, direction){
        var x = position.x + direction.x,
            y = position.y + direction.y;

        var tx = (x - this.tielSizeHalf.x)/this.tileSize.width,
            ty = (y - this.tielSizeHalf.y)/this.tileSize.height;

        var ox = (position.x - this.tielSizeHalf.x)/this.tileSize.width,
            oy = (position.y - this.tielSizeHalf.y)/this.tileSize.height;
        var nx1 = Math.floor(ox),
            nx2 = Math.ceil(ox),
            ny1 = Math.floor(oy),
            ny2 = Math.ceil(oy);

        if(direction.x < 0){// 左
            let nx = Math.floor(tx);
            if(this.isCollide(nx, ny1) || this.isCollide(nx, ny2)){
                x = (nx+1)*this.tileSize.width + this.tielSizeHalf.x;
            }
        } else if(direction.x > 0){// 右
            let nx = Math.ceil(tx);
            if(this.isCollide(nx, ny1) || this.isCollide(nx, ny2)){
                x = (nx-1)*this.tileSize.width + this.tielSizeHalf.x;
            }
        }
        if(direction.y < 0){// 下
            let ny = Math.floor(ty);
            if(this.isCollide(nx1, ny) || this.isCollide(nx2, ny)){
                y = (ny+1)*this.tileSize.height + this.tielSizeHalf.y;
            }
        }
        if(direction.y > 0){// 上
            let ny = Math.ceil(ty);
            if(this.isCollide(nx1, ny) || this.isCollide(nx2, ny)){
                y = (ny-1)*this.tileSize.height + this.tielSizeHalf.y;
            }
        }
        return cc.p(x, y);
    },

});
