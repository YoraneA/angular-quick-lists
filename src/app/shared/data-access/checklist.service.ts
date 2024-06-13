import {effect, Injectable, signal} from '@angular/core';
import {Checklist, ChecklistForm} from "../interfaces/checklist";
import {Subject} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Injectable({
  providedIn: 'root'
})
export class ChecklistService {

  #state = signal<Checklist[]>([]);
  checklist = this.#state.asReadonly()

  add$ = new Subject<ChecklistForm>();

  constructor() {
    effect(() => {
      if (this.#state()) {
        console.log('signal modifiée');
      }
    });

    this.add$
      .pipe(takeUntilDestroyed())
      .subscribe((checklist) => {
        this.#state.update(checklistCollection => {
            checklistCollection.push(this.addIdToChecklist(checklist));
            return checklistCollection;
          }
        )
      })
  }

  private addIdToChecklist(checklist: ChecklistForm): Checklist {
    return {
      ...checklist,
      id: Date.now().toString()
    };
  }
}
