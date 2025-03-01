import TodoApp from "@/components/todo/todo-app";
import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, Tag as TagIcon, BarChart3, Clock, CalendarClock, ListTodo } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 lg:p-12 bg-gradient-to-br from-background to-background/80">
      <div className="container mx-auto">
        {/* ヘッダーセクション */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary rounded-lg p-2 text-primary-foreground shadow-md">
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

        {/* ダッシュボードセクション */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800/30 shadow-sm hover:shadow-md transition-all duration-200">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="bg-blue-500/10 dark:bg-blue-500/20 p-3 rounded-full">
                <ListTodo className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">総タスク数</p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">8</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800/30 shadow-sm hover:shadow-md transition-all duration-200">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="bg-green-500/10 dark:bg-green-500/20 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">完了済み</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">3</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-800/30 shadow-sm hover:shadow-md transition-all duration-200">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="bg-amber-500/10 dark:bg-amber-500/20 p-3 rounded-full">
                <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">進行中</p>
                <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">2</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800/30 shadow-sm hover:shadow-md transition-all duration-200">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="bg-red-500/10 dark:bg-red-500/20 p-3 rounded-full">
                <CalendarClock className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm text-red-600 dark:text-red-400 font-medium">期限間近</p>
                <p className="text-2xl font-bold text-red-700 dark:text-red-300">2</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* クイックアクセスセクション */}
        <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-2">
          <Button variant="outline" className="bg-background/60 backdrop-blur-sm border border-border/50 rounded-full shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            今日のタスク
          </Button>
          <Button variant="outline" className="bg-background/60 backdrop-blur-sm border border-border/50 rounded-full shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            優先度が高いタスク
          </Button>
          <Button variant="outline" className="bg-background/60 backdrop-blur-sm border border-border/50 rounded-full shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-primary" />
            期限切れのタスク
          </Button>
        </div>
        
        {/* タスク表示セクション */}
        <Tabs defaultValue="all" className="mb-6">
          <TabsList className="grid grid-cols-3 md:w-[400px] mb-4 bg-background/60 backdrop-blur-sm">
            <TabsTrigger value="all" className="rounded-full">すべてのタスク</TabsTrigger>
            <TabsTrigger value="today" className="rounded-full">今日のタスク</TabsTrigger>
            <TabsTrigger value="important" className="rounded-full">重要なタスク</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-0">
            <TodoApp />
          </TabsContent>
          <TabsContent value="today" className="mt-0">
            <TodoApp />
          </TabsContent>
          <TabsContent value="important" className="mt-0">
            <TodoApp />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}