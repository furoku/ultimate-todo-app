"use client";

import React, { useState } from "react";
import { TodoCategory } from "@/types/todo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CategoryEditDialog } from "@/components/category/category-edit-dialog";
import { 
  TrashIcon, 
  Pencil1Icon,
} from "@radix-ui/react-icons";
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

interface CategoryListProps {
  categories: TodoCategory[];
  isLoading: boolean;
  onUpdate: (id: string, category: Partial<TodoCategory>) => void;
  onDelete: (id: string) => void;
}

export function CategoryList({ categories, isLoading, onUpdate, onDelete }: CategoryListProps) {
  const [editingCategory, setEditingCategory] = useState<TodoCategory | null>(null);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>カテゴリ一覧</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (categories.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>カテゴリ一覧</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-16 text-muted-foreground">
            カテゴリがありません。新しいカテゴリを追加してください。
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>カテゴリ一覧</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-4 border rounded-lg bg-card"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingCategory(category)}
                      className="h-8 px-2"
                    >
                      <Pencil1Icon className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-destructive hover:text-destructive"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>カテゴリの削除</AlertDialogTitle>
                          <AlertDialogDescription>
                            このカテゴリを削除してもよろしいですか？ このカテゴリを使用しているタスクは、
                            カテゴリなしの状態になります。この操作は元に戻せません。
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>キャンセル</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDelete(category.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            削除
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 編集ダイアログ */}
      {editingCategory && (
        <CategoryEditDialog
          category={editingCategory}
          isOpen={!!editingCategory}
          onClose={() => setEditingCategory(null)}
          onUpdate={(updatedCategory) => {
            onUpdate(editingCategory.id, updatedCategory);
            setEditingCategory(null);
          }}
        />
      )}
    </>
  );
}