import TodoApp from "@/components/todo/todo-app";
import { ModeToggle } from "@/components/mode-toggle";

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 lg:p-12">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">究極のTodoアプリ</h1>
          <ModeToggle />
        </div>
        <TodoApp />
      </div>
    </main>
  );
}