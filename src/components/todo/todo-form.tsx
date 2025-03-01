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
import { CalendarIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TodoFormProps {
  onSubmit: (todo: Partial<Todo>) => void;
}

export function TodoForm({ onSubmit }: TodoFormProps) {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>新しいタスクを追加</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="title">タイトル</Label>
            <Input
              id="title"
              placeholder="タスクのタイトル"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">説明</Label>
            <Textarea
              id="description"
              placeholder="タスクの詳細"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="status">ステータス</Label>
              <Select
                value={status}
                onValueChange={(value) => setStatus(value as TodoStatus)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="ステータスを選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TodoStatus.TODO}>未着手</SelectItem>
                  <SelectItem value={TodoStatus.IN_PROGRESS}>進行中</SelectItem>
                  <SelectItem value={TodoStatus.COMPLETED}>完了</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="priority">優先度</Label>
              <Select
                value={priority}
                onValueChange={(value) => setPriority(value as TodoPriority)}
              >
                <SelectTrigger id="priority">
                  <SelectValue placeholder="優先度を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TodoPriority.LOW}>低</SelectItem>
                  <SelectItem value={TodoPriority.MEDIUM}>中</SelectItem>
                  <SelectItem value={TodoPriority.HIGH}>高</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="dueDate">期限日</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="dueDate"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "yyyy/MM/dd") : "期限日を選択"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">カテゴリ</Label>
              <Select
                value={categoryId || ""}
                onValueChange={(value) => setCategoryId(value || undefined)}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="カテゴリを選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">カテゴリなし</SelectItem>
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

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading || !title.trim()}>
              <PlusCircledIcon className="mr-2 h-4 w-4" />
              {isLoading ? "追加中..." : "タスクを追加"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}