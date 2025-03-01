"use client";

import { useState } from "react";
import { TodoCategory } from "@/types/todo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// カラーパレット - カテゴリのデフォルトカラー選択肢
const colorPalette = [
  "#ef4444", // Red
  "#f97316", // Orange
  "#f59e0b", // Amber
  "#eab308", // Yellow
  "#84cc16", // Lime
  "#22c55e", // Green
  "#10b981", // Emerald
  "#14b8a6", // Teal
  "#06b6d4", // Cyan
  "#0ea5e9", // Sky
  "#3b82f6", // Blue
  "#6366f1", // Indigo
  "#8b5cf6", // Violet
  "#a855f7", // Purple
  "#d946ef", // Fuchsia
  "#ec4899", // Pink
  "#f43f5e", // Rose
];

interface CategoryEditDialogProps {
  category: TodoCategory;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedCategory: Partial<TodoCategory>) => void;
}

export function CategoryEditDialog({
  category,
  isOpen,
  onClose,
  onUpdate,
}: CategoryEditDialogProps) {
  const [name, setName] = useState(category.name);
  const [color, setColor] = useState(category.color);
  const [isLoading, setIsLoading] = useState(false);
  const [customColor, setCustomColor] = useState("");

  const isPredefinedColor = colorPalette.includes(category.color);

  // フォーム送信処理
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const updatedCategory: Partial<TodoCategory> = {
      name: name.trim(),
      color: customColor || color,
    };

    onUpdate(updatedCategory);
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>カテゴリの編集</DialogTitle>
          <DialogDescription>
            カテゴリの詳細を編集します。完了したら保存ボタンをクリックしてください。
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">カテゴリ名</Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>カラー</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {colorPalette.map((paletteColor) => (
                  <div
                    key={paletteColor}
                    className={`w-8 h-8 rounded-full cursor-pointer ${
                      color === paletteColor && !customColor ? "ring-2 ring-primary ring-offset-2" : ""
                    }`}
                    style={{ backgroundColor: paletteColor }}
                    onClick={() => {
                      setColor(paletteColor);
                      setCustomColor("");
                    }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <Input
                  type="color"
                  value={customColor || color}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="w-12 h-12 p-1 cursor-pointer"
                />
                <span className="text-sm">
                  {customColor || color}
                </span>
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
            <Button type="submit" disabled={isLoading || !name.trim()}>
              {isLoading ? "保存中..." : "保存"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}