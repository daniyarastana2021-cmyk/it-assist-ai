import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import HomeScreen from '../screens/employee/HomeScreen';
import AIServiceDeskScreen from '../screens/employee/AIServiceDeskScreen';
import MyTicketsScreen from '../screens/employee/MyTicketsScreen';
import NewTicketScreen from '../screens/employee/NewTicketScreen';
import KnowledgeBaseScreen from '../screens/employee/KnowledgeBaseScreen';
import ArticleScreen from '../screens/employee/ArticleScreen';
import ProfileScreen from '../screens/employee/ProfileScreen';
import TicketDetailScreen from '../screens/engineer/TicketDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabIcon({ emoji, focused, color }) {
  return (
    <Text style={{ fontSize: focused ? 22 : 20, opacity: focused ? 1 : 0.6 }}>{emoji}</Text>
  );
}

function TicketsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MyTickets" component={MyTicketsScreen} />
      <Stack.Screen name="NewTicket" component={NewTicketScreen} />
      <Stack.Screen name="TicketDetail" component={TicketDetailScreen} />
    </Stack.Navigator>
  );
}

function KBStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="KnowledgeBase" component={KnowledgeBaseScreen} />
      <Stack.Screen name="Article" component={ArticleScreen} />
    </Stack.Navigator>
  );
}

export default function EmployeeNavigator() {
  const { colors, scheme } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          paddingBottom: 4,
          height: 60,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textDisabled,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Главная',
          tabBarIcon: ({ focused, color }) => <TabIcon emoji="🏠" focused={focused} color={color} />,
        }}
      />
      <Tab.Screen
        name="AITab"
        component={AIServiceDeskScreen}
        options={{
          tabBarLabel: 'AI Помощник',
          tabBarIcon: ({ focused, color }) => <TabIcon emoji="🤖" focused={focused} color={color} />,
        }}
      />
      <Tab.Screen
        name="TicketsTab"
        component={TicketsStack}
        options={{
          tabBarLabel: 'Заявки',
          tabBarIcon: ({ focused, color }) => <TabIcon emoji="🎫" focused={focused} color={color} />,
        }}
      />
      <Tab.Screen
        name="KBTab"
        component={KBStack}
        options={{
          tabBarLabel: 'База знаний',
          tabBarIcon: ({ focused, color }) => <TabIcon emoji="📚" focused={focused} color={color} />,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Профиль',
          tabBarIcon: ({ focused, color }) => <TabIcon emoji="👤" focused={focused} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}
