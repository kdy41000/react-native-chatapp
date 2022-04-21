import React,{ useContext, useState, useRef, useEffect } from 'react';
import styled from 'styled-components/native';
import { ThemeContext } from 'styled-components';
import { Button, Image, Input, ErrorMessage } from '../components'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';  // npm i react-native-keyboard-aware-scroll-view (키보드에 화면이 가려져 자동스크롤 생성 라이브러리)
import { signin } from '../firebase';
import { Alert } from 'react-native';
import { validateEmail, removeWhitespace } from '../utils';
import { UserContext, ProgressContext } from '../contexts';


const Container = styled.View`
    flex : 1;
    justify-content: center;
    align-items: center;
    background-color: ${({theme}) => theme.background};
    padding: 0 20px;
    padding-top: ${({ insets: {top}}) => top}px;
    padding-bottom: ${({ insets: {bottom}}) => bottom}px;
`;

const StyledText = styled.Text`
    font-size: 30px;
    color: black;
`;

const LOGO = 'https://firebasestorage.googleapis.com/v0/b/rn-chat-a729a.appspot.com/o/logo.png?alt=media';

const Signin = ({navigation}) => {
    const insets = useSafeAreaInsets();   //노치디자인 방지
    const theme = useContext(ThemeContext);
    const { setUser } = useContext(UserContext);
    const { spinner } = useContext(ProgressContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [disabled, setDisabled] = useState(true);

    const refPassword = useRef(null);

    useEffect(() => {
        setDisabled(!(email && password && !errorMessage));
    },[email, password, errorMessage])

    const _handleEmailChange = email => {
        const changeEmail = removeWhitespace(email);
        setEmail(changeEmail);
        setErrorMessage(validateEmail(changeEmail) ? '' : 'Please verify your email');
    }

    const _handlePasswordChange = password => {
        const changePassword = removeWhitespace(password);
        setPassword(changePassword);
    }

    const _handleSigninBtnPress = async () => {
        console.log("signin");
        try {
           spinner.start();
           const user = await signin({email, password});  
           setUser(user); 
        } catch(e) {
           Alert.alert('Signin Error', e.message);
        } finally {
            spinner.stop();
        }
    }

    return (
        <KeyboardAwareScrollView extraScrollHeight={20} contentContainerStyle={{flex: 1}}>
            <Container insets={insets}>
                <Image url={LOGO} />
                <StyledText>Signin</StyledText>
                <Input label="Email" placeholder="Email" returnKeyType="next" value={email} onChangeText={_handleEmailChange} onSubmitEditing={() => refPassword.current.focus()} />
                <Input label="Password" placeholder="Password" returnKeyType="done" value={password} onChangeText={_handlePasswordChange} ref={refPassword} isPassword={true} onSubmitEditing={_handleSigninBtnPress}/>
                <ErrorMessage message={errorMessage}/>
                <Button title="Sign in" onPress={_handleSigninBtnPress} disabled={disabled} />
                <Button 
                    title="or Sign up" 
                    onPress={() => navigation.navigate('Signup')} 
                    containerStyle={{marginTop: 0, backgroundColor: 'transparent'}}
                    textStyle={{color:theme.btnTextLink, fontSize: 10}}
                />
            </Container>
        </KeyboardAwareScrollView>
    );
}

export default Signin;