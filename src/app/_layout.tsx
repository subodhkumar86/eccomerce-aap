import { DarkTheme, DefaultTheme, ThemeProvider, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';
import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { StoreProvider } from '@/context/StoreContext';
import ToastOverlay from '@/components/ToastOverlay';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <StoreProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AnimatedSplashOverlay />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="product/[id]" options={{ presentation: 'card' }} />
          <Stack.Screen name="checkout/success" />
          <Stack.Screen name="orders/[id]" />
          <Stack.Screen name="orders/track" />
          <Stack.Screen name="promo/index" />
          <Stack.Screen name="promo/spin" />
          <Stack.Screen name="support/index" />
          <Stack.Screen name="support/chat" />
          <Stack.Screen name="notifications/index" />
          <Stack.Screen name="profile/vip" />
          <Stack.Screen name="profile/addresses" />
          <Stack.Screen name="profile/payments" />
          <Stack.Screen name="profile/orders" />
          <Stack.Screen name="search/index" />
          <Stack.Screen name="promo/scratch" />
        </Stack>
        <ToastOverlay />
      </ThemeProvider>
    </StoreProvider>
  );
}
