import { Badge } from '@/registry/nativewind/components/ui/badge';
import { Icon } from '@/registry/nativewind/components/ui/icon';
import { Text } from '@/registry/nativewind/components/ui/text';
import { BadgeCheckIcon } from 'lucide-react-native';
import { View } from 'react-native';

export function BadgePreview() {
  return (
    <View className="flex flex-col items-center gap-2">
      <View className="flex w-full flex-row flex-wrap gap-2">
        <Badge>
          <Text>Badge</Text>
        </Badge>
        <Badge variant="secondary">
          <Text>Secondary</Text>
        </Badge>
        <Badge variant="destructive">
          <Text>Destructive</Text>
        </Badge>
        <Badge variant="outline">
          <Text>Outline</Text>
        </Badge>
      </View>
      <View className="flex w-full flex-row flex-wrap gap-2">
        <Badge variant="secondary" className="bg-blue-500 dark:bg-blue-600">
          <Icon as={BadgeCheckIcon} className="text-white" />
          <Text className="text-white">Verified</Text>
        </Badge>
        <Badge className="min-w-5 rounded-full px-1">
          <Text>8</Text>
        </Badge>
        <Badge className="min-w-5 rounded-full px-1" variant="destructive">
          <Text>99</Text>
        </Badge>
        <Badge className="min-w-5 rounded-full px-1" variant="outline">
          <Text>20+</Text>
        </Badge>
      </View>
    </View>
  );
}
