import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { shareReplay } from 'rxjs/operators';
import { SiteContent } from '../models/site-content.model';

@Injectable({ providedIn: 'root' })
export class ContentService {
  private http = inject(HttpClient);

  content$ = this.http
    .get<SiteContent>('assets/data/site-content.json')
    .pipe(shareReplay(1));
}
