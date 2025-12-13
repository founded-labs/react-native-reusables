import { RnrIcon } from '@docs/components/icons/rnr-icon';
import { SkipNavigationButton } from '@docs/components/skip-navigation-button';
import { Button } from '@docs/components/ui/button';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'React Native Reusables',
  description:
    'Bringing shadcn/ui to React Native. Beautifully crafted components with Nativewind or Uniwind, open source, and almost as easy to use.',
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <SkipNavigationButton />
      <HomeLayout
        githubUrl="https://github.com/founded-labs/react-native-reusables"
        className="dark:from-fd-background dark:to-fd-background from-fd-accent bg-gradient-to-b to-white"
        nav={{
          title: (
            <div className="hover:bg-fd-accent -ml-0.5 flex size-8 items-center justify-center rounded-md transition-colors duration-200">
              <RnrIcon className="w-6" pathClassName="stroke-[1px]" />
            </div>
          ),
        }}
        links={[
          {
            type: 'custom',
            children: (
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="hover:bg-fd-accent dark:hover:bg-fd-accent -ml-1.5 justify-start sm:ml-0 sm:justify-center">
                <Link href="/docs">Docs</Link>
              </Button>
            ),
          },
          {
            type: 'custom',
            children: (
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="hover:bg-fd-accent dark:hover:bg-fd-accent -ml-1.5 justify-start sm:ml-0 sm:justify-center">
                <Link href="/docs/blocks/authentication">Blocks</Link>
              </Button>
            ),
          },
          {
            type: 'custom',
            children: (
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="hover:bg-fd-accent dark:hover:bg-fd-accent -ml-1.5 justify-start sm:ml-0 sm:justify-center">
                <Link href="/docs/components/accordion">Components</Link>
              </Button>
            ),
          },
        ]}>
        {children}
      </HomeLayout>
    </>
  );
}
