import { cn } from '@/registry/nativewind/lib/utils';
import { Button } from '@/registry/nativewind/components/ui/button';
import { Icon } from '@/registry/nativewind/components/ui/icon';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react-native';
import * as React from 'react';
import { useState } from 'react';
import {
  Dimensions,
  FlatList,
  ListRenderItemInfo,
  NativeScrollEvent,
  NativeSyntheticEvent,
  View,
} from 'react-native';

const windowWidth = Dimensions.get('window').width;

type PreviewCarouselProps = {
  previews: { name: string; component: (props: unknown) => React.JSX.Element }[];
  removeBottomSafeArea?: boolean;
};

function PreviewCarousel({ previews, removeBottomSafeArea = false }: PreviewCarouselProps) {
  const [index, setIndex] = useState(0);
  const ref = React.useRef<FlatList>(null);

  function onScroll(ev: NativeSyntheticEvent<NativeScrollEvent>) {
    const index = Math.round(ev.nativeEvent.contentOffset.x / windowWidth);
    setIndex(index);
  }

  function onPreviewPress() {
    ref.current?.scrollToIndex({ index: Math.max(0, index - 1) });
  }

  function onNextPress() {
    ref.current?.scrollToIndex({ index: Math.min(previews.length - 1, index + 1) });
  }

  return (
    <>
      <FlatList
        ref={ref}
        data={previews}
        renderItem={renderItem}
        onScroll={onScroll}
        keyExtractor={keyExtractor}
        horizontal
        snapToInterval={windowWidth}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        contentContainerClassName={cn(!removeBottomSafeArea && 'pb-12 mb-safe')}
      />
      <View className="mb-safe absolute bottom-0 left-0 right-0 h-12 flex-row items-center justify-center px-4">
        <View className="relative flex-row items-center justify-center gap-2">
          <View className="bg-background rounded-md">
            <Button variant="outline" size="icon" disabled={index === 0} onPress={onPreviewPress}>
              <Icon as={ChevronLeftIcon} className="size-4" />
            </Button>
          </View>
          <View className="bg-background rounded-md">
            <Button
              variant="outline"
              size="icon"
              disabled={index === previews.length - 1}
              onPress={onNextPress}>
              <Icon as={ChevronRightIcon} className="size-4" />
            </Button>
          </View>
        </View>
      </View>
    </>
  );
}

export { PreviewCarousel };

function renderItem({
  item,
}: ListRenderItemInfo<{ name: string; component: (props: unknown) => React.JSX.Element }>) {
  const Component = item.component;
  return (
    <View className="w-screen flex-1 items-center justify-center">
      <Component />
    </View>
  );
}

function keyExtractor(item: { name: string }) {
  return item.name;
}
