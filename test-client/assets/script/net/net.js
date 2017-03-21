
var code = require('code');
// var protocol = require('protocol');
// var Tip = require('Tip');


/**
 * 通信类
 * @type {[type]}
 */

var net = module.exports;

// pomelo.on('disconnect', function(){
// 	console.log('服务器断开连接');
// });
/**
 * 服务器断开
 */
net.onDisconnect = function(cb){
	pomelo.on('disconnect', cb);
	// pomelo.on('disconnect', function(){
	// 	console.log('pomelo disconnect');
	// });
	// pomelo.on('close', function(){
	// 	console.log('pomelo close');
	// })
};

/**
 * 连接服务器
 * @param  {[type]}   address [服务器地址]
 * @param  {Function} cb      [成功回掉]
 */
net.connect = function(address, cb){
	pomelo.disconnect();
	pomelo.init(address, cb);
};

/**
 * 发送消息
 */
net.send = function(route, msg, cb, isWait){

	// var pro = protocol[route];
	// if(!pro){
	// 	console.log(route , ' 协议不存在');
	// 	return;
	// }	
	// if(typeof msg != 'object'){
	// 	console.log(msg, ' msg内容不是Object');
	// 	return;
	// }
	// for (var item in msg) {
	// 	if(!pro.request[item]){
	// 		console.log(item , ' 没有这个字段');
	// 		return;
	// 	}
	// }

	if(!!cb){
		pomelo.request(route, msg, cb);
	}else{
		pomelo.notify(route, msg);
	}
};

/**
 * 监听消息
 */
net.on = function(route, cb){
	pomelo.on(route, cb);
};


function request(route, msg, cb, isWait){
	// if(!isWait)
	// 	Tip.showWait(true);
	pomelo.request(route, msg, function(data){
		// Tip.showWait(false);
		// if(data.code === code.FAIL && data.error){
		// 	Tip.showMessage(data.error);
		// } else {
		// 	cb(data);
		// }
		cb(data);
	});
}

function notify(route, msg){
	pomelo.notify(route, msg);
}