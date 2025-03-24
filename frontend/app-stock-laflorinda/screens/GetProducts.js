import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Alert, FlatList, StyleSheet, Touchable, TouchableOpacity } from "react-native";
import { Button, Dialog, Portal, Provider, TextInput as PaperInput, ActivityIndicator } from "react-native-paper";
import { getProducts, searchProduct, updateProduct, deleteProduct } from "../api/api.js";
import {useFonts} from "expo-font";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";



function GetProductsScreen() {

  const [fontLoaded] = useFonts ({
    "Roboto-Condensed": require("../assets/fonts/RobotoCondensed-Regular.ttf"),
  })
  if(!fontLoaded){
    return(
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0AA689"/>
      </View>
    )
    
  }
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedQuantity, setEditedQuantity] = useState("");
  const [editedPrice, setEditedPrice] = useState("");

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
      loadProducts();
    } else {
      const results = await searchProduct(query);
      setProducts(results);
    }
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setEditedName(product.name);
    setEditedQuantity(product.quantity.toString());
    setEditedPrice(product.price.toString());
    setEditDialogVisible(true);
  };

  const handleSaveEdit = async () => {
    if (!editedName || !editedQuantity || !editedPrice) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    try {
      await updateProduct(selectedProduct.id, {
        name: editedName,
        quantity: parseInt(editedQuantity, 10),
        price: parseFloat(editedPrice),
      });

      Alert.alert("Éxito", "Producto actualizado correctamente.");
      setEditDialogVisible(false);
      loadProducts();
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el producto.");
      console.error("Error al actualizar producto:", error);
    }
  };

  const handleDeleteProduct = (productId) => {
    Alert.alert(
      "Eliminar producto",
      "¿Estás seguro de que deseas eliminar este producto?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              await deleteProduct(productId);
              Alert.alert("Éxito", "Producto eliminado correctamente.");
              loadProducts();
            } catch (error) {
              Alert.alert("Error", "No se pudo eliminar el producto.");
              console.error("Error al eliminar producto:", error);
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <Provider>
      <View style={styles.container}>
        <Text style={styles.title}>Inventario</Text>

        <TextInput
          style={styles.searchInput}
          placeholder="Buscar productos"
          placeholderTextColor="#D0D2D9"
          value={searchQuery}
          onChangeText={handleSearch}
        />

        {/*Lista de productos */}
        {/* <View style={styles.tableHeader}>
          <Text style={[styles.headerText, { flex: 2 }]}>Nombre</Text>
          <Text style={[styles.headerText, { flex: 1 }]}>Cant.</Text>
          <Text style={[styles.headerText, { flex: 1 }]}>Precio</Text>
          <Text style={[styles.headerText, { flex: 1 }]}>Acciones</Text>
        </View> */}

        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <View style={styles.cardContent}>
              <View style={styles.cardBody}>
                <Text style={styles.infoText}>Stock: {item.quantity}</Text>
                <Text style={styles.infoText}>Precio: 
            ${parseFloat(item.price).toFixed(2)}</Text>
            </View>
            <View style={styles.cardFooter}> 
             <TouchableOpacity style={styles.actionButton} onPress={()=> handleEditProduct(item)}>
            <Icon name="pencil" size={20} color="#111026"/>
             </TouchableOpacity>
             <TouchableOpacity style={[styles.actionButton,   styles.deleteButton]} onPress={()=> handleDeleteProduct(item)}>
              <Icon name="delete" size={20} color="#111026" />
             </TouchableOpacity>
            </View> 
            </View>   
            </View>
            </View>
          )}
        />

        {/* Modal de Edición */}
        <Portal>
          <Dialog style={styles.dialogEdit} visible={editDialogVisible} onDismiss={() => setEditDialogVisible(false)}>
            <Dialog.Title style={styles.dialogTitle}>Editar Producto</Dialog.Title>
            <Dialog.Content>
              <View style={styles.inputContainer}>
              <PaperInput
                label="Nombre"
                value={editedName}
                onChangeText={setEditedName}
                mode="outlined"
                style={styles.input}
              />
              <PaperInput
                label="Cantidad"
                value={editedQuantity}
                keyboardType="numeric"
                onChangeText={setEditedQuantity}
                mode="outlined"
                style={styles.input}
              />
              <PaperInput
                label="Precio"
                value={editedPrice}
                keyboardType="numeric"
                onChangeText={setEditedPrice}
                mode="outlined"
                style={styles.input}
              />
              </View>
            </Dialog.Content>
            <Dialog.Actions style={styles.dialogActions}>
              <Button onPress={() => setEditDialogVisible(false)}>Cancelar</Button>
              <Button mode="contained" onPress={handleSaveEdit} style={styles.saveButton}>Guardar</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111026",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    color: "#0AA689",
    fontFamily: "Roboto-Condensed",
  },
  searchInput: {
    backgroundColor: "#332D59",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#000",
    fontSize: 16,
    color: "#fff",
  },
  /* tableHeader: {
    flexDirection: "row",
    backgroundColor: "#ddd",
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 5,
  },
  headerText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    alignItems: "center",
  },
  cellText: {
    fontSize: 16,
    textAlign: "center",
  }, */
  card: {
    backgroundColor: '#332D59',
    padding:15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {width: 2, height:2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginBottom: 15,
  },
  cardHeader: {
    borderBottonWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 8,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  /* PROBANDO SI QUEDAN EN EL MISMO ESPACIO EL CONTENIDO Y LOS BOTONES */
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardBody: {
    flexDirection: "column",
  },
  infoText: {
    fontSize: 18,
    color: "#fff",
    marginTop: 15,
  },
  cardFooter:{
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  actionButton: {
    backgroundColor: "#0AA689",
    padding: 15,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  deleteButton: {
    backgroundColor: "#D9534F",
    
  },
  dialogEdit: {
    backgroundColor: "#D0D2D9",
    borderRadius: 10,
    padding: 10,
    
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: "bold",
    fontWeight: "bold",
    color: "#332D59",
    textAling: "center",
  },
  inputContainer: {
    gap:10,
  },
  input: {
    backgroundColor: "#D0D2D9",
  },
  dialogActions: {
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  saveButton: {
    backgroundColor: "#0AA689",
    padding: 5,
    borderRadius: 20,
    
  },
});

export default GetProductsScreen;

  