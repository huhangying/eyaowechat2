// appid: "wxf73fbd0076a0e2c1"
// mch_id: "1603895592"
// nonce_str: "tEvTBokrvgMTzpd0"
// prepay_id: "wx12121018970453e16833612b4f6b380000"
// result_code: "SUCCESS"
// return_code: "SUCCESS"
// return_msg: "OK"
// sign: "0E23BEEAF5DD6DEA9F26AA27B2F6FE53"
// trade_type: "JSAPI"

export interface WeixinPayResponse {
  appid?: string;
  mch_id?: string;
  nonce_str?: string;
  prepay_id?: string;
  return_code: string;
  return_msg: string;
  sign?: string;
  trade_type?: string;

  result_code?: string; // important
  err_code?: string;
  err_code_des?: string;
}
