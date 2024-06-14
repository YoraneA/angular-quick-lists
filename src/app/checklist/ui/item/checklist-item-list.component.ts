import {Component, input, signal} from '@angular/core';
import {RouterLink} from "@angular/router";
import {ChecklistItem} from "../../../shared/interfaces/checklist-item";

@Component({
  selector: 'app-checklist-item-list',
  standalone: true,
  imports: [
    RouterLink
  ],
  template: `
    <ul>
    @for (item of checklistItems(); track item.id) {
      <li>
        {{ item.title }}
      </li>
    } @empty {
      <p>Add so tasks to your checklist !</p>
    }
    </ul>
  `,
  styles: ``
})
export class ChecklistItemListComponent {
  checklistItems = input.required<ChecklistItem[]>();
}
