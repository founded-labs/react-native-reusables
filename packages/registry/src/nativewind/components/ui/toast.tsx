import { Text } from '@/registry/nativewind/components/ui/text';
import { Icon } from '@/registry/nativewind/components/ui/icon';
import { Portal } from '@rn-primitives/portal';
import * as ToastPrimitive from '@rn-primitives/toast';
import { AlertTriangle, Check, Info, X } from 'lucide-react-native';
import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  FadeInDown,
  FadeOutDown,
  FadeInUp,
  FadeOutUp,
  LinearTransition,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { create } from 'zustand';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ToastType = 'default' | 'success' | 'error' | 'info' | 'warning';
type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

type ToastData = {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
  duration?: number;
  action?: {
    label: string;
    onPress: () => void;
  };
};

interface ToastState {
  toasts: ToastData[];
  config: {
    limit: number;
    duration: number;
  };
  add: (data: Omit<ToastData, 'id'>) => string;
  update: (id: string, data: Partial<Omit<ToastData, 'id'>>) => void;
  dismiss: (id: string) => void;
  setConfig: (config: Partial<ToastState['config']>) => void;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

const toastTimers = new Map<string, NodeJS.Timeout>();

const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  config: {
    limit: 3, // Default limit
    duration: 4000,
  },

  setConfig: (newConfig) =>
    set((state) => ({
      config: { ...state.config, ...newConfig },
    })),

  add: (data) => {
    const { config, toasts } = get();
    const id = Math.random().toString(36).substring(7);
    const duration = data.duration ?? config.duration;

    // Add to store and enforce limit
    // We append new toasts to the end. The UI determines render order.
    const newToasts = [...toasts, { ...data, id, duration }];

    // If we exceed limit, remove the oldest (first in array)
    if (newToasts.length > config.limit) {
      const oldestId = newToasts[0].id;
      // Clear timer for the dismissed toast
      const timer = toastTimers.get(oldestId);
      if (timer) clearTimeout(timer);
      toastTimers.delete(oldestId);
      newToasts.shift();
    }

    set({ toasts: newToasts });

    if (duration !== Infinity) {
      const timer = setTimeout(() => {
        get().dismiss(id);
      }, duration);
      toastTimers.set(id, timer);
    }

    return id;
  },

  update: (id, data) => {
    if (data.duration) {
      const existingTimer = toastTimers.get(id);
      if (existingTimer) clearTimeout(existingTimer);

      if (data.duration !== Infinity) {
        const timer = setTimeout(() => {
          useToastStore.getState().dismiss(id);
        }, data.duration);
        toastTimers.set(id, timer);
      }
    }

    set((state) => ({
      toasts: state.toasts.map((t) => (t.id === id ? { ...t, ...data } : t)),
    }));
  },

  dismiss: (id) => {
    const timer = toastTimers.get(id);
    if (timer) clearTimeout(timer);
    toastTimers.delete(id);

    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
}));

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

function toast(title: string, opts?: Partial<Omit<ToastData, 'id' | 'title' | 'type'>>) {
  return useToastStore.getState().add({ title, type: 'default', ...opts });
}

toast.success = (title: string, opts?: Partial<Omit<ToastData, 'id' | 'title' | 'type'>>) =>
  useToastStore.getState().add({ title, type: 'success', ...opts });

toast.error = (title: string, opts?: Partial<Omit<ToastData, 'id' | 'title' | 'type'>>) =>
  useToastStore.getState().add({ title, type: 'error', ...opts });

toast.info = (title: string, opts?: Partial<Omit<ToastData, 'id' | 'title' | 'type'>>) =>
  useToastStore.getState().add({ title, type: 'info', ...opts });

toast.warning = (title: string, opts?: Partial<Omit<ToastData, 'id' | 'title' | 'type'>>) =>
  useToastStore.getState().add({ title, type: 'warning', ...opts });

toast.promise = <T,>(
  promise: Promise<T>,
  messages: { loading: string; success: string; error: string },
  opts?: Partial<Omit<ToastData, 'id' | 'title' | 'type'>>
): Promise<T> => {
  const id = useToastStore.getState().add({
    title: messages.loading,
    ...opts,
    type: 'default',
    duration: Infinity,
  });

  return promise
    .then((result) => {
      useToastStore.getState().update(id, {
        title: messages.success,
        type: 'success',
        duration: useToastStore.getState().config.duration,
      });
      return result;
    })
    .catch((error) => {
      useToastStore.getState().update(id, {
        title: messages.error,
        type: 'error',
        duration: useToastStore.getState().config.duration,
      });
      throw error;
    });
};

toast.dismiss = (id: string) => useToastStore.getState().dismiss(id);

export { toast };

// ---------------------------------------------------------------------------
// Component Helpers
// ---------------------------------------------------------------------------

// Map position to styles
const getPositionStyle = (position: ToastPosition, insets: { top: number; bottom: number }) => {
  switch (position) {
    case 'top-left':
      return { top: insets.top + 10, left: 16, width: 320 };
    case 'top-center':
      return { top: insets.top + 10, left: 16, right: 16 };
    case 'top-right':
      return { top: insets.top + 10, right: 16, width: 320 };
    case 'bottom-left':
      return { bottom: insets.bottom + 10, left: 16, width: 320 };
    case 'bottom-center':
      return { bottom: insets.bottom + 10, left: 16, right: 16 };
    case 'bottom-right':
      return { bottom: insets.bottom + 10, right: 16, width: 320 };
    default:
      return { top: insets.top + 10, left: 16, right: 16 };
  }
};

// Map type to border colors
const getTypeStyles = (type: ToastType) => {
  switch (type) {
    case 'success':
      return 'border-l-green-500';
    case 'error':
      return 'border-l-red-500';
    case 'warning':
      return 'border-l-amber-500';
    case 'info':
      return 'border-l-blue-500';
    default:
      return 'border-l-primary/50';
  }
};

// Subtle Animation Config
// Damping 30 + Mass 0.8 = Snappy but not "springy/bouncy"
const LAYOUT_ANIMATION = LinearTransition.springify().damping(30).mass(0.8).stiffness(200);
const ENTER_ANIMATION_DOWN = FadeInDown.springify().damping(30).mass(0.8).stiffness(200);
const ENTER_ANIMATION_UP = FadeInUp.springify().damping(30).mass(0.8).stiffness(200);
const EXIT_ANIMATION_DOWN = FadeOutDown.springify().damping(30).mass(0.8).stiffness(200);
const EXIT_ANIMATION_UP = FadeOutUp.springify().damping(30).mass(0.8).stiffness(200);

// ---------------------------------------------------------------------------
// Toaster Component
// ---------------------------------------------------------------------------

interface ToasterProps {
  position?: ToastPosition;
  limit?: number;
  duration?: number;
}

export function Toaster({ position = 'top-center', limit = 3, duration = 4000 }: ToasterProps) {
  const { toasts, dismiss, setConfig } = useToastStore();
  const insets = useSafeAreaInsets();

  // Sync props to store config
  useEffect(() => {
    setConfig({ limit, duration });
  }, [limit, duration, setConfig]);

  if (toasts.length === 0) return null;

  // Determine stack direction based on position (Top positions stack down, Bottom positions stack up)
  const isBottom = position.startsWith('bottom');

  // Ensure we sort toasts correctly for the stack direction
  // For bottom toasts, we often want the newest one at the bottom (visually closest to edge)
  const sortedToasts = isBottom ? [...toasts] : [...toasts].reverse();

  return (
    <Portal name="toast-portal">
      <View
        pointerEvents="box-none"
        // Use flex-col-reverse for bottom to make them stack upwards from the bottom edge
        className={`absolute z-50 gap-2 ${isBottom ? 'flex-col-reverse' : 'flex-col'}`}
        style={getPositionStyle(position, insets)}>
        {sortedToasts.map((t) => (
          <Animated.View
            key={t.id}
            layout={LAYOUT_ANIMATION}
            entering={isBottom ? ENTER_ANIMATION_UP : ENTER_ANIMATION_DOWN}
            exiting={isBottom ? EXIT_ANIMATION_UP : EXIT_ANIMATION_DOWN}>
            <ToastPrimitive.Root
              open={true}
              onOpenChange={(open) => {
                if (!open) dismiss(t.id);
              }}
              // Added border-l-4 and dynamic color class
              className={`bg-background border-border shadow-foreground/5 flex-row items-center justify-between rounded-xl border border-l-4 p-4 shadow-xl ${getTypeStyles(t.type)}`}>
              <View className="flex-1 flex-row items-center gap-3">
                <View>
                  {t.type === 'success' && (
                    <Icon as={Check} className="text-green-500 size-5 stroke-[1.5px]" />
                  )}
                  {t.type === 'error' && (
                    <Icon as={AlertTriangle} className="text-destructive size-5 stroke-[1.5px]" />
                  )}
                  {t.type === 'warning' && (
                    <Icon as={AlertTriangle} className="text-amber-500 size-5 stroke-[1.5px]" />
                  )}
                  {t.type === 'info' && (
                    <Icon as={Info} className="text-blue-500 size-5 stroke-[1.5px]" />
                  )}
                  {t.type === 'default' && (
                    <Icon as={Info} className="text-foreground size-5 stroke-[1.5px]" />
                  )}
                </View>

                <View className="flex-1 gap-1">
                  <ToastPrimitive.Title className="text-foreground text-sm font-semibold">
                    {t.title}
                  </ToastPrimitive.Title>
                  {t.description && (
                    <ToastPrimitive.Description className="text-muted-foreground text-sm">
                      {t.description}
                    </ToastPrimitive.Description>
                  )}
                </View>
              </View>

              {t.action && (
                <ToastPrimitive.Action
                  className="bg-primary ml-3 rounded px-3 py-1.5"
                  onPress={t.action.onPress}>
                  <Text className="text-primary-foreground text-xs font-semibold">
                    {t.action.label}
                  </Text>
                </ToastPrimitive.Action>
              )}

              {!t.action && (
                <ToastPrimitive.Close className="active:bg-secondary rounded-full p-1">
                  <Icon as={X} className="text-foreground size-5 stroke-[1.5px]" />
                </ToastPrimitive.Close>
              )}
            </ToastPrimitive.Root>
          </Animated.View>
        ))}
      </View>
    </Portal>
  );
}
