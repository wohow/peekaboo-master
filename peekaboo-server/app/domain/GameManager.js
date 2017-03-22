'use strict';

/**
 * 用户管理中心
 */
var exp = module.exports;

var users = {};
exp.isStart = false;// 游戏是否开始
exp.captainUid = '';// 队长UID

/** 判断对象是否空对象{} */
function isEmptyObject(obj) {
    for (var k in obj)
        return false;
    return true;
}

// 根据key获取玩家信息
function getUserByKey(key, value) {
	for(var k in users){
		var user = users[k];
		if(user[key] === value){
			return user;
		}
	}
	return null;
}

exp.getUsers = function(){
	return users;
};

exp.users = function(){
	var arr = [];
	for (var k in users) {
		arr.push(users[k].strip());
	}
	return arr;
};

exp.userStutes = function(){
	var arr = [];
	for (var k in users) {
		var user = users[k];
		// 这里避免重复发相同的
		if(user.yetSequenceNumber !== user.lastSequenceNumber){
			user.yetSequenceNumber = user.lastSequenceNumber;
			arr.push(user.state());
		}
	}
	return arr;
};

// 获取对应阵营个数
exp.getCampCount = function () {
	var dodge = 0, finder = 0;
	for (var k in users) {
		if(users[k].isInGame)
			continue;
		if(users[k].camp === 0){
			++dodge;
		} else if(users[k].camp === 1){
			++finder;
		}
	}
	return [dodge, finder];
};

// 添加一个user
exp.addUser = function(user){
	var counts = exp.getCampCount();
	if(isEmptyObject(users)){
		exp.captainUid = user.uid;
	}
	user.camp = counts[0] > counts[1] ? 1 : 0;
	users[user.uid] = user;
};

// 获取角色
exp.getUser = function(uid){
	return users[uid];
};

// 是否存在该名字
exp.nameIsExists = function(nickname){
	return !!getUserByKey('nickname', nickname);
};

// 刷新下一个队长
exp.updateCaptainUid = function () {
	exp.captainUid = '';
	for (var k in users) {
		exp.captainUid = users[k].uid;
		break;
	}
};

// 获取当前已经找到的个数
exp.getCurfoundCount = function () {
	var count = 0;
	for (var k in users) {
		var user = users[k];
		if(!user.isInGame)
			continue;
		if(user.camp === 0 && user.itemId === 0){
			++count;
		}
	}
	return count;
};

// 判断是否全部找完了
exp.isAllFound = function () {
	for (var k in users) {
		var user = users[k];
		if(!user.isInGame)
			continue;
		if(user.camp === 0 && user.itemId !== 0){
			return false;
		}
	}
	return true;
};

// 玩家离线
exp.userLeave = function (uid) {
	var user = users[uid];
	delete users[uid];
	if(isEmptyObject(users)){
		exp.isStart = false;
	}
	return user;
};