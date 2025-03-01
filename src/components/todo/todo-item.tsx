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
import { cn } from "@/lib/utils";

interface TodoItemProps {
  todo: Todo;
  onUpdate: (id: string, todo: Partial<Todo>) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onUpdate, onDelete }: TodoItemProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // ステータスに応じてバッジの色とアイコンを設定
  const getStatusBadge = (status: TodoStatus) => {
    switch (status) {
      case TodoStatus.TODO:
        return {
          color: "text-blue-600 dark:text-blue-400",
          bg: "bg-blue-50 dark:bg-blue-950/50",
          icon: <Clock className="h-3 w-3 mr-1" />,
          text: "未着手"
        };
      case TodoStatus.IN_PROGRESS:
        return {
          color: "text-amber-600 dark:text-amber-400",
          bg: "bg-amber-50 dark:bg-amber-950/50",
          icon: <Clock className="h-3 w-3 mr-1" />,
          text: "進行中"
        };
      case TodoStatus.COMPLETED:
        return {
          color: "text-green-600 dark:text-green-400",
          bg: "bg-green-50 dark:bg-green-950/50",
          icon: <CheckCircle className="h-3 w-3 mr-1" />,
          text: "完了"
        };
      default:
        return {
          color: "text-gray-600 dark:text-gray-400",
          bg: "bg-gray-50 dark:bg-gray-950/50",
          icon: null,
          text: ""
        };
    }
  };

  // 優先度に応じてバッジの色を設定
  const getPriorityBadge = (priority: TodoPriority) => {
    switch (priority) {
      case TodoPriority.HIGH:
        return {
          text: "高",
          bg: "bg-red-50 dark:bg-red-950/50",
          color: "text-red-600 dark:text-red-400"
        };
      case TodoPriority.MEDIUM:
        return {
          text: "中",
          bg: "bg-orange-50 dark:bg-orange-950/50",
          color: "text-orange-600 dark:text-orange-400"
        };
      case TodoPriority.LOW:
        return {
          text: "低",
          bg: "bg-slate-50 dark:bg-slate-900/50",
          color: "text-slate-600 dark:text-slate-400"
        };
      default:
        return {
          text: "",
          bg: "bg-gray-50 dark:bg-gray-900/50",
          color: "text-gray-600 dark:text-gray-400"
        };
    }
  };

  // チェックボックスの状態変更時にタスクの状態を更新
  const handleStatusChange = () => {
    const newStatus = todo.status === TodoStatus.COMPLETED
      ? TodoStatus.TODO
      : TodoStatus.COMPLETED;
    
    onUpdate(todo.id, { status: newStatus });
  };

  const statusBadge = getStatusBadge(todo.status);
  const priorityBadge = getPriorityBadge(todo.priority);

  return (
    <div className="flex items-start gap-3 p-4 hover:bg-muted/10 transition-colors">
      <Checkbox
        id={`todo-${todo.id}`}
        checked={todo.status === TodoStatus.COMPLETED}
        onCheckedChange={handleStatusChange}
        className="h-5 w-5 mt-0.5 rounded-sm border-2"
      />
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center">
          <label
            htmlFor={`todo-${todo.id}`}
            className={cn(
              "font-medium text-base cursor-pointer pr-4",
              todo.status === TodoStatus.COMPLETED ? "line-through text-muted-foreground" : ""
            )}
          >
            {todo.title}
          </label>
          <div className="flex flex-wrap gap-1.5 mt-1 sm:mt-0">
            <Badge className={cn("text-xs font-medium rounded-full px-2 py-0.5", priorityBadge.bg, priorityBadge.color)}>
              {priorityBadge.text}
            </Badge>
            <Badge className={cn("text-xs font-medium rounded-full px-2 py-0.5 flex items-center", statusBadge.bg, statusBadge.color)}>
              {statusBadge.icon} {statusBadge.text}
            </Badge>
            {todo.category && (
              <Badge 
                className="text-xs font-medium rounded-full px-2 py-0.5"
                style={{ 
                  backgroundColor: `${todo.category.color}20`,
                  color: todo.category.color
                }}
              >
                {todo.category.name}
              </Badge>
            )}
          </div>
        </div>
        
        {todo.description && (
          <p className={cn(
            "text-sm text-muted-foreground mt-1",
            todo.status === TodoStatus.COMPLETED ? "line-through" : ""
          )}>
            {todo.description}
          </p>
        )}
        
        <div className="flex items-center justify-between mt-2 text-muted-foreground text-xs">
          <div className="flex flex-wrap gap-3">
            {todo.dueDate && (
              <div className="flex items-center">
                <CalendarDays className="mr-1 h-3 w-3" />
                <span>期限: {format(new Date(todo.dueDate), "yyyy/MM/dd")}</span>
              </div>
            )}
            <div className="flex items-center">
              <Calendar className="mr-1 h-3 w-3" />
              <span>作成: {format(new Date(todo.createdAt), "yyyy/MM/dd")}</span>
            </div>
          </div>
          
          <div className="flex">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditDialogOpen(true)}
              className="h-8 w-8"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                >
                  <Trash2 className="h-4 w-4" />
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