import { Toggle, ToggleIcon } from '@/registry/nativewind/components/ui/toggle';
import { Bold } from 'lucide-react-native';
import * as React from 'react';
import * as Haptics from 'expo-haptics';

export function TogglePreview() {
  const [pressed, setPressed] = React.useState(false);

  function onPressedChange(pressed: boolean) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPressed(pressed);
  }

  return (
    <Toggle aria-label="Toggle italic" pressed={pressed} onPressedChange={onPressedChange}>
      <ToggleIcon as={Bold} />
    </Toggle>
  );
}
