import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Recommendation {
  id: number;
  text: string;
  votes: number;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class RecommendationService {
  private readonly apiUrl = '/api/recommendations';

  constructor(private http: HttpClient) {}

  list(sort: string = 'newest'): Observable<Recommendation[]> {
    const params = new HttpParams().set('sort', sort);
    return this.http.get<Recommendation[]>(this.apiUrl, { params });
  }

  search(query: string): Observable<Recommendation[]> {
    const params = new HttpParams().set('q', query);
    return this.http.get<Recommendation[]>(`${this.apiUrl}/search`, { params });
  }

  create(text: string, submitterName?: string): Observable<Recommendation> {
    return this.http.post<Recommendation>(this.apiUrl, { text, submitterName: submitterName || null });
  }

  vote(id: number): Observable<Recommendation> {
    return this.http.post<Recommendation>(`${this.apiUrl}/${id}/vote`, {});
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
