import React,{ useContext, useEffect } from 'react';
import { ThemeContext } from 'styled-components/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {ChannelList, Profile} from '../screens';
import { MaterialIcons } from '@expo/vector-icons';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';  //현재 선택된 화면의 이름을 알수 있는 기능
import Navigation from '.';

const TabIcon = ({name, focused}) => {
    const theme = useContext(ThemeContext);
    return <MaterialIcons name={name} size={26} color={focused ? theme.tabBtnActive: theme.tabBtnInactive} />
}

const Tab = createBottomTabNavigator();

const Home = ({ navigation, route }) => {
    useEffect(() => {
       // console.log(getFocusedRouteNameFromRoute(route));
       const screenName = getFocusedRouteNameFromRoute(route) || 'List';  //초기 화면 이름 undefined로 초기에는 List화면이 나타날 수 있도록 세팅
       navigation.setOptions({
           headerTitle: screenName,
           headerRight: () => screenName === 'List' && (
               <MaterialIcons 
                name="add" 
                size={26}
                style={{margin:10}}
                onPress={() => navigation.navigate('ChannelCreation')} 
               />
           ),
       })
    });
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen 
              name="List" 
              component={ChannelList} 
              options={{
                tabBarIcon: ({focused}) => TabIcon({name: focused ? 'chat-bubble' : 'chat-bubble-outline', focused})
              }}
            />
            <Tab.Screen 
              name="Profile" 
              component={Profile} 
              options={{
                tabBarIcon: ({focused}) => TabIcon({name: focused ? 'person' : 'person-outline', focused})
              }}
            />
        </Tab.Navigator>
    );
}

export default Home;