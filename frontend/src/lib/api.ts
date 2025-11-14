export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

type RequestOptions = RequestInit & { skipJsonParse?: boolean };

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { skipJsonParse, headers, ...rest } = options;

  // Get token from localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...headers,
    },
    ...rest,
  });

  if (!res.ok) {
    let message = res.statusText;
    try {
      const data = await res.json();
      message = data.message || message;
    } catch {
      // ignore json parse error
    }
    throw new Error(message);
  }

  if (skipJsonParse) {
    // @ts-expect-error – caller expects raw Response
    return res;
  }
  return res.json();
}

// ============================================
// Type Definitions
// ============================================

// Auth
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface ResetPasswordData {
  email: string;
  password: string;
  otp: string;
}

// Project
export interface Project {
  project_id: number;
  name: string;
  description: string;
  color: string;
  cover_image?: string;
  status: number;
  created_at: string;
  task_count: number;
}

export interface CreateProjectData {
  name: string;
  description?: string;
  color?: string;
  cover_image?: string;
}

// Todo
export interface Todo {
  task_id: number;
  title: string;
  description?: string;
  is_roadmap: boolean;
  priority: number;
  due_days: number;
  start_date: string;
  end_date: string;
  status: number;
  parent_id?: number;
  project_id?: number;
  roadmap_id?: number;
}

export interface CreateTodoData {
  title: string;
  description?: string;
  is_roadmap?: boolean;
  priority?: number;
  due_days?: number;
  start_date?: string;
  end_date?: string;
  status?: number;
  parent_id?: number;
  project_id?: number;
  roadmap_id?: number;
}

// Finance
export interface Finance {
  finance_id: number;
  balance: number;
  total_debt: number;
  user_id: number;
}

export interface FinanceSummary {
  balance: number;
  total_debt: number;
  total_savings: number;
  total_loans: number;
  total_income: number;
  total_expense: number;
  net_worth: number;
}

export interface UpdateFinanceData {
  balance: number;
  total_debt: number;
}

// Transaction
export interface Transaction {
  id: number;
  source: string;
  amount: number;
  type: number; // 1 = income, 2 = expense
  transaction_type: number;
  category: string;
  date: string;
  notes_id?: number;
  status: number;
}

export interface CreateTransactionData {
  source: string;
  amount: number;
  type: number;
  transaction_type?: number;
  category?: string;
  date?: string;
  notes_id?: number;
}

// Savings
export interface Savings {
  saving_id: number;
  name: string;
  amount: number;
  target_amount: number;
  rate: number;
  user_id: number;
  updated_at: string;
  status: number;
}

export interface CreateSavingsData {
  name: string;
  amount: number;
  target_amount: number;
  rate?: number;
}

// Loan
export interface Loan {
  loan_id: number;
  name: string;
  total_amount: number;
  rate: number;
  term: number;
  duration: number;
  premium_amount: number;
  user_id: number;
  status: number;
}

export interface CreateLoanData {
  name: string;
  total_amount: number;
  rate?: number;
  term?: number;
  duration?: number;
  premium_amount?: number;
}

// Roadmap
export interface Roadmap {
  roadmap_id: number;
  name: string;
  start_date: string;
  end_date: string;
  progress: number;
  status: number;
  todo_count: number;
}

export interface CreateRoadmapData {
  name: string;
  start_date?: string;
  end_date?: string;
  progress?: number;
}

// Tag
export interface Tag {
  tag_id: number;
  name: string;
}

export interface CreateTagData {
  name: string;
}

// Resource
export interface Resource {
  resource_id: number;
  type: number; // 1=Link, 2=Audio, 3=Video, 4=Notes
  misc_id: number;
  link?: string;
  todo_id: number;
}

export interface CreateResourceData {
  type: number;
  misc_id?: number;
  link?: string;
  todo_id: number;
}

// Note
export interface Note {
  note_id: number;
  text: string;
}

export interface CreateNoteData {
  text: string;
}

// Dashboard
export interface Dashboard {
  total_balance: number;
  total_debt: number;
  total_savings: number;
  total_loans: number;
  total_income: number;
  total_expense: number;
  net_worth: number;
  total_todo: number;
  total_projects: number;
  active_roadmaps: number;
}

// ============================================
// API Functions
// ============================================

export const api = {
  // ============================================
  // Authentication
  // ============================================
  login: (data: LoginData) =>
    request('/user/login', { method: 'POST', body: JSON.stringify(data) }),

  register: (data: RegisterData) =>
    request('/user/register', { method: 'POST', body: JSON.stringify(data) }),

  generateOtp: (email: string) =>
    request('/user/generate-otp', { method: 'POST', body: JSON.stringify({ email }) }),

  resetPassword: (data: ResetPasswordData) =>
    request('/user/forgot-password', { method: 'POST', body: JSON.stringify(data) }),

  // ============================================
  // Projects
  // ============================================
  projects: {
    getAll: () =>
      request<{ data: Project[] }>('/projects'),

    getById: (id: number) =>
      request<{ data: Project }>(`/projects/${id}`),

    create: (data: CreateProjectData) =>
      request<{ data: Project }>('/projects', { method: 'POST', body: JSON.stringify(data) }),

    update: (id: number, data: Partial<CreateProjectData>) =>
      request<{ data: Project }>(`/projects/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

    delete: (id: number) =>
      request(`/projects/${id}`, { method: 'DELETE' }),
  },

  // ============================================
  // Todos
  // ============================================
  todos: {
    getAll: (filters?: { project_id?: number; roadmap_id?: number }) => {
      const params = new URLSearchParams();
      if (filters?.project_id) params.append('project_id', filters.project_id.toString());
      if (filters?.roadmap_id) params.append('roadmap_id', filters.roadmap_id.toString());
      const query = params.toString() ? `?${params.toString()}` : '';
      return request<{ data: Todo[] }>(`/todo${query}`);
    },

    getById: (id: number) =>
      request<{ data: Todo }>(`/todo/${id}`),

    create: (data: CreateTodoData) =>
      request<{ data: Todo }>('/todo', { method: 'POST', body: JSON.stringify(data) }),

    update: (id: number, data: Partial<CreateTodoData>) =>
      request<{ data: Todo }>(`/todo/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

    delete: (id: number) =>
      request(`/todo/${id}`, { method: 'DELETE' }),
  },

  // ============================================
  // Finance
  // ============================================
  finance: {
    get: () =>
      request<{ data: Finance }>('/finance'),

    update: (data: UpdateFinanceData) =>
      request<{ data: Finance }>('/finance', { method: 'PUT', body: JSON.stringify(data) }),

    getSummary: () =>
      request<{ data: FinanceSummary }>('/finance/summary'),
  },

  // ============================================
  // Transactions
  // ============================================
  transactions: {
    getAll: (filters?: { type?: number; category?: string; start_date?: string; end_date?: string }) => {
      const params = new URLSearchParams();
      if (filters?.type) params.append('type', filters.type.toString());
      if (filters?.category) params.append('category', filters.category);
      if (filters?.start_date) params.append('start_date', filters.start_date);
      if (filters?.end_date) params.append('end_date', filters.end_date);
      const query = params.toString() ? `?${params.toString()}` : '';
      return request<{ data: Transaction[] }>(`/transactions${query}`);
    },

    getById: (id: number) =>
      request<{ data: Transaction }>(`/transactions/${id}`),

    create: (data: CreateTransactionData) =>
      request<{ data: Transaction }>('/transactions', { method: 'POST', body: JSON.stringify(data) }),

    update: (id: number, data: Partial<CreateTransactionData>) =>
      request<{ data: Transaction }>(`/transactions/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

    delete: (id: number) =>
      request(`/transactions/${id}`, { method: 'DELETE' }),

    getSummary: () =>
      request('/transactions/summary'),
  },

  // ============================================
  // Savings
  // ============================================
  savings: {
    getAll: () =>
      request<{ data: Savings[] }>('/savings'),

    getById: (id: number) =>
      request<{ data: Savings }>(`/savings/${id}`),

    create: (data: CreateSavingsData) =>
      request<{ data: Savings }>('/savings', { method: 'POST', body: JSON.stringify(data) }),

    update: (id: number, data: Partial<CreateSavingsData>) =>
      request<{ data: Savings }>(`/savings/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

    delete: (id: number) =>
      request(`/savings/${id}`, { method: 'DELETE' }),
  },

  // ============================================
  // Loans
  // ============================================
  loans: {
    getAll: () =>
      request<{ data: Loan[] }>('/loans'),

    getById: (id: number) =>
      request<{ data: Loan }>(`/loans/${id}`),

    create: (data: CreateLoanData) =>
      request<{ data: Loan }>('/loans', { method: 'POST', body: JSON.stringify(data) }),

    update: (id: number, data: Partial<CreateLoanData>) =>
      request<{ data: Loan }>(`/loans/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

    delete: (id: number) =>
      request(`/loans/${id}`, { method: 'DELETE' }),
  },

  // ============================================
  // Roadmaps
  // ============================================
  roadmaps: {
    getAll: () =>
      request<{ data: Roadmap[] }>('/roadmaps'),

    getById: (id: number) =>
      request<{ data: Roadmap }>(`/roadmaps/${id}`),

    create: (data: CreateRoadmapData) =>
      request<{ data: Roadmap }>('/roadmaps', { method: 'POST', body: JSON.stringify(data) }),

    update: (id: number, data: Partial<CreateRoadmapData>) =>
      request<{ data: Roadmap }>(`/roadmaps/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

    delete: (id: number) =>
      request(`/roadmaps/${id}`, { method: 'DELETE' }),
  },

  // ============================================
  // Tags
  // ============================================
  tags: {
    getAll: () =>
      request<{ data: Tag[] }>('/tags'),

    getById: (id: number) =>
      request<{ data: Tag }>(`/tags/${id}`),

    create: (data: CreateTagData) =>
      request<{ data: Tag }>('/tags', { method: 'POST', body: JSON.stringify(data) }),

    update: (id: number, data: Partial<CreateTagData>) =>
      request<{ data: Tag }>(`/tags/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

    delete: (id: number) =>
      request(`/tags/${id}`, { method: 'DELETE' }),

    // Todo-Tag assignments
    assignToTodo: (todoId: number, tagId: number) =>
      request(`/todo/${todoId}/tags`, { method: 'POST', body: JSON.stringify({ tag_id: tagId }) }),

    removeFromTodo: (todoId: number, tagId: number) =>
      request(`/todo/${todoId}/tags/${tagId}`, { method: 'DELETE' }),

    getTodoTags: (todoId: number) =>
      request<{ data: Tag[] }>(`/todo/${todoId}/tags`),
  },

  // ============================================
  // Resources
  // ============================================
  resources: {
    getById: (id: number) =>
      request<{ data: Resource }>(`/resources/${id}`),

    create: (data: CreateResourceData) =>
      request<{ data: Resource }>('/resources', { method: 'POST', body: JSON.stringify(data) }),

    update: (id: number, data: Partial<CreateResourceData>) =>
      request<{ data: Resource }>(`/resources/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

    delete: (id: number) =>
      request(`/resources/${id}`, { method: 'DELETE' }),

    getTodoResources: (todoId: number) =>
      request<{ data: Resource[] }>(`/todo/${todoId}/resources`),
  },

  // ============================================
  // Notes
  // ============================================
  notes: {
    getById: (id: number) =>
      request<{ data: Note }>(`/notes/${id}`),

    create: (data: CreateNoteData) =>
      request<{ data: Note }>('/notes', { method: 'POST', body: JSON.stringify(data) }),

    update: (id: number, data: Partial<CreateNoteData>) =>
      request<{ data: Note }>(`/notes/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

    delete: (id: number) =>
      request(`/notes/${id}`, { method: 'DELETE' }),
  },

  // ============================================
  // Dashboard
  // ============================================
  dashboard: {
    get: () =>
      request<{ data: Dashboard }>('/dashboard'),
  },
};
