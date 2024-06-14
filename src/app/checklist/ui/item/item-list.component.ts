import {Component, input, output, signal} from '@angular/core';
import {RouterLink} from "@angular/router";
import {Item, RemoveItem} from "../../../shared/interfaces/item";

@Component({
  selector: 'app-checklist-item-list',
  standalone: true,
  imports: [
    RouterLink
  ],
  template: `
    <ul>
      @for (item of items(); track item.id) {
        <li>
          <div>
            @if (item.checked) {
              <span>✅</span>
            }
            {{ item.title }}
          </div>
          <div>
            <button (click)="toggleDone.emit(item.id)">Toggle</button>
          </div>
        </li>
      } @empty {
        <div>
          <h2>Add an item</h2>
          <p>Click the add button to add your first item to this quicklist</p>
        </div>
      }
    </ul>
  `,
  styles: ``
})
export class ItemListComponent {
  items = input.required<Item[]>();
  toggleDone = output<RemoveItem>();
}
