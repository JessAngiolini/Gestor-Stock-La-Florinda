import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList } from "react-native";
import { getProducts, updatePrices } from "../api/api.js";

function HomeScreen() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
  
    try {
        const data = await getProducts();
        console.log("Productos cargados:", data);  // Asegúrate de que esto imprima los productos
        setProducts(data);
      } catch (error) {
        console.error("Error cargando productos:", error);
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
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text>{item.name} - ${item.quantity} - ${item.price}  </Text>
        )}
      />
      <Button title="Actualizar precios" onPress={handleUpdatePrices} />
    </View>
  );
}

export default HomeScreen;