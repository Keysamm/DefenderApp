import React from 'react';
import {StyleSheet} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import {CanvasScreen} from './screen/CanvasScreen';

/**
 * Hide the navigation bar for Android devices.
 */
SystemNavigationBar.stickyImmersive();

export function App(): JSX.Element {
  return (
    <GestureHandlerRootView style={styles.fullFlex}>
      <SafeAreaProvider>
        <CanvasScreen />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
const styles = StyleSheet.create({
  fullFlex: {
    flex: 1,
  },
});
