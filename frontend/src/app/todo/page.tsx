"use client"

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { KanbanBoard } from './KanbanBoard';
import { TodoItem } from './types';

export default function TodoPage() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await api.get('/todo');
        setTodos(response.data);
      } catch (error) {
        console.error('Failed to fetch todos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Todo List</h1>
      <KanbanBoard initialTodos={todos} />
    </div>
  );
}