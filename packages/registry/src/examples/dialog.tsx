import { Button } from '@/registry/nativewind/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/registry/nativewind/components/ui/dialog';
import { Input } from '@/registry/nativewind/components/ui/input';
import { Label } from '@/registry/nativewind/components/ui/label';
import { Text } from '@/registry/nativewind/components/ui/text';
import { View } from 'react-native';

export function DialogPreview() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Text>Open Dialog</Text>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <View className="grid gap-4">
          <View className="grid gap-3">
            <Label htmlFor="name-1">Name</Label>
            <Input id="name-1" defaultValue="Pedro Duarte" />
          </View>
          <View className="grid gap-3">
            <Label htmlFor="username-1">Username</Label>
            <Input id="username-1" defaultValue="@peduarte" />
          </View>
        </View>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">
              <Text>Cancel</Text>
            </Button>
          </DialogClose>
          <Button>
            <Text>Save changes</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
