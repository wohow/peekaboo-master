
'use strict';

var UserManager = require('../../../domain/UserManager');

module.exports = function(app) {
  	return new Handler(app);
};

var Handler = function(app) {
  	this.app = app;
  	this.syncChannel = app.get('channelService').getChannel('syncChannel', true);
};

/**
 * 提交位置
 * 1秒提交30次
 */
Handler.prototype.commitPosition  = function(msg, session, next) {
	
	var user = UserManager.getUser(session.uid);

	user.position = msg.position;

	// 这里同步给其他玩家
	this.syncChannel.pushMessage('onSyncPosition', {uid: user.uid, position: user.position});
};