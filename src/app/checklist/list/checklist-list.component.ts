import {Component, input} from '@angular/core';
import {Checklist} from '../../shared/interfaces/checklist';

@Component({
  selector: 'app-checklist-list',
  standalone: true,
  imports: [],
  template: `
    <h3>Your checklist</h3>
    <ul>
      @for (checklist of checklistCollection(); track checklist.id) {
      <li>{{ checklist.title }}</li>
      } @empty {
        <i>Your checklist is empty !</i>
      }
    </ul>
  `,
  styles: ``,
})
export class ChecklistListComponent {
  checklistCollection = input.required<Checklist[]>();
}
