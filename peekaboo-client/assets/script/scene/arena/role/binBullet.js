
/**
* 子弹
*/
cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad: function () {
    },

    onCollisionEnter: function (other, self) {
        if(other.node.group === 'role'){
            console.log('on collision role');
            var bin = other.node.getComponent('DodgeRole');
            bin.wasfound();

        } else if(other.node.group === 'wall'){
            console.log('on collision wall');

        }

    }
});
