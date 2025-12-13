import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from '@/registry/nativewind/components/ui/menubar';
import { Text } from '@/registry/nativewind/components/ui/text';
import * as React from 'react';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function MenubarPreview() {
  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };
  const [value, setValue] = React.useState<string | undefined>();
  const [isSubOpen, setIsSubOpen] = React.useState(false);
  const [isSubOpen2, setIsSubOpen2] = React.useState(false);
  const [isChecked, setIsChecked] = React.useState(false);
  const [isChecked2, setIsChecked2] = React.useState(false);
  const [radio, setRadio] = React.useState('michael');

  /**
   * NOTE:
   * On mobile, if the menu is open and the user is about to go to a new screen,
   * it's best to close the menu first.
   */

  function closeSubs() {
    setIsSubOpen(false);
    setIsSubOpen2(false);
  }

  function onValueChange(val: string | undefined) {
    if (typeof val === 'string') {
      setValue(val);
      return;
    }
    closeSubs();
    setValue(undefined);
  }

  return (
    <Menubar value={value} onValueChange={onValueChange}>
      <MenubarMenu value="file">
        <MenubarTrigger onPress={closeSubs}>
          <Text>File</Text>
        </MenubarTrigger>
        <MenubarContent insets={contentInsets}>
          <MenubarItem>
            <Text>New Tab</Text>
            <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            <Text>New Window</Text>
            <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem disabled>
            <Text>New Incognito Window</Text>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarSub open={isSubOpen} onOpenChange={setIsSubOpen}>
            <MenubarSubTrigger>
              <Text>Share</Text>
            </MenubarSubTrigger>
            <MenubarSubContent>
              <Animated.View entering={FadeIn.duration(200)}>
                <MenubarItem>
                  <Text>Email link</Text>
                </MenubarItem>
                <MenubarItem>
                  <Text>Messages</Text>
                </MenubarItem>
                <MenubarItem>
                  <Text>Notes</Text>
                </MenubarItem>
              </Animated.View>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>
            <Text>Print...</Text>
            <MenubarShortcut>⌘P</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu value="edit">
        <MenubarTrigger onPress={closeSubs}>
          <Text>Edit</Text>
        </MenubarTrigger>
        <MenubarContent insets={contentInsets} className="native:w-48">
          <MenubarItem>
            <Text>Undo</Text>
            <MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            <Text>Redo</Text>
            <MenubarShortcut>⇧⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarSub open={isSubOpen2} onOpenChange={setIsSubOpen2}>
            <MenubarSubTrigger>
              <Text>Find</Text>
            </MenubarSubTrigger>
            <MenubarSubContent>
              <Animated.View entering={FadeIn.duration(200)}>
                <MenubarItem>
                  <Text>Search the web</Text>
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem>
                  <Text>Find...</Text>
                </MenubarItem>
                <MenubarItem>
                  <Text>Find Next</Text>
                </MenubarItem>
                <MenubarItem>
                  <Text>Find Previous</Text>
                </MenubarItem>
              </Animated.View>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>
            <Text>Cut</Text>
          </MenubarItem>
          <MenubarItem>
            <Text>Copy</Text>
          </MenubarItem>
          <MenubarItem>
            <Text>Paste</Text>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu value="view">
        <MenubarTrigger onPress={closeSubs}>
          <Text>View</Text>
        </MenubarTrigger>
        <MenubarContent insets={contentInsets}>
          <MenubarCheckboxItem
            checked={isChecked}
            onCheckedChange={setIsChecked}
            closeOnPress={false}>
            <Text>Always Show Bookmarks Bar</Text>
          </MenubarCheckboxItem>
          <MenubarCheckboxItem
            checked={isChecked2}
            onCheckedChange={setIsChecked2}
            closeOnPress={false}>
            <Text>Always Show Full URLs</Text>
          </MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarItem inset>
            <Text>Reload</Text>
            <MenubarShortcut>⌘R</MenubarShortcut>
          </MenubarItem>
          <MenubarItem disabled inset>
            <Text>Force Reload</Text>
            <MenubarShortcut>⇧⌘R</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem inset>
            <Text>Toggle Fullscreen</Text>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem inset>
            <Text>Hide Sidebar</Text>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu value="profile">
        <MenubarTrigger onPress={closeSubs}>
          <Text>Profiles</Text>
        </MenubarTrigger>
        <MenubarContent insets={contentInsets}>
          <MenubarRadioGroup value={radio} onValueChange={setRadio}>
            <MenubarRadioItem closeOnPress={false} value="andy">
              <Text>Andy</Text>
            </MenubarRadioItem>
            <MenubarRadioItem closeOnPress={false} value="michael">
              <Text>Michael</Text>
            </MenubarRadioItem>
            <MenubarRadioItem closeOnPress={false} value="creed">
              <Text>Creed</Text>
            </MenubarRadioItem>
          </MenubarRadioGroup>
          <MenubarSeparator />
          <MenubarItem inset>
            <Text>Edit...</Text>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem inset>
            <Text>Add Profile...</Text>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
