
const binRole = require('binRole');
const RoleControl = require('RoleControl');

/**
 * 地图控制器
 */
cc.Class({
    extends: cc.Component,

    properties: {
        dodgeRolePrefab: cc.Prefab,// 躲
        finderRolePrefab: cc.Prefab,// 找

        hideItemCount: 10, // 隐藏个数
        generateItemCount: 5,// 生成个数
    },

    onLoad: function () {
        this.mapInfo = this.node.getComponent('MapInfo');
    },

    // 初始化地图
    init: function(){
        // 先随机隐藏 地面物品
        this.mapInfo.randomHideItem(this.hideItemCount);
        // 随机生成物品
        this.mapInfo.randomGenerateItem(this.generateItemCount);
        // 初始化玩家
        this.initRole();
    },

    // 初始化玩家
    initRole: function(){
        var data = {
            nickname: '角色名在',
            profession: 1
        };
        // 创建角色空节点
        var roleNode = new cc.Node('roleNode');
        // 添加角色统一控制器
        var bin = roleNode.addComponent(binRole);
        // 根据角色职业生成对应实体
        var prefab = cc.instantiate(this.dodgeRolePrefab);
        var entity = prefab.getComponent('DodgeRole');
        prefab.parent = roleNode;
        // 完事
        bin.init(data, entity);
        // 加入地图
        this.mapInfo.addRole(roleNode);
        // 如果是自己就添加这个控制脚本 主要用于接收键盘事件
        roleNode.addComponent(RoleControl);

        bin.entity.setItemSpr(5);
    }

});
