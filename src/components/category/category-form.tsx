"use client";

import React, { useState } from "react";
import { TodoCategory } from "@/types/todo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircledIcon } from "@radix-ui/react-icons";

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

interface CategoryFormProps {
  onSubmit: (category: Partial<TodoCategory>) => void;
}

export function CategoryForm({ onSubmit }: CategoryFormProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(colorPalette[5]); // デフォルトは緑色
  const [isLoading, setIsLoading] = useState(false);
  const [customColor, setCustomColor] = useState("");

  // フォーム送信処理
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const newCategory: Partial<TodoCategory> = {
      name: name.trim(),
      color: customColor || color,
    };

    onSubmit(newCategory);

    // フォームをリセット
    setName("");
    setCustomColor("");
    setIsLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>新しいカテゴリを追加</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">カテゴリ名</Label>
            <Input
              id="name"
              placeholder="カテゴリ名"
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

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading || !name.trim()}>
              <PlusCircledIcon className="mr-2 h-4 w-4" />
              {isLoading ? "追加中..." : "カテゴリを追加"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}