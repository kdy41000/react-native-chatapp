import React,{ useEffect, useState, useLayoutEffect } from 'react';
import styled from 'styled-components/native';
import { Button, Input } from '../components';
import { createMessage, getCurrentUser, db } from '../firebase';
import { GiftedChat, Send } from 'react-native-gifted-chat'
import { Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import {
    collection,
    onSnapshot,
    orderBy,
    query
 } from 'firebase/firestore';


const Container = styled.View`
    flex: 1;
    background-color: ${({theme}) => theme.background};
`;

const SendButton = props => {
    return (
        <Send {...props} 
            containerStyle={{
                width: 44, 
                height: 44, 
                alignItems: 'center',
                justifyContent: 'center', 
                marginHorizontal: 4 
            }}
            disabled={!props.text}
        >
            <MaterialIcons name="send" size={24} />
        </Send>
    );
}

const Channel = ({ navigation, route }) => {
    const [messages, setMessages] = useState('');
    const {uid, name, photo} = getCurrentUser();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: route.params.title || 'Channel',
        })
    },[])

    useEffect(() => {
        const q = query(collection(db, `channels/${route.params.id}/messages`), orderBy('createdAt','desc'));
        const unsub = onSnapshot(q, (snapshot) => {
            const list = [];
            snapshot.forEach(doc => {
                list.push(doc.data());
            });
            setMessages(list);
        });
        return () => unsub();
    }),[];
    
    const _handleMessageSend = async messageList => {
        const message = messageList[0];
        try {
            await createMessage({channelId: route.params.id},message);
        } catch (e) {
            Alert.alert('Message Error', e.message);
        }
    }

    return (
        <Container>
            <GiftedChat 
                placeholder="Enter a message ..."
                messages={messages}
                user={{ _id: uid, name, avatar: photo }}
                onSend={_handleMessageSend}
                renderSend={props => <SendButton {...props} />}
                scrollToBottom={true}
                renderUsernameOnMessage={true}
                alwayShowSend={true}
                multiline={false}
            />
        </Container>
    )
}

export default Channel;