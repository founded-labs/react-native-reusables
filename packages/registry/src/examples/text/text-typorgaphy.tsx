import { ScrollView, View } from 'react-native';
import { Text } from '@/registry/nativewind/components/ui/text';

export function TextTypographyPreview() {
  return (
    <ScrollView contentContainerClassName="p-6 native:pb-safe">
      <View className="native:pb-12 max-w-lg">
        <Text variant="h1">The Rainbow Forest Adventure</Text>
        <View className="p-1.5" />
        <Text variant="p">
          Once upon a time, in a magical forest, there lived a curious rabbit named Whiskers.
          Whiskers loved exploring and discovering new things every day.
        </Text>
        <View className="p-3" />
        <Text variant="h2">Whiskers' Discovery</Text>
        <Text variant="p">
          One day, while hopping through the forest, Whiskers stumbled upon{' '}
          <Text variant="p" className="font-medium">
            a mysterious rainbow-colored flower
          </Text>
          . The flower had the power to make the forest come alive with vibrant colors and happy
          creatures.
        </Text>
        <Text variant="blockquote">
          "Oh, what a wonderful discovery!" exclaimed Whiskers. "I must share this magic with all my
          forest friends!"
        </Text>
        <View className="p-4" />
        <Text variant="h3">The Colorful Transformation</Text>
        <View className="p-0.5" />
        <Text variant="p">
          Whiskers excitedly gathered all the animals in the forest and showed them the magical
          rainbow flower. The animals were amazed and decided to plant more of these flowers to make
          their home even more magical.
        </Text>
        <View className="p-1.5" />
        <Text variant="p">
          As the rainbow flowers bloomed, the entire forest transformed into a kaleidoscope of
          colors. Birds chirped in harmony, butterflies danced in the air, and even the trees swayed
          to the rhythm of the wind.
        </Text>
        <View className="p-3" />
        <Text variant="h3">The Enchanted Celebration</Text>
        <View className="p-0.5" />
        <Text variant="p">
          The animals decided to celebrate their enchanted forest with a grand feast. They gathered
          nuts, berries, and fruits from the colorful trees and shared stories of their adventures.
          The joyous laughter echoed through the Rainbow Forest.
        </Text>
        <View className="p-1.5" />
        <Text variant="lead">
          And so, the Rainbow Forest became a place of wonder and happiness, where Whiskers and all
          the animals lived together in harmony.
        </Text>
        <View className="p-3" />
        <Text variant="h3">The Never-ending Magic</Text>
        <View className="p-0.5" />
        <Text variant="p">
          The magic of the rainbow flowers continued to spread, reaching other parts of the world.
          Soon, forests everywhere became vibrant and alive, thanks to the discovery of Whiskers and
          the enchanted Rainbow Forest.
        </Text>
        <View className="p-1.5" />
        <Text variant="large">
          The moral of the story is: embrace the magic of discovery, share joy with others, and
          watch as the world transforms into a colorful and beautiful place.
        </Text>
        <View className="p-3" />
      </View>
    </ScrollView>
  );
}
