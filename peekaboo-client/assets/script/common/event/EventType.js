/**
 * 所有 事件类型
 */

var EventType = module.exports;


// 有玩家离线
EventType.SYNC_USERLEAVE = 'SYNC_USERLEAVE';
// 同步有玩家进入房间
EventType.SYNC_ENTRYROOM = 'SYNC_ENTRYROOM';
// 同步选择阵营
EventType.SYNC_SELECTCAMP = 'SYNC_SELECTCAMP';
// 同步位置
EventType.SYNC_DIRECTION = 'SYNC_DIRECTION';

// 同步开火
EventType.SYNC_FIRE = 'SYNC_FIRE';
