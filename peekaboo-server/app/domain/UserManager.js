'use strict';

/**
 * 用户管理中心
 */
var exp = module.exports;

var users = {};

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

// 添加一个user
exp.addUser = function(user){
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

// 玩家离线
exp.userLeave = function (uid) {
	delete users[uid];	
};