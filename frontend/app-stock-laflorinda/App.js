

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/Home";
import AddProductScreen from "./screens/AddProduct"; 
import GetProductsScreen from "./screens/GetProducts";
import UpdatePricesScreen from "./screens/UpdateProduct";

import  TransactionScreen  from "./screens/Transaction";


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="GetProducts" component={GetProductsScreen} />
        <Stack.Screen name="AddProduct" component={AddProductScreen} />
        <Stack.Screen name="UpdateProduct" component={UpdatePricesScreen} /> 
        <Stack.Screen name="Transaction" component={TransactionScreen} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
}

