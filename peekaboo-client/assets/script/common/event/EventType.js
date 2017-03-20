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
//
EventType.SYNC_CHATMSG = 'SYNC_CHATMSG';

//
EventType.SYNC_STARTSEARCH = 'SYNC_STARTSEARCH';
// 同步开火
EventType.SYNC_FIRE = 'SYNC_FIRE';
// 所有人每回合的操作指令
EventType.SYNC_REVEAL = 'SYNC_REVEAL';
// 
EventType.SYNC_WASFOUND = 'SYNC_WASFOUND';
//
EventType.SYNC_GAMEOVER = 'SYNC_GAMEOVER';
//
EventType.SYNC_EXITGAME = 'SYNC_EXITGAME';