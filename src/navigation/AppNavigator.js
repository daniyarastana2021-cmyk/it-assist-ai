import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { USER_ROLES } from '../config/constants';
import LoadingScreen from '../components/common/LoadingScreen';
import AuthNavigator from './AuthNavigator';
import EmployeeNavigator from './EmployeeNavigator';
import EngineerNavigator from './EngineerNavigator';

export default function AppNavigator() {
  const { user, profile, loading } = useAuth();

  if (loading) return <LoadingScreen message="IT Assist AI..." />;

  const role = profile?.role || USER_ROLES.EMPLOYEE;

  return (
    <NavigationContainer>
      {!user ? (
        <AuthNavigator />
      ) : role === USER_ROLES.ENGINEER || role === USER_ROLES.ADMIN ? (
        <EngineerNavigator />
      ) : (
        <EmployeeNavigator />
      )}
    </NavigationContainer>
  );
}
