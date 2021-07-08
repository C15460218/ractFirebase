import React from 'react';
import { View, Text, Button, StyleSheet, FlatList } from 'react-native';
import {
  Container,
  Card,
  UserInfo,
  UserImgWrapper,
  UserImg,
  UserInfoText,
  UserName,
  PostTime,
  MessageText,
  TextSection,
} from '../styles/MessageStyles';

const Messages = [
  {
    id: '1',
    userName: 'Cambiar Orden',
    messageText:
      'Cambiar el orden que se muestran las suscripciones',
  },
  {
    id: '2',
    userName: 'Modo Oscuro',
    messageText:
      'Cambiar la aplicacion a modo oscuro',
  },
  {
    id: '3',
    userName: 'Moneda',
    messageText:
      'Tipo de moneda',
  },
  {
    id: '4',
    userName: 'Ver total Como',
    messageText:
      'Ver total menual o anual',
  },
  {
    id: '5',
    userName: 'Seguridad',
    messageText:
      'Cambia las opciones de seguridad',
  },
];

const MessagesScreen = ({navigation}) => {
    return (
      <Container>
        <FlatList 
          data={Messages}
          keyExtractor={item=>item.id}
          renderItem={({item}) => (
            <Card>
              <UserInfo>
                <TextSection>
                  <UserInfoText>
                    <UserName>{item.userName}</UserName>
                  </UserInfoText>
                  <MessageText>{item.messageText}</MessageText>
                </TextSection>
              </UserInfo>
            </Card>
          )}
        />
      </Container>
    );
};

export default MessagesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
});
