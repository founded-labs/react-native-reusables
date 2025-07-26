'use client';

import { Icon } from '@/registry/default/components/ui/icon';
import { NativeOnlyAnimatedView } from '@/registry/default/components/ui/native-only-animated-view';
import { TextClassContext } from '@/registry/default/components/ui/text';
import { cn } from '@/registry/default/lib/utils';
import * as MenubarPrimitive from '@rn-primitives/menubar';
import { Check, ChevronDown, ChevronRight, ChevronUp } from 'lucide-react-native';
import * as React from 'react';
import {
  Platform,
  Pressable,
  type StyleProp,
  StyleSheet,
  Text,
  type TextProps,
  View,
  type ViewStyle,
} from 'react-native';
import { FadeIn } from 'react-native-reanimated';

const MenubarMenu = MenubarPrimitive.Menu;

const MenubarGroup = MenubarPrimitive.Group;

const MenubarPortal = MenubarPrimitive.Portal;

const MenubarSub = MenubarPrimitive.Sub;

const MenubarRadioGroup = MenubarPrimitive.RadioGroup;

function Menubar({
  className,
  value: valueProp,
  onValueChange: onValueChangeProp,
  ...props
}: MenubarPrimitive.RootProps & {
  ref?: React.RefObject<MenubarPrimitive.RootRef | null>;
}) {
  const [value, setValue] = React.useState<string | undefined>(undefined);
  return (
    <>
      {Platform.OS !== 'web' && (value || valueProp) ? (
        <Pressable
          onPress={() => {
            if (onValueChangeProp) {
              onValueChangeProp(undefined);
              return;
            }
            setValue(undefined);
          }}
          style={StyleSheet.absoluteFill}
        />
      ) : null}
      <MenubarPrimitive.Root
        className={cn(
          'bg-background border-border flex h-11 flex-row items-center gap-1 rounded-md border p-1 sm:h-10',
          className
        )}
        value={value ?? valueProp}
        onValueChange={onValueChangeProp ?? setValue}
        {...props}
      />
    </>
  );
}

function MenubarTrigger({
  className,
  ...props
}: MenubarPrimitive.TriggerProps & {
  ref?: React.RefObject<MenubarPrimitive.TriggerRef | null>;
}) {
  const { value } = MenubarPrimitive.useRootContext();
  const { value: itemValue } = MenubarPrimitive.useMenuContext();

  return (
    <TextClassContext.Provider
      value={cn(
        'text-sm font-medium select-none group-active:text-accent-foreground',
        value === itemValue && 'text-accent-foreground'
      )}>
      <MenubarPrimitive.Trigger
        className={cn(
          'group flex items-center rounded-md px-3 py-2 sm:py-1.5',
          Platform.select({
            web: 'focus:bg-accent focus:text-accent-foreground cursor-default outline-none',
          }),
          value === itemValue && 'bg-accent',
          className
        )}
        {...props}
      />
    </TextClassContext.Provider>
  );
}

function MenubarSubTrigger({
  className,
  inset,
  children,
  iconClassName,
  ...props
}: MenubarPrimitive.SubTriggerProps & {
  ref?: React.RefObject<MenubarPrimitive.SubTriggerRef | null>;
  children?: React.ReactNode;
  iconClassName?: string;
  inset?: boolean;
}) {
  const { open } = MenubarPrimitive.useSubContext();
  const icon = Platform.OS === 'web' ? ChevronRight : open ? ChevronUp : ChevronDown;
  return (
    <TextClassContext.Provider
      value={cn(
        'text-sm select-none group-active:text-accent-foreground',
        open && 'text-accent-foreground'
      )}>
      <MenubarPrimitive.SubTrigger
        className={cn(
          'active:bg-accent group flex flex-row items-center rounded-sm px-2 py-2 sm:py-1.5',
          Platform.select({
            web: 'focus:bg-accent focus:text-accent-foreground cursor-default outline-none [&_svg]:pointer-events-none',
          }),
          open && 'bg-accent',
          inset && 'pl-8'
        )}
        {...props}>
        <>{children}</>
        <Icon as={icon} className={cn('text-foreground ml-auto size-4 shrink-0', iconClassName)} />
      </MenubarPrimitive.SubTrigger>
    </TextClassContext.Provider>
  );
}

function MenubarSubContent({
  className,
  ...props
}: MenubarPrimitive.SubContentProps & {
  ref?: React.RefObject<MenubarPrimitive.SubContentRef | null>;
}) {
  return (
    <NativeOnlyAnimatedView entering={FadeIn}>
      <MenubarPrimitive.SubContent
        className={cn(
          'bg-popover border-border overflow-hidden rounded-md border p-1 shadow-md',
          Platform.select({
            web: 'animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 fade-in-0 data-[state=closed]:zoom-out-95 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-context-menu-content-transform-origin) z-50 min-w-[8rem]',
          }),
          className
        )}
        {...props}
      />
    </NativeOnlyAnimatedView>
  );
}

function MenubarContent({
  className,
  overlayClassName,
  overlayStyle,
  portalHost,
  align = 'start',
  alignOffset = -4,
  sideOffset = 8,
  ...props
}: MenubarPrimitive.ContentProps & {
  ref?: React.RefObject<MenubarPrimitive.ContentRef | null>;
  overlayStyle?: StyleProp<ViewStyle>;
  overlayClassName?: string;
  portalHost?: string;
}) {
  return (
    <MenubarPrimitive.Portal hostName={portalHost}>
      <NativeOnlyAnimatedView
        entering={FadeIn}
        style={StyleSheet.absoluteFill}
        pointerEvents="box-none">
        <TextClassContext.Provider value="text-popover-foreground">
          <MenubarPrimitive.Content
            className={cn(
              'bg-popover border-border min-w-[12rem] overflow-hidden rounded-md border p-1 shadow-md',
              Platform.select({
                web: cn(
                  'animate-in fade-in-0 zoom-in-95 max-h-(--radix-context-menu-content-available-height) origin-(--radix-context-menu-content-transform-origin) z-50 cursor-default',
                  props.side === 'bottom' && 'slide-in-from-top-2',
                  props.side === 'top' && 'slide-in-from-bottom-2'
                ),
              }),
              className
            )}
            align={align}
            alignOffset={alignOffset}
            sideOffset={sideOffset}
            {...props}
          />
        </TextClassContext.Provider>
      </NativeOnlyAnimatedView>
    </MenubarPrimitive.Portal>
  );
}

function MenubarItem({
  className,
  inset,
  variant,
  ...props
}: MenubarPrimitive.ItemProps & {
  ref?: React.RefObject<MenubarPrimitive.ItemRef | null>;
  className?: string;
  inset?: boolean;
  variant?: 'default' | 'destructive';
}) {
  return (
    <TextClassContext.Provider
      value={cn(
        'select-none text-sm text-popover-foreground group-active:text-popover-foreground',
        variant === 'destructive' && 'text-destructive group-active:text-destructive'
      )}>
      <MenubarPrimitive.Item
        className={cn(
          'active:bg-accent group relative flex flex-row items-center gap-2 rounded-sm px-2 py-2 sm:py-1.5',
          Platform.select({
            web: cn(
              'focus:bg-accent focus:text-accent-foreground cursor-default outline-none data-[disabled]:pointer-events-none',
              variant === 'destructive' && 'focus:bg-destructive/10 dark:focus:bg-destructive/20'
            ),
          }),
          variant === 'destructive' && 'active:bg-destructive/10 dark:active:bg-destructive/20',
          props.disabled && 'opacity-50',
          inset && 'pl-8',
          className
        )}
        {...props}
      />
    </TextClassContext.Provider>
  );
}

function MenubarCheckboxItem({
  className,
  children,
  ...props
}: MenubarPrimitive.CheckboxItemProps & {
  ref?: React.RefObject<MenubarPrimitive.CheckboxItemRef | null>;
  children?: React.ReactNode;
}) {
  return (
    <TextClassContext.Provider value="text-sm text-popover-foreground select-none group-active:text-accent-foreground">
      <MenubarPrimitive.CheckboxItem
        className={cn(
          'active:bg-accent group relative flex flex-row items-center gap-2 rounded-sm py-2 pl-8 pr-2 sm:py-1.5',
          Platform.select({
            web: 'focus:bg-accent focus:text-accent-foreground cursor-default outline-none data-[disabled]:pointer-events-none',
          }),
          props.disabled && 'opacity-50',
          className
        )}
        {...props}>
        <View className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          <MenubarPrimitive.ItemIndicator>
            <Icon
              as={Check}
              className={cn(
                'text-foreground size-4',
                Platform.select({ web: 'pointer-events-none' })
              )}
            />
          </MenubarPrimitive.ItemIndicator>
        </View>
        <>{children}</>
      </MenubarPrimitive.CheckboxItem>
    </TextClassContext.Provider>
  );
}

function MenubarRadioItem({
  className,
  children,
  ...props
}: MenubarPrimitive.RadioItemProps & {
  ref?: React.RefObject<MenubarPrimitive.RadioItemRef | null>;
  children?: React.ReactNode;
}) {
  return (
    <TextClassContext.Provider value="text-sm text-popover-foreground select-none group-active:text-accent-foreground">
      <MenubarPrimitive.RadioItem
        className={cn(
          'active:bg-accent group relative flex flex-row items-center gap-2 rounded-sm py-2 pl-8 pr-2 sm:py-1.5',
          Platform.select({
            web: 'focus:bg-accent focus:text-accent-foreground cursor-default outline-none data-[disabled]:pointer-events-none',
          }),
          props.disabled && 'opacity-50',
          className
        )}
        {...props}>
        <View className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          <MenubarPrimitive.ItemIndicator>
            <View className="bg-foreground h-2 w-2 rounded-full" />
          </MenubarPrimitive.ItemIndicator>
        </View>
        <>{children}</>
      </MenubarPrimitive.RadioItem>
    </TextClassContext.Provider>
  );
}

function MenubarLabel({
  className,
  inset,
  ...props
}: MenubarPrimitive.LabelProps & {
  ref?: React.RefObject<MenubarPrimitive.LabelRef | null>;
  className?: string;
  inset?: boolean;
}) {
  return (
    <MenubarPrimitive.Label
      className={cn(
        'text-foreground px-2 py-2 text-sm font-semibold sm:py-1.5',
        inset && 'pl-8',
        className
      )}
      {...props}
    />
  );
}

function MenubarSeparator({
  className,
  ...props
}: MenubarPrimitive.SeparatorProps & {
  ref?: React.RefObject<MenubarPrimitive.SeparatorRef | null>;
}) {
  return (
    <MenubarPrimitive.Separator className={cn('bg-border -mx-1 my-1 h-px', className)} {...props} />
  );
}

function MenubarShortcut({ className, ...props }: TextProps) {
  return (
    <Text
      className={cn('text-muted-foreground ml-auto text-xs tracking-widest', className)}
      {...props}
    />
  );
}

export {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarPortal,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
};
