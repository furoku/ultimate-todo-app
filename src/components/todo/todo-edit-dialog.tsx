"use client";

import { useEffect, useState } from "react";
import { Todo, TodoPriority, TodoStatus, TodoCategory } from "@/types/todo";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

interface TodoEditDialogProps {
  todo: Todo;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedTodo: Partial<Todo>) => void;
}

export function TodoEditDialog({
  todo,
  isOpen,
  onClose,
  onUpdate,
}: TodoEditDialogProps) {
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description || "");
  const [status, setStatus] = useState<TodoStatus>(todo.status);
  const [priority, setPriority] = useState<TodoPriority>(todo.priority);
  const [dueDate, setDueDate] = useState<Date | undefined>(
    todo.dueDate ? new Date(todo.dueDate) : undefined
  );
  const [categories, setCategories] = useState<TodoCategory[]>([]);
  const [categoryId, setCategoryId] = useState<string | undefined>(todo.categoryId);
  const [isLoading, setIsLoading] = useState(false);

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

    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  // フォーム送信時の処理
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const updatedTodo: Partial<Todo> = {
      title,
      description: description || null,
      status,
      priority,
      dueDate,
      categoryId: categoryId || null,
    };

    // 完了状態に変更された場合は完了日時を設定
    if (status === TodoStatus.COMPLETED && todo.status !== TodoStatus.COMPLETED) {
      updatedTodo.completedAt = new Date();
    } else if (status !== TodoStatus.COMPLETED) {
      updatedTodo.completedAt = null;
    }

    onUpdate(updatedTodo);
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>タスクの編集</DialogTitle>
          <DialogDescription>
            タスクの詳細を編集します。完了したら保存ボタンをクリックしてください。
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">タイトル</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">説明</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
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
            </div>
            <div className="grid grid-cols-2 gap-4">
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
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              キャンセル
            </Button>
            <Button type="submit" disabled={isLoading || !title.trim()}>
              {isLoading ? "保存中..." : "保存"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}