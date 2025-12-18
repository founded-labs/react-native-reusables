import { Button } from '@/registry/nativewind/components/ui/button';
import { Text } from '@/registry/nativewind/components/ui/text';
import { toast } from '@/registry/nativewind/components/ui/toast';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function ToastPreview() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      className="bg-background flex-1"
      contentContainerClassName="gap-6 p-6"
      contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
      showsVerticalScrollIndicator={false}>
      <View className="gap-2">
        <Text className="text-muted-foreground text-sm font-medium uppercase">Basic</Text>
        <Button
          variant="outline"
          onPress={() =>
            toast('Event created', {
              description: 'Monday, January 3rd at 6:00pm',
            })
          }>
          <Text>Default Toast</Text>
        </Button>
      </View>

      <View className="gap-2">
        <Text className="text-muted-foreground text-sm font-medium uppercase">Variants</Text>

        <Button
          variant="secondary"
          className="bg-green-100 dark:bg-green-900"
          onPress={() =>
            toast.success('Project created', {
              description: 'The project has been successfully created.',
            })
          }>
          <Text className="text-green-800 dark:text-green-100">Success</Text>
        </Button>

        <Button
          variant="secondary"
          className="bg-red-100 dark:bg-red-900"
          onPress={() =>
            toast.error('Deletion failed', {
              description: 'An unknown error occurred. Please try again.',
            })
          }>
          <Text className="text-red-800 dark:text-red-100">Error</Text>
        </Button>

        <Button
          variant="secondary"
          className="bg-blue-100 dark:bg-blue-900"
          onPress={() =>
            toast.info('New Update', {
              description: 'A new version of the app is available.',
            })
          }>
          <Text className="text-blue-800 dark:text-blue-100">Info</Text>
        </Button>
      </View>

      <View className="gap-2">
        <Text className="text-muted-foreground text-sm font-medium uppercase">Interactive</Text>

        <Button
          variant="outline"
          onPress={() =>
            toast('Scheduled: Catch up', {
              description: 'Friday, February 10, 2024 at 5:57 PM',
              action: {
                label: 'Undo',
                onPress: () => toast.info('Undo action clicked'),
              },
            })
          }>
          <Text>With Action Button</Text>
        </Button>
      </View>

      <View className="gap-2">
        <Text className="text-muted-foreground text-sm font-medium uppercase">Async / Promise</Text>

        <Button
          onPress={() =>
            toast.promise(fakeRequest(false), {
              loading: 'Uploading file...',
              success: 'File uploaded successfully',
              error: 'Upload failed',
            })
          }>
          <Text>Promise (Success)</Text>
        </Button>

        <Button
          variant="destructive"
          onPress={() =>
            toast.promise(fakeRequest(true), {
              loading: 'Connecting to database...',
              success: 'Connected',
              error: 'Connection timed out',
            })
          }>
          <Text>Promise (Error)</Text>
        </Button>
      </View>
    </ScrollView>
  );
}

// Helper to simulate async operations
function fakeRequest(shouldFail = false, delay = 2000) {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      shouldFail ? reject() : resolve();
    }, delay);
  });
}
