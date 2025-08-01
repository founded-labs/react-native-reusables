import { cn } from '@/registry/new-york/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/registry/ui/avatar';
import { Button } from '@/registry/ui/button';
import { Icon } from '@/registry/default/components/ui/icon';
import { Popover, PopoverContent, PopoverTrigger } from '@/registry/ui/popover';
import { Text } from '@/registry/ui/text';
import type { TriggerRef } from '@rn-primitives/popover';
import { LogOutIcon, PlusIcon, SettingsIcon } from 'lucide-react-native';
import * as React from 'react';
import { View } from 'react-native';

const USER = {
  fullName: 'Zach Nugent',
  initials: 'ZN',
  imgSrc: { uri: 'https://github.com/mrzachnugent.png' },
  username: 'mrzachnugent',
};

export function UserMenu() {
  const popoverTriggerRef = React.useRef<TriggerRef>(null);

  async function onSignOut() {
    popoverTriggerRef.current?.close();
    // TODO: Sign out and navigate to sign in screen
  }

  return (
    <Popover>
      <PopoverTrigger asChild ref={popoverTriggerRef}>
        <Button variant="ghost" size="icon" className="size-8 rounded-full">
          <UserAvatar />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="center" side="bottom" className="w-80 p-0">
        <View className="border-border gap-3 border-b p-3">
          <View className="flex-row items-center gap-3">
            <UserAvatar className="size-10" />
            <View className="flex-1">
              <Text className="font-medium leading-5">{USER.fullName}</Text>
              {USER.fullName?.length ? (
                <Text className="text-muted-foreground text-sm font-normal leading-4">
                  {USER.username}
                </Text>
              ) : null}
            </View>
          </View>
          <View className="flex-row flex-wrap gap-3 py-0.5">
            <Button
              variant="outline"
              size="sm"
              onPress={() => {
                // TODO: Navigate to account settings screen
              }}>
              <Icon as={SettingsIcon} className="size-4" />
              <Text>Manage Account</Text>
            </Button>
            <Button variant="outline" size="sm" className="flex-1" onPress={onSignOut}>
              <Icon as={LogOutIcon} className="size-4" />
              <Text>Sign Out</Text>
            </Button>
          </View>
        </View>
        <Button
          variant="ghost"
          size="lg"
          className="h-16 justify-start gap-3 rounded-none rounded-b-md px-3 sm:h-14"
          onPress={() => {
            // TODO: Navigate to add account screen
          }}>
          <View className="size-10 items-center justify-center">
            <View className="border-border bg-muted/50 size-7 items-center justify-center rounded-full border border-dashed">
              <Icon as={PlusIcon} className="size-5" />
            </View>
          </View>
          <Text>Add account</Text>
        </Button>
      </PopoverContent>
    </Popover>
  );
}

function UserAvatar({ className, ...props }: Omit<React.ComponentProps<typeof Avatar>, 'alt'>) {
  return (
    <Avatar alt={`${USER.fullName}'s avatar`} className={cn('size-8', className)} {...props}>
      <AvatarImage source={USER.imgSrc} />
      <AvatarFallback>
        <Text>{USER.initials}</Text>
      </AvatarFallback>
    </Avatar>
  );
}
