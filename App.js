import 'react-native-gesture-handler';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

class ErrorBoundary extends React.Component {
  state = { error: null };
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <View style={styles.error}>
          <Text style={styles.errorTitle}>IT Assist AI</Text>
          <Text style={styles.errorText}>
            Не удалось загрузить приложение.{'\n'}
            Настройте Firebase в Settings → Secrets.
          </Text>
          <Text style={styles.errorDetail}>{this.state.error.message}</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

function Root() {
  const { scheme } = useTheme();
  return (
    <>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Root />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  error: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#0F6CBD', padding: 32,
  },
  errorTitle: {
    color: '#fff', fontSize: 28, fontWeight: '800', marginBottom: 16,
  },
  errorText: {
    color: 'rgba(255,255,255,0.9)', fontSize: 16, textAlign: 'center', marginBottom: 24,
  },
  errorDetail: {
    color: 'rgba(255,255,255,0.5)', fontSize: 12, textAlign: 'center',
  },
});
