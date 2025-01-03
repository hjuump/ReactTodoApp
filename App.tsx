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
  Alert,
} from 'react-native';
import {theme} from './colors';

const STORAGE_KEY_TODOS = '@toDos';
const STORAGE_KEY_WORKING = '@working';

function App(): React.JSX.Element {
  // 코드 챌린지
  // 1. 앱 재실행시, 마지막 상태의 Work 또는 Travel 기억하기 (완료)
  // 2. Todo에 완료 기능 추가하기
  // 3. Todo에 수정 기능 추가하기

  const [working, setWorking] = useState(true);
  const [text, setText] = useState('');
  const [toDos, setToDos] = useState<{
    [key: string]: {text: string; working: boolean};
  }>({});
  useEffect(() => {
    loadToDos();
    loadWorking();
  }, []);
  const travel = () => saveWorking(false);
  const work = () => saveWorking(true);
  const onChangeText = (payload: string) => setText(payload);
  const saveToDos = async (toSave: {
    [key: string]: {text: string; working: boolean};
  }) => {
    await AsyncStorage.setItem(STORAGE_KEY_TODOS, JSON.stringify(toSave));
  };
  const loadToDos = async () => {
    const s = await AsyncStorage.getItem(STORAGE_KEY_TODOS);
    if (s) {
      setToDos(JSON.parse(s));
    }
  };
  const saveWorking = async (working: boolean) => {
    setWorking(working);
    await AsyncStorage.setItem(STORAGE_KEY_WORKING, JSON.stringify(working));
  };
  const loadWorking = async () => {
    const savedWorking = await AsyncStorage.getItem(STORAGE_KEY_WORKING);
    if (savedWorking !== null) {
      setWorking(JSON.parse(savedWorking));
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

  const deleteToDo = (key: string) => {
    Alert.alert('Delete To Do', 'Are you sure?', [
      {
        text: 'Cancel',
      },
      {
        text: 'Delete',
        onPress: () => {
          const newToDos = {...toDos};
          delete newToDos[key];
          setToDos(newToDos);
          saveToDos(newToDos);
        },
        style: 'destructive',
      },
    ]);
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
          autoCapitalize="none"
        />
        <ScrollView>
          {Object.keys(toDos).map(key =>
            toDos[key].working === working ? (
              <View style={styles.toDo} key={key}>
                <Text style={styles.toDoText}>{toDos[key].text}</Text>
                <TouchableOpacity
                  onPress={() => {
                    deleteToDo(key);
                  }}>
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
