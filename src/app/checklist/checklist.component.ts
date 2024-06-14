import {Component, computed, effect, inject, signal} from '@angular/core';
import {ChecklistService} from '../shared/data-access/checklist.service';
import {ActivatedRoute} from '@angular/router';
import {toSignal} from '@angular/core/rxjs-interop';
import {ChecklistHeaderComponent} from './ui/checklist-header/checklist-header.component';
import {ChecklistItemService} from "./data-access/checklist-item.service";
import {FormBuilder} from "@angular/forms";
import {ChecklistItem} from "../shared/interfaces/checklist-item";
import {ModalComponent} from "../shared/ui/modal/modal.component";
import {FormModalComponent} from "../shared/ui/form-modal/form-modal.component";
import {ChecklistListComponent} from "../home/ui/checklist-list/checklist-list.component";
import {ChecklistItemListComponent} from "./ui/item/checklist-item-list.component";

@Component({
  selector: 'app-checklist',
  standalone: true,
  imports: [ChecklistHeaderComponent, ModalComponent, FormModalComponent, ChecklistListComponent, ChecklistItemListComponent],
  template: `
    @if (checklist(); as checklist){
    <app-checklist-header [checklist]="checklist" (addItem)="checklistItemBeingEdited.set({})"/>
      <section>
        <h2>Your Items</h2>
        <app-checklist-item-list [checklistItems]="checklistItem()" />
      </section>
      <app-modal [isOpen]="!!checklistItemBeingEdited()">
        <ng-template>
          <app-form-modal
            title="Create item"
            [formGroup]="checklistItemForm"
            (save)="checklistItemService.add$.next({
              item: checklistItemForm.getRawValue(),
              checklistId: checklist?.id!,
            })"
            (close)="checklistItemBeingEdited.set(null)"
          ></app-form-modal>
        </ng-template>
      </app-modal>
    }
  `,
  styles: ``,
})
export default class ChecklistComponent {
  checklistService = inject(ChecklistService);
  checklistItemService = inject(ChecklistItemService);
  route = inject(ActivatedRoute);
  formBuilder = inject(FormBuilder);

  checklistItemBeingEdited = signal<Partial<ChecklistItem> | null>(null);

  params = toSignal(this.route.paramMap);

  checklist = computed(() =>
    this.checklistService
      .checklists()
      .find((checklist) => checklist.id === this.params()?.get('id'))
  );

  checklistItem = computed(() =>
    this.checklistItemService
      .checklistItems()
      .filter(checklistItem => checklistItem.checklistId === this.params()?.get('id'))
  )

  checklistItemForm = this.formBuilder.nonNullable.group({
    title: [''],
  });

  constructor() {
    effect(() => {
      const checklistItem = this.checklistItemBeingEdited();

      if (!checklistItem) {
        this.checklistItemForm.reset();
      }
    });
  }
}
