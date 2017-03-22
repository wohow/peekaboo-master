
/**
*　常量
*/
var exp = module.exports;

exp.rtt = 10;// rtt 记录往返延迟

/** 服务器地址 */
exp.connectorAddress = 
{
	// host: '192.168.1.103', //家IP
	// host: '192.168.1.148', //公司IP
// 	host: '120.77.48.203',// 采田
    host: 'mc.hhhhhh.org',
	port: 50100,
	log: true
};

// 服务器是否收到提交
exp.sIsRC = false;