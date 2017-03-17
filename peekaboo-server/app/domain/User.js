'use strict';

/**
 * 玩家
 */
module.exports = User;

function User(opts) {
	this.uid = opts.uid;
	this.sid = opts.sid;
	this.nickname = opts.nickname || ''; //昵称
	this.camp = 0;// 阵营 0.藏 1.找 2.观战
	this.itemId = 1;// 随机的道具ID 只有camp为0才有

	// 用于同步
	this.position = {x:0, y:0};
	this.direction = {x:0, y:0};// 方向
}

User.prototype.strip = function() {
	return {
		uid: this.uid,
		nickname: this.nickname,
		camp: this.camp
	};
};