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

/**
 * 申请开火
 */
Handler.prototype.applyFire  = function(msg, session, next) {
	
	var user = GameManager.getUser(session.uid);

	// 这里同步给其他玩家
	LockStep.onFire(user.uid, msg.startPos, msg.targetPos);
};

/**
 * 提交指令
 */
Handler.prototype.commitInstructions  = function(msg, session, next) {
	LockStep.collectInstruction(session.uid, msg.direction, msg.position);
};

/**
 * 被找到了
 */
Handler.prototype.wasfound  = function(msg, session, next) {
	var user = GameManager.getUser(session.uid);
	user.itemId = 0;

	var curfoundCount = GameManager.getCurfoundCount();

	LockStep.onWasfound(user.uid, curfoundCount);

	if(GameManager.isAllFound()){
		LockStep.stopTurn(1);
	}
};

/**
 * 退出游戏
 */
Handler.prototype.exitGame  = function(msg, session, next) {
	var user = GameManager.getUser(session.uid);
	user.isInGame = false;

	next(null, {code: 200});

	this.syncChannel.pushMessage('onExitGame', {uid: user.uid});
};
