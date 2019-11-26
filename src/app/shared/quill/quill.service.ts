import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QuillService {
  public currentInstructions: any;

  constructor() {
    console.log('quill service created');
  }
}
