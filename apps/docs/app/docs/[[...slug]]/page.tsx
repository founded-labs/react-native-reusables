import { Button } from '@docs/components/ui/button';
import { source } from '@docs/lib/source';
import { cn } from '@docs/lib/utils';
import { findNeighbour } from 'fumadocs-core/server';
import { CodeBlock, Pre } from 'fumadocs-ui/components/codeblock';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/page';
import { ArrowLeftIcon, ArrowRightIcon, ExternalLinkIcon } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function Page(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      breadcrumb={{ enabled: false }}
      tableOfContent={{
        footer: <TableOfContentFooter />,
      }}
      footer={{
        component: <Footer url={page.url} />,
      }}>
      <DocsBody>
        <div className="flex items-center justify-between gap-2">
          <DocsTitle className="mb-0 font-semibold">{page.data.title}</DocsTitle>
          <NeighbourButtons url={page.url} />
        </div>
        <DocsDescription className="mb-4 mt-2.5 text-base">{page.data.description}</DocsDescription>
        <MDX
          components={{
            ...defaultMdxComponents,
            h2: ({ className, ...props }) => (
              <defaultMdxComponents.h2 className={cn(className, 'font-medium')} {...props} />
            ),
            //  HTML `ref` attribute conflicts with `forwardRef`
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            pre: ({ ref: _ref, className, ...props }) => (
              <CodeBlock
                {...props}
                className={cn(
                  className,
                  'bg-fd-foreground/95 dark:bg-fd-secondary/50 text-background dark:text-foreground *:dark relative'
                )}>
                <Pre>{props.children}</Pre>
              </CodeBlock>
            ),
            h3: ({ className, ...props }) => (
              <h3 className={cn(className, 'mb-6 mt-10 scroll-mt-20 font-medium')} {...props} />
            ),
          }}
        />
      </DocsBody>
    </DocsPage>
  );
}

function NeighbourButtons({ url }: { url: string }) {
  const neighbours = findNeighbour(source.pageTree, url);

  const isManualInstallation = url === '/docs/installation/manual';

  return (
    <div className="flex items-center gap-2">
      {neighbours.previous || isManualInstallation ? (
        <Button variant="outline" size="icon" className="border-border/70 size-8" asChild>
          <Link href={neighbours.previous?.url || '/docs'}>
            <ArrowLeftIcon />
          </Link>
        </Button>
      ) : null}
      {neighbours.next || isManualInstallation ? (
        <Button variant="outline" size="icon" className="border-border/70 size-8" asChild>
          <Link
            href={neighbours.next?.url || '/docs/customization'}
            target={
              neighbours.next?.url.startsWith('https://foundedlabs.com') ? '_blank' : undefined
            }>
            <ArrowRightIcon />
          </Link>
        </Button>
      ) : null}
    </div>
  );
}

export function Footer({ url }: { url: string }) {
  const neighbours = findNeighbour(source.pageTree, url);

  const isManualInstallation = url === '/docs/installation/manual';

  return (
    <footer>
      <div className="flex h-16 w-full items-center justify-between gap-2">
        {neighbours.previous || isManualInstallation ? (
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="bg-fd-accent hover:bg-fd-accent/80 dark:hover:bg-fd-accent/80">
            <Link href={neighbours.previous?.url || '/docs'}>
              <ArrowLeftIcon />
              {neighbours.previous?.name || 'Introduction'}
            </Link>
          </Button>
        ) : (
          <div />
        )}
        {neighbours.next || isManualInstallation ? (
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="bg-fd-accent hover:bg-fd-accent/80 dark:hover:bg-fd-accent/80">
            <Link href={neighbours.next?.url || '/docs/customization'}>
              {neighbours.next?.name || 'Customization'}
              <ArrowRightIcon />
            </Link>
          </Button>
        ) : null}
      </div>
      <div className="flex h-20 items-center justify-between">
        <div className="text-fd-muted-foreground w-full text-balance px-4 text-center text-xs leading-loose lg:text-sm">
          Built by{' '}
          <a
            href="https://x.com/mrzachnugent"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4">
            mrzachnugent
          </a>{' '}
          at{' '}
          <a
            href="https://foundedlabs.com"
            target="_blank"
            rel="noreferrer"
            className="decoration-fd-muted-foreground/0 hover:decoration-fd-muted-foreground underline underline-offset-4">
            Founded Labs
          </a>
          , bringing{' '}
          <a
            href="https://ui.shadcn.com"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4">
            shadcn/ui
          </a>{' '}
          to React Native. Source on{' '}
          <a
            href="https://github.com/founded-labs/react-native-reusables"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4">
            GitHub
          </a>
          .
        </div>
      </div>
    </footer>
  );
}

function TableOfContentFooter() {
  return (
    <div className="bg-card dark:bg-fd-muted border-border/50 text-fd-foreground/80 group relative mt-12 flex flex-col gap-2 overflow-clip rounded-lg border p-6 text-sm">
      <div className="text-balance text-base font-semibold leading-tight group-hover:underline">
        Want to work with us?
      </div>
      <div className="">Mention us to your team.</div>
      <div className="text-muted-foreground pb-2">We help companies ship world-class UI/UX.</div>
      <Button
        size="sm"
        className="from-primary to-primary/75 group-hover:to-primary/80 relative w-fit bg-transparent bg-gradient-to-br duration-150 group-hover:pr-8">
        Learn more
        <ExternalLinkIcon className="absolute right-2 top-1/2 size-3.5 -translate-x-1 -translate-y-1/2 scale-y-0 opacity-0 duration-100 group-hover:translate-x-0 group-hover:scale-y-100 group-hover:opacity-100" />
      </Button>
      <Link href="https://foundedlabs.com" target="_blank" className="absolute inset-0">
        <span className="sr-only">Learn more about Founded Labs</span>
      </Link>
    </div>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
