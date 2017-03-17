
/**
 * 自己信息
 */
var exp = module.exports;

exp.uid = '';
exp.nickname = '';
exp.camp = 0;// 0.躲 1.找
exp.itemId = 1;

exp.init = function (data) {
	this.uid = data.uid;
	this.nickname = data.nickname;
	this.camp = data.camp;
};