import { Checkbox } from '@/registry/nativewind/components/ui/checkbox';
import { Label } from '@/registry/nativewind/components/ui/label';
import * as Haptics from 'expo-haptics';
import * as React from 'react';
import { Platform, View } from 'react-native';

export function LabelPreview() {
  const [checked, setChecked] = React.useState(false);

  function onCheckedChange(checked: boolean) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setChecked(checked);
  }

  return (
    <View className="flex-row items-center gap-2">
      <Checkbox
        aria-labelledby="terms-checkbox"
        id="terms-checkbox"
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
      <Label
        nativeID="terms-checkbox"
        htmlFor="terms-checkbox"
        onPress={Platform.select({
          native: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setChecked((prev) => !prev);
          },
        })}>
        Accept terms and conditions
      </Label>
    </View>
  );
}
