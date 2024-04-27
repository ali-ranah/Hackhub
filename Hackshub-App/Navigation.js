import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Login from './src/Components/Login/Login';
import Signup from './src/Components/Signup/Signup';
import Header from './src/Components/Header/Header';
import Layout from './Layout/Layout';
import Home from './src/Components/Home/Home';
import EditProfile from './src/Components/EditProfile/EditProfile';
import UpdateProfile from './src/Components/EditProfile/UpdateProfile';



const Stack = createStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
        <Stack.Screen name="UpdateProfile" component={UpdateProfile} options={{ headerShown: false }} />
        <Stack.Screen
          name="Home"
          options={{ headerShown: false }}
        >
          {() => (
            <Layout>
              <Home />
            </Layout>
          )}
        </Stack.Screen>
        <Stack.Screen
  name="Hackathon"
  options={{ headerShown: false }}
>
  {() => (
    <Layout>
      <EditProfile />
    </Layout>
  )}
</Stack.Screen>
<Stack.Screen
          name="Profile"
          options={{ headerShown: false }}
        >
          {() => (
            <Layout>
              <EditProfile />
            </Layout>
          )}
        </Stack.Screen>

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;


