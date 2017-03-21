
var global = require('global');
var net = require('net');


var input_sequence_number = 0;
var direction = {x:0, y:0};

cc.Class({
    extends: cc.Component,

    properties: {
        players: cc.Node,
        playerPrefab: cc.Prefab
    },

    // use this for initialization
    onLoad: function () {
        this.roles = [];
        this.pendingInputs = [];
        this.entity = null;

        var self = this;
        net.on('onUpdateWorldState', function (data) {
            self.onUpdateWorldState(data.worldStates);
        });
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    start: function () {

        for (var i = global.entities.length - 1; i >= 0; i--) {
            this.addPlayer(global.entities[i]);
        }
    },

    addPlayer: function (entity) {
        var prefab = cc.instantiate(this.playerPrefab);
        this.players.addChild(prefab);
        prefab.x = entity.position.x;
        prefab.y = entity.position.y;

        var bf = prefab.getComponent('binPlayer');
        bf.init(entity.uid, entity.nickname);

        if(entity.uid === global.uid){
            this.entity = bf;
        }
        this.roles.push(bf);
    },

    getPlayer: function (uid) {
        var arr = this.roles.filter((m)=> m.uid === uid);
        return arr.length === 0 ? null : arr[0];
    },


    onKeyDown: function(event){
        this.move(event, 1);
    },
    onKeyUp: function(event){
        this.move(event, 0);
    },
    move: function(event, speed){
        switch(event.keyCode) {
            case cc.KEY.a:
            case cc.KEY.left: // 左
                direction.x = -1 * speed;
                break;
            case cc.KEY.d:
            case cc.KEY.right:// 右
                direction.x = 1 * speed;
                break;
            case cc.KEY.w:
            case cc.KEY.up: // 上
                direction.y = 1 * speed;
                break;
            case cc.KEY.s:
            case cc.KEY.down:// 下
                direction.y = -1 * speed;
                break;
        }
    },

    update: function(dt){
        if(direction.x === 0 && direction.y === 0)
            return;

        var input = {
            pressTime: {x: direction.x*dt, y: direction.y*dt},
            sequenceNumber: ++input_sequence_number,
        };

        net.send('connector.testHandler.processInputs', {input: input});

        // 客户端预测
        this.entity.applyMove(input.pressTime);

        // 记录每次的操作指令 方便后面做调和
        this.pendingInputs.push(input);
    },

    onUpdateWorldState: function(worldStates) {
        for (var i = worldStates.length - 1; i >= 0; i--) {
            var state = worldStates[i];
            // console.log(state.position)
            var role = this.getPlayer(state.uid);
            if(!role){
                continue;
            }
            var p = cc.p(state.position);

            if(cc.pSameAs(role.node.position, p)){
                console.log('闲置了');
            } else {
                console.log('开始移动了');
            }
            // 直接设置成服务器 的位置
            role.node.position = p;

            // 这里做调和
            if(role.uid === global.uid){
                var j = 0;
                while (j < this.pendingInputs.length) {
                    var input = this.pendingInputs[j];
                    if (input.sequenceNumber <= state.lastSequenceNumber) {
                        this.pendingInputs.splice(j, 1);
                    } else {
                        role.applyMove(input.pressTime);
                        j++;
                    }
                }
            }
            
        }
    }
});
