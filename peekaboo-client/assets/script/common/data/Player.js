
/**
 * 自己信息
 */
var exp = module.exports;

exp.uid = '';
exp.nickname = '';
exp.profession = 1;// 1.躲 2.找

exp.init = function (data) {
	this.uid = data.uid;
	this.nickname = data.nickname;
	this.profession = data.profession;
};