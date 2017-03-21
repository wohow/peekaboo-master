

var exp = module.exports;

var entities = [];// 每个玩家数据

var channel = null;// 通道
var updateInterval = null;// 更新定时器

// 启动
exp.startup = function(chl, fps){
	channel = chl;
	updateInterval = setInterval(update, 1000/fps);
};

// 玩家连接上来
exp.connect = function (uid, sid) {
	var entity = {
		uid: uid,
		sid: sid,
		speed: 2,// 速度 单位秒
		position: {x: 0, y: 0},
		lastSequenceNumber: 0, // 最后一个输入

		applyInput: function (input) {
			this.position.x = input.x*this.speed;
			this.position.y = input.y*this.speed;
			this.lastSequenceNumber = input.sequenceNumber;
		},

		state: function() {
			return {
				uid: this.uid,
				position: this.position,
				lastSequenceNumber: this.lastSequenceNumber
			};
		}
	};
	entities.push(entity);

	channel.add(uid, sid);
};

// 获取某个玩家
exp.getEntity = function (uid) {
	var arr = entities.filter((m)=> m.uid === uid);
	return arr.length === 0 ? null : arr[0];
};

// 检查是否这个输入似乎是有效的
exp.validateInput = function(input) {
	return true;
};

// 向前端同步 所有玩家状态
function update(){

	var worldStates = entities.map((m)=>{
		return m.state();
	});

	channel.pushMessage('onUpdateWorldState', worldStates);
}