import React, { useState } from "react";
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { addProduct } from "../api/api.js";
import Icon from 'react-native-vector-icons/FontAwesome'; // Importar íconos
import { Button } from 'react-native-paper'; // Importar Button de react-native-paper

function AddProductScreen({ navigation }) {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");

  const handleAddProduct = async () => {
    if (!name || !quantity || !price) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    const newProduct = {
      name,
      quantity: parseInt(quantity),
      price: parseFloat(price),
    };

    try {
      await addProduct(newProduct);
      Alert.alert("Éxito", "Producto agregado correctamente");
      navigation.goBack(); // Vuelve a la pantalla anterior
    } catch (error) {
      console.error("Error agregando producto:", error);
      Alert.alert("Error", "No se pudo agregar el producto");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.formContainer}>
        <Text style={styles.title}>Agregar Producto</Text>

        {/* Campo para el nombre del producto */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nombre del Producto:</Text>
          <View style={styles.inputWrapper}>
            <Icon name="tag" size={20} color="#666" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Ingrese el nombre del producto"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>
        </View>

        {/* Campo para la cantidad */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Cantidad:</Text>
          <View style={styles.inputWrapper}>
            <Icon name="plus" size={20} color="#666" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Ingrese la cantidad"
              value={quantity}
              keyboardType="numeric"
              onChangeText={setQuantity}
            />
          </View>
        </View>

        {/* Campo para el precio */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Precio:</Text>
          <View style={styles.inputWrapper}>
            <Icon name="money" size={20} color="#666" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Ingrese el precio"
              value={price}
              keyboardType="numeric"
              onChangeText={setPrice}
            />
          </View>
        </View>

        {/* Botón para agregar el producto */}
        <Button
          mode="contained"
          onPress={handleAddProduct}
          style={styles.button}
          labelStyle={styles.buttonText}
        >
          Agregar Producto
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EAEAEA", // Color de fondo gris suave
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#444",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#D1D1D1",
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    height: 45,
    flex: 1,
    fontSize: 16,
    backgroundColor: "#FFF",
    color: "#333",
  },
  button: {
    backgroundColor: "#F75C5C", // Color de botón en tonos rojos
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    elevation: 5, // Sombra en Android
    shadowColor: "#000", // Sombra en iOS
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});

export default AddProductScreen;

