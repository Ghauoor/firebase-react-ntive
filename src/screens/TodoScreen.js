import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, TextInput, ScrollView} from 'react-native';
import CustomButton from '../components/CustomButton';
import {useNavigation} from '@react-navigation/native';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const TodoScreen = () => {
  const [text, setText] = useState('');
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const userId = auth().currentUser.uid;

    const unsubscribe = firestore()
      .collection('todos')
      .where('userId', '==', userId)
      .onSnapshot(snapshot => {
        const todosData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTodos(todosData);
      });

    return () => unsubscribe();
  }, []);

  //Handle Logout
  const handleLogout = async () => {
    try {
      await auth().signOut();
      console.log('User Logout Successfully');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handlePress = () => {
    if (text.trim() === '') {
      return;
    }

    const userId = auth().currentUser.uid; // Get the user ID of the current user

    if (editId) {
      firestore().collection('todos').doc(editId).update({text: text});
      setEditId(null);
    } else {
      const newTodo = {text: text, userId: userId};
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
      <View style={styles.headerContainer}>
        <Text style={styles.mainText}>Todo App: </Text>
        <CustomButton
          onPress={handleLogout}
          title="Logout"
          buttonStyle={styles.logoutButton}
          textStyle={styles.todoButtonText}
        />
      </View>

      <TextInput
        style={styles.textInputStyle}
        placeholder="Enter Your Todos here"
        onChangeText={setText}
        value={text}
      />
      <ScrollView contentContainerStyle={styles.todoListContainer}>
        <Text style={styles.todoListText}>Todo List:</Text>
        {todos.length === 0 ? (
          <Text style={styles.emptyListText}>No todos yet.</Text>
        ) : (
          todos.map(todo => (
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
          ))
        )}
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
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
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
  emptyListText: {
    fontSize: 16,
    color: '#423a3a',
    fontStyle: 'italic',
    marginVertical: 10,
  },
  logoutButton: {
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default TodoScreen;
