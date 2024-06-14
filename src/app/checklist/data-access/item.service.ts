import { Injectable, computed, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import {
  AddItem,
  Item, RemoveItem,
} from '../../shared/interfaces/item';

export interface ItemState {
  items: Item[];
}

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  // state
  private state = signal<ItemState>({
    items: [],
  });

  // selectors
  items = computed(() => this.state().items);

  // sources
  add$ = new Subject<AddItem>();
  toggle$ = new Subject<RemoveItem>();

  constructor() {
    this.add$.pipe(takeUntilDestroyed()).subscribe((checklistItem) =>
      this.state.update((state) => ({
        ...state,
        items: [
          ...state.items,
          {
            ...checklistItem.item,
            id: Date.now().toString(),
            checklistId: checklistItem.checklistId,
            checked: false,
          },
        ],
      }))
    );

    this.toggle$
      .pipe(takeUntilDestroyed())
      .subscribe((itemId) => {
        this.state.update((state) => ({
          ...state,
          items: state.items.map((item) =>
            item.id === itemId
              ? {...item, checked: !item.checked}
              : item
          )
        }))
      });
  }
}
