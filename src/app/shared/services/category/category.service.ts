import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ICategoryResponse } from '../../interfaces/category.interface';
import { ICategoryRequest } from '../../interfaces/category.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  private url = environment.BACKEND_URL;
  private api = { categories: `${this.url}/categories` }

  getAll(): Observable<ICategoryResponse[]> {
    return this.http.get<ICategoryResponse[]>(this.api.categories)
  }

  getOne(id: number): Observable<ICategoryResponse> {
    return this.http.get<ICategoryResponse>(`${this.api.categories}/${id}`);
  }

  create(discount: ICategoryRequest): Observable<ICategoryResponse> {
    return this.http.post<ICategoryResponse>(this.api.categories, discount);
  }

  update(discount: ICategoryRequest, id: number): Observable<ICategoryResponse> {
    return this.http.patch<ICategoryResponse>(`${this.api.categories}/${id}`, discount);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api.categories}/${id}`);
  }
}
