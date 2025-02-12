import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const Widget = ({ title, content, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.cardTitle}>{title}</Text>
      {content.map((item, index) => (
        <Text key={index} style={styles.cardContent}>
          {item}
        </Text>
      ))}
    </TouchableOpacity>
  );
};

export default Widget;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#a9cebd',
    padding: 16,
    marginBottom: 16,
    borderRadius: 15,
    borderColor: '#4f6d7a',
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardContent: {
    fontSize: 16,
  },
});
