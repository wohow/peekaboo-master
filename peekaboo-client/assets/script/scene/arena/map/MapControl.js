
const binRole = require('binRole');
const DodgeRoleControl = require('DodgeRoleControl');
const FinderRoleControl = require('FinderRoleControl');

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
        this.myRoleControl = null;// 
        this.professions = [
        {
            Prefab: this.dodgeRolePrefab,
            ClassName: 'DodgeRole',
            RoleControl: DodgeRoleControl
        },
        {
            Prefab: this.finderRolePrefab,
            ClassName: 'FinderRole',
            RoleControl: FinderRoleControl
        }];

        this.node.on(cc.Node.EventType.MOUSE_DOWN, this.onMouseDown, this);
        this.node.on(cc.Node.EventType.MOUSE_MOVE, this.onMouseMove, this);
    },

    onDestroy () {
        this.node.off(cc.Node.EventType.MOUSE_DOWN, this.onMouseDown, this);
        this.node.off(cc.Node.EventType.MOUSE_MOVE, this.onMouseMove, this);
    },

    onMouseDown: function (event) {
        this.myRoleControl.onMouseDown(event);
    },
    
    onMouseMove: function (event) {
        this.myRoleControl.onMouseMove(event);
    },

    // 初始化地图
    init: function(){
        // 先随机隐藏 地面物品
        this.mapInfo.randomHideItem(this.hideItemCount);
        // 随机生成物品
        this.mapInfo.randomGenerateItem(this.generateItemCount);
        // 初始化玩家
        this.initAllRole();
    },

    // 初始化玩家
    initAllRole: function(){
        var data = {
            uid: '1',
            nickname: '找找找',
            profession: 1
        };
        var roleNode = this.createrRole(data);
        // 如果是自己就添加这个控制脚本 主要用于接收键盘事件
        this.myRoleControl = roleNode.addComponent(FinderRoleControl);
        
        var data = {
            uid: '2',
            nickname: '躲躲躲',
            profession: 0
        };
        var roleNode = this.createrRole(data);
    },

    createrRole: function (data) {
        var prof = this.professions[data.profession];
        // 创建角色空节点
        var roleNode = new cc.Node('roleNode'+data.uid);
        // 添加角色统一控制器
        var bin = roleNode.addComponent(binRole);
        // 根据角色职业生成对应实体
        var prefab = cc.instantiate(prof.Prefab);
        var entity = prefab.getComponent(prof.ClassName);
        prefab.parent = roleNode;
        // 完事
        bin.init(data, entity);
        // 加入地图
        this.mapInfo.addRole(roleNode);

        // 测试
        if(data.profession === 0){
            entity.setItemSpr(5);
        } else {
            entity.isShowIndicator(true);
        }
        return roleNode;
    }

});
