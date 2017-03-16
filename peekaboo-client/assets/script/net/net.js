
/**
 * 通信类
 * @type {[type]}
 */
var net = module.exports;

/**
 * 服务器断开
 */
net.onDisconnect = function(cb){
	pomelo.on('disconnect', cb);
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
	if(cb){
		pomelo.request(route, msg, cb)
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
