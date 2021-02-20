export interface ArticlePage {
  _id?: string;
  name?: string; // page section name
  doctor: string; // id
  doctor_name: string; // doctor's full name
  cat?: string; // article cat id
  title?: string;
  title_image?: string;
  content?: string;
  apply?: boolean; // false: 未发送; true: 已发送
  createdAt?: Date;
}

export interface ArticleSearch {
  _id?: string;
  name: string; // page section name
  cat?: string; // article cat id
  title?: string;
  title_image?: string;
  targetUrl: string; // wx: http://mp.weixin.qq.com/s?__biz=MzIxNTMzNTM0MA==&mid=100000079&idx=1&sn=c5bef41ef4665408aaee381238df549f#rd
  keywords: string; // separated by |
  author?: string; // wx
  digest?: string; // wx
  update_time?: Date;
  updatedAt?: Date;
}