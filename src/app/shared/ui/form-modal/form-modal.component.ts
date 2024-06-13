import {Component, input, output} from '@angular/core';
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {KeyValuePipe} from "@angular/common";

@Component({
  selector: 'app-form-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    KeyValuePipe
  ],
  template: `
    <h2>Add to checklist</h2>
    <form
        [formGroup]="formGroup()"
        (ngSubmit)="save.emit()"
    >
      @for (input of formGroup().controls | keyvalue; track input.key) {
        <input [id]="input.key" [name]="input.key" [formControlName]="input.key"/>
      }
      <button type="submit" [disabled]="!formGroup().valid">Add</button>
    </form>
  `,
  styles: ``
})
export class FormModalComponent {
  formGroup = input.required<FormGroup>();
  save = output();
}
