import { Injectable } from '@angular/core';
import { UserFeedback } from '../models/user-feedback.model';
import { ApiService } from '../core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(
    private api: ApiService,
  ) { }

  getFeedbacksByType(type: number, uid: string) {
    return this.api.get<UserFeedback[]>(`feedbacks/user/${type}/${uid}`);
  }

  getFeedbackHistoryByDoctorAndType(type: number, uid: string, did: string) {
    return this.api.get<UserFeedback[]>(`feedbacks/user/${type}/${uid}/${did}`);
  }

  createFeedback(feedback: UserFeedback) {
    return this.api.post<UserFeedback>('feedback', feedback);
  }
}
