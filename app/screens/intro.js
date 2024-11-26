import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, Dimensions } from 'react-native';
import colors from '../misc/colors';
import RoundIconBtn from '../components/RoundIconBtn';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Intro = ({onFinish}) => {
    const [name, setName] = useState("")
    const handleOnChangeText = (text) => setName(text);
    
    const handleSubmit =async () => {
        const user = {name: name}
        await AsyncStorage.setItem('user', JSON.stringify(user))
        if(onFinish) onFinish();
    }
    return (
        <>
        <StatusBar hidden />
        <View style={styles.container}>
            <Text style={styles.inputTitle}>Digite seu nome para continuar</Text>
            <TextInput value={name} onChangeText={handleOnChangeText} placeholder='Digite Aqui' style={styles.textInput} />
        {name.trim().length >= 3 ? <RoundIconBtn antIconName='arrowright' onPress={handleSubmit} /> : null}
        </View> 
    </>
    );
};
 //cria uma condição para mostrar o botão somente se o texto for maior ou igual a 3 caracteres

const width = Dimensions.get('window').width - 50;
console.log(width)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    //Texto de entrada
    textInput: {
        borderWidth: 2,
        borderColor: colors.PRIMARY,
        color: colors.PRIMARY,
        width,
        height: 50,
        borderRadius: 10,
        paddingLeft: 15,
        fontSize: 20,
        marginBottom: 15, //distância do texto em relação ao final da tela
    },
    //Texto de instrução
    inputTitle: {
        alignSelf: 'flex-start',
        paddingLeft: 50,
        marginBottom: 5,
        opacity: 0.5,
        fontSize: 30,

    },
});

export default Intro;