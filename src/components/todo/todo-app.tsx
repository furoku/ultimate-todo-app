"use client";

import React, { useEffect, useState } from "react";
import { Todo, TodoPriority, TodoStatus } from "@/types/todo";
import { TodoList } from "@/components/todo/todo-list";
import { TodoForm } from "@/components/todo/todo-form";
import { TodoFilter } from "@/components/todo/todo-filter";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Filter as FilterIcon, 
  Plus,
  Search
} from "lucide-react";
import { cn } from "@/lib/utils";
import { addDays } from "date-fns";

export interface TodoStatistics {
  total: number;
  completed: number;
  inProgress: number;
  upcoming: number;
  high: number;
}

interface TodoAppProps {
  variant?: 'all' | 'today' | 'important';
  onStatisticsChange?: (stats: TodoStatistics) => void;
}

export default function TodoApp({ variant = 'all', onStatisticsChange }: TodoAppProps) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<TodoStatus | "ALL">("ALL");
  const [filterPriority, setFilterPriority] = useState<TodoPriority | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const { toast } = useToast();

  // タスク一覧の取得
  const fetchTodos = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/todos");
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }
      const data = await response.json();
      setTodos(data);
      
      // タスク統計を計算して親コンポーネントに通知
      calculateAndUpdateStatistics(data);
    } catch (error) {
      console.error("Error fetching todos:", error);
      toast({
        title: "エラー",
        description: "タスクの取得に失敗しました。",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // タスク統計を計算
  const calculateAndUpdateStatistics = (todos: Todo[]) => {
    if (!onStatisticsChange) return;
    
    const stats: TodoStatistics = {
      total: todos.length,
      completed: todos.filter(todo => todo.status === TodoStatus.COMPLETED).length,
      inProgress: todos.filter(todo => todo.status === TodoStatus.IN_PROGRESS).length,
      upcoming: todos.filter(todo => {
        if (!todo.dueDate) return false;
        const dueDate = new Date(todo.dueDate);
        const today = new Date();
        const threeDaysFromNow = addDays(today, 3);
        return dueDate <= threeDaysFromNow && dueDate >= today && todo.status !== TodoStatus.COMPLETED;
      }).length,
      high: todos.filter(todo => todo.priority === TodoPriority.HIGH && todo.status !== TodoStatus.COMPLETED).length,
    };
    
    onStatisticsChange(stats);
  };

  // 初回ロード時にタスク一覧を取得
  useEffect(() => {
    fetchTodos();
  }, []);

  // タスクの追加
  const addTodo = async (todo: Partial<Todo>) => {
    try {
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(todo),
      });

      if (!response.ok) {
        throw new Error("Failed to create task");
      }

      const newTodo = await response.json();
      const updatedTodos = [newTodo, ...todos];
      setTodos(updatedTodos);
      calculateAndUpdateStatistics(updatedTodos);
      
      toast({
        title: "成功",
        description: "タスクを追加しました。",
      });
      
      // フォームダイアログを閉じる
      setIsFormDialogOpen(false);
    } catch (error) {
      console.error("Error adding todo:", error);
      toast({
        title: "エラー",
        description: "タスクの追加に失敗しました。",
        variant: "destructive",
      });
    }
  };

  // タスクの更新
  const updateTodo = async (id: string, updatedTodo: Partial<Todo>) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTodo),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      const updated = await response.json();
      const updatedTodos = todos.map((todo) => (todo.id === id ? updated : todo));
      setTodos(updatedTodos);
      calculateAndUpdateStatistics(updatedTodos);
      
      toast({
        title: "成功",
        description: "タスクを更新しました。",
      });
    } catch (error) {
      console.error("Error updating todo:", error);
      toast({
        title: "エラー",
        description: "タスクの更新に失敗しました。",
        variant: "destructive",
      });
    }
  };

  // タスクの削除
  const deleteTodo = async (id: string) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      const updatedTodos = todos.filter((todo) => todo.id !== id);
      setTodos(updatedTodos);
      calculateAndUpdateStatistics(updatedTodos);
      
      toast({
        title: "成功",
        description: "タスクを削除しました。",
      });
    } catch (error) {
      console.error("Error deleting todo:", error);
      toast({
        title: "エラー",
        description: "タスクの削除に失敗しました。",
        variant: "destructive",
      });
    }
  };

  // バリアントに基づいてフィルタリング条件を設定
  useEffect(() => {
    if (variant === 'today') {
      // 今日のタスク
      setFilterStatus("ALL");
      setFilterPriority("ALL");
      setSearchQuery("");
    } else if (variant === 'important') {
      // 重要なタスク
      setFilterPriority(TodoPriority.HIGH);
      setFilterStatus("ALL");
      setSearchQuery("");
    } else {
      // すべてのタスク
      setFilterStatus("ALL");
      setFilterPriority("ALL");
    }
  }, [variant]);

  // フィルタリングされたタスク一覧
  const getFilteredTodos = () => {
    let filtered = [...todos];
    
    // バリアントに基づくフィルタリング
    if (variant === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      filtered = filtered.filter(todo => {
        if (!todo.dueDate) return false;
        const dueDate = new Date(todo.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate.getTime() === today.getTime() && todo.status !== TodoStatus.COMPLETED;
      });
    } else if (variant === 'important') {
      filtered = filtered.filter(todo => 
        todo.priority === TodoPriority.HIGH && todo.status !== TodoStatus.COMPLETED
      );
    } else {
      // 通常のフィルタリング
      if (filterStatus !== "ALL") {
        filtered = filtered.filter(todo => todo.status === filterStatus);
      }
      
      if (filterPriority !== "ALL") {
        filtered = filtered.filter(todo => todo.priority === filterPriority);
      }
      
      if (searchQuery) {
        filtered = filtered.filter(todo => 
          todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          todo.description?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
    }
    
    return filtered;
  };

  const filteredTodos = getFilteredTodos();

  return (
    <div className="relative">
      {/* 通常のバリアントの場合のみ検索バーとフィルターボタンを表示 */}
      {variant === 'all' && (
        <div className="flex items-center gap-2 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="タスクを検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 rounded-full"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsFilterDialogOpen(true)}
            className="h-10 w-10 rounded-full"
          >
            <FilterIcon className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* タスク一覧 */}
      <TodoList
        todos={filteredTodos}
        isLoading={isLoading}
        onUpdate={updateTodo}
        onDelete={deleteTodo}
      />

      {/* フローティングアクションボタン */}
      <Button
        onClick={() => setIsFormDialogOpen(true)}
        className="fixed right-6 bottom-6 h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-white p-0"
      >
        <Plus className="h-6 w-6" />
      </Button>

      {/* タスク追加ダイアログ */}
      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              新しいタスクを追加
            </DialogTitle>
          </DialogHeader>
          <TodoForm onSubmit={addTodo} onCancel={() => setIsFormDialogOpen(false)} inDialog={true} />
        </DialogContent>
      </Dialog>

      {/* フィルターダイアログ */}
      {variant === 'all' && (
        <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FilterIcon className="h-5 w-5 text-primary" />
                フィルター設定
              </DialogTitle>
            </DialogHeader>
            <TodoFilter
              filterStatus={filterStatus}
              filterPriority={filterPriority}
              searchQuery={searchQuery}
              onStatusChange={setFilterStatus}
              onPriorityChange={setFilterPriority}
              onSearchChange={setSearchQuery}
              inDialog={true}
              onReset={() => {
                setFilterStatus("ALL");
                setFilterPriority("ALL");
                setSearchQuery("");
              }}
              onClose={() => setIsFilterDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}