import { Injectable } from '@angular/core';
import { ApiService } from '../core/services/api.service';
import { Observable } from 'rxjs';
import { Order } from '../models/consult/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(
    private api: ApiService,
  ) {
  }

  getAll() {
    return this.api.get<Order[]>('orders');
  }

  getById(id: string) {
    return this.api.get<Order>('order/' + id);
  }

  update(order: Order): Observable<Order> {
    return this.api.post<Order>('order', order) as Observable<Order>;
  }

}
