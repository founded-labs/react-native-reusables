'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@docs/components/ui/tabs';
import * as React from 'react';
import { useStylingLibrary } from './use-styling-library';

export function StylingLibraryTabs({ children }: React.PropsWithChildren) {
  const [stylingLibrary, onStylingLibraryChange] = useStylingLibrary();
  return (
    <Tabs value={stylingLibrary} onValueChange={onStylingLibraryChange}>
      <div className="flex items-center justify-between">
        <TabsList>
          <TabsTrigger id="nativewind" value="nativewind">
            Nativewind
          </TabsTrigger>
          <TabsTrigger id="uniwind" value="uniwind">
            Uniwind
          </TabsTrigger>
        </TabsList>
      </div>
      {children}
    </Tabs>
  );
}

export function StylingLibraryTabsNativewindContent({ children }: React.PropsWithChildren) {
  const [stylingLibrary] = useStylingLibrary();

  if (stylingLibrary !== 'nativewind') {
    return null;
  }
  return <TabsContent value="nativewind">{children}</TabsContent>;
}

export function StylingLibraryTabsUnwindContent({ children }: React.PropsWithChildren) {
  const [stylingLibrary] = useStylingLibrary();

  if (stylingLibrary !== 'uniwind') {
    return null;
  }

  return <TabsContent value="uniwind">{children}</TabsContent>;
}
