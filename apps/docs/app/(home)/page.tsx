import { Badge } from '@docs/components/ui/badge';
import { Button } from '@docs/components/ui/button';
import { ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';
import { Footer } from '../docs/[[...slug]]/page';
import ComponentsGrid from './ComponentsGrid';

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col">
      <main
        id="nd-page"
        className="max-w-fd-container mx-auto flex w-full flex-1 flex-col items-center gap-4 pt-4 md:pt-0">
        <div className="container relative z-0 flex flex-col items-center gap-2 py-8 text-center md:pt-16 lg:pt-20 xl:gap-4">
          <div className="bg-grid-print pointer-events-none absolute inset-0 -bottom-16 z-[-1] bg-white opacity-60 [mask-image:radial-gradient(ellipse_50%_100%_at_50%_100%,red,#0000)] dark:bg-neutral-800" />
          <div className="h-6">
            <Badge
              variant="outline"
              asChild
              className="bg-card dark:bg-secondary border-border/75 gap-1 rounded-full pr-2 font-normal">
              <Link href="/docs/blocks/authentication">
                New Authentication Blocks <ArrowRightIcon className="size-3" />
              </Link>
            </Badge>
          </div>
          <h1 className="text-primary/90 leading-tighter max-w-3xl text-balance text-4xl font-semibold tracking-tight lg:leading-[1.1] xl:max-w-7xl xl:text-5xl xl:font-medium xl:tracking-tighter">
            Build your Universal Component Library
          </h1>
          <p className="text-foreground/80 max-w-3xl text-balance text-base sm:text-lg">
            Bringing{' '}
            <a
              href="https://ui.shadcn.com"
              target="_blank"
              className="decoration-fd-muted-foreground/0 hover:decoration-fd-muted-foreground underline underline-offset-4">
              shadcn/ui
            </a>{' '}
            to React Native. Beautifully crafted components with Nativewind or Uniwind, open source,
            and <i>almost as easy to use.</i>
          </p>
          <div className="**:data-[slot=button]:shadow-none flex w-full items-center justify-center gap-2 pt-2">
            <Button asChild size="sm">
              <Link href="/docs">Get Started</Link>
            </Button>
          </div>
        </div>
        <ComponentsGrid />
      </main>
      <Footer url="/" />
    </div>
  );
}
