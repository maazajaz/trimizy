import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
// We are no longer using TabBarBackground, but I'll leave the import in case you use it elsewhere.
import { useColorScheme } from '@/hooks/useColorScheme';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

// This custom component remains the same
const CustomTabLabel = ({ label, color, isFocused }: { label: string; color: string; isFocused: boolean }) => (
  <View style={styles.labelContainer}>
    <Text style={[styles.labelText, { color, fontWeight: isFocused ? '700' : '500' }]}>
      {label}
    </Text>
    {isFocused && <View style={[styles.indicator, { backgroundColor: color }]} />}
  </View>
);

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const trimizyRed = '#8c52ff';
  const inactiveGray = '#696969';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: trimizyRed,
        tabBarInactiveTintColor: inactiveGray,
        headerShown: false,
        tabBarButton: HapticTab,
        // REMOVED: The custom tabBarBackground prop is gone to ensure a solid background.
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: '#ffffff', // This will now be respected, creating the solid background.
          borderTopWidth: 1,
          borderTopColor: '#f0f0f0',
          height: Platform.OS === 'ios' ? 95 : 75,
          paddingTop: 10,
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="scooter" color={color} />,
          tabBarLabel: ({ color, focused }) => (
            <CustomTabLabel label="At-home" color={color} isFocused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="scissors" color={color} />,
          tabBarLabel: ({ color, focused }) => (
            <CustomTabLabel label="In-salon" color={color} isFocused={focused} />
          ),
          // NEW: This adds the vertical divider line to the left of this specific tab.
          tabBarItemStyle: {
            borderLeftWidth: 1,
            borderLeftColor: '#f0f0f0',
          },
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  labelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelText: {
    fontSize: 12,
  },
  indicator: {
    width: 30,
    height: 3,
    borderRadius: 2,
    marginTop: 6,
  },
});