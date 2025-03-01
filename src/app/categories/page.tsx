"use client";

import React from "react";
import { CategoryManager } from "@/components/category/category-manager";
import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft as ArrowLeftIcon } from "lucide-react";

export default function CategoriesPage() {
  return (
    <main className="min-h-screen p-4 md:p-8 lg:p-12">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                戻る
              </Button>
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold">カテゴリ管理</h1>
          </div>
          <ModeToggle />
        </div>
        <CategoryManager />
      </div>
    </main>
  );
}