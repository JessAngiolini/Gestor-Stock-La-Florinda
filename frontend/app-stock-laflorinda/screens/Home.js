import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useFonts } from 'expo-font';

const HomeScreen = () => {
  const navigation = useNavigation();

  // Cargar la fuente correctamente
  const [fontsLoaded] = useFonts({
    "Roboto-Condensed": require("../assets/fonts/RobotoCondensed-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0AA689" />
      </View>
    );
  }

  const menuItems = [
    { title: "Inventario", icon: "clipboard-list", screen: "GetProducts", color: "#332D59" },
    { title: "Agregar Producto", icon: "plus-box", screen: "AddProduct", color: "#332D59" },
    { title: "Actualizar Precios", icon: "currency-usd", screen: "updateProduct", color: "#332D59" },
    { title: "Venta", icon: "cart", screen: "Transaction", color: "#332D59" },
    { title: "Compra", icon: "basket", screen: "PurchaseScreen", color: "#332D59" },
    { title: "Detalles Venta", icon: "playlist-edit", screen: "SalesDetail", color: "#332D59" },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.button, { backgroundColor: item.color }]} 
      onPress={() => navigation.navigate(item.screen)}
    >
      <Icon name={item.icon} size={55} color="#0AA689" />
      <Text style={styles.buttonText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestión de Stock</Text>
      <FlatList
        data={menuItems}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111026",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111026",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 40,
    marginBottom: 20,
    color: "#0AA689",
    fontFamily: "Roboto-Condensed",
  },
  row: {
    justifyContent: "space-between",
    gap: 2,
  },
  button: {
    width: "45%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
    borderRadius: 10,
    shadowColor: "#5e52a8",
    shadowOffset: {
      width: 4,
      height: 4
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5, 
  },
  buttonText: {
    color: "#D0D2D9",
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 5,
    textAlign: "center",
    fontFamily: "Roboto-Condensed",
  },
});

export default HomeScreen;



 