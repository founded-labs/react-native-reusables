import { cn } from '@/lib/utils';
import React from 'react';
import { Platform, TextInput, type TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  isRTL?: boolean;
}

const Input = React.forwardRef<TextInput, InputProps>(
  ({ className, isRTL = false, ...props }, ref) => {
    const rtlClasses = isRTL ? 'text-right' : 'text-left';
    const rtlPlaceholder = isRTL ? 'placeholder:text-right' : 'placeholder:text-left';

    return (
      <TextInput
        ref={ref} 
        className={cn(
          'dark:bg-input/30 border-input bg-background text-foreground flex h-10 w-full min-w-0 flex-row items-center rounded-md border px-3 py-1 text-base leading-5 shadow-sm shadow-black/5 sm:h-9',
          rtlClasses,
          props.editable === false &&
            cn(
              'opacity-50',
              Platform.select({ web: 'disabled:pointer-events-none disabled:cursor-not-allowed' })
            ),
          Platform.select({
            web: cn(
              'selection:bg-primary selection:text-primary-foreground outline-none transition-[color,box-shadow] md:text-sm',
              'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
              'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
              rtlPlaceholder
            ),
            native: cn('placeholder:text-muted-foreground/50', rtlPlaceholder),
          }),
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };
