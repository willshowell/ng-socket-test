export interface Chat {
  room: string;
  username: string;
  text: string;
  timestamp?: Date;
  type?: 'message' | 'meta';
};
