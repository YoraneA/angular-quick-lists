import {Component, inject, signal} from '@angular/core';
import {ChecklistListComponent} from '../checklist/list/checklist-list.component';
import {Checklist} from '../shared/interfaces/checklist';
import {FormBuilder, Validators} from "@angular/forms";
import {FormModalComponent} from "../shared/ui/form-modal/form-modal.component";
import {ChecklistService} from "../shared/data-access/checklist.service";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ChecklistListComponent, FormModalComponent],
  template: `
    <h2>Quicklist</h2>
    <app-checklist-list [checklistCollection]="checklistService.checklist()"></app-checklist-list>
    <app-form-modal [formGroup]="formGroup" (save)="onSave()"></app-form-modal>
  `,
  styles: ``
})
export default class HomeComponent {
  checklistService = inject(ChecklistService);
  formBuilder = inject(FormBuilder);
  formGroup = this.formBuilder.nonNullable.group({
    title: ['', Validators.required],
  });

  onSave() {
    this.checklistService.add$.next(this.formGroup.getRawValue());
    this.formGroup.reset();
  }
}
