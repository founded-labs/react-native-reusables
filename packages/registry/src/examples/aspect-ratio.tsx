import { AspectRatio } from '@/registry/nativewind/components/ui/aspect-ratio';
import { Image } from 'react-native';

export function AspectRatioPreview() {
  return (
    <AspectRatio ratio={16 / 9} className="relative aspect-video w-full overflow-hidden rounded-md">
      <Image
        source={{
          uri: 'https://images.unsplash.com/photo-1672758247442-82df22f5899e',
        }}
        alt="Photo by Drew Beamer (https://unsplash.com/@dbeamer_jpg)"
        className="absolute bottom-0 left-0 right-0 top-0 object-cover"
      />
    </AspectRatio>
  );
}
