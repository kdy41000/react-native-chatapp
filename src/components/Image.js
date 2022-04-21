import React,{ useState, useEffect } from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { MaterialIcons } from '@expo/vector-icons';
import { Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const ButtonContainer = styled.TouchableOpacity`
    background-color: ${({theme}) => theme.imgBackground};
    position: absolute;
    bottom: 0;
    right: 0;
    width: 30px;
    height: 30px;
    border-radius: 15px;
    justify-content: center;
    align-items: center;
`;

const Container = styled.View`
    margin-bottom: 30px;
`;

const ProfileImage = styled.Image`
    background-color: ${({theme}) => theme.imgBackground};
    width: 100px;
    height: 100px;
    border-radius: 50px;
`;

const ButtonIcon = styled(MaterialIcons)`
    background-color: ${({theme}) => theme.imgBtnBackground};
`;

const PhotoButton = ({onPress}) => {
    return (
        <ButtonContainer onPress={onPress}>
            <ButtonIcon name="photo-camera" size={20} color="black" />
        </ButtonContainer>
    );
}

const Image = ({url, showButton, onChangePhoto}) => {

    const pickImage = async () => {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      console.log(result);
  
      if (!result.cancelled) {
        onChangePhoto(result.uri);
      }
    }

    return (
            <Container>
                <ProfileImage source={{uri:url}} />
                {showButton && <PhotoButton onPress={pickImage}/>}
            </Container>
        );
}

//기본 face이미지 설정
Image.defaultProps = {
    url: "https://firebasestorage.googleapis.com/v0/b/rn-chat-a729a.appspot.com/o/face.png?alt=media"
}

Image.propTypes = {
    url: PropTypes.string,
    showButton: PropTypes.bool,
    onChangePhoto: PropTypes.func
}

export default Image;