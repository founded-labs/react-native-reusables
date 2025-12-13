import { Bold, Italic, Underline } from 'lucide-react-native';
import {
  ToggleGroup,
  ToggleGroupIcon,
  ToggleGroupItem,
} from '@/registry/nativewind/components/ui/toggle-group';
import * as React from 'react';
import * as Haptics from 'expo-haptics';

export function ToggleGroupPreview() {
  const [value, setValue] = React.useState<string[]>([]);

  function onValueChange(value: string[]) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setValue(value);
  }

  return (
    <ToggleGroup value={value} onValueChange={onValueChange} variant="outline" type="multiple">
      <ToggleGroupItem isFirst value="bold" aria-label="Toggle bold">
        <ToggleGroupIcon as={Bold} />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Toggle italic">
        <ToggleGroupIcon as={Italic} />
      </ToggleGroupItem>
      <ToggleGroupItem isLast value="strikethrough" aria-label="Toggle strikethrough">
        <ToggleGroupIcon as={Underline} />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
