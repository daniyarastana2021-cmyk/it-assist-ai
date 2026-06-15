import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import EmployeeNavigator from './EmployeeNavigator';

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <EmployeeNavigator />
    </NavigationContainer>
  );
}
