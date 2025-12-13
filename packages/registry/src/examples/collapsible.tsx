import { Button } from '@/registry/nativewind/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/registry/nativewind/components/ui/collapsible';
import { Icon } from '@/registry/nativewind/components/ui/icon';
import { ChevronsUpDown } from 'lucide-react-native';
import { Text, View } from 'react-native';

export function CollapsiblePreview() {
  return (
    <Collapsible className="flex w-[350px] flex-row flex-col gap-2">
      <View className="flex flex-row items-center justify-between gap-4 px-4">
        <Text className="text-foreground text-sm font-semibold">
          @peduarte starred 3 repositories
        </Text>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8">
            <Icon as={ChevronsUpDown} className="text-foreground" />
            <Text className="sr-only">Toggle</Text>
          </Button>
        </CollapsibleTrigger>
      </View>
      <View className="border-border rounded-md border px-4 py-2">
        <Text className='text-foreground text-sm"'>@radix-ui/primitives</Text>
      </View>
      <CollapsibleContent className="gap-2">
        <View className="border-border rounded-md border px-4 py-2">
          <Text className="text-foreground text-sm">@radix-ui/react</Text>
        </View>
        <View className="border-border rounded-md border px-4 py-2">
          <Text className="text-foreground text-sm">@stitches/core</Text>
        </View>
      </CollapsibleContent>
    </Collapsible>
  );
}
