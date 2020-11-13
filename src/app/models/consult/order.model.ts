export interface Order {
  _id?: string;
  openid: string,
  userName?: string;
  doctor: string; // id
  doctorName?: string;

  consultId?: string;
  consultType?: number;
  amount?: number; // 分

  // for weixin pay
  orderId: string;
  prepay_id?: string;
  status?: string;
  createdAt?: Date;
}
