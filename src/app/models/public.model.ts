export interface Faq {
  question: string;
  answer: string;
}

export interface WxMaterial {
  total_count: number;
  item_count: number;
  item: WxMaterialItem[];
}

export interface WxMaterialItem {
  media_id: string;
  content: {
    news_item: WxMaterialNewsItem[];
  };
  update_time: Date;
}

export interface WxMaterialNewsItem {
  // title: string;
  // thumb_media_id: string; // THUMB_MEDIA_ID,
  // show_cover_pic: boolean; // SHOW_COVER_PIC(0 / 1),
  // author: string;
  // digest: string;
  // content: string;
  // url: string;
  // content_source_url: string;

  title: string;
  author: string;
  digest: string;
  content: string;
  content_source_url?: string;
  thumb_media_id: string;
  show_cover_pic: number;
  url: string;
  thumb_url: string;
  need_open_comment?: number;
  only_fans_can_comment?: number;
}