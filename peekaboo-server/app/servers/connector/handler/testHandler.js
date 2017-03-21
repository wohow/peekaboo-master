'use strict';

var crc = require('crc');
var test = require('../../../domain/test');

module.exports = function(app) {
  	return new Handler(app);
};

var Handler = function(app) {
  	this.app = app;
};

Handler.prototype.login = function(msg, session, next) {
	var nickname = msg.nickname;

	// 生成uid
	var uid = Math.abs(crc.crc32(nickname)).toString();

	session.bind(uid);

	test.connect(uid, this.app.sid);

	next(null, {code: 200, uid: uid, nickname: nickname});
};

// 处理输入
Handler.prototype.processInputs = function(msg, session, next) {

	var entity = test.getEntity(session.uid);
	if(!entity){
		return;
	}
	// 检查是否非法操作
	if(!test.validateInput(msg.input)){
		return;
	}

	entity.applyInput(msg.input);
};