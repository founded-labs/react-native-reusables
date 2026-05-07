import { cn } from '@/registry/nativewind/lib/utils';
import * as SeparatorPrimitive from '@rn-primitives/separator';
import { Platform } from 'react-native';

function Separator({
  className,
  orientation = 'horizontal',
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      decorative={decorative}
      orientation={orientation}
      className={cn(
        'shrink-0',
        Platform.select({
          web:
            orientation === 'horizontal'
              ? 'border-t border-border'
              : 'border-l border-border',
          default: cn(
            'bg-border',
            orientation === 'horizontal'
              ? 'h-[1px] w-full'
              : 'h-full w-[1px]'
          ),
        }),
        className
      )}
      {...props}
    />
  );
}

export { Separator };
