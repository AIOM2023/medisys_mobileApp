import React from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';

function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <RootNavigator />
    </SafeAreaView>
  );
}

export default App;
