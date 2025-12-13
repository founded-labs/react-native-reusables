import { Button } from '@/registry/nativewind/components/ui/button';
import { Input } from '@/registry/nativewind/components/ui/input';
import { Label } from '@/registry/nativewind/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/registry/nativewind/components/ui/popover';
import { Text } from '@/registry/nativewind/components/ui/text';
import { View } from 'react-native';

export function PopoverPreview() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Text>Open popover</Text>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" side="top">
        <View className="gap-4">
          <View className="gap-2">
            <Text className="font-medium leading-none">Dimensions</Text>
            <Text className="text-muted-foreground text-sm">Set the dimensions for the layer.</Text>
          </View>
          <View className="gap-2">
            <View className="flex-row items-center gap-4">
              <Label className="web:block w-24" htmlFor="width">
                Width
              </Label>
              <Input id="width" defaultValue="100%" className="flex-1 sm:h-8" />
            </View>
            <View className="flex-row items-center gap-4">
              <Label className="web:block w-24" htmlFor="maxWidth">
                Max. width
              </Label>
              <Input id="maxWidth" defaultValue="300px" className="flex-1 sm:h-8" />
            </View>
            <View className="flex-row items-center gap-4">
              <Label className="web:block w-24" htmlFor="height">
                Height
              </Label>
              <Input id="height" defaultValue="25px" className="flex-1 sm:h-8" />
            </View>
            <View className="flex-row items-center gap-4">
              <Label className="web:block w-24" htmlFor="maxHeight">
                Max. height
              </Label>
              <Input id="maxHeight" defaultValue="none" className="flex-1 sm:h-8" />
            </View>
          </View>
        </View>
      </PopoverContent>
    </Popover>
  );
}
