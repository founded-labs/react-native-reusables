import { Skeleton } from '@/registry/nativewind/components/ui/skeleton';
import { View } from 'react-native';

export function SkeletonPreview() {
  return (
    <View className="flex flex-row items-center gap-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <View className="gap-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </View>
    </View>
  );
}
