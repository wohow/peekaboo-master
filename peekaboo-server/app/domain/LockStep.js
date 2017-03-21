
var GameManager = require('./GameManager');

// 同步机制
var exp = module.exports;

exp.PREPARE_TIME = 30;
exp.SEARCH_TIME = 120;

// 所有玩家的操作指令
var entities = [];

// 通道
var channel = null;

var interval = null;
var timeout = null;
var prepareTimeout = null;

// 开启
exp.startTurn = function (_channel) {
	channel = _channel;
	interval = setInterval(onTurn, 1000/30);
	
	// 
	prepareTimeout = setTimeout(function(){
		// 通知可以开始了
		channel.pushMessage('onStartSearch', {});
		// 记时 时间到了 就结束
		timeout = setTimeout(function(){
			exp.stopTurn(0);
		}, exp.SEARCH_TIME*1000);
	}, exp.PREPARE_TIME*1000);
};

// 关闭
exp.stopTurn = function (camp) {
	clearInterval(interval);
	clearTimeout(timeout);
	clearTimeout(prepareTimeout);
	exp.onGameOver(camp);
	GameManager.isStart = false;
};

// 玩家离开
exp.leave = function (uid, sid) {
	if(!channel)
		return true;
	channel.leave(uid, sid);
	if(channel.getMembers().length <= 1){
		return channel.getMembers()[0];
	}
	return false;
};

// 同步开火
exp.onFire = function (uid, startPos, targetPos) {
	if(!channel)
		return;
	channel.pushMessage('onFire', {
		uid: uid,
		startPos: startPos,
		targetPos: targetPos
	});
};

// 同步找到了
exp.onWasfound = function (uid, curfoundCount) {
	if(!channel)
		return;
	channel.pushMessage('onWasfound', {
		uid: uid,
		curfoundCount: curfoundCount
	});
};

// 游戏结束
exp.onGameOver = function(camp) {
	if(!channel)
		return;
	if(channel.getMembers().length !== 0){
		channel.pushMessage('onGameOver', {camp: camp});
	}
	channel.destroy();
	channel = null;
};


// 每回合同步玩家 指令
function onTurn(){
	
	var worldStates = GameManager.userStutes();
	channel.pushMessage('onReveal', {worldStates: worldStates});
}