'use client';

import { Icon } from '@/registry/default/components/ui/icon';
import { NativeOnlyAnimatedView } from '@/registry/default/components/ui/native-only-animated-view';
import { cn } from '@/registry/default/lib/utils';
import * as DialogPrimitive from '@rn-primitives/dialog';
import { X } from 'lucide-react-native';
import * as React from 'react';
import { Platform, Text, View, type ViewProps } from 'react-native';
import { FadeIn, FadeOut } from 'react-native-reanimated';

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

function DialogOverlay({
  className,
  children,
  ...props
}: Omit<DialogPrimitive.OverlayProps, 'asChild'> & {
  ref?: React.RefObject<DialogPrimitive.OverlayRef>;
  children?: React.ReactNode;
}) {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        'absolute bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center bg-black/80 p-2',
        Platform.select({
          web: 'animate-in fade-in-0 fixed cursor-default [&>*]:cursor-auto',
        }),
        className
      )}
      {...props}
      asChild={Platform.OS !== 'web'}>
      <NativeOnlyAnimatedView entering={FadeIn.duration(200)} exiting={FadeOut.duration(150)}>
        <NativeOnlyAnimatedView entering={FadeIn.delay(50)} exiting={FadeOut.duration(150)}>
          <>{children}</>
        </NativeOnlyAnimatedView>
      </NativeOnlyAnimatedView>
    </DialogPrimitive.Overlay>
  );
}
function DialogContent({
  className,
  portalHost,
  children,
  ...props
}: DialogPrimitive.ContentProps & {
  ref?: React.RefObject<DialogPrimitive.ContentRef>;
  portalHost?: string;
}) {
  return (
    <DialogPortal hostName={portalHost}>
      <DialogOverlay>
        <DialogPrimitive.Content
          className={cn(
            'bg-background border-border z-50 flex max-w-lg flex-col gap-4 rounded-lg border p-6 shadow-lg',
            Platform.select({
              web: 'animate-in fade-in-0 zoom-in-95 duration-200',
            }),
            className
          )}
          {...props}>
          <>{children}</>
          <DialogPrimitive.Close
            className={cn(
              'absolute right-4 top-4 rounded opacity-70 active:opacity-100',
              Platform.select({
                web: 'ring-offset-background focus:ring-ring data-[state=open]:bg-accent transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2',
              })
            )}
            hitSlop={12}>
            <Icon
              as={X}
              className={cn('text-accent-foreground web:pointer-events-none size-4 shrink-0')}
            />
            <Text className="sr-only">Close</Text>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogOverlay>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: ViewProps) {
  return (
    <View className={cn('flex flex-col gap-1.5 text-center sm:text-left', className)} {...props} />
  );
}

function DialogFooter({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
      {...props}
    />
  );
}

function DialogTitle({
  className,
  ...props
}: DialogPrimitive.TitleProps & {
  ref?: React.RefObject<DialogPrimitive.TitleRef>;
}) {
  return (
    <DialogPrimitive.Title
      className={cn('text-foreground text-lg font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: DialogPrimitive.DescriptionProps & {
  ref?: React.RefObject<DialogPrimitive.DescriptionRef>;
}) {
  return (
    <DialogPrimitive.Description
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
