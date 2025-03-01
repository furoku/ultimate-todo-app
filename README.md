# 究極のTodoアプリ

## 概要
Next.js、React、Tailwind CSS、Prismaを使用した高機能なTodoアプリケーションです。
モダンなUIと直感的な操作性を重視し、生産性を最大限に高めることを目指しています。

## 機能
- タスクの作成、読取、更新、削除（CRUD操作）
- タスクのカテゴリ分け
- 優先度設定（高、中、低）
- 期限設定と通知
- ドラッグ&ドロップでの並べ替え
- ステータス管理（未着手、進行中、完了）
- ダークモード対応
- レスポンシブデザイン
- フローティングアクションボタン
- カスタムタブコンポーネント

## 技術スタック
- TypeScript
- Next.js 15
- React 19
- Tailwind CSS
- shadcn/ui
- Prisma
- SQLite
- react-beautiful-dnd
- lucide-react（アイコン）
- Zod（バリデーション）

## 開発環境のセットアップ

```bash
# リポジトリのクローン
git clone https://github.com/furoku/ultimate-todo-app.git
cd ultimate-todo-app

# 依存関係のインストール
npm install --legacy-peer-deps  # React 19との互換性のため

# 環境変数の設定
cp .env.example .env
# .envファイルを編集し、必要な環境変数を設定

# データベースのセットアップ
npx prisma migrate dev

# 開発サーバーの起動
npm run dev
```

## データベース管理

```bash
# マイグレーションの作成
npx prisma migrate dev --name <migration-name>

# データベースのリセット
npx prisma migrate reset

# Prisma Studioの起動（データベース管理UI）
npx prisma studio
```

## 主要コンポーネント

### Todoアプリケーション
- `TodoApp`: メインのアプリケーションコンポーネント
- `TodoList`: タスク一覧の表示と管理
- `TodoItem`: 個別のタスク表示と操作
- `TodoEditDialog`: タスクの作成・編集フォーム

### カテゴリ管理
- `CategoryList`: カテゴリ一覧の表示
- `CategoryItem`: 個別のカテゴリ表示
- `CategoryEditDialog`: カテゴリの作成・編集フォーム

## 注意点
- SQLiteを使用しているため、enumの代わりに文字列型を使用しています
- React 19との互換性のため、一部のパッケージは`--legacy-peer-deps`オプションでインストールする必要があります
- 開発時は`.env`ファイルが必要です

## ライセンス
MIT

## 作者
furoku
