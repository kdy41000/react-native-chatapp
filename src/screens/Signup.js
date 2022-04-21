import React,{ useContext, useState, useRef, useEffect } from 'react';
import styled from 'styled-components/native';
import { ThemeContext } from 'styled-components';
import { Button, ErrorMessage, Image, Input } from '../components'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';  // npm i react-native-keyboard-aware-scroll-view (키보드에 화면이 가려져 자동스크롤 생성 라이브러리)
import { signup } from '../firebase';
import { Alert } from 'react-native';
import { validateEmail, setPasswordConfirm, removeWhitespace } from '../utils';
import { UserContext, ProgressContext } from '../contexts';

const Container = styled.View`
    flex : 1;
    justify-content: center;
    align-items: center;
    background-color: ${({theme}) => theme.background};
    padding: 50px 20px;
`;

const StyledText = styled.Text`
    font-size: 30px;
    color: black;
`;

const DEFAULT_PHOTO = 'https://firebasestorage.googleapis.com/v0/b/rn-chat-a729a.appspot.com/o/face.png?alt=media';

const Signup = ({navigation}) => {
    const { setUser } = useContext(UserContext);
    const { spinner } = useContext(ProgressContext);
    const [photo, setPhoto] = useState(DEFAULT_PHOTO);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [disabled, setDisabled] = useState(true);

    const refEmail = useRef(null);
    const refPassword = useRef(null);
    const refPasswordConfirm = useRef(null);
    const refDidMount = useRef(null);

    useEffect(() => {
        setDisabled(!(name && email && password && passwordConfirm && !errorMessage));
    },[email, name, password, passwordConfirm, errorMessage]);

    useEffect(() => {
        if(refDidMount.current) {
            let error = '';
            if(!name) error = 'Please enter your name';
            else if(!email) error = 'Please enter your email';
            else if(!validateEmail(email)) error = 'Please verify your email';
            else if(password.length < 6) error = 'The password must contain 6 characters at least';
            else if(password !== passwordConfirm) error = 'Password need to match'; 
            else error = '';

            setErrorMessage(error);
        } else {
            refDidMount.current = true;
        }
    }),[email, name, password, passwordConfirm];

    const _handleSignupBtnPress = async () => {
        console.log("클릭:",photo);
        try {
            spinner.start();
            const user = await signup({name, email, password, photo});
            setUser(user);
        } catch (e) {
            Alert.alert('Signup Error', e.message);
        } finally {
            spinner.stop();
        }
    }

    return (
        <KeyboardAwareScrollView extraScrollHeight={20}>
            <Container>
                <Image showButton={true} url={photo} onChangePhoto={setPhoto}/>
                <StyledText>Signup</StyledText>
                <Input 
                    label="Name" 
                    placeholder="Name" 
                    returnKeyType="next" 
                    value={name} 
                    onChangeText={setName} 
                    onSubmitEditing={() => refEmail.current.focus()} 
                    onBlur={() => setName(name.trim())}
                    maxLength={12}
                />
                <Input 
                    label="Email" 
                    placeholder="Email" 
                    returnKeyType="next" 
                    value={email} 
                    onChangeText={setEmail}
                    ref={refEmail} 
                    onSubmitEditing={() => refPassword.current.focus()} 
                    onBlur={() => setEmail(removeWhitespace(email))}
                />
                <Input 
                    label="Password" 
                    placeholder="Password" 
                    returnKeyType="next" 
                    value={password} 
                    onChangeText={setPassword} 
                    onSubmitEditing={() => refPasswordConfirm.current.focus()}
                    ref={refPassword}
                    isPassword={true} 
                    onBlur={() => setPassword(removeWhitespace(password))}
                />
                <Input 
                    label="Password Confirm" 
                    placeholder="Password Confirm" 
                    returnKeyType="done" 
                    value={passwordConfirm} 
                    onChangeText={setPasswordConfirm} 
                    onSubmitEditing={_handleSignupBtnPress}
                    ref={refPasswordConfirm} 
                    isPassword={true} 
                    onBlur={() => setPasswordConfirm(removeWhitespace(passwordConfirm))}
                />
                <ErrorMessage message={errorMessage}/>
                <Button title="Sign up" onPress={_handleSignupBtnPress} disabled={disabled} />
            </Container>
        </KeyboardAwareScrollView>

    );
}

export default Signup;