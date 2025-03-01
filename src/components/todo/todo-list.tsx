"use client";

import React from "react";
import { Todo } from "@/types/todo";
import { TodoItem } from "@/components/todo/todo-item";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TodoListProps {
  todos: Todo[];
  isLoading: boolean;
  onUpdate: (id: string, todo: Partial<Todo>) => void;
  onDelete: (id: string) => void;
}

export function TodoList({ todos, isLoading, onUpdate, onDelete }: TodoListProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>タスク一覧</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (todos.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>タスク一覧</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-16 text-muted-foreground">
            タスクがありません。新しいタスクを追加してください。
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>タスク一覧</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}