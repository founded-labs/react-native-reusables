import { Avatar, AvatarFallback, AvatarImage } from '@/registry/nativewind/components/ui/avatar';
import { Button } from '@/registry/nativewind/components/ui/button';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/registry/nativewind/components/ui/hover-card';
import { Text } from '@/registry/nativewind/components/ui/text';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function HoverCardPreview() {
  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">
          <Text>@expo</Text>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent insets={contentInsets} className="w-80">
        <View className="flex flex-row justify-between gap-4">
          <Avatar alt="Vercel avatar">
            <AvatarImage source={{ uri: 'https://github.com/expo.png' }} />
            <AvatarFallback>
              <Text>E</Text>
            </AvatarFallback>
          </Avatar>
          <View className="flex-1 gap-1">
            <Text className="text-sm font-semibold">@expo</Text>
            <Text className="text-sm">
              Framework and tools for creating native apps with React.
            </Text>
            <Text className="text-muted-foreground text-xs">Joined December 2021</Text>
          </View>
        </View>
      </HoverCardContent>
    </HoverCard>
  );
}
