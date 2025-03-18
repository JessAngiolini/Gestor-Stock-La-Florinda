import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList } from "react-native";
import { getProducts, searchProducts, updatePrices } from "../api/api.js";

function HomeScreen() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

    const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error cargando productos:", error);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      loadProducts(); // Si está vacío, recarga todos los productos
    } else {
      const results = await searchProducts(query);
      setProducts(results);
    }
  };

  const handleUpdatePrices = async () => {
    const response = await updatePrices("maceta", 10); // Ejemplo: aumentar 10% a "maceta"
    console.log(response);
    loadProducts(); // Recargar la lista
  };

  return (
    <View>
      <Text>Lista de productos:</Text>

      <TextInput
        placeholder="Buscar productos..."
        value={searchQuery}
        onChangeText={handleSearch}
        style={{ borderBottomWidth: 1, padding: 8, marginBottom: 10 }}
      />


      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text>{item.name} - {item.quantity} - ${item.price}  </Text>
        )}
      />
    
    </View>
  );
}

export default HomeScreen;