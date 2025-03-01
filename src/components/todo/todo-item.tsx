"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { Todo, TodoPriority, TodoStatus } from "@/types/todo";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { TodoEditDialog } from "@/components/todo/todo-edit-dialog";
import { 
  TrashIcon, 
  Pencil1Icon, 
  CalendarIcon,
  CheckCircledIcon,
  CrossCircledIcon,
  StopwatchIcon
} from "@radix-ui/react-icons";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface TodoItemProps {
  todo: Todo;
  onUpdate: (id: string, todo: Partial<Todo>) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onUpdate, onDelete }: TodoItemProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // ステータスに応じてバッジの色とテキストを設定
  const getStatusBadge = (status: TodoStatus) => {
    switch (status) {
      case TodoStatus.TODO:
        return (
          <Badge variant="outline" className="flex items-center gap-1 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400">
            <StopwatchIcon className="h-3 w-3" /> 未着手
          </Badge>
        );
      case TodoStatus.IN_PROGRESS:
        return (
          <Badge variant="outline" className="flex items-center gap-1 bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400">
            <StopwatchIcon className="h-3 w-3" /> 進行中
          </Badge>
        );
      case TodoStatus.COMPLETED:
        return (
          <Badge variant="outline" className="flex items-center gap-1 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400">
            <CheckCircledIcon className="h-3 w-3" /> 完了
          </Badge>
        );
      default:
        return null;
    }
  };

  // 優先度に応じてバッジの色とテキストを設定
  const getPriorityBadge = (priority: TodoPriority) => {
    switch (priority) {
      case TodoPriority.LOW:
        return (
          <Badge variant="outline" className="bg-slate-50 text-slate-700 dark:bg-slate-900 dark:text-slate-400">
            低
          </Badge>
        );
      case TodoPriority.MEDIUM:
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-400">
            中
          </Badge>
        );
      case TodoPriority.HIGH:
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400">
            高
          </Badge>
        );
      default:
        return null;
    }
  };

  // チェックボックスの状態変更時にタスクの状態を更新
  const handleStatusChange = () => {
    const newStatus = todo.status === TodoStatus.COMPLETED
      ? TodoStatus.TODO
      : TodoStatus.COMPLETED;
    
    onUpdate(todo.id, { status: newStatus });
  };

  return (
    <div className="flex items-start gap-2 p-4 border rounded-lg bg-card hover:shadow-sm transition-shadow">
      <Checkbox
        id={`todo-${todo.id}`}
        checked={todo.status === TodoStatus.COMPLETED}
        onCheckedChange={handleStatusChange}
      />
      <div className="flex-1 space-y-1">
        <div className="flex items-start justify-between">
          <label
            htmlFor={`todo-${todo.id}`}
            className={`font-medium cursor-pointer ${
              todo.status === TodoStatus.COMPLETED
                ? "line-through text-muted-foreground"
                : ""
            }`}
          >
            {todo.title}
          </label>
          <div className="flex gap-1">
            {getPriorityBadge(todo.priority)}
            {getStatusBadge(todo.status)}
            {todo.category && (
              <Badge
                variant="outline"
                style={{ 
                  backgroundColor: `${todo.category.color}10`,
                  color: todo.category.color,
                  borderColor: todo.category.color
                }}
              >
                {todo.category.name}
              </Badge>
            )}
          </div>
        </div>
        {todo.description && (
          <p className={`text-sm text-muted-foreground ${
            todo.status === TodoStatus.COMPLETED ? "line-through" : ""
          }`}>
            {todo.description}
          </p>
        )}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center text-xs text-muted-foreground">
            {todo.dueDate && (
              <div className="flex items-center mr-4">
                <CalendarIcon className="mr-1 h-3 w-3" />
                <span>期限: {format(new Date(todo.dueDate), "yyyy/MM/dd")}</span>
              </div>
            )}
            <span>作成: {format(new Date(todo.createdAt), "yyyy/MM/dd")}</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditDialogOpen(true)}
              className="h-8 px-2"
            >
              <Pencil1Icon className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-destructive hover:text-destructive"
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>タスクの削除</AlertDialogTitle>
                  <AlertDialogDescription>
                    このタスクを削除してもよろしいですか？この操作は元に戻せません。
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>キャンセル</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(todo.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    削除
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
      {/* 編集ダイアログ */}
      <TodoEditDialog
        todo={todo}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onUpdate={(updatedTodo) => {
          onUpdate(todo.id, updatedTodo);
          setIsEditDialogOpen(false);
        }}
      />
    </div>
  );
}