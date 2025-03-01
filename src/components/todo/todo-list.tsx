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
      <Card className="border-none shadow-lg rounded-xl overflow-hidden backdrop-blur-sm bg-background/70 dark:bg-background/50">
        <CardHeader className="bg-gradient-to-r from-green-500/10 to-amber-500/10 dark:from-green-500/20 dark:to-amber-500/20 border-b border-green-500/10">
          <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <ListChecks className="h-5 w-5" />
            タスク一覧
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent shadow-md"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (todos.length === 0) {
    return (
      <Card className="border-none shadow-lg rounded-xl overflow-hidden backdrop-blur-sm bg-background/70 dark:bg-background/50">
        <CardHeader className="bg-gradient-to-r from-green-500/10 to-amber-500/10 dark:from-green-500/20 dark:to-amber-500/20 border-b border-green-500/10">
          <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <ListChecks className="h-5 w-5" />
            タスク一覧
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <FileQuestion className="h-16 w-16 mb-4 text-muted-foreground/50" />
            <p className="text-lg font-medium">タスクがありません</p>
            <p className="text-sm">新しいタスクを追加してください。</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-lg rounded-xl overflow-hidden backdrop-blur-sm bg-background/70 dark:bg-background/50">
      <CardHeader className="bg-gradient-to-r from-green-500/10 to-amber-500/10 dark:from-green-500/20 dark:to-amber-500/20 border-b border-green-500/10">
        <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
          <ListChecks className="h-5 w-5" />
          タスク一覧
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
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