import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';

import database from '@react-native-firebase/database';

const RealtimeDatabase = () => {
  const [data, setData] = useState(null);
  const getData = async () => {
    try {
      const db = await database().ref('users/1').once('value');
      console.log(db);
      setData(db.val());
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <View style={styles.container}>
      <Text>Name : {data ? data.name : 'Loading'}</Text>
      <Text>Age : {data ? data.age : 'Loading'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default RealtimeDatabase;
