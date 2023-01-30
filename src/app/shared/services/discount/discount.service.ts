import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IDiscountRequest, IDiscountResponse } from '../../interfaces/discount.interface';

@Injectable({
  providedIn: 'root'
})
export class DiscountService {

  constructor(private http: HttpClient) { }
  private url = environment.BACKEND_URL
  private api = { discounts: `${this.url}/discounts` }

  getAll(): Observable<IDiscountResponse[]> {
    return this.http.get<IDiscountResponse[]>(this.api.discounts)
  }

  getOne(id: number): Observable<IDiscountRequest[]> {
    return this.http.get<IDiscountRequest[]>(`${this.api.discounts}/${id}`)
  }

  create(discount: IDiscountResponse): Observable<IDiscountResponse[]> {
    return this.http.post<IDiscountResponse[]>(this.api.discounts, discount)
  }

  update(discount: IDiscountRequest, id: number): Observable<IDiscountResponse> {
    return this.http.patch<IDiscountResponse>(`${this.api.discounts}/${id}`, discount);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api.discounts}/${id}`);
  }
}
