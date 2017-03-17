
/**
 * 工具类
 * @type {[type]}
 */
var exp = module.exports;

/**
 * 判断对象是否空对象{}
 */
exp.isEmptyObject = function(obj) {
    for (var k in obj)
        return false;
    return true;
};

/**
 * 随机一个整数 包括min和max
 * @param  {[Number]} min [最小值]
 * @param  {[Number]} max [最大值]
 * @return {[Number]}
 */
exp.random = function(min, max){
    var count = Math.max(max - min, 0) + 1;
    return Math.floor(Math.random()*count) + min;
};

/**
 * 随机一个下标出来
 * @param  {[Number]} len    [数组长度]
 * @param  {[Number]} count  [需要随机的个数](可不填)
 * @param  {[Number]} ignore [需要忽略的下标](可不填)
 * @return {[Number|Array]}  [如果count大于1 则返回count长度的数组下标 不重复]
 */
exp.randomIndex = function(len, count, ignore){
    if(len === 0){
        return -1;
    }
    var indexs = [];
    count = count || 1;
    count = count > len ? len : count;
    for (var i = 0; i < len; i++) {
        if(i === ignore)
            continue;
        indexs.push(i);
    }
    var ret = [];
    for (var i = 0; i < count; i++) {
        var idx = exp.random(0, indexs.length-1);
        ret.push(indexs[idx]);
        indexs.splice(idx, 1);
    }
    return ret.length === 1 ? ret[0] : ret;
};

/**
 * 将一个常数变成1
 */
exp.cTo1 = function(n){
    return n === 0 ? 0 : n / Math.abs(n);
};

// 获取两点之间的角度
function getAngle(px,py,mx,my){
    //获取两点间的相对角度
    var x = Math.abs(px-mx);
    var y = Math.abs(py-my);
    var z = Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
    var cos = y/z;
    var radina = Math.acos(cos);
    var angle = Math.floor(180/(Math.PI/radina));
    //在第四象限
    if(mx>px&&my>py){angle = 180 - angle;}
    //在y轴负方向上
    if(mx==px&&my>py){angle = 180;}
    //在x轴正方向上
    if(mx>px&&my==py){angle = 90;}
    //在第三象限
    if(mx<px&&my>py){angle = 180 + angle;}
    //在x轴负方向
    if(mx<px&&my==py){angle = 270;}
    //在第二象限
    if(mx<px&&my<py){angle = 360 - angle;}
    return angle;
}
exp.rotation = function(a, b){
    return getAngle( b.x, b.y, a.x, a.y );
};