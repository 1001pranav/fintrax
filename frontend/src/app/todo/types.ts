export interface TodoItem {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  createdAt: string;
}

export interface Column {
  id: string;
  title: string;
  items: TodoItem[];
}

export interface ColumnState {
  todo: TodoItem[];
  'in-progress': TodoItem[];
  done: TodoItem[];
}
