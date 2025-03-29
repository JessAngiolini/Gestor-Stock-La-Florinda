import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";

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
    { title: "Inventario", icon: "clipboard-list", screen: "GetProducts", colors: ["#8E2DE2", "#4A00E0"] },
    { title: "Agregar Producto", icon: "plus-box", screen: "AddProduct", colors: ["#FF512F", "#DD2476"] },
    { title: "Actualizar Precios", icon: "currency-usd", screen: "updateProduct", colors: [ "#93F9B9", "#1D976C"] },
    { title: "Venta", icon: "cart", screen: "Transaction", colors: ["#FF0099", "#DD02F7"] },
    { title: "Compra", icon: "truck-fast", screen: "PurchaseScreen", colors: ["#36D1DC", "#024CF7"] },
    { title: "Detalles Venta", icon: "file-chart", screen: "SalesDetail", colors: [ "#F09819", "#FF512F"] },
    { title: "Alertas", icon: "bell-alert", screen: "SalesDetail", colors: [ "#FF6A00", "#EE0979"] },
    { title: "Detalles Compra", icon: "file-document", screen: "SalesDetail", colors: [ "#2E3192", "#1BFFFF"] },
    
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate(item.screen)} style={styles.buttonContainer}>
      <LinearGradient colors={item.colors} style={styles.button}>
        <Icon name={item.icon} size={55} color="#FFFFFF" />
        <Text style={styles.buttonText}>{item.title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <>
    <StatusBar style="light" />
    <LinearGradient colors={["#111026", "#332D59"]} style={styles.container}>
      <Text style={styles.title}>Gestión de Stock</Text>
      <FlatList
        data={menuItems}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={{ paddingBottom: 50 }} 
      />
    </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: 50, 
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
    marginTop: 80,
    marginBottom: 20,
    color: "#fff",
    fontFamily: "Roboto-Condensed",
  },
  row: {
    justifyContent: "space-between",
    gap: 2,
  },
  buttonContainer: {
    width: "45%",
    aspectRatio: 1,
    margin: 10,
    borderRadius: 10,
    overflow: "hidden", // Para que el degradado respete las esquinas redondeadas
  },
  button: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 5,
    textAlign: "center",
    fontFamily: "Roboto-Condensed",
  },
});

export default HomeScreen;


 