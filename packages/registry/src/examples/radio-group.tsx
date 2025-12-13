import { Label } from '@/registry/nativewind/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/registry/nativewind/components/ui/radio-group';
import * as Haptics from 'expo-haptics';
import * as React from 'react';
import { View } from 'react-native';

export function RadioGroupPreview() {
  const [value, setValue] = React.useState('comfortable');

  function onLabelPress(label: string) {
    return () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setValue(label);
    };
  }

  function onValueChange(value: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setValue(value);
  }

  return (
    <RadioGroup value={value} onValueChange={onValueChange}>
      <View className="flex flex-row items-center gap-3">
        <RadioGroupItem value="default" id="r1" />
        <Label htmlFor="r1" onPress={onLabelPress('default')}>
          Default
        </Label>
      </View>
      <View className="flex flex-row items-center gap-3">
        <RadioGroupItem value="comfortable" id="r2" />
        <Label htmlFor="r2" onPress={onLabelPress('comfortable')}>
          Comfortable
        </Label>
      </View>
      <View className="flex flex-row items-center gap-3">
        <RadioGroupItem value="compact" id="r3" />
        <Label htmlFor="r3" onPress={onLabelPress('compact')}>
          Compact
        </Label>
      </View>
    </RadioGroup>
  );
}
