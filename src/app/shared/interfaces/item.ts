import { RemoveChecklist } from './checklist';

export interface Item {
  id: string;
  checklistId: string;
  title: string;
  checked: boolean;
}

export type AddItem = {
  item: Omit<Item, 'id' | 'checklistId' | 'checked'>;
  checklistId: RemoveChecklist;
};
export type EditItem = {
  id: Item['id'];
  data: AddItem['item'];
};
export type RemoveItem = Item['id'];
