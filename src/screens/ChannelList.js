import React,{ useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { Button } from '../components';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../theme';
import { FlatList } from 'react-native';
import { db } from '../firebase';
import {
    collection,
    onSnapshot,
    orderBy,
    query
 } from 'firebase/firestore';
 import moment from 'moment';

 //timestamp => 시간으로 변경
 const getDateOrTime = ts => {
     const now = moment().startOf('day');
     const target = moment(ts).startOf('day');
     return moment(ts).format(now.diff(target, 'day') > 0 ? 'MM/DD' : 'HH:mm');
 }

const ItemContainer = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
    border-bottom-width: 1px;
    border-color: ${({theme}) => theme.itemBorder};
    padding: 15px 20px;
`;

const ItemTextContainer = styled.View`
    flex: 1;
    flex-direction: column;
`;
const ItemTitle = styled.Text`
    font-size: 20px;
    font-weight: 600;
    color: ${({theme}) => theme.text};
`;
const ItemDesc = styled.Text`
    font-size: 16px;
    margin-top: 5px;
    color: ${({theme}) => theme.itemDesc};
`;
const ItemTime = styled.Text`
    font-size: 12px;
    color: ${({theme}) => theme.itemTime};
`;
const ItemIcon = styled(MaterialIcons)
``;
//React에서 제공하는 memo사용시 스크롤에 따라 값이 변경 될 때마다 리렌더링되는 문제를 방지할 수 있다.
const Item = React.memo(
    ({item: {id, title, description, createdAt}, onPress}) => {
    console.log(id);

    return (
        <ItemContainer onPress={() => onPress({id, title})}>
            <ItemTextContainer>
                <ItemTitle>{title}</ItemTitle>
                <ItemDesc>{description}</ItemDesc>
            </ItemTextContainer>
            <ItemTime>{getDateOrTime(createdAt)}</ItemTime>
            <ItemIcon name="keyboard-arrow-right" size={24} color={theme.itemIcon} />
        </ItemContainer>
    );
});

const Container = styled.View`
    flex: 1;
    background-color: ${({theme}) => theme.background};
`;

const ChannelList = ({navigation}) => {
    const [channels, setChannels] = useState([]);

    useEffect(() => {
        const q = query(collection(db, 'channels'), orderBy('createdAt','desc'));
        const unsub = onSnapshot(q, (snapshot) => {
            const list = [];
            snapshot.forEach(doc => {
                list.push(doc.data());
            });
            setChannels(list);
        });

        return () => unsub();   //페이지 재진입시 기존에 조회된 데이터와 중복되는 현상이 있으므로 unsub변수로 할당 후 리턴으로 해당 변수 해제함
    },[]);

    return (
        <Container>
            <FlatList
                data={channels}
                renderItem={({item}) => <Item item={item} onPress={params => navigation.navigate('Channel', params)} />}
                keyExtractor={item => item['id'].toString()}
            />
        </Container>
    )
}

export default ChannelList;