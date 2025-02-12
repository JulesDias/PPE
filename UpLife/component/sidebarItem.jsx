// components/MenuItem.jsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const SidebarItem = ({ title, navigate, url }) => {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={() => navigate(url)}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    paddingVertical: 15,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
});

export default SidebarItem;
