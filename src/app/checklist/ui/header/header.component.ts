import {Component, input, output} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Checklist } from '../../../shared/interfaces/checklist';

@Component({
  standalone: true,
  selector: 'app-header',
  template: `
    <header>
      <a routerLink="/home">Back</a>
      <h1>
        {{ checklist().title }}
      </h1>
      <div>
        <button (click)="addItem.emit()">Add item</button>
      </div>
    </header>
  `,
  imports: [RouterLink],
})
export class HeaderComponent {
  checklist = input.required<Checklist>();
  addItem = output();
}
