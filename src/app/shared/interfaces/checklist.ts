export interface Checklist {
  id: string;
  title: string;
}

export type ChecklistForm = Omit<Checklist, 'id'>
