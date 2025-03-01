"use client";

import React from "react";
import { TodoPriority, TodoStatus } from "@/types/todo";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TodoFilterProps {
  filterStatus: TodoStatus | "ALL";
  filterPriority: TodoPriority | "ALL";
  searchQuery: string;
  onStatusChange: (status: TodoStatus | "ALL") => void;
  onPriorityChange: (priority: TodoPriority | "ALL") => void;
  onSearchChange: (query: string) => void;
}

export function TodoFilter({
  filterStatus,
  filterPriority,
  searchQuery,
  onStatusChange,
  onPriorityChange,
  onSearchChange,
}: TodoFilterProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>フィルター</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="grid gap-2">
            <Label htmlFor="search">検索</Label>
            <Input
              id="search"
              placeholder="タスクを検索..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="status">ステータス</Label>
            <Select
              value={filterStatus}
              onValueChange={(value) => onStatusChange(value as TodoStatus | "ALL")}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="ステータスでフィルター" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">すべて</SelectItem>
                <SelectItem value={TodoStatus.TODO}>未着手</SelectItem>
                <SelectItem value={TodoStatus.IN_PROGRESS}>進行中</SelectItem>
                <SelectItem value={TodoStatus.COMPLETED}>完了</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="priority">優先度</Label>
            <Select
              value={filterPriority}
              onValueChange={(value) => onPriorityChange(value as TodoPriority | "ALL")}
            >
              <SelectTrigger id="priority">
                <SelectValue placeholder="優先度でフィルター" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">すべて</SelectItem>
                <SelectItem value={TodoPriority.LOW}>低</SelectItem>
                <SelectItem value={TodoPriority.MEDIUM}>中</SelectItem>
                <SelectItem value={TodoPriority.HIGH}>高</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}