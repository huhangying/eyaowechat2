export interface ArticlePage {
  _id?: string;
  name?: string; // page section name
  doctor: string; // doctor's full name
  cat?: string; // article cat id
  title?: string;
  title_image?: string;
  content?: string;
  apply?: boolean; // false: 未发送; true: 已发送
  createdAt?: Date;
}