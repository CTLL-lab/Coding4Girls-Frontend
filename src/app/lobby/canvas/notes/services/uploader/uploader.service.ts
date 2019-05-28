import { Injectable } from '@angular/core';
import { HttpClient } from 'node_modules/@angular/common/http';
import { imgurAPI } from 'src/app/config';

@Injectable()
export class UploaderService {
  private requestOptions = {
    headers: { Authorization: 'Client-ID af24de90a2dc80e' }
  };
  constructor(private http: HttpClient) {}
  uploadImage(img: File) {
    const body = new FormData();
    body.set('image', img);
    return this.http.post(imgurAPI + '/image', body, this.requestOptions);
  }
}
