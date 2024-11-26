import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, TouchableWithoutFeedback, Keyboard, FlatList } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from "../misc/colors";
import SearchBar from "../components/SearchBar";
import RoundIconBtn from "../components/RoundIconBtn";
import NoteInputModal from "../components/NoteInputModal";
import Note from "../components/Note";
import  {useNotes} from '../contexts/NoteProvider';
import NotFound from "../components/NotFound";

const reverseData = data => {
    return data.sort((a, b) => {
        const aInt = parseInt(a.time);
        const bInt = parseInt(b.time);
        if (aInt < bInt) return 1;
        if (aInt === bInt) return 0;
        if (aInt > bInt) return -1;
    });
}
const NoteScreen = ({ user, navigation }) => {
    const [greet, setGreet] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const {notes, setNotes, findNotes} = useNotes();
    const[searchQuery, setSearchQuery] = useState('');
    const [resultNotFound, setResultNotFound] = useState(false);

    

    const findGreet = () => {
        const hrs = new Date().getHours();
        if (hrs >= 0 && hrs < 12) return setGreet('Bom Dia,');
        if (hrs >= 12 && hrs < 18) return setGreet('Boa Tarde,');
        setGreet('Boa Noite,');
    };


    useEffect(() => {
        findGreet();
    }, []);

    const reverseNotes = reverseData(notes);

    const handleOnSubmit = async (title, desc) => {
        const note = { id: Date.now(), title, desc, time: Date.now() };
        const updatedNotes = [...notes, note];
        setNotes(updatedNotes);
        await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
    };

    const openNote = (note) => {
        navigation.navigate('NoteDetail', {note})
    };

    const handleOnSearchInput = async text => {
        setSearchQuery(text);
        if(!text.trim()){
            setSearchQuery('');
            setResultNotFound(false);
            return await findNotes();

        }
        const filteredNotes = notes.filter(note => {
            if(note.title.toLowerCase().includes(text.toLowerCase()))
                return note;
        })

        if(filteredNotes.length){
            setNotes([...filteredNotes]);
        }else{
            setResultNotFound(true);
        }
    }

    const handleOnClear = async () => {
        setSearchQuery('');
        setResultNotFound(false);
        await findNotes();
    }

    return (
        <>
            <StatusBar barStyle="dark-content" backgroundColor={colors.LIGHT} />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <Text style={styles.header}>{`${greet} ${user.name}`}</Text>
                    {notes.length ? (<SearchBar value={searchQuery} onChangeText={handleOnSearchInput} containerStyle={{ marginVertical: 15}} onClear={handleOnClear} />) : null }
                    
                    {resultNotFound ? <NotFound/> : (<FlatList
                        data={reverseNotes}
                        numColumns={2}
                        columnWrapperStyle = { {justifyContent: 'space-between', marginBottom:15 } }
                        contentContainerStyle = {{
                            paddingTop :10,
                        }}
                        keyExtractor={item => item.id.toString()}
                        renderItem={({ item }) => 
                        <Note onPress={() => openNote(item)} item={item} />}
                    /> )}
                    
                    {!notes.length ? (
                        <View 
                        style={
                            [StyleSheet.absoluteFillObject, 
                            styles.emptyHeaderContainer]}>
                            <Text style={styles.emptyHeader}>Insira um relatório</Text>
                        </View>
                    ) : null}
                </View>
            </TouchableWithoutFeedback>
            <RoundIconBtn
                onPress={() => setModalVisible(true)}
                antIconName="plus"
                style={styles.addBtn}
            />
            <NoteInputModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSubmit={handleOnSubmit}
            />
        </>
    );
};

const styles = StyleSheet.create({
    header: {
        fontSize: 25,
        fontWeight: 'bold',
        color: colors.PRIMARY,
        textAlign: 'center',
        marginTop: 50,
    },
    container: {
        paddingHorizontal: 20,
        flex: 1,
        zIndex: 1,
    },
    emptyHeader: {
        fontSize: 25,
        fontWeight: 'bold',
        opacity: 0.3,
    },
    emptyHeaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -80,
        zIndex: -1,
    },
    addBtn: {
        position: 'absolute',
        bottom: 50,
        right: 15,
        zIndex: 1,
    }
});

export default NoteScreen;
