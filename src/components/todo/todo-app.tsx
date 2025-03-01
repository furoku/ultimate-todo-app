"use client";

import React, { useEffect, useState } from "react";
import { Todo, TodoPriority, TodoStatus } from "@/types/todo";
import { TodoList } from "@/components/todo/todo-list";
import { TodoForm } from "@/components/todo/todo-form";
import { TodoFilter } from "@/components/todo/todo-filter";
import { useToast } from "@/components/ui/use-toast";

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<TodoStatus | "ALL">("ALL");
  const [filterPriority, setFilterPriority] = useState<TodoPriority | "ALL">(
    "ALL"
  );
  const [searchQuery, setSearchQuery] = useState("");
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
      setTodos((prev) => [newTodo, ...prev]);
      toast({
        title: "成功",
        description: "タスクを追加しました。",
      });
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
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? updated : todo))
      );
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

      setTodos((prev) => prev.filter((todo) => todo.id !== id));
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

  // フィルタリングされたタスク一覧
  const filteredTodos = todos.filter((todo) => {
    // ステータスでフィルタリング
    if (filterStatus !== "ALL" && todo.status !== filterStatus) {
      return false;
    }

    // 優先度でフィルタリング
    if (filterPriority !== "ALL" && todo.priority !== filterPriority) {
      return false;
    }

    // 検索キーワードでフィルタリング
    if (
      searchQuery &&
      !todo.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !todo.description?.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      <TodoForm onSubmit={addTodo} />
      <TodoFilter
        filterStatus={filterStatus}
        filterPriority={filterPriority}
        searchQuery={searchQuery}
        onStatusChange={setFilterStatus}
        onPriorityChange={setFilterPriority}
        onSearchChange={setSearchQuery}
      />
      <TodoList
        todos={filteredTodos}
        isLoading={isLoading}
        onUpdate={updateTodo}
        onDelete={deleteTodo}
      />
    </div>
  );
}