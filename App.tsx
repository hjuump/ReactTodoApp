import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import {theme} from './colors';

const STORAGE_KEY = '@toDos';
function App(): React.JSX.Element {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState('');
  const [toDos, setToDos] = useState<{
    [key: string]: {text: string; working: boolean};
  }>({});
  useEffect(() => {
    loadToDos();
  }, []);
  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const onChangeText = (payload: string) => setText(payload);
  const saveToDos = async (toSave: {
    [key: string]: {text: string; working: boolean};
  }) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };
  const loadToDos = async () => {
    const s = await AsyncStorage.getItem(STORAGE_KEY);
    if (s) {
      setToDos(JSON.parse(s));
    }
  };

  const addToDo = async () => {
    if (text === '') {
      return;
    }
    const newToDos = Object.assign({}, toDos, {
      [Date.now()]: {text, working},
    });
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{...styles.btnText, color: working ? 'white' : theme.grey}}>
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={{...styles.btnText, color: working ? theme.grey : 'white'}}>
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        <TextInput
          returnKeyType="done"
          onSubmitEditing={addToDo}
          onChangeText={onChangeText}
          value={text}
          style={styles.input}
          placeholder={working ? 'Add a To Do' : 'Where do you want to go?'}
        />
        <ScrollView>
          {Object.keys(toDos).map(key =>
            toDos[key].working === working ? (
              <View style={styles.toDo} key={key}>
                <Text style={styles.toDoText}>{toDos[key].text}</Text>
                <TouchableOpacity>
                  <Icon name="close" size={24} color={theme.delete_btn} />
                </TouchableOpacity>
              </View>
            ) : null,
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flex: 1,
    backgroundColor: theme.bg,
  },
  header: {
    marginTop: 100,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  btnText: {
    fontSize: 44,
    fontWeight: 600,
    color: 'white',
  },
  input: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 20,
    borderRadius: 40,
    fontSize: 16,
  },
  toDo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.toDoBg,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  toDoText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 600,
  },
});

export default App;
