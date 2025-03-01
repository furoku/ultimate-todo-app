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
import { Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogFooter } from "@/components/ui/dialog";

interface TodoFilterProps {
  filterStatus: TodoStatus | "ALL";
  filterPriority: TodoPriority | "ALL";
  searchQuery: string;
  onStatusChange: (status: TodoStatus | "ALL") => void;
  onPriorityChange: (priority: TodoPriority | "ALL") => void;
  onSearchChange: (query: string) => void;
  inDialog?: boolean;
  onReset?: () => void;
  onClose?: () => void;
}

export function TodoFilter({
  filterStatus,
  filterPriority,
  searchQuery,
  onStatusChange,
  onPriorityChange,
  onSearchChange,
  inDialog = false,
  onReset,
  onClose,
}: TodoFilterProps) {
  const filterContent = (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="filter-status" className="font-medium text-foreground/80">ステータス</Label>
        <Select
          value={filterStatus}
          onValueChange={(value) => onStatusChange(value as TodoStatus | "ALL")}
        >
          <SelectTrigger id="filter-status" className="rounded-lg">
            <SelectValue placeholder="ステータスでフィルター" />
          </SelectTrigger>
          <SelectContent className="rounded-lg">
            <SelectItem value="ALL">すべて</SelectItem>
            <SelectItem value={TodoStatus.TODO}>未着手</SelectItem>
            <SelectItem value={TodoStatus.IN_PROGRESS}>進行中</SelectItem>
            <SelectItem value={TodoStatus.COMPLETED}>完了</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="filter-priority" className="font-medium text-foreground/80">優先度</Label>
        <Select
          value={filterPriority}
          onValueChange={(value) => onPriorityChange(value as TodoPriority | "ALL")}
        >
          <SelectTrigger id="filter-priority" className="rounded-lg">
            <SelectValue placeholder="優先度でフィルター" />
          </SelectTrigger>
          <SelectContent className="rounded-lg">
            <SelectItem value="ALL">すべて</SelectItem>
            <SelectItem value={TodoPriority.LOW}>低</SelectItem>
            <SelectItem value={TodoPriority.MEDIUM}>中</SelectItem>
            <SelectItem value={TodoPriority.HIGH}>高</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {inDialog && (
        <div className="grid gap-2">
          <Label htmlFor="dialog-search" className="font-medium text-foreground/80">検索キーワード</Label>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="dialog-search"
              placeholder="タスクを検索..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 rounded-lg"
            />
          </div>
        </div>
      )}
      
      {inDialog && (
        <div className="flex items-center space-x-2 mt-2">
          <Checkbox 
            id="show-completed" 
            defaultChecked={true}
          />
          <Label 
            htmlFor="show-completed" 
            className="text-sm font-medium leading-none cursor-pointer"
          >
            完了したタスクを表示
          </Label>
        </div>
      )}
    </div>
  );

  // ダイアログ内での表示の場合
  if (inDialog) {
    return (
      <>
        {filterContent}
        <DialogFooter className="mt-6">
          {onReset && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onReset}
              className="rounded-lg"
            >
              リセット
            </Button>
          )}
          {onClose && (
            <Button 
              type="button"
              onClick={onClose}
              className="rounded-lg"
            >
              適用
            </Button>
          )}
        </DialogFooter>
      </>
    );
  }

  // 通常の表示の場合（現在は使用していないが、将来の拡張性のために残しておく）
  return (
    <Card className="border-none shadow-lg rounded-xl overflow-hidden backdrop-blur-sm bg-background/70 dark:bg-background/50">
      <CardHeader className="bg-gradient-to-r from-blue-500/10 to-teal-500/10 dark:from-blue-500/20 dark:to-teal-500/20 border-b border-blue-500/10">
        <CardTitle className="flex items-center gap-2 text-blue-500 dark:text-blue-400">
          <Filter className="h-5 w-5" />
          フィルター
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="grid gap-2">
            <Label htmlFor="search" className="font-medium text-foreground/80">検索</Label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="タスクを検索..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 rounded-lg"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="status" className="font-medium text-foreground/80">ステータス</Label>
            <Select
              value={filterStatus}
              onValueChange={(value) => onStatusChange(value as TodoStatus | "ALL")}
            >
              <SelectTrigger id="status" className="rounded-lg">
                <SelectValue placeholder="ステータスでフィルター" />
              </SelectTrigger>
              <SelectContent className="rounded-lg">
                <SelectItem value="ALL">すべて</SelectItem>
                <SelectItem value={TodoStatus.TODO}>未着手</SelectItem>
                <SelectItem value={TodoStatus.IN_PROGRESS}>進行中</SelectItem>
                <SelectItem value={TodoStatus.COMPLETED}>完了</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="priority" className="font-medium text-foreground/80">優先度</Label>
            <Select
              value={filterPriority}
              onValueChange={(value) => onPriorityChange(value as TodoPriority | "ALL")}
            >
              <SelectTrigger id="priority" className="rounded-lg">
                <SelectValue placeholder="優先度でフィルター" />
              </SelectTrigger>
              <SelectContent className="rounded-lg">
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