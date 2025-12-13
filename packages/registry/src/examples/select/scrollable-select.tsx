import {
  NativeSelectScrollView,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/registry/nativewind/components/ui/select';
import type { TriggerRef } from '@rn-primitives/select';
import * as React from 'react';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const fruits = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Blueberry', value: 'blueberry' },
  { label: 'Grapes', value: 'grapes' },
  { label: 'Pineapple', value: 'pineapple' },
  { label: 'Cherry', value: 'cherry' },
  { label: 'Strawberry', value: 'strawberry' },
  { label: 'Orange', value: 'orange' },
  { label: 'Lemon', value: 'lemon' },
  { label: 'Kiwi', value: 'kiwi' },
  { label: 'Mango', value: 'mango' },
  { label: 'Pomegranate', value: 'pomegranate' },
  { label: 'Watermelon', value: 'watermelon' },
  { label: 'Peach', value: 'peach' },
  { label: 'Pear', value: 'pear' },
  { label: 'Plum', value: 'plum' },
  { label: 'Raspberry', value: 'raspberry' },
  { label: 'Tangerine', value: 'tangerine' },
];

export function ScrollableSelectPreview() {
  const ref = React.useRef<TriggerRef>(null);

  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: Platform.select({ ios: insets.bottom, android: insets.bottom + 24 }),
    left: 12,
    right: 12,
  };

  // Workaround for rn-primitives/select not opening on mobile
  function onTouchStart() {
    ref.current?.open();
  }

  return (
    <Select>
      <SelectTrigger ref={ref} className="w-[180px]" onTouchStart={onTouchStart}>
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent insets={contentInsets} className="w-[180px]">
        <NativeSelectScrollView>
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            {fruits.map((fruit) => (
              <SelectItem key={fruit.value} label={fruit.label} value={fruit.value}>
                {fruit.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </NativeSelectScrollView>
      </SelectContent>
    </Select>
  );
}
