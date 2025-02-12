import { View, Text } from 'react-native'
import React from 'react'
import { Tabs, redirect } from 'expo-router'

const TabIcon = ({icon, color, name, focused}) => {
  return (
    <View>
      <Text>test</Text>
    </View>
  )
}

const TabsLayout = () => {
  return (
    <>
    <Tabs>
      <Tabs.Screen 
      name = "home"
      options = {{
        title: 'Home',
        headerShown: false,
        tabBarIcon: ({color, focused })
      }}
      />
    </Tabs>
    </>
  )
}

export default TabsLayout