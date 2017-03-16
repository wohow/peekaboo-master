'use strict';

/**
 * 玩家
 */
module.exports = User;

function User(opts) {
	this.uid = opts.uid;
	this.nickname = opts.nickname || ''; //昵称
	this.sid = opts.sid;

	this.profession = 0;
	this.position = {x:0, y:0};
}

User.prototype.strip = function() {
	return {
		uid: this.uid,
		nickname: this.nickname,
		profession: this.profession
	};
};