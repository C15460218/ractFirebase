import styled from 'styled-components';
import { Dimensions } from 'react-native';

export const InputWrapper = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    width: 100%;
    background-color: #2e64e515;
`;

const width = Dimensions.get('window').width - 50;
export const InputField = styled.TextInput`
    border: 1px;
    height: 50px;
    width:90%;
    borderRadius:5px;
    paddingLeft:15px;
    marginBottom:10px;
    fontSize:20px;
`;

export const InputTitle = styled.Text`
    width:90%;
    height: 50px;
    marginTop:5px;
    fontSize:20px;
`;

export const AddImage = styled.Image`
    width: 100%;
    height: 250px;
    margin-bottom: 15px;
`;

export const StatusWrapper = styled.View`
    justify-content: center;
    align-items: center;
`;

export const SubmitBtn = styled.TouchableOpacity`
    flex-direction: row;
    justify-content: center;
    background-color: #2e64e515;
    border-radius: 5px;
    padding: 10px 25px;
`;

export const SubmitBtnText = styled.Text`
    font-size: 18px;
    font-family: 'Lato-Bold';
    font-weight: bold;
    color: #2e64e5;
`;