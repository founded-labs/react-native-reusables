import { Button } from '@/registry/nativewind/components/ui/button';
import { Icon } from '@/registry/nativewind/components/ui/icon';
import { Text } from '@/registry/nativewind/components/ui/text';
import { Mail } from 'lucide-react-native';

export function ButtonWithIconPreview() {
  return (
    <Button>
      <Icon as={Mail} className="text-primary-foreground" />
      <Text>Login with Email</Text>
    </Button>
  );
}
