export interface Order {
  _id?: string;
  openid: string, // -------------- KEY!
  userName?: string;
  doctor: string; // id
  doctorName?: string;

  consultId?: string;
  consultType?: number;
  amount?: number; // 分
  
  prepay_id?: string;
  status?: string;

  // for weixin pay
  out_trade_no: string; // 商户订单号 ------------- KEY!
  return_code?: string,
  total_fee?: number; // 订单金额 ------
  bank_type?: string;
  transaction_id?: string; // 微信订单号
  time_end?: string;

  return_msg?: string; // if error

  // refund
  refund_id?: string; // 微信退款单号
  out_refund_no?: string; // 商户退款单号
  refund_fee?: number; // 申请退款金额
  settlement_refund_fee?: number; // 退款金额
  refund_status?: string; // 退款状态
  refund_recv_accout?: string; // 退款入账账户
  refund_account?: string; // 退款资金来源
  refund_request_source?: string; // 退款发起来源
   
  createdAt?: Date;
}
