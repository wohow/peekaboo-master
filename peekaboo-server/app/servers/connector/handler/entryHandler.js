'use strict';

var crc = require('crc');
var async = require('async');
var code = require('../../../consts/code');
var User = require('../../../domain/User');
var UserManager = require('../../../domain/UserManager');

module.exports = function(app) {
  	return new Handler(app);
};

var Handler = function(app) {
  	this.app = app;
  	this.sid = app.get('serverId');
};

/**
 * 进入游戏
 */
Handler.prototype.entry = function(msg, session, next) {

	var nickname = msg.nickname;
	// 是否重名
	if(UserManager.nameIsExists(nickname)){
		next(null, {code: code.FAIL, error: '名字已存在'});
		return;
	}

	// 生成uid
	var uid = Math.abs(crc.crc32(nickname)).toString();

	var self = this;
	async.waterfall([
		function(cb){
			session.bind(uid, cb);
		}
	], function(err){
		// 监听离线
		session.on('closed', userLeave.bind(null, self.app));

		// 加入到设备管理中心
		var user = new User({uid: uid, nickname: nickname, sid: self.sid});
		UserManager.addUser(user);
		user.profession = UserManager.users().length % 2;

		//
		var syncChannel = self.app.get('channelService').getChannel('syncChannel', true);
		syncChannel.add(uid, self.sid);

		// 
		next(null, {code: code.OK, user: user.strip(), users: UserManager.users()});
	});
};
// 退出
function userLeave(app, session){
	if(!session || !session.uid) {
		return;
	}
	console.log(session.uid, ' 断开连接');
	UserManager.userLeave(session.uid);
}

/**
 * RTT
 * 30秒请求一次
 */
Handler.prototype.rtt = function(msg, session, next) {
	next(null, {time: msg.time});
};
