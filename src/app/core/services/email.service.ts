import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private emailUrl = 'http://localhost:4000/send-email';
  constructor(private httpClient: HttpClient) { }

  sendEMail(email: any) {
    return this.httpClient.post(this.emailUrl, email);
  }
}
