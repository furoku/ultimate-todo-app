/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../custom-tabs';

describe('Tabs コンポーネント', () => {
  const setup = () => {
    const handleValueChange = jest.fn();
    const result = render(
      <Tabs value="tab1" onValueChange={handleValueChange}>
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          <TabsTrigger value="tab3" disabled>Tab 3</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
        <TabsContent value="tab3">Content 3</TabsContent>
      </Tabs>
    );

    return {
      ...result,
      handleValueChange,
      tab1Trigger: screen.getByRole('tab', { name: 'Tab 1' }),
      tab2Trigger: screen.getByRole('tab', { name: 'Tab 2' }),
      tab3Trigger: screen.getByRole('tab', { name: 'Tab 3' }),
    };
  };

  it('アクティブなタブのコンテンツのみ表示すること', () => {
    setup();

    // タブ1のコンテンツは表示されているはず
    expect(screen.getByText('Content 1')).toBeInTheDocument();
    
    // タブ2とタブ3のコンテンツは表示されていないはず
    expect(screen.queryByText('Content 2')).toBeNull();
    expect(screen.queryByText('Content 3')).toBeNull();
  });

  it('タブをクリックすると onValueChange が呼ばれること', () => {
    const { tab2Trigger, handleValueChange } = setup();

    fireEvent.click(tab2Trigger);
    
    expect(handleValueChange).toHaveBeenCalledWith('tab2');
  });

  it('disabled のタブをクリックしても onValueChange が呼ばれないこと', () => {
    const { tab3Trigger, handleValueChange } = setup();

    fireEvent.click(tab3Trigger);
    
    expect(handleValueChange).not.toHaveBeenCalled();
  });

  it('適切なWAI-ARIA属性が設定されていること', () => {
    const { tab1Trigger, tab2Trigger } = setup();
    
    // tablistロールを持つ要素があること
    const tablist = screen.getByRole('tablist');
    expect(tablist).toBeInTheDocument();
    expect(tablist).toHaveAttribute('aria-orientation', 'horizontal');
    
    // 選択されているタブに正しい属性が設定されていること
    expect(tab1Trigger).toHaveAttribute('aria-selected', 'true');
    expect(tab1Trigger).toHaveAttribute('tabindex', '0');
    const panelId = tab1Trigger.getAttribute('aria-controls');
    expect(panelId).toBeTruthy();
    
    // 選択されていないタブに正しい属性が設定されていること
    expect(tab2Trigger).toHaveAttribute('aria-selected', 'false');
    expect(tab2Trigger).toHaveAttribute('tabindex', '-1');
    
    // パネルに正しい属性が設定されていること
    const panel = screen.getByRole('tabpanel');
    expect(panel).toHaveAttribute('id', panelId);
    expect(panel).toHaveAttribute('aria-labelledby', tab1Trigger.id);
  });
});
