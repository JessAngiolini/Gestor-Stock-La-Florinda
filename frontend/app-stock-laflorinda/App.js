
  import React from "react";
  import { NavigationContainer } from "@react-navigation/native";
  import { createNativeStackNavigator } from "@react-navigation/native-stack";
  import HomeScreen from "./screens/Home";
  import { Provider as PaperProvider } from "react-native-paper";
  import AddProductScreen from "./screens/AddProduct"; 
  import GetProductsScreen from "./screens/GetProducts";
  import  TransactionScreen  from "./screens/Transaction";
  import PurchaseScreen from "./screens/PurchaseScreen";
  import UpdatePricesScreen from "./screens/updateProduct";
  import SalesHistoryScreen from "./screens/SalesDetail";

  const Stack = createNativeStackNavigator();

  export default function App() {
    return (
      <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ 
          headerShown: false,
         }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="GetProducts" component={GetProductsScreen} />
          <Stack.Screen name="AddProduct" component={AddProductScreen} />
          <Stack.Screen name="updateProduct" component={UpdatePricesScreen} /> 
          <Stack.Screen name="Transaction" component={TransactionScreen} /> 
          <Stack.Screen name="PurchaseScreen" component={PurchaseScreen} />
          <Stack.Screen name="SalesDetail" component={SalesHistoryScreen} options={{ title: "Historial de Ventas" }} />
        </Stack.Navigator>
      </NavigationContainer>
      </PaperProvider>
    );
  }

