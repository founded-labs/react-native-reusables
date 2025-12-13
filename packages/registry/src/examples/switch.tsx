import { Label } from '@/registry/nativewind/components/ui/label';
import { Switch } from '@/registry/nativewind/components/ui/switch';
import * as Haptics from 'expo-haptics';
import * as React from 'react';
import { View } from 'react-native';

export function SwitchPreview() {
  const [checked, setChecked] = React.useState(false);

  function onPress() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setChecked((prev) => !prev);
  }

  function onCheckedChange(checked: boolean) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setChecked(checked);
  }

  return (
    <View className="flex-row items-center gap-2">
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        id="airplane-mode"
        nativeID="airplane-mode"
      />
      <Label nativeID="airplane-mode" htmlFor="airplane-mode" onPress={onPress}>
        Airplane Mode
      </Label>
    </View>
  );
}
