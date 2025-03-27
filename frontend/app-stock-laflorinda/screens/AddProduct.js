import React, { useState } from "react";
import { View, Text, TextInput, Alert, TouchableOpacity, StyleSheet } from "react-native";
import { Button, Dialog, Portal, Provider, TextInput as PaperInput } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import { addProduct } from "../api/api";

function  AddProductScreen({ navigation }) {
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
    <Provider>
      <LinearGradient colors={["#FFF", "#DDD"]} 
      
      style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="chevron-left" size={30} style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.title}>Agregar Producto</Text>
        </View>
        <Text style={styles.subtitle}>Registra nuevos productos para mantener tu inventario actualizado. Ingresa la cantidad y el precio correctamente.</Text>
       
        <View style={styles.inputContainer}>
          <PaperInput
            label="Nombre"
            value={name}
            onChangeText={setName}
            mode="outlined"
             placeholder="Ingrese el nombre del producto"
            style={styles.input}
           
          />
          <PaperInput
            label="Cantidad"
            value={quantity}
            keyboardType="numeric"
            onChangeText={setQuantity}
            mode="outlined"
             placeholder="Ingrese la cantidad"
            style={styles.input}
          
          />
          <PaperInput
            label="Precio"
            value={price}
            keyboardType="numeric"
            onChangeText={setPrice}
            mode="outlined"
             placeholder="Ingrese el precio unitario"
            style={styles.input}
          />
        </View>
        <Button
          mode="contained"
          onPress={handleAddProduct}
          style={styles.saveButton}
         
        >
          Guardar
        </Button>
      </LinearGradient>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EAEAEA", // Fondo gris suave
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 50,
  },
  backIcon: {
    color: "#332D59",
  },
  title: {
    fontSize: 20,
    color: "#332D59",
    marginLeft: 10,
  },
  inputContainer: {
    flex: 1,
    justifyContent: "flex-start",
    
    marginBottom: 15,
    
    
  },
  input: {
    marginBottom: 15,
    
    
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    
   
  },
  saveButton: {
    backgroundColor: "#1D976C",
    marginBottom: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  subtitle: {
    fontSize: 15,
    color: "#332D59",
    marginBottom: 20,
    marginLeft: 10,
  },
});

export default AddProductScreen;