import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';

import firestore from '@react-native-firebase/firestore';

const CloudStore = () => {
  const [personalData, setPersonalData] = useState(null);
  const getCollection = async () => {
    try {
      const data = await firestore().collection('test').get();
    } catch (error) {
      console.log(error);
    }
  };
  //reading Collection
  useEffect(() => {
    getCollection();
  }, []);
  const getData = async () => {
    try {
      const data = await firestore()
        .collection('test')
        .doc('R4RgwUc3WaGrL2mvgGVg')
        .get();
      setPersonalData(data._data);
    } catch (error) {
      console.log(error);
    }
  };
  //reading document
  useEffect(() => {
    getData();
  }, []);
  return (
    <View style={styles.container}>
      <Text>Name: {personalData ? personalData.name : 'Loading'}</Text>
      <Text>age: {personalData ? personalData.age : 'Loading'}</Text>
      <Text>
        Hobbies:{' '}
        {personalData ? personalData.hobby.map(list => ` ${list} `) : 'Loading'}
      </Text>
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

export default CloudStore;
