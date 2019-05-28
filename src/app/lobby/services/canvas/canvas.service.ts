import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { apiURL } from 'src/app/config';

@Injectable()
export class CanvasService {
  constructor(private http: HttpClient) {}
}
