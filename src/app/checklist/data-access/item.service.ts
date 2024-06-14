import {computed, effect, inject, Injectable, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Subject} from 'rxjs';
import {AddItem, EditItem, Item, RemoveItem,} from '../../shared/interfaces/item';
import {StorageService} from "../../shared/data-access/storage.service";
import {RemoveChecklist} from "../../shared/interfaces/checklist";

export interface ItemState {
  items: Item[];
  loaded: boolean;
  error: null;
}

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private storageService = inject(StorageService);

  // state
  private state = signal<ItemState>({
    items: [],
    loaded: false,
    error: null,
  });

  // selectors
  items = computed(() => this.state().items);
  loaded = computed(() => this.state().loaded);


  // sources
  private itemsLoaded$ = this.storageService.loadItems();
  add$ = new Subject<AddItem>();
  toggle$ = new Subject<RemoveItem>();
  reset$ = new Subject<RemoveChecklist>();
  remove$ = new Subject<RemoveItem>();
  edit$ = new Subject<EditItem>();
  checklistRemoved$ = new Subject<RemoveChecklist>();

  constructor() {
    //reducers
    this.itemsLoaded$
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (items) =>
          this.state.update((state) => ({
            ...state,
            items,
            loaded: true,
          })),
        error: (error) =>
          this.state.update((state) => ({
            ...state,
            error
          })),
      });

    this.add$
      .pipe(takeUntilDestroyed())
      .subscribe((addItem) =>
        this.state.update((state) => ({
          ...state,
          items: [
            ...state.items,
            {
              ...addItem.item,
              id: Date.now().toString(),
              checklistId: addItem.checklistId,
              checked: false,
            },
          ],
        }))
    );

    this.toggle$.pipe(takeUntilDestroyed()).subscribe((itemId) =>
      this.state.update((state) => ({
        ...state,
        checklistItems: state.items.map((item) =>
          item.id === itemId
            ? { ...item, checked: !item.checked }
            : item
        ),
      }))
    );

    this.reset$.pipe(takeUntilDestroyed()).subscribe((checklistId) =>
      this.state.update((state) => ({
        ...state,
        checklistItems: state.items.map((item) =>
          item.checklistId === checklistId ? { ...item, checked: false } : item
        ),
      }))
    );

    this.edit$.pipe(takeUntilDestroyed()).subscribe((update) =>
      this.state.update((state) => ({
        ...state,
        checklistItems: state.items.map((item) =>
          item.id === update.id ? { ...item, title: update.data.title } : item
        ),
      }))
    );

    this.remove$.pipe(takeUntilDestroyed()).subscribe((id) =>
      this.state.update((state) => ({
        ...state,
        checklistItems: state.items.filter((item) => item.id !== id),
      }))
    );

    this.checklistRemoved$.pipe(takeUntilDestroyed()).subscribe((checklistId) =>
      this.state.update((state) => ({
        ...state,
        checklistItems: state.items.filter(
          (item) => item.checklistId !== checklistId
        ),
      }))
    );

    // effects
    effect(() => {
      if (this.loaded()) {
        this.storageService.saveItems(this.items());
      }
    });
  }
}
