import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, TextInput, ScrollView} from 'react-native';
import CustomButton from '../components/CustomButton';

import firestore from '@react-native-firebase/firestore';

const TodoScreen = () => {
  const [text, setText] = useState('');
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('todos')
      .onSnapshot(snapshot => {
        const todosData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTodos(todosData);
      });

    return () => unsubscribe();
  }, []);

  const handlePress = () => {
    if (text.trim() === '') {
      return;
    }

    if (editId) {
      firestore().collection('todos').doc(editId).update({text: text});
      setEditId(null);
    } else {
      const newTodo = {text: text};
      firestore().collection('todos').add(newTodo);
    }

    setText('');
  };

  const handleDelete = id => {
    firestore().collection('todos').doc(id).delete();
  };

  const handleEdit = (id, currentText) => {
    setEditId(id);
    setText(currentText);
  };

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.mainText}>Todo App: </Text>
      <TextInput
        style={styles.textInputStyle}
        placeholder="Enter Your Todos here"
        onChangeText={setText}
        value={text}
      />
      <ScrollView contentContainerStyle={styles.todoListContainer}>
        <Text style={styles.todoListText}>Todo List:</Text>
        {todos.map(todo => (
          <View key={todo.id} style={styles.todoCard}>
            <Text style={styles.todoText}>{todo.text}</Text>
            <CustomButton
              onPress={() => handleDelete(todo.id)}
              title="Delete"
              buttonStyle={styles.deleteButton}
              textStyle={styles.deleteButtonText}
            />
            <CustomButton
              onPress={() => handleEdit(todo.id, todo.text)}
              title="Edit"
              buttonStyle={styles.editButton}
              textStyle={styles.editButtonText}
            />
          </View>
        ))}
      </ScrollView>
      <View style={styles.buttonPosition}>
        <View style={styles.buttonContainer}>
          <CustomButton
            onPress={handlePress}
            title="Add Todo"
            buttonStyle={styles.todoButton}
            textStyle={styles.todoButtonText}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#cbc6c6',
  },
  todoButton: {
    backgroundColor: '#ff6f00',
  },
  deleteButton: {
    backgroundColor: '#ff3c00',
  },
  editButton: {
    backgroundColor: '#00aaff',
  },
  todoButtonText: {
    color: '#ffffff',
  },
  deleteButtonText: {
    color: '#ffffff',
  },
  editButtonText: {
    color: '#ffffff',
  },
  mainText: {
    fontSize: 35,
    padding: 7,
    marginBottom: 20,
    color: '#423a3a',
  },
  textInputStyle: {
    backgroundColor: '#ffffff',
    borderWidth: 4,
    borderColor: '#423a3a',
    margin: 5,
    borderRadius: 5,
    padding: 10,
  },
  buttonContainer: {
    padding: 10,
  },
  buttonPosition: {
    justifyContent: 'flex-end',
    alignContent: 'flex-end',
  },
  todoListContainer: {
    alignItems: 'center',
    paddingBottom: 10,
  },
  todoListText: {
    fontSize: 25,
    marginBottom: 10,
    color: '#423a3a',
  },
  todoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  todoText: {
    fontSize: 16,
    color: '#423a3a',
    flex: 1,
  },
});

export default TodoScreen;
