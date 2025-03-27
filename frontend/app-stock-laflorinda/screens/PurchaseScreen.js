import React, { useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { purchaseFromSupplier, searchProduct } from "../api/api";
import Icon from "react-native-vector-icons/FontAwesome"; // Para los iconos
import { Button } from "react-native-paper"; // Para el botón de compra

const PurchaseScreen = () => {
  const [query, setQuery] = useState(""); // Texto ingresado por el usuario
  const [products, setProducts] = useState([]); // Lista de productos filtrados
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState("");

  // Buscar productos en la API
  const handleSearch = async (text) => {
    setQuery(text);
    if (text.length > 1) {
      const results = await searchProduct(text);
      setProducts(results);
    } else {
      setProducts([]);
    }
  };

  // Seleccionar un producto
  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setQuery(product.name); // Muestra el nombre en el input
    setProducts([]); // Oculta la lista
  };

  // Enviar la compra
  const handlePurchase = async () => {
    if (!selectedProduct || !quantity) {
      Alert.alert("Error", "Selecciona un producto y una cantidad");
      return;
    }

    const result = await purchaseFromSupplier(selectedProduct.id, quantity);
    console.log("Resultado de la compra:", result);
    Alert.alert("Éxito", "Compra realizada con éxito");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Realizar Compra</Text>

      {/* Campo de búsqueda */}
      <View style={styles.inputContainer}>
        <Icon name="search" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Buscar producto..."
          value={query}
          onChangeText={handleSearch}
        />
      </View>

      {/* Lista de productos filtrados */}
      {products.length > 0 && (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.productItem} onPress={() => handleSelectProduct(item)}>
              <Text style={styles.productText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Input de cantidad */}
      <View style={styles.inputContainer}>
        <Icon name="shopping-cart" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Cantidad"
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
        />
      </View>

      {/* Botón para realizar la compra */}
      <Button mode="contained" onPress={handlePurchase} style={styles.button} labelStyle={styles.buttonText}>
        Comprar al mayorista
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 45,
    fontSize: 16,
    color: "#333",
  },
  productItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 5,
  },
  productText: {
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#FA86C4", // Color personalizado para el botón
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    shadowColor: "#000", // Sombra en iOS
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5, // Sombra en Android
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default PurchaseScreen;
