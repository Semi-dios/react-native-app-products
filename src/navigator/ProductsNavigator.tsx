import {createStackNavigator} from '@react-navigation/stack';
import * as React from 'react';
import {ProductScreen} from '../screens/ProductScreen';
import {ProductsScreen} from '../screens/ProductsScreen';

export type ProductsStackParmas = {
  ProductsScreen: undefined;
  ProductScreen: {id?: string; name?: string};
};

const Stack = createStackNavigator<ProductsStackParmas>();

export const ProductsNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProductsScreen" component={ProductsScreen} />
      <Stack.Screen name="ProductScreen" component={ProductScreen} />
    </Stack.Navigator>
  );
};
