'use strict';

var crc = require('crc');
var async = require('async');
var code = require('../../../consts/code');
var User = require('../../../domain/User');
var GameManager = require('../../../domain/GameManager');
var LockStep = require('../../../domain/LockStep');

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
	if(GameManager.nameIsExists(nickname)){
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
		GameManager.addUser(user);

		var data = user.strip();

		//
		var channel = self.app.get('channelService').getChannel('syncChannel', true);
		// 先同步其他玩家
		channel.pushMessage('onEntryRoom', {user: data});
		// 然后把玩家添加进来
		channel.add(uid, self.sid);

		// 
		next(null, {
			code: code.OK, 
			user: data, 
			users: GameManager.users(),
			captainUid: GameManager.captainUid,
			isStart: GameManager.isStart
		});
	});
};
// 退出
function userLeave(app, session){
	if(!session || !session.uid) {
		return;
	}
	var user = GameManager.userLeave(session.uid);
	if(!user){
		return;
	}

	console.log(user.nickname + '(' + user.uid + ')', ' 断开连接');
	var channel = app.get('channelService').getChannel('syncChannel', true);
	channel.leave(user.uid, user.sid);

	// 游戏通道
	var lastUid = LockStep.leave(user.uid, user.sid);
	if(lastUid){
		GameManager.isStart = false;
		let u = GameManager.getUser(lastUid);
		LockStep.stopTurn(u ? u.camp : null);
	}

	var msg = { uid: user.uid };

	// 如果是队长 把队长移到下一个
	if(user.uid === GameManager.captainUid){
		GameManager.updateCaptainUid();
		msg.newCaptainUid = GameManager.captainUid;
	}

	// 同步其他玩家 
	channel.pushMessage('onUserLeave', msg);
}

/**
 * RTT
 * 30秒请求一次
 */
Handler.prototype.rtt = function(msg, session, next) {
	next(null, {time: msg.time});
};
