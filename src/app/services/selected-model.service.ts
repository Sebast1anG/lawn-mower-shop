import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SelectedModelService {
  private selectedModelSubject = new BehaviorSubject<string | null>(null);
  selectedModel$ = this.selectedModelSubject.asObservable();

  setSelectedModel(model: string): void {
    this.selectedModelSubject.next(model);
  }
}
