import { CodeBlock, Pre } from 'fumadocs-ui/components/codeblock';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';

const MANAGERS = ['npm', 'bun', 'pnpm', 'yarn', 'yarn@berry'] as const;

const COMMAND: Record<(typeof MANAGERS)[number], string[]> = {
  npm: ['npx'],
  bun: ['bunx', '--bun'],
  pnpm: ['pnpm', 'dlx'],
  yarn: ['yarn'],
  'yarn@berry': ['yarn', 'dlx'],
};

export function CommandTabs({ args }: { args: string[] }) {
  return (
    <div className="dark">
      <Tabs items={MANAGERS as unknown as string[]} groupId="manager" persist>
        {MANAGERS.map((manager) => (
          <Tab key={manager} value={manager} className="dark:text-foreground *:dark">
            <CodeBlock>
              <Pre>
                <code>
                  {[...COMMAND[manager], '@react-native-reusables/cli@latest', ...args].join(' ')}
                </code>
              </Pre>
            </CodeBlock>
          </Tab>
        ))}
      </Tabs>
    </div>
  );
}
