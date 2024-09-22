import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LawnMowerService {
  private brands = ['Honda', 'Bosch', 'Makita'];

  private models: { [key: string]: string[] } = {
    Honda: ['XTR100', 'XTR200'],
    Bosch: ['CUT2000', 'CUT3000'],
    Makita: ['MKE54231', 'TUM4110'],
  };

  constructor() {}

  getBrands(): Observable<string[]> {
    return of(this.brands);
  }

  getModels(brand: string): Observable<string[]> {
    return of(this.models[brand] || []);
  }
}
