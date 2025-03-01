"use client";

import React, { useEffect, useState } from "react";
import { TodoCategory } from "@/types/todo";
import { CategoryForm } from "@/components/category/category-form";
import { CategoryList } from "@/components/category/category-list";
import { useToast } from "@/components/ui/use-toast";

export function CategoryManager() {
  const [categories, setCategories] = useState<TodoCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // カテゴリ一覧の取得
  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/categories");
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast({
        title: "エラー",
        description: "カテゴリの取得に失敗しました。",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 初回ロード時にカテゴリ一覧を取得
  useEffect(() => {
    fetchCategories();
  }, []);

  // カテゴリの追加
  const addCategory = async (category: Partial<TodoCategory>) => {
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(category),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create category");
      }

      const newCategory = await response.json();
      setCategories((prev) => [...prev, newCategory]);
      toast({
        title: "成功",
        description: "カテゴリを追加しました。",
      });
    } catch (error) {
      console.error("Error adding category:", error);
      toast({
        title: "エラー",
        description: error instanceof Error ? error.message : "カテゴリの追加に失敗しました。",
        variant: "destructive",
      });
    }
  };

  // カテゴリの更新
  const updateCategory = async (id: string, updatedCategory: Partial<TodoCategory>) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedCategory),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update category");
      }

      const updated = await response.json();
      setCategories((prev) =>
        prev.map((category) => (category.id === id ? updated : category))
      );
      toast({
        title: "成功",
        description: "カテゴリを更新しました。",
      });
    } catch (error) {
      console.error("Error updating category:", error);
      toast({
        title: "エラー",
        description: error instanceof Error ? error.message : "カテゴリの更新に失敗しました。",
        variant: "destructive",
      });
    }
  };

  // カテゴリの削除
  const deleteCategory = async (id: string) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete category");
      }

      setCategories((prev) => prev.filter((category) => category.id !== id));
      toast({
        title: "成功",
        description: "カテゴリを削除しました。",
      });
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        title: "エラー",
        description: "カテゴリの削除に失敗しました。",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <CategoryForm onSubmit={addCategory} />
      <CategoryList
        categories={categories}
        isLoading={isLoading}
        onUpdate={updateCategory}
        onDelete={deleteCategory}
      />
    </div>
  );
}