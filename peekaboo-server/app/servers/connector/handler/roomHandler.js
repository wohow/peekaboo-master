'use strict';

var GameManager = require('../../../domain/GameManager');
var LockStep = require('../../../domain/LockStep');

module.exports = function(app) {
  	return new Handler(app);
};

var Handler = function(app) {
  	this.app = app;
  	this.syncChannel = app.get('channelService').getChannel('syncChannel', true);
};

// 随机一个下标出来
function randomIndex(len, count, ignore){
    if(len === 0){
        return -1;
    }
    var indexs = [];
    count = count || 1;
    count = count > len ? len : count;
    for (var i = 0; i < len; i++) {
        if(i === ignore)
            continue;
        indexs.push(i);
    }
    var ret = [];
    for (var i = 0; i < count; i++) {
        var idx = Math.floor(Math.random() * indexs.length);
        ret.push(indexs[idx]);
        indexs.splice(idx, 1);
    }
    return ret.length === 1 ? ret[0] : ret;
}

/**
 * 选择 阵营
 */
Handler.prototype.selectCamp = function(msg, session, next) {
	
	var user = GameManager.getUser(session.uid);

	user.camp = msg.camp;
	next(null, {code: 200, camp: user.camp});
	// 同步
	this.syncChannel.pushMessage('onSyncSelectCamp', {
		uid: user.uid,
		camp: user.camp
	});
};

/**
 * 发送聊天信息
 */
Handler.prototype.sendChat = function(msg, session, next) {
	var user = GameManager.getUser(session.uid);
	this.syncChannel.pushMessage('onChatMsg', {id: msg.id, nickname: user.nickname, content: msg.content});
};

/**
 * 开始游戏
 */
Handler.prototype.startGame = function(msg, session, next) {
	
	if(session.uid !== GameManager.captainUid){
		next(null, {code: 500, error: '你不是队长'});
		return;
	}

	// 检查双方至少要有一个人
	var counts = GameManager.getCampCount();
	if(counts[0] === 0 || counts[1] === 0){
		next(null, {code: 500, error: '双方至少要有一个人'});
		return;
	}
	next(null, {code: 200});

	GameManager.isStart = true;

	var hideItemIndexs = randomIndex(137, 20);
	var generateItemIndexs = randomIndex(857, 20);

	// 创建游戏专用通道
	var channel = this.app.get('channelService').createChannel('gameChannel');

	var gamePlayers = [];
	var users = GameManager.getUsers();
	var idx0 = 0;
	var idx1 = 0;
	var pos0 = [{x:13, y:13},{x:13, y:8},{x:16, y:8},{x:19, y:13},{x:19, y:8},{x:22, y:13},{x:22, y:8},{x:25, y:13},{x:25, y:8},{x:28, y:13},{x:28, y:8},{x:31, y:13},{x:31, y:8},{x:34, y:13},{x:34, y:8},{x:37, y:13},{x:37, y:8}];
	var pos1 = [{x:16, y:3},{x:17, y:1},{x:18, y:3},{x:19, y:1},{x:20, y:3},{x:21, y:1},{x:22, y:3},{x:23, y:1},{x:24, y:3},{x:25, y:1},{x:26, y:3},{x:27, y:1},{x:28, y:3},{x:29, y:1},{x:30, y:3},{x:31, y:1},{x:32, y:3},{x:33, y:1}];

	for(var key in users) {
		var user = users[key];
		if(user.isInGame){
			continue;
		}
		user.itemId = (user.camp === 0) ? (Math.floor(Math.random()*12) + 1) : 0;
		user.isInGame = true;
		var point = (user.camp === 0) ? pos0[++idx0] : pos1[++idx1];
		user.position.x = point.x * 32 + 16;
		user.position.y = point.y * 32 + 16;
		user.speed = (user.camp === 0) ? 100 : 120;

		channel.add(user.uid, user.sid);
		gamePlayers.push({
			uid: user.uid, 
			camp: user.camp, 
			itemId: user.itemId,
			position: user.position,
			speed: user.speed
		});
	}
	// 开启回合
	LockStep.startTurn(channel);

	// 同步其他玩家
	this.syncChannel.pushMessage('onStartGame', {
		hideItemIndexs: hideItemIndexs,
		generateItemIndexs: generateItemIndexs,
		gamePlayers: gamePlayers,
		prepareTime: LockStep.PREPARE_TIME,
		searchTime: LockStep.SEARCH_TIME
	});
};