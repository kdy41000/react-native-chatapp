import React from 'react';
import styled from 'styled-components/native';
import {ActivityIndicator} from "react-native";

const Container = styled.View`
    position: absolute;
    z-index: 2;
    opacity: 0.3;
    width: 100%;
    height: 100%;
    justify-content: center;
    background-color: ${({theme}) => theme.spinnerBackground};
`;

const Spinner = () => {
    return (
        <Container>
            <ActivityIndicator size="large" color="white" />
        </Container>
    );
}

export default Spinner;