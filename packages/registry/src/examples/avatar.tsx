import { Avatar, AvatarFallback, AvatarImage } from '@/registry/nativewind/components/ui/avatar';
import { Text } from '@/registry/nativewind/components/ui/text';
import { View } from 'react-native';

export function AvatarPreview() {
  return (
    <View className="flex-row flex-wrap gap-12">
      <Avatar
        alt="@mrzachnugent"
        className="border-background web:border-0 web:ring-2 web:ring-background border-2">
        <AvatarImage source={{ uri: 'https://github.com/mrzachnugent.png' }} />
        <AvatarFallback>
          <Text>ZN</Text>
        </AvatarFallback>
      </Avatar>
      <Avatar
        alt="@shadcn"
        className="border-background web:border-0 web:ring-2 web:ring-background rounded-lg border-2">
        <AvatarImage source={{ uri: 'https://github.com/shadcn.png' }} />
        <AvatarFallback>
          <Text>CN</Text>
        </AvatarFallback>
      </Avatar>
      <View className="flex-row">
        <Avatar
          alt="@mrzachnugent"
          className="border-background web:border-0 web:ring-2 web:ring-background -mr-2 border-2">
          <AvatarImage source={{ uri: 'https://github.com/mrzachnugent.png' }} />
          <AvatarFallback>
            <Text>ZN</Text>
          </AvatarFallback>
        </Avatar>
        <Avatar
          alt="@leerob"
          className="border-background web:border-0 web:ring-2 web:ring-background -mr-2 border-2">
          <AvatarImage source={{ uri: 'https://github.com/leerob.png' }} />
          <AvatarFallback>
            <Text>LR</Text>
          </AvatarFallback>
        </Avatar>
        <Avatar
          alt="@evilrabbit"
          className="border-background web:border-0 web:ring-2 web:ring-background -mr-2 border-2">
          <AvatarImage source={{ uri: 'https://github.com/evilrabbit.png' }} />
          <AvatarFallback>
            <Text>ER</Text>
          </AvatarFallback>
        </Avatar>
      </View>
    </View>
  );
}
