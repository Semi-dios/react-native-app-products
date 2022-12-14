import {StackScreenProps} from '@react-navigation/stack';
import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import {ProductsStackParmas} from '../navigator/ProductsNavigator';
import {Picker} from '@react-native-picker/picker';
import {useEffect, useState} from 'react';
import {useCategories} from '../hooks/useCategories';
import {useForm} from '../hooks/useForm';
import {onChange} from 'react-native-reanimated';
import {ProductsContext} from '../contexts/ProductsContext';

interface Props
  extends StackScreenProps<ProductsStackParmas, 'ProductScreen'> {}

export const ProductScreen = ({route, navigation}: Props) => {
  const {id = '', name = ''} = route.params;
  const [tempUri, setTempUri] = useState<string>();
  const {categories} = useCategories();
  const {loadProductById, addProduct, updateProduct, uploadImage} =
    React.useContext(ProductsContext);

  const {_id, categoriaId, nombre, img, setFormValue} = useForm({
    _id: id,
    categoriaId: '',
    nombre: name,
    img: '',
  });
  React.useEffect(() => {
    navigation.setOptions({
      title: name ? name : 'Did not find',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nombre]);

  const saveOrUpdate = async () => {
    if (id.length > 0) {
      updateProduct(categoriaId, nombre, id);
    } else {
      const tempCategoriaId = categoriaId || categories[0]._id;
      const newProduct = await addProduct(tempCategoriaId, nombre);
      onChange(newProduct._id, '_id');
    }
  };

  const loadProduct = async () => {
    if (id.length === 0) {
      return;
    }
    const product = await loadProductById(id);
    setFormValue({
      _id: id,
      categoriaId: product.categoria._id,
      img: product.img || '',
      nombre,
    });
  };

  useEffect(() => {
    loadProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const takePhoto = () => {
    launchCamera(
      {
        mediaType: 'photo',
        quality: 0.5,
      },
      resp => {
        if (resp.didCancel) {
          return;
        }
        if (!resp.uri) {
          return;
        }

        setTempUri(resp.uri);
        uploadImage(resp, _id);
      },
    );
  };

  const takePhotoGallery = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.5,
      },
      resp => {
        if (resp.didCancel) {
          return;
        }
        if (!resp.uri) {
          return;
        }

        setTempUri(resp.uri);
        uploadImage(resp, _id);
      },
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.label}>{_id}Name Product</Text>
        <TextInput
          placeholder="Name product"
          value={nombre}
          style={styles.textInput}
          onChangeText={value => onChange(value, 'nombre')}
        />
        <Text style={styles.label}>Select Category</Text>;
        <Picker
          selectedValue={categoriaId}
          onValueChange={value => onChange(value, 'categoriaId')}>
          {categories.map(category => (
            <Picker.Item
              label={category.nombre}
              value={category._id}
              key={category._id}
            />
          ))}
        </Picker>
        <TouchableOpacity
          onPress={saveOrUpdate}
          style={{backgroundColor: '#5856d6'}}>
          <Text style={{...styles.title, color: 'white'}}>Create</Text>;
        </TouchableOpacity>
        {_id.length > 0 && (
          <>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: 10,
              }}>
              <TouchableOpacity
                onPress={takePhoto}
                style={{backgroundColor: '#5856d6'}}>
                <Text style={{...styles.title, color: 'white'}}>
                  Take a picture
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={takePhotoGallery}
                style={{backgroundColor: '#5856d6'}}>
                <Text style={{...styles.title, color: 'white'}}>
                  Upload local
                </Text>
                ;
              </TouchableOpacity>
            </View>
          </>
        )}
        {img.length > 0 && !tempUri && (
          <Image style={{...styles.containerImage}} source={{uri: img}} />
        )}
        {tempUri && (
          <Image style={{...styles.containerImage}} source={{uri: tempUri}} />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    marginHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 20,
  },
  textInput: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderColor: 'rgba(0,0,0,0.2)',
    height: 45,
    maeginTop: 15,
    marginBottom: 20,
  },
  containerImage: {
    width: '100%',
    height: 300,
    margin: 15,
  },
});
