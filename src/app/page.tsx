import TodoApp from "@/components/todo/todo-app";
import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, Tag as TagIcon } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 lg:p-12 bg-gradient-to-br from-background to-background/80">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary rounded-lg p-2 text-primary-foreground">
              <CheckCircle className="h-6 w-6" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600 dark:from-primary dark:to-blue-400">究極のTodoアプリ</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/categories">
              <Button variant="outline" size="sm" className="rounded-full shadow-sm hover:shadow-md transition-all duration-200">
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