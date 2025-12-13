import { Separator } from '@/registry/nativewind/components/ui/separator';
import { Text } from '@/registry/nativewind/components/ui/text';
import { View } from 'react-native';

export function SeparatorPreview() {
  return (
    <View>
      <View className="gap-1">
        <Text className="text-sm font-medium leading-none">Radix Primitives</Text>
        <Text className="text-muted-foreground text-sm">An open-source UI component library.</Text>
      </View>
      <Separator className="my-4" />
      <View className="flex h-5 flex-row items-center gap-4">
        <Text className="text-sm">Blog</Text>
        <Separator orientation="vertical" />
        <Text className="text-sm">Docs</Text>
        <Separator orientation="vertical" />
        <Text className="text-sm">Source</Text>
      </View>
    </View>
  );
}
