import { useReactiveGetCookie, useReactiveSetCookie } from 'cookies-next';

export function useStylingLibrary() {
  const getCookie = useReactiveGetCookie();
  const setCookie = useReactiveSetCookie();
  const stylingLibrary = getCookie('user.styling-library') ?? 'nativewind';
  function onIntegrationChange(value: string) {
    setCookie('user.styling-library', value === 'uniwind' ? 'uniwind' : 'nativewind');
  }

  return [stylingLibrary, onIntegrationChange] as const;
}
