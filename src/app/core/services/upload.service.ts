import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import Compressor from 'compressorjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(
    private api: ApiService,
  ) { }

  compressImg(file: Blob | File) {
    return new Promise<Blob | File>((resolve) => {
      new Compressor(file, {
        quality: 0.6,
        success(result) {
          return resolve(result);
        },
        error(err) {
          return resolve(file);
        }
      });
    });
  }

  uploadUserDir(uid: string, type: string, file: Blob | File, fileName?: string) {
    const formData = new FormData();
    formData.append('file', file, fileName);// pass new file name in
    return this.api.post<{path: string}>(`upload/user/${uid}_${type + this.getRandomString(10)}`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  getRandomString(length: number) {
    const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
  }
}
