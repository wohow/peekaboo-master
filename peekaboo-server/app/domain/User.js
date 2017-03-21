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
	this.isInGame = false;// 是否在游戏中

	// 用于同步
	this.status = 0;
	this.speed = 100;
	this.position = {x:0, y:0};
	this.lastSequenceNumber = 0;
}

User.prototype.applyInput = function (input) {
	this.status = input.status;
	this.position.x += input.pressTime.x*this.speed;
	this.position.y += input.pressTime.y*this.speed;
	this.lastSequenceNumber = input.sequenceNumber;
};

User.prototype.state = function() {
	return {
		uid: this.uid,
		status: this.status,
		position: this.position,
		lastSequenceNumber: this.lastSequenceNumber
	};
};

User.prototype.strip = function() {
	return {
		uid: this.uid,
		nickname: this.nickname,
		camp: this.camp,
		itemId: this.itemId,
		isInGame: this.isInGame,
		speed: this.speed,
		position: this.position,
		status: this.status
	};
};