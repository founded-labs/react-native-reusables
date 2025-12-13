import { Text, TextClassContext } from '@/registry/nativewind/components/ui/text';
import { View } from 'react-native';

export function TextCascadePreview() {
  return (
    <View className="items-center gap-2">
      {/* Default behavior without a parent `TextClassContext.Provider` */}
      <Text>
        Default: <Text variant="code">text-foreground</Text>
      </Text>
      <Parent>
        {/* Inherits the `TextClassContext.Provider` value from the `Parent` component and overrides the default `Text` component `className` */}
        <Text>
          Inherited from Parent: <Text variant="code">text-emerald-500</Text>
        </Text>
        <Text>
          {/* This `className` will override the `TextClassContext.Provider` value */}
          <Text className="text-purple-500">Overridden:</Text>{' '}
          <Text variant="code" className="text-purple-500">
            text-purple-500
          </Text>
        </Text>
        <NestedParent>
          {/* Inherits the `TextClassContext.Provider` value from the `OtherParent` component overrides the `TextClassContext.Provider` value from the `Parent` */}
          <Text>
            Inherited from NestedParent: <Text variant="code">text-sky-500</Text>
          </Text>
        </NestedParent>
      </Parent>
    </View>
  );
}

// Parent component that provides a `TextClassContext.Provider` value
function Parent({ children }: React.ComponentProps<typeof View>) {
  return (
    <TextClassContext.Provider value="text-emerald-500">
      <View className="items-center gap-2">{children}</View>
    </TextClassContext.Provider>
  );
}

// Nested parent component that overrides the `TextClassContext.Provider` value from the `Parent` component
function NestedParent({ children }: React.ComponentProps<typeof View>) {
  return (
    <TextClassContext.Provider value="text-sky-500">
      <View className="items-center gap-2">{children}</View>
    </TextClassContext.Provider>
  );
}
