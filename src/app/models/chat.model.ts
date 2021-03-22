
export interface Chat {
  _id?: string;
  hid?: string;
  room?: string; // doc id
  sender: string; // id
  senderName: string;
  to: string; // id
  // direction: boolean; // 消息方向：   false： user->doctor;     true: doctor->user
  type: ChatType;
  data: string;
  created?: Date;
  read?: number;

  cs?: boolean; // 客服咨询消息flag
}

// 消息類別： 0：Text；  1：圖片；  2：語音；   4：視頻；   8: command
export enum ChatType {
  text = 0,
  picture = 1,
  audio = 2,
  video = 4,
  command = 8,
  adverseReaction = 10,
  doseCombination = 20,
}

export enum ChatCommandType {
  setCharged =  'SET_CHARGED',
  setFree = 'SET_FREE',
  setFinished = 'SET_FINISHED',
  inConsult = 'IN_CONSULT',
}

export const ChatCommandTypeMap = {
  SET_CHARGED: '药师已设置成收费咨询',
  SET_FREE: '药师已设置成免费咨询',
  SET_FINISHED: '付费咨询已完成',
  IN_CONSULT: '您与药师正在付费咨询中',
};