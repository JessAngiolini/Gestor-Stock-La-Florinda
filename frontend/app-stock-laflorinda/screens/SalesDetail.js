import { View, Text, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

const SalesHistoryScreen = () => {
  return (
    <View style={styles.container}>
      <LottieView 
        source={require('../assets/PantallaEnProceso.json')} 
        autoPlay 
        loop 
        style={styles.animation}
      />
      <Text style={styles.text}>Estamos trabajando en esta sección 🚧 </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  animation: {
    width: 250,
    height: 250,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
  },
});

export default SalesHistoryScreen;

