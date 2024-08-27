import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import * as SQLite from 'expo-sqlite';

export default function App() {
  const [db, setDb] = useState(null);

  useEffect(() => {
    const openDatabase = async () => {
      const database = await SQLite.openDatabaseAsync('databaseName');
      setDb(database);
      await initializeDatabase(database);
    };
    openDatabase();
  }, []);

  const initializeDatabase = async (database) => {
    await database.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS test (
        id INTEGER PRIMARY KEY NOT NULL, 
        value TEXT NOT NULL, 
        intValue INTEGER
      );
    `);
  };

  const createTable = async () => {
    if (db) {
      await initializeDatabase(db);
      console.log('Table created or already exists.');
    }
  };

  const addArray = async () => {
    if (db) {
      await db.runAsync('INSERT INTO test (value, intValue) VALUES (?, ?)', 'test4', 1234);
      console.log('Array added.');
    }
  };

  const removeData = async () => {
    if (db) {
      await db.runAsync('DELETE FROM test WHERE value = ?', 'test4');
      console.log('Data removed.');
    }
  };

  const dropTable = async () => {
    if (db) {
      await db.runAsync('DROP TABLE IF EXISTS test');
      console.log('Table dropped.');
    }
  };

  const fetchData = async () => {
    if (db) {
      try {
        const result = await db.execAsync('SELECT * FROM test');
        console.log('Fetched data:', result[0].rows._array);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  };


  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity
          style={styles.button}
          onPress={createTable}
        >
          <Text>Create Table</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={addArray}
        >
          <Text>Add Array</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity
          style={styles.button}
          onPress={removeData}
        >
          <Text>Remove</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={dropTable}
        >
          <Text>Drop Table</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={fetchData}
      >
        <Text>Fetch Data</Text>
      </TouchableOpacity>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: 'green',
    height: 50,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    marginRight: 5,
  },
});