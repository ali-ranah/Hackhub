import React from 'react';
import { View, ScrollView } from 'react-native';
import Header from '../src/Components/Header/Header';

const Layout = ({ children }) => {
  return (
    <View className="flex h-screen overflow-hidden">
      {/* Header */}
      <View className="flex-grow">
        <Header />
      </View>

      {/* Content */}
      <ScrollView className="flex-grow overflow-y-auto">
        {children}
      </ScrollView>
    </View>
  );
};

export default Layout;
