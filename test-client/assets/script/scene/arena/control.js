
var global = require('global');

cc.Class({
    extends: cc.Component,

    properties: {
        players: cc.Node,
        playerPrefab: cc.Prefab
    },

    // use this for initialization
    onLoad: function () {
        this.roles = [];
        
        this.addPlayer(global.uid, global.nickname);
    },

    addPlayer: function (uid, nickname) {
        var prefab = cc.instantiate(this.playerPrefab);
        this.players.addChild(prefab);

        var bf = prefab.getComponent('binPlayer');
        bf.init(uid, nickname);

        this.roles.push(bf);
    }
});
