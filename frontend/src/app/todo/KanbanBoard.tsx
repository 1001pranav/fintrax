"use client"
import { useState } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DroppableProvided,
  DraggableProvided,
} from 'react-beautiful-dnd';
import api from '@/lib/api';
import { TodoItem } from './types';

export const KanbanBoard = ({ initialTodos }: { initialTodos: TodoItem[] }) => {
  const [columns, setColumns] = useState<{
    todo: TodoItem[];
    'in-progress': TodoItem[];
    done: TodoItem[];
  }>(() => {
    const columnState: {
      todo: TodoItem[];
      'in-progress': TodoItem[];
      done: TodoItem[];
    } = {
      todo: [],
      'in-progress': [],
      done: [],
    };
    initialTodos.forEach(todo => {
      const status = todo.status as keyof typeof columnState;
      columnState[status].push(todo);
    });
    return columnState;
  });

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceColumn = columns[source.droppableId as keyof typeof columns];
    const destColumn = columns[destination.droppableId as keyof typeof columns];

    const [reorderedItem] = sourceColumn.splice(source.index, 1);
    destColumn.splice(destination.index, 0, reorderedItem);

    setColumns({
      ...columns,
      [source.droppableId]: sourceColumn,
      [destination.droppableId]: destColumn,
      'in-progress': columns['in-progress'],
      done: columns.done,
    });

    // Update the todo status in the backend
    try {
      await api.patch(`/todo/${reorderedItem.id}`, {
        status: destination.droppableId as 'todo' | 'in-progress' | 'done',
      });
    } catch (error) {
      console.error('Failed to update todo status:', error);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-3 gap-4 p-4">
        {Object.entries(columns).map(([columnId, columnItems]) => (
          <Droppable key={columnId} droppableId={columnId}>
            {(provided: DroppableProvided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="bg-white rounded-lg p-4 shadow"
              >
                <h3 className="text-lg font-semibold mb-4">{columnId.charAt(0).toUpperCase() + columnId.slice(1)}</h3>
                <div className="space-y-2">
                  {columnItems.map((item: TodoItem, index: number) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided: DraggableProvided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <h4 className="font-medium">{item.title}</h4>
                            <p className="text-sm text-gray-500">{item.description}</p>
                          </div>
                          <button
                            onClick={async () => {
                              try {
                                await api.delete(`/todo/${item.id}`);
                                setColumns(prev => ({
                                  todo: prev.todo.filter(t => t.id !== item.id),
                                  'in-progress': prev['in-progress'].filter(t => t.id !== item.id),
                                  done: prev.done.filter(t => t.id !== item.id),
                                }));
                              } catch (error) {
                                console.error('Failed to delete todo:', error);
                              }
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};
