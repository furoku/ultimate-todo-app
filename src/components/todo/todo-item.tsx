"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { Todo, TodoPriority, TodoStatus } from "@/types/todo";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { TodoEditDialog } from "@/components/todo/todo-edit-dialog";
import { 
  Calendar, 
  CalendarDays, 
  CheckCircle, 
  Clock, 
  Pencil, 
  Trash2 
} from "lucide-react";
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
          <Badge variant="outline" className="flex items-center gap-1 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400 rounded-full px-3 shadow-sm">
            <Clock className="h-3 w-3" /> 未着手
          </Badge>
        );
      case TodoStatus.IN_PROGRESS:
        return (
          <Badge variant="outline" className="flex items-center gap-1 bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400 rounded-full px-3 shadow-sm">
            <Clock className="h-3 w-3" /> 進行中
          </Badge>
        );
      case TodoStatus.COMPLETED:
        return (
          <Badge variant="outline" className="flex items-center gap-1 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400 rounded-full px-3 shadow-sm">
            <CheckCircle className="h-3 w-3" /> 完了
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
          <Badge variant="outline" className="bg-slate-50 text-slate-700 dark:bg-slate-900 dark:text-slate-400 rounded-full px-3 shadow-sm">
            低
          </Badge>
        );
      case TodoPriority.MEDIUM:
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-400 rounded-full px-3 shadow-sm">
            中
          </Badge>
        );
      case TodoPriority.HIGH:
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400 rounded-full px-3 shadow-sm">
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
    <div className="flex items-start gap-3 p-4 border-0 rounded-xl bg-card/60 hover:bg-card/90 hover:shadow-md transition-all duration-200 backdrop-blur-sm">
      <div className="mt-1">
        <Checkbox
          id={`todo-${todo.id}`}
          checked={todo.status === TodoStatus.COMPLETED}
          onCheckedChange={handleStatusChange}
          className="h-5 w-5 rounded-full border-2 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
        />
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <label
            htmlFor={`todo-${todo.id}`}
            className={`font-medium cursor-pointer text-lg ${
              todo.status === TodoStatus.COMPLETED
                ? "line-through text-muted-foreground"
                : ""
            }`}
          >
            {todo.title}
          </label>
          <div className="flex flex-wrap gap-1.5">
            {getPriorityBadge(todo.priority)}
            {getStatusBadge(todo.status)}
            {todo.category && (
              <Badge
                variant="outline"
                className="rounded-full px-3 shadow-sm"
                style={{ 
                  backgroundColor: `${todo.category.color}20`,
                  color: todo.category.color,
                  borderColor: `${todo.category.color}30`
                }}
              >
                {todo.category.name}
              </Badge>
            )}
          </div>
        </div>
        {todo.description && (
          <p className={`text-sm text-muted-foreground mt-2 ${
            todo.status === TodoStatus.COMPLETED ? "line-through" : ""
          }`}>
            {todo.description}
          </p>
        )}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-3 gap-2">
          <div className="flex flex-wrap items-center text-xs text-muted-foreground gap-3">
            {todo.dueDate && (
              <div className="flex items-center">
                <CalendarDays className="mr-1 h-3 w-3" />
                <span>期限: {format(new Date(todo.dueDate), "yyyy/MM/dd")}</span>
              </div>
            )}
            <span className="flex items-center">
              <Calendar className="mr-1 h-3 w-3" />
              作成: {format(new Date(todo.createdAt), "yyyy/MM/dd")}
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditDialogOpen(true)}
              className="h-8 w-8 p-0 rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-lg">
                <AlertDialogHeader>
                  <AlertDialogTitle>タスクの削除</AlertDialogTitle>
                  <AlertDialogDescription>
                    このタスクを削除してもよろしいですか？この操作は元に戻せません。
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-full">キャンセル</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(todo.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-full"
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