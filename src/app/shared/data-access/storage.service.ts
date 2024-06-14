import { Injectable, InjectionToken, PLATFORM_ID, inject } from '@angular/core';
import { of } from 'rxjs';
import { Checklist } from '../interfaces/checklist';
import {Item} from "../interfaces/item";

export const LOCAL_STORAGE = new InjectionToken<Storage>(
  'window local storage object',
  {
    providedIn: 'root',
    factory: () => {
      return inject(PLATFORM_ID) === 'browser'
        ? window.localStorage
        : ({} as Storage);
    },
  }
);

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  storage = inject(LOCAL_STORAGE);

  loadChecklists() {
    const checklists = this.storage.getItem('checklists');
    return of(checklists ? (JSON.parse(checklists) as Checklist[]) : []);
  }

  loadItems() {
    const checklistsItems = this.storage.getItem('items');
    return of(
      checklistsItems ? (JSON.parse(checklistsItems) as Item[]) : []
    );
  }

  saveChecklists(checklists: Checklist[]) {
    this.storage.setItem('checklists', JSON.stringify(checklists));
  }

  saveItems(items: Item[]) {
    this.storage.setItem('items', JSON.stringify(items));
  }
}
