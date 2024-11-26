import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import colors from "../misc/colors";
import {AntDesign} from '@expo/vector-icons';

const SearchBar = ({containderStyle, value, onChangeText, onClear}) => {
    return (
        <View style={[styles.container, { ...containderStyle }]}>
          <TextInput value={value} onChangeText={onChangeText} style={styles.SearchBar} placeholder="Procure aqui..." />
          {value ? <AntDesign name="close" size={20} color={colors.PRIMARY} onPress={onClear} style={styles.clearIcon} /> : null}  
        </View>
    )
}

const styles = StyleSheet.create({
    SearchBar: {
        borderWidth: 0.5,
        borderColor: colors.PRIMARY,
        height: 40,
        borderRadius: 40,
        paddingLeft: 15,
        fontSize: 20,
    },
    container: {
        justifyContent: 'center'
    },
    clearIcon: {
        position: 'absolute',
        right:10,
    }
})

export default SearchBar;