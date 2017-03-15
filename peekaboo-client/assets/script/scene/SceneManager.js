
/**
 * 场景管理
 */
cc.Class({
    extends: cc.Component,

    properties: {
        bg: cc.Node,
        prompt: cc.Label,
        progressBar: cc.Sprite,
    },

    onLoad: function(){
        cc.game.addPersistRootNode(this.node);
    },

    open: function (isOpen) {
        this.bg.active = isOpen;
        if(isOpen){
            // this.prompt.string = '提示：' + consts.randomPromptString();
        }
    },

    // 
    setPercent: function(percent){
        if(!this.node.active)
            return;
        this.progressBar.fillRange = percent;
    }
});


var exp = module.exports;

/**
 * 加载一个场景
 * @param  {[type]} sceneNanme [description]
 * @return {[type]}            [description]
 */
exp.load = function (sceneNanme) {
    showLoadingDisplay();
    // console.log(sceneNanme)
    if(typeof(sceneNanme) === 'string'){
        cc.director.loadScene(sceneNanme);
    } else if(typeof(sceneNanme) === 'function'){
        sceneNanme(function(name){
            cc.director.loadScene(name);
        })
    } else {
        console.error('sceneNanme typeof error');
    }
};


// 显示加载进度条 - node形式实现
function showLoadingDisplay(){
    var instance = cc.find('scene-loading').getComponent('SceneManager');

    instance.open(true);

    cc.loader.onProgress = function (completedCount, totalCount, item) {
        // console.log(completedCount, totalCount);
        // var percent = 100 * completedCount / totalCount;
        instance.setPercent(completedCount / totalCount);
    };

    cc.director.once(cc.Director.EVENT_AFTER_SCENE_LAUNCH, function () {
        instance.open(false);
        cc.loader.onProgress = null;
    });
}