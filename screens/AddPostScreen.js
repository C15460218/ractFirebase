import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  Platform,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';

import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';

import {
  InputField,
  InputWrapper,
  AddImage,
  SubmitBtn,
  SubmitBtnText,
  StatusWrapper,
  InputTitle,
} from '../styles/AddPost';

import { AuthContext } from '../navigation/AuthProvider';
import HomeScreen from './HomeScreen';

const AddPostScreen = () => {
  const {user, logout} = useContext(AuthContext);

  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [post, setPost] = useState(null);
  const [sus,setSus] = useState(null);
  const [price,setPrice] = useState(null);
  const [desc,setDesc] = useState(null);
  const [day,setDay] = useState(null);

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      width: 1200,
      height: 780,
      cropping: true,
    }).then((image) => {
      console.log(image);
      const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
      setImage(imageUri);
    });
  };

  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      width: 1200,
      height: 780,
      cropping: true,
    }).then((image) => {
      console.log(image);
      const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
      setImage(imageUri);
    });
  };

  const submitSusc = async ({navigate}) => {

    firestore()
    .collection('suscripcion')
    .add({
      userId: user.uid,
      name: sus,
      price,
      desc,
      day,
      postTime: firestore.Timestamp.fromDate(new Date()),
    })
    .then(() => {
      console.log('Suscripción Agregada!');
      Alert.alert(
        'Suscripción Agregada!',
        'Tu suscripción ha sido agregada correctamente!',
      );
      setSus(null);
    })
    .catch((error) => {
      console.log('Something went wrong with added post to firestore.', error);
    });
    navigate.navigate(HomeScreen);
  }

  const submitPost = async () => {
    const imageUrl = await uploadImage();
    console.log('Image Url: ', imageUrl);
    console.log('Post: ', post);

    firestore()
    .collection('posts')
    .add({
      userId: user.uid,
      post: post,
      postImg: imageUrl,
      postTime: firestore.Timestamp.fromDate(new Date()),
      likes: null,
      comments: null,
    })
    .then(() => {
      console.log('Post Added!');
      Alert.alert(
        'Post published!',
        'Your post has been published Successfully!',
      );
      setPost(null);
    })
    .catch((error) => {
      console.log('Something went wrong with added post to firestore.', error);
    });
  }

  const uploadImage = async () => {
    if( image == null ) {
      return null;
    }
    const uploadUri = image;
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

    // Add timestamp to File Name
    const extension = filename.split('.').pop(); 
    const name = filename.split('.').slice(0, -1).join('.');
    filename = name + Date.now() + '.' + extension;

    setUploading(true);
    setTransferred(0);

    const storageRef = storage().ref(`photos/${filename}`);
    const task = storageRef.putFile(uploadUri);

    // Set transferred state
    task.on('state_changed', (taskSnapshot) => {
      console.log(
        `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
      );

      setTransferred(
        Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
          100,
      );
    });

    try {
      await task;

      const url = await storageRef.getDownloadURL();

      setUploading(false);
      setImage(null);

      // Alert.alert(
      //   'Image uploaded!',
      //   'Your image has been uploaded to the Firebase Cloud Storage Successfully!',
      // );
      return url;

    } catch (e) {
      console.log(e);
      return null;
    }

  };

  return (
    <View style={styles.container}>

      <InputWrapper>
        {image != null ? <AddImage source={{uri: image}} /> : null}
        <InputTitle>Nombre de Suscripción</InputTitle>
        <InputField
          placeholder="Nombre de la suscripcion"
          multiline
          numberOfLines={4}
          value={sus}
          onChangeText={(content) => setSus(content)}
        />
        <InputTitle>Monto</InputTitle>
        <InputField
          placeholder="Monto a Pagar"
          multiline
          numberOfLines={4}
          value={price}
          onChangeText={(content) => setPrice(content)}
        />
        <InputTitle>Dia de Pago</InputTitle>
        <InputField
          placeholder="¿Cada cuando se Paga?"
          multiline
          numberOfLines={4}
          value={day}
          onChangeText={(content) => setDay(content)}
        />
        <InputTitle>Descripción</InputTitle>
        <InputField
          multiline
          numberOfLines={4}
          value={desc}
          onChangeText={(content) => setDesc(content)}
        />
        {uploading ? (
          <StatusWrapper>
            <Text>{transferred} % Completed!</Text>
            <ActivityIndicator size="large" color="#0000ff" />
          </StatusWrapper>
        ) : (
          <SubmitBtn onPress={submitSusc}>
            <SubmitBtnText>Aceptar</SubmitBtnText>
          </SubmitBtn>
        )}
      </InputWrapper>
    </View>
  );
};

export default AddPostScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
});
