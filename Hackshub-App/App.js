import React from 'react';
import { StatusBar, LogBox } from 'react-native';
import Navigation from './Navigation';
import 'react-native-gesture-handler';
import { Provider } from 'react-redux'; // Import the Provider component
import Store from './State/Store.jsx';

// Ignore specific warning
LogBox.ignoreLogs(['Warning: TextElement: Support for defaultProps will be removed from function components in a future major release']);
LogBox.ignoreLogs(['Warning: Failed prop type: Invalid prop `textStyle` of type `array` supplied to `Cell`, expected `object`']);
LogBox.ignoreLogs(['Warning: Failed prop type: Invalid prop `style` of type `array` supplied to `Table`, expected `object`']);


const App = () => {
  return (
    <Provider store={Store}>
      <StatusBar />
      <Navigation />
    </Provider>
  );
}

export default App;
