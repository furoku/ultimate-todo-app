# カスタムTabsコンポーネント

このコンポーネントは、外部依存関係なしで実装された、アクセシブルなタブインターフェースを提供します。

## 特徴

- 純粋なReactで実装（@radix-ui/react-tabsなどの外部依存関係が不要）
- WAI-ARIAに準拠したアクセシビリティサポート
- shadcn/uiスタイリングと完全互換
- キーボードナビゲーションサポート
- レスポンシブデザイン対応

## 使用方法

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/custom-tabs";

export function TabsDemo() {
  const [currentTab, setCurrentTab] = useState("account");

  return (
    <Tabs value={currentTab} onValueChange={setCurrentTab}>
      <TabsList>
        <TabsTrigger value="account">アカウント</TabsTrigger>
        <TabsTrigger value="password">パスワード</TabsTrigger>
        <TabsTrigger value="settings" disabled>設定</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <p>アカウント設定の内容</p>
      </TabsContent>
      <TabsContent value="password">
        <p>パスワード設定の内容</p>
      </TabsContent>
      <TabsContent value="settings">
        <p>一般設定の内容</p>
      </TabsContent>
    </Tabs>
  );
}
```

## コンポーネントAPI

### Tabs

タブコンポーネントのメインコンテナです。

| プロパティ      | 型                      | 説明                             |
| -------------- | ----------------------- | -------------------------------- |
| value          | string                  | 現在選択されているタブの値         |
| onValueChange  | (value: string) => void | タブが選択されたときに呼び出される関数 |
| className      | string (オプション)     | 追加のCSSクラス                   |
| children       | React.ReactNode         | タブコンポーネントの子要素         |

### TabsList

タブのトリガーを表示するコンテナです。

| プロパティ      | 型                  | 説明                             |
| -------------- | ------------------- | -------------------------------- |
| className      | string (オプション) | 追加のCSSクラス                   |
| children       | React.ReactNode     | TabsTriggerコンポーネント         |

### TabsTrigger

クリックするとタブパネルを切り替えるボタンです。

| プロパティ      | 型                  | 説明                             |
| -------------- | ------------------- | -------------------------------- |
| value          | string              | このトリガーに関連付けられたタブの値 |
| className      | string (オプション) | 追加のCSSクラス                   |
| children       | React.ReactNode     | ボタンのコンテンツ                |
| disabled       | boolean (オプション) | トリガーを無効にする              |

### TabsContent

選択されたタブに表示されるコンテンツです。

| プロパティ      | 型                   | 説明                               |
| -------------- | -------------------- | ---------------------------------- |
| value          | string               | このコンテンツに関連付けられたタブの値 |
| className      | string (オプション)  | 追加のCSSクラス                     |
| children       | React.ReactNode      | タブパネルのコンテンツ               |
| forceMount     | boolean (オプション) | 選択されていなくてもマウントするか     |

## アクセシビリティ

このコンポーネントは[WAI-ARIA Tabs Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabpanel/)に準拠しています。

- 適切なWAI-ARIAロールとアトリビュート
- キーボードサポート
- スクリーンリーダーサポート
- フォーカス管理

## カスタマイズ

tailwindのcn関数を使用してスタイルをカスタマイズできます：

```tsx
<Tabs className="w-full">
  <TabsList className="grid grid-cols-2">
    <TabsTrigger 
      value="tab1" 
      className="data-[state=active]:bg-blue-500"
    >
      タブ1
    </TabsTrigger>
    <TabsTrigger value="tab2">タブ2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1" className="p-4 border rounded-md mt-4">
    タブ1のコンテンツ
  </TabsContent>
</Tabs>
```
