import React, { useContext, useEffect, useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { View, Text, StyleSheet, Animated, TouchableHighlight, TouchableOpacity } from 'react-native';

import { SwipeListView } from 'react-native-swipe-list-view';

import {
  Container,
  Card,
  UserInfo,
  UserImg,
  UserName,
  UserInfoText,
  PostTime,
  PostText,
  PostImg,
  InteractionWrapper,
  Interaction,
  InteractionText,
  Divider,
} from '../styles/FeedStyles';

import ProgressiveImage from './ProgressiveImage';

import { AuthContext } from '../navigation/AuthProvider';

import moment from 'moment';
// import {TouchableOpacity} from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';

const PostCard = ({ item, onDelete, onPress }) => {
  const { user, logout } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);



  const getUser = async () => {
    await firestore()
      .collection('users')
      .doc(item.userId)
      .get()
      .then((documentSnapshot) => {
        if (documentSnapshot.exists) {
          console.log('User Data', documentSnapshot.data());
          setUserData(documentSnapshot.data());
        }
      });
  };

  useEffect(() => {
    getUser();
  }, []);


  const VisibleItem = props => {
    console.log("Hola")
    const { data } = props;
    return (
      <TouchableHighlight
        style={styles.rowFrontVisible}
      >
        <View>
          <Text style={styles.title} numberOfLines={1}>{data.item.name}</Text>
        </View>
      </TouchableHighlight>
    );
  }

  const renderItem = (data, rowMap) => {
    return <VisibleItem data={data} />
  }

  const renderHiddenItem = () => {

  }

  return (
    <Card key={item.id}>
      {user.uid == item.userId ? (
        <>
        <UserInfo>
          <UserInfoText>
            <TouchableOpacity onPress={onPress}>
              <UserName>
                {item.name}
              </UserName>
            </TouchableOpacity>
          </UserInfoText>
        </UserInfo>
        <PostText>{item.desc}</PostText>
        <InteractionWrapper>
          <Interaction>
            <InteractionText>Monto a Pagar</InteractionText>
            <InteractionText>${item.price}.00</InteractionText>
          </Interaction>
          <Interaction>
            <InteractionText>Dia de Pago</InteractionText>
            <InteractionText>{item.day}</InteractionText>
          </Interaction>
          {user.uid == item.userId ? (
            <Interaction onPress={() => onDelete(item.id)}>
              <Ionicons name="md-trash-bin" size={25} />
            </Interaction>
          ) : null}
        </InteractionWrapper>
        </>
      ) : null}
    </Card>
  );
};

export default PostCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f4f4f4',
    flex: 1,
  },
  backTextWhite: {
    color: '#FFF',
  },
  rowFront: {
    backgroundColor: '#FFF',
    borderRadius: 5,
    height: 60,
    margin: 5,
    marginBottom: 15,
    shadowColor: '#999',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  rowFrontVisible: {
    backgroundColor: '#FFF',
    borderRadius: 5,
    height: 60,
    padding: 10,
    marginBottom: 15,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
    margin: 5,
    marginBottom: 15,
    borderRadius: 5,
  },
  backRightBtn: {
    alignItems: 'flex-end',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
    paddingRight: 17,
  },
  backRightBtnLeft: {
    backgroundColor: '#1f65ff',
    right: 75,
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    right: 0,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  trash: {
    height: 25,
    width: 25,
    marginRight: 7,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#666',
  },
  details: {
    fontSize: 12,
    color: '#999',
  },
});
