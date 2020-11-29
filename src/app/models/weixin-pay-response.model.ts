
export interface WeixinPayParams {
  appId: string;
  timeStamp: string;
  nonceStr: string;
  package: string;
  signType: string;
  paySign: string;
}

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

export interface WxJsapiResponse {
  nonceStr: string;
  timestamp: string;
  signature: string;
}
