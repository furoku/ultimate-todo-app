"use client";

import React, { createContext, useContext, useState, useId } from "react";
import { cn } from "@/lib/utils";

type TabsContextValue = {
  value: string;
  onValueChange: (value: string) => void;
  baseId: string;
};

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

function useTabs() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs components must be used within a TabsProvider");
  }
  return context;
}

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}

export function Tabs({ value, onValueChange, className, children }: TabsProps) {
  const baseId = useId();
  
  return (
    <TabsContext.Provider value={{ value, onValueChange, baseId }}>
      <div 
        className={cn("space-y-2", className)}
        role="tablist"
        aria-orientation="horizontal"
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
}

interface TabsListProps {
  className?: string;
  children: React.ReactNode;
}

export function TabsList({ className, children }: TabsListProps) {
  return (
    <div
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
        className
      )}
    >
      {children}
    </div>
  );
}

interface TabsTriggerProps {
  value: string;
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
}

export function TabsTrigger({ value, className, children, disabled = false }: TabsTriggerProps) {
  const { value: selectedValue, onValueChange, baseId } = useTabs();
  const isSelected = selectedValue === value;
  const tabId = `${baseId}-tab-${value}`;
  const panelId = `${baseId}-panel-${value}`;

  return (
    <button
      type="button"
      role="tab"
      id={tabId}
      aria-selected={isSelected}
      aria-controls={panelId}
      tabIndex={isSelected ? 0 : -1}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isSelected && "bg-background text-foreground shadow-sm",
        className
      )}
      onClick={() => !disabled && onValueChange(value)}
    >
      {children}
    </button>
  );
}

interface TabsContentProps {
  value: string;
  className?: string;
  children: React.ReactNode;
  forceMount?: boolean;
}

export function TabsContent({ value, className, children, forceMount = false }: TabsContentProps) {
  const { value: selectedValue, baseId } = useTabs();
  const isSelected = selectedValue === value;
  const tabId = `${baseId}-tab-${value}`;
  const panelId = `${baseId}-panel-${value}`;

  if (!isSelected && !forceMount) return null;

  return (
    <div
      role="tabpanel"
      id={panelId}
      aria-labelledby={tabId}
      hidden={!isSelected}
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      tabIndex={0}
    >
      {children}
    </div>
  );
}

// READMEを追加
/**
 * Tabs コンポーネント
 * 
 * Radix UIに依存しない純粋なReactで実装されたアクセシブルなタブコンポーネント
 * 
 * 使用例:
 * ```tsx
 * <Tabs value={tab} onValueChange={setTab}>
 *   <TabsList>
 *     <TabsTrigger value="account">アカウント</TabsTrigger>
 *     <TabsTrigger value="password">パスワード</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="account">アカウント設定...</TabsContent>
 *   <TabsContent value="password">パスワード設定...</TabsContent>
 * </Tabs>
 * ```
 */