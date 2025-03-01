"use client";

import React from "react";
import { Todo } from "@/types/todo";
import { TodoItem } from "@/components/todo/todo-item";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListChecks, FileQuestion } from "lucide-react";

interface TodoListProps {
  todos: Todo[];
  isLoading: boolean;
  onUpdate: (id: string, todo: Partial<Todo>) => void;
  onDelete: (id: string) => void;
}

export function TodoList({ todos, isLoading, onUpdate, onDelete }: TodoListProps) {
  if (isLoading) {
    return (
      <div className="py-10 flex justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-card shadow-sm rounded-lg border-0">
      <div className="px-4 py-3 border-b border-border/30 flex items-center gap-2 text-green-600 dark:text-green-400">
        <ListChecks className="h-5 w-5" />
        <h2 className="text-lg font-medium">タスク一覧</h2>
      </div>

      {todos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-muted-foreground px-4">
          <FileQuestion className="h-12 w-12 mb-3 text-muted-foreground/50" />
          <p className="text-base font-medium">タスクがありません</p>
          <p className="text-sm">新しいタスクを追加してください</p>
        </div>
      ) : (
        <div className="divide-y divide-border/20">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}