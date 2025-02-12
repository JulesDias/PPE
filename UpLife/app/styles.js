import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#85baa1',
    borderColor: '#4f6d7a',
    borderWidth: 1,
  },
  headerText: {
    fontSize: 20,
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 20,
  },
  mainContent: {
    padding: 20,
  },
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
  menuContainer: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 250,
    borderRightColor: '#ddd',
    borderRightWidth: 1,
  },
  menuContent: {
    padding: 10,
  },
  menuHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  closeMenu: {
    alignSelf: 'flex-end',
    padding: 10,
    marginTop: 25,
  },
  modalOverlay :{
    flex: 1,
  },
});
