# 究極のTodoアプリ

## 概要
Next.js、React、Tailwind CSS、Prismaを使用した高機能なTodoアプリケーションです。

## 機能
- タスクの作成、読取、更新、削除（CRUD操作）
- タスクのカテゴリ分け
- 優先度設定
- 期限設定と通知
- ドラッグ&ドロップでの並べ替え
- ダークモード対応
- レスポンシブデザイン

## 技術スタック
- TypeScript
- Next.js 15
- React 19
- Tailwind CSS
- shadcn/ui
- Prisma
- SQLite

## 開発環境のセットアップ

```bash
# リポジトリのクローン
git clone https://github.com/furoku/ultimate-todo-app.git
cd ultimate-todo-app

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

## データベースセットアップ

```bash
# Prismaマイグレーションの実行
npx prisma migrate dev

# (オプション) Prisma Studioの起動
npx prisma studio
```
