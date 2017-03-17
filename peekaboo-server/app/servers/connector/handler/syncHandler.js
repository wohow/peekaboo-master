'use strict';

var GameManager = require('../../../domain/GameManager');

module.exports = function(app) {
  	return new Handler(app);
};

var Handler = function(app) {
  	this.app = app;
  	this.syncChannel = app.get('channelService').getChannel('syncChannel', true);
};

/**
 * 提交位置
 * 1秒提交20次
 */
Handler.prototype.commitPosition  = function(msg, session, next) {
	
	var user = GameManager.getUser(session.uid);

	user.position = msg.position;

	// 这里同步给其他玩家
	this.syncChannel.pushMessage('onSyncPosition', {
		uid: user.uid, 
		position: user.position
	});
};

/**
 * 提交方向
 */
Handler.prototype.commitDirection  = function(msg, session, next) {
	
	var user = GameManager.getUser(session.uid);

	user.position = msg.position;
	user.direction = msg.direction;

	// 这里同步给其他玩家
	this.syncChannel.pushMessage('onSyncDirection', {
		uid: user.uid, 
		position: user.position,
		direction: user.direction
	});
};

/**
 * 申请开火
 */
Handler.prototype.applyFire  = function(msg, session, next) {
	
	var user = GameManager.getUser(session.uid);

	// 这里同步给其他玩家
	this.syncChannel.pushMessage('onFire', {
		uid: user.uid,
		startPos: msg.startPos,
		targetPos: msg.targetPos
	});
};