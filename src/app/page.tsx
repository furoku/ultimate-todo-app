import TodoApp from "@/components/todo/todo-app";
import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tag as TagIcon } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 lg:p-12">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">究極のTodoアプリ</h1>
          <div className="flex items-center gap-4">
            <Link href="/categories">
              <Button variant="outline" size="sm">
                <TagIcon className="mr-2 h-4 w-4" />
                カテゴリ管理
              </Button>
            </Link>
            <ModeToggle />
          </div>
        </div>
        <TodoApp />
      </div>
    </main>
  );
}