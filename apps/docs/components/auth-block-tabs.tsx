'use client';

import {
  AuthIntegrationSelect,
  useAuthIntegration,
} from '@docs/components/auth-integration-select';
import { Callout } from '@docs/components/callout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@docs/components/ui/tabs';
import * as React from 'react';

export function AuthBlockTabs({ children }: React.PropsWithChildren) {
  const [integration] = useAuthIntegration();

  return (
    <Tabs defaultValue="cli">
      <div className="flex items-center justify-between">
        <TabsList>
          <TabsTrigger id="cli" value="cli">
            CLI
          </TabsTrigger>
          <TabsTrigger id="manual" value="manual">
            Manual
          </TabsTrigger>
        </TabsList>
        <AuthIntegrationSelect className="mt-px" />
      </div>
      {integration === 'clerk' ? (
        <Callout title="Development build recommended" type="warning">
          To ensure all Clerk Expo features work correctly, use a development build.
        </Callout>
      ) : null}
      {children}
    </Tabs>
  );
}
type AuthIntegration = 'none' | 'clerk';

type ContentProps = {
  integration: AuthIntegration;
  children: React.ReactNode;
};

export function AuthBlockTabsCliContent({ children, integration: integrationProp }: ContentProps) {
  const [integration] = useAuthIntegration();

  if (integration !== integrationProp) {
    return null;
  }
  return <TabsContent value="cli">{children}</TabsContent>;
}

export function AuthBlockTabsManualContent({
  children,
  integration: integrationProp,
}: ContentProps) {
  const [integration] = useAuthIntegration();

  if (integration !== integrationProp) {
    return null;
  }

  return <TabsContent value="manual">{children}</TabsContent>;
}
