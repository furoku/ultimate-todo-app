"use client";

import React, { useEffect, useState } from "react";
import { Todo, TodoCategory, TodoPriority, TodoStatus } from "@/types/todo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { DialogFooter } from "@/components/ui/dialog";

interface TodoFormProps {
  onSubmit: (todo: Partial<Todo>) => void;
  onCancel?: () => void;
  inDialog?: boolean;
}

export function TodoForm({ onSubmit, onCancel, inDialog = false }: TodoFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TodoStatus>(TodoStatus.TODO);
  const [priority, setPriority] = useState<TodoPriority>(TodoPriority.MEDIUM);
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<TodoCategory[]>([]);

  // カテゴリ一覧を取得
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // フォーム送信処理
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const newTodo: Partial<Todo> = {
      title,
      description: description || undefined,
      status,
      priority,
      dueDate,
      categoryId: categoryId || undefined,
    };

    onSubmit(newTodo);

    // フォームをリセット
    setTitle("");
    setDescription("");
    setStatus(TodoStatus.TODO);
    setPriority(TodoPriority.MEDIUM);
    setDueDate(undefined);
    setCategoryId(undefined);
    
    setIsLoading(false);
  };

  const formContent = (
    <>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="title" className="font-medium text-foreground/80">タイトル</Label>
          <Input
            id="title"
            placeholder="タスクのタイトル"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="rounded-lg"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description" className="font-medium text-foreground/80">説明</Label>
          <Textarea
            id="description"
            placeholder="タスクの詳細"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="rounded-lg"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="status" className="font-medium text-foreground/80">ステータス</Label>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as TodoStatus)}
            >
              <SelectTrigger id="status" className="rounded-lg">
                <SelectValue placeholder="ステータスを選択" />
              </SelectTrigger>
              <SelectContent className="rounded-lg">
                <SelectItem value={TodoStatus.TODO}>未着手</SelectItem>
                <SelectItem value={TodoStatus.IN_PROGRESS}>進行中</SelectItem>
                <SelectItem value={TodoStatus.COMPLETED}>完了</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="priority" className="font-medium text-foreground/80">優先度</Label>
            <Select
              value={priority}
              onValueChange={(value) => setPriority(value as TodoPriority)}
            >
              <SelectTrigger id="priority" className="rounded-lg">
                <SelectValue placeholder="優先度を選択" />
              </SelectTrigger>
              <SelectContent className="rounded-lg">
                <SelectItem value={TodoPriority.LOW}>低</SelectItem>
                <SelectItem value={TodoPriority.MEDIUM}>中</SelectItem>
                <SelectItem value={TodoPriority.HIGH}>高</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="dueDate" className="font-medium text-foreground/80">期限日</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="dueDate"
                  className={cn(
                    "w-full justify-start text-left font-normal rounded-lg",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "yyyy/MM/dd") : "期限日を選択"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-lg shadow-lg">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                  className="rounded-lg"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category" className="font-medium text-foreground/80">カテゴリ</Label>
            <Select
              value={categoryId || "none"}
              onValueChange={(value) => setCategoryId(value === "none" ? undefined : value)}
            >
              <SelectTrigger id="category" className="rounded-lg">
                <SelectValue placeholder="カテゴリを選択" />
              </SelectTrigger>
              <SelectContent className="rounded-lg">
                <SelectItem value="none">カテゴリなし</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: category.color }}
                      ></div>
                      {category.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </>
  );

  // ダイアログ内での表示の場合
  if (inDialog) {
    return (
      <form onSubmit={handleSubmit} className="mt-4">
        {formContent}
        <DialogFooter className="mt-6">
          {onCancel && (
            <Button variant="outline" type="button" onClick={onCancel} className="rounded-lg">
              キャンセル
            </Button>
          )}
          <Button type="submit" disabled={isLoading || !title.trim()} className="rounded-lg">
            <Plus className="mr-2 h-4 w-4" />
            {isLoading ? "追加中..." : "タスクを追加"}
          </Button>
        </DialogFooter>
      </form>
    );
  }

  // 通常の表示の場合（現在は使用していないが、将来の拡張性のために残しておく）
  return (
    <div className="border-none shadow-lg rounded-xl overflow-hidden backdrop-blur-sm bg-background/70 dark:bg-background/50 p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {formContent}
        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={isLoading || !title.trim()}
            className="rounded-full shadow-md hover:shadow-lg transition-all duration-200 bg-gradient-to-r from-primary to-purple-600 dark:from-primary dark:to-blue-600 hover:scale-105"
          >
            <Plus className="mr-2 h-4 w-4" />
            {isLoading ? "追加中..." : "タスクを追加"}
          </Button>
        </div>
      </form>
    </div>
  );
}