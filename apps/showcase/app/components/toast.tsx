import { ToastPreview } from '@/registry/examples/toast';
import { View } from 'react-native';

export default function ToastScreen() {
  return (
    <View className="flex-1 items-center justify-center gap-12 p-6">
      <ToastPreview />
    </View>
  );
}
