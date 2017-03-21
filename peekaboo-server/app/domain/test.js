

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
exp.connect = function (uid, sid, nickname) {
	var entity = {
		uid: uid,
		sid: sid,
		nickname: nickname,
		speed: 100.0,// 速度 单位秒
		position: {x: 0, y: 0},
		lastSequenceNumber: 0, // 最后一个输入

		applyInput: function (input) {
			this.position.x += input.pressTime.x*this.speed;
			this.position.y += input.pressTime.y*this.speed;
			this.lastSequenceNumber = input.sequenceNumber;
		},

		state: function() {
			return {
				uid: this.uid,
				position: this.position,
				lastSequenceNumber: this.lastSequenceNumber
			};
		},

		strip: function () {
			return {
				uid: this.uid,
				speed: this.speed,
				nickname: this.nickname,
				position: this.position,
			};
		}
	};
	entities.push(entity);

	// 添加到 通道中
	channel.add(uid, sid);
};

// 获取某个玩家
exp.getEntity = function (uid) {
	var arr = entities.filter((m)=> m.uid === uid);
	return arr.length === 0 ? null : arr[0];
};

exp.entities = function () {
	return entities.map((m)=> {
		return m.strip();
	});
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

	channel.pushMessage('onUpdateWorldState', {worldStates: worldStates});
}