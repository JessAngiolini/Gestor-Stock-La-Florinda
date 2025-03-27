import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Modal, Portal, Button, Card, Text } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

const UpdatePricesScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [percentage, setPercentage] = useState("");
  const [originalPrices, setOriginalPrices] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(true);

  // Función para buscar productos
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const response = await fetch(
        `http://192.168.0.161:3000/api/products/search/${searchQuery}`
      );
      const data = await response.json();

      // Guardamos precios originales solo si no están guardados
      if (Object.keys(originalPrices).length === 0) {
        const pricesMap = {};
        data.forEach((product) => {
          pricesMap[product.id] = product.price;
        });
        setOriginalPrices(pricesMap);
      }

      setProducts(data);
    } catch (error) {
      console.error("Error al buscar productos:", error);
    }
  };

  // Función para actualizar precios
  const handleUpdatePrices = async () => {
    const increase = parseFloat(percentage);
    if (isNaN(increase) || increase <= 0) {
      alert("Ingresa un porcentaje válido.");
      return;
    }

    try {
      const updatedProducts = products.map((product) => ({
        ...product,
        price: parseFloat((product.price * (1 + increase / 100)).toFixed(2)),
      }));

      for (const product of updatedProducts) {
        await fetch(`http://192.168.0.161:3000/api/products/${product.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ price: product.price }),
        });
      }

      setProducts(updatedProducts);
      alert("Precios actualizados correctamente.");
    } catch (error) {
      console.error("Error al actualizar precios:", error);
    }
  };

  // Función para deshacer cambios
  const handleUndo = async () => {
    try {
      for (const productId in originalPrices) {
        await fetch(`http://192.168.0.161:3000/api/products/${productId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ price: originalPrices[productId] }),
        });
      }

      const restoredProducts = products.map((product) => ({
        ...product,
        price: originalPrices[product.id],
      }));

      setProducts(restoredProducts);
      alert("Precios restaurados correctamente.");
    } catch (error) {
      console.error("Error al restaurar precios:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Modal de instrucciones */}
      <Portal>
        <Modal
          visible={isModalVisible}
          onDismiss={() => setIsModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Ionicons name="information-circle-outline" size={50} color="#ff5aa4" />
          <Text style={styles.modalTitle}>Instrucciones</Text>
          <Text style={styles.modalText}>
            Escribe el producto y presiona{" "}
            <Ionicons name="arrow-forward-circle" size={20} color="#ff5aa4" />{" "}
            para buscar.
          </Text>
          <Button mode="contained" onPress={() => setIsModalVisible(false)}>
            Entendido
          </Button>
        </Modal>
      </Portal>

      <Text style={styles.title}>Actualizar Precios</Text>

      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.icon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar producto..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Ionicons name="arrow-forward-circle" size={30} color="#ff5aa4" />
        </TouchableOpacity>
      </View>

      {/* Lista de productos */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={() =>
          products.length > 0 ? (
            <View style={styles.tableHeader}>
              <Text style={styles.headerText}>Productos encontrados</Text>
              
              
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <Card style={styles.productItem}>
            <Card.Content>
              <Text variant="titleMedium">{item.name}</Text>
              <Text>Cantidad: {item.quantity}</Text>
              <Text>Precio: ${parseFloat(item.price).toFixed(2)}</Text>
            </Card.Content>
          </Card>
        )}
      />

      {/* Campo para ingresar porcentaje */}
      <Text style={styles.label}>Aumento (%)</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: 10"
        keyboardType="numeric"
        value={percentage}
        onChangeText={setPercentage}
      />

      {/* Botones */}
      <View style={styles.buttonContainer}>
        <Button mode="contained" onPress={handleUndo} style={styles.undoButton}>
          Deshacer
        </Button>
        <Button
          mode="contained"
          onPress={handleUpdatePrices}
          style={styles.updateButton}
        >
          Actualizar Precios
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f4f4", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  icon: { marginRight: 5 },
  searchInput: { flex: 1, height: 40, fontSize: 16 },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 5,
  },
  headerText: { fontWeight: "bold", flex: 1, textAlign: "center" },
  productItem: { marginBottom: 10, backgroundColor: "#fff", borderRadius: 8 },
  label: { fontSize: 16, fontWeight: "bold", marginBottom: 5, marginTop: 10 },
  input: { height: 40, borderColor: "#ccc", borderWidth: 1, borderRadius: 5, paddingLeft: 10 },
  buttonContainer: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  updateButton: { backgroundColor: "#FA86C4" },
  undoButton: { backgroundColor: "#FF5A5A" },
  modalContainer: { backgroundColor: "white", padding: 20, borderRadius: 10, alignItems: "center" },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginVertical: 10 },
  modalText: { fontSize: 16, textAlign: "center", marginBottom: 20 },
});

export default UpdatePricesScreen;
