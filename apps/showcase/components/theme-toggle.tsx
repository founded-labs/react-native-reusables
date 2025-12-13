import { Button } from '@/registry/nativewind/components/ui/button';
import * as Haptics from 'expo-haptics';
import { useColorScheme } from 'nativewind';
import { Image, type ImageStyle } from 'react-native';

const THEME_TOGGLE_IMAGES = {
  light: require('@showcase/assets/images/theme-toggle-light.png'),
  dark: require('@showcase/assets/images/theme-toggle-dark.png'),
};

const IMAGE_STYLE: ImageStyle = {
  height: 22,
  width: 22,
};

export function ThemeToggle() {
  const { colorScheme, setColorScheme } = useColorScheme();

  function toggleColorScheme() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    const newTheme = colorScheme === 'dark' ? 'light' : 'dark';
    setColorScheme(newTheme);
  }

  return (
    <Button
      onPress={toggleColorScheme}
      variant="ghost"
      size="icon"
      className="web:mr-5 size-9 rounded-full">
      <Image source={THEME_TOGGLE_IMAGES[colorScheme]} style={IMAGE_STYLE} />
    </Button>
  );
}
