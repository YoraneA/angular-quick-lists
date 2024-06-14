import {Component, computed, effect, inject, signal} from '@angular/core';
import {ChecklistService} from '../shared/data-access/checklist.service';
import {ActivatedRoute} from '@angular/router';
import {toSignal} from '@angular/core/rxjs-interop';
import {HeaderComponent} from './ui/header/header.component';
import {ItemService} from "./data-access/item.service";
import {FormBuilder} from "@angular/forms";
import {Item} from "../shared/interfaces/item";
import {ModalComponent} from "../shared/ui/modal/modal.component";
import {FormModalComponent} from "../shared/ui/form-modal/form-modal.component";
import {ChecklistListComponent} from "../home/ui/checklist-list/checklist-list.component";
import {ItemListComponent} from "./ui/item/item-list.component";

@Component({
  selector: 'app-checklist',
  standalone: true,
  imports: [HeaderComponent, ModalComponent, FormModalComponent, ChecklistListComponent, ItemListComponent],
  template: `
    @if (checklist(); as checklist) {
      <app-header [checklist]="checklist" (addItem)="itemBeingEdited.set({})"/>
      <section>
        <h2>Your Items</h2>
        <button (click)="itemService.reset$.next(checklist.id)">Reset</button>
        <app-item-list
          [items]="items()"
          (toggleDone)="itemService.toggle$.next($event)"
        />
      </section>
      <app-modal [isOpen]="!!itemBeingEdited()">
        <ng-template>
          <app-form-modal
            title="Create item"
            [formGroup]="checklistItemForm"
            (save)="itemService.add$.next({
              item: checklistItemForm.getRawValue(),
              checklistId: checklist?.id!,
            })"
            (close)="itemBeingEdited.set(null)"
          ></app-form-modal>
        </ng-template>
      </app-modal>
    }
  `,
  styles: ``,
})
export default class ChecklistComponent {
  checklistService = inject(ChecklistService);
  itemService = inject(ItemService);
  route = inject(ActivatedRoute);
  formBuilder = inject(FormBuilder);

  itemBeingEdited = signal<Partial<Item> | null>(null);

  params = toSignal(this.route.paramMap);

  checklist = computed(() =>
    this.checklistService
      .checklists()
      .find((checklist) => checklist.id === this.params()?.get('id'))
  );

  items = computed(() =>
    this.itemService
      .items()
      .filter(item => item.checklistId === this.params()?.get('id'))
  )

  checklistItemForm = this.formBuilder.nonNullable.group({
    title: [''],
  });

  constructor() {
    effect(() => {
      const item = this.itemBeingEdited();

      if (!item) {
        this.checklistItemForm.reset();
      }
    });
  }
}
