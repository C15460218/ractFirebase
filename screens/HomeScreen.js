import React, {useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Alert,
} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

import Ionicons from 'react-native-vector-icons/Ionicons';

import PostCard from '../components/PostCard';

import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';

import {Container} from '../styles/FeedStyles';


const HomeScreen = ({navigation}) => {
  const [suscr,setSuscr] = useState(null);
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleted, setDeleted] = useState(false);

  const fetchPosts = async () => {
    try {
      const list = [];

      await firestore()
        .collection('suscripcion')
        .orderBy('postTime', 'desc')
        .get()
        .then((querySnapshot) => {
          // console.log('Total Posts: ', querySnapshot.size);

          querySnapshot.forEach((doc) => {
            const {
              userId,
              name,
              price,
              desc,
              day,
              postTime,
            } = doc.data();
            list.push({
              id: doc.id,
              userId,
              name,
              price,
              desc,
              day,
              postTime: postTime,
            });
          });
        });

      setSuscr(list);

      if (loading) {
        setLoading(false);
      }

      console.log('Suscripciones: ', suscr);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    fetchPosts();
    setDeleted(false);
  }, [deleted]);

  const handleDelete = (suscripcionId) => {
    Alert.alert(
      'Delete post',
      'Are you sure?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed!'),
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => deleteSusc(suscripcionId),
        },
      ],
      {cancelable: false},
    );
  };

  const deletePost = (postId) => {
    console.log('Current Post Id: ', postId);

    firestore()
      .collection('posts')
      .doc(postId)
      .get()
      .then((documentSnapshot) => {
        if (documentSnapshot.exists) {
          const {postImg} = documentSnapshot.data();

          if (postImg != null) {
            const storageRef = storage().refFromURL(postImg);
            const imageRef = storage().ref(storageRef.fullPath);

            imageRef
              .delete()
              .then(() => {
                console.log(`${postImg} has been deleted successfully.`);
                deleteFirestoreData(postId);
              })
              .catch((e) => {
                console.log('Error while deleting the image. ', e);
              });
            // If the post image is not available
          } else {
            deleteFirestoreData(postId);
          }
        }
      });
  };

  const deleteFirestoreData = (postId) => {
    firestore()
      .collection('posts')
      .doc(postId)
      .delete()
      .then(() => {
        Alert.alert(
          'Post deleted!',
          'Your post has been deleted successfully!',
        );
        setDeleted(true);
      })
      .catch((e) => console.log('Error deleting posst.', e));
  };

  const deleteSusc = (suscripcionId) => {
    console.log('Current Susc Id: ', suscripcionId);

    firestore()
      .collection('suscripcion')
      .doc(suscripcionId)
      .get()
      .then((documentSnapshot) => {
        if (documentSnapshot.exists) {
          deleteFirestoreDataSusc(suscripcionId);
        }
      });
  };

  const deleteFirestoreDataSusc = (suscripcionId) => {
    firestore()
      .collection('suscripcion')
      .doc(suscripcionId)
      .delete()
      .then(() => {
        Alert.alert(
          'Suscripción eliminada!',
          'Tu suscripción fue eliminada exitosamente!',
        );
        setDeleted(true);
      })
      .catch((e) => console.log('Error deleting post.', e));
  };

  const ListHeader = () => {
    return null;
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <Container>
          <FlatList
            data={suscr}
            renderItem={({item}) => (
              <PostCard
                item={item}
                onDelete={handleDelete}
              />
            )}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={ListHeader}
            ListFooterComponent={ListHeader}
            showsVerticalScrollIndicator={false}
          />
        </Container>
    </SafeAreaView>
  );
};

export default HomeScreen;
