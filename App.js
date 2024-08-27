import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import * as SQLite from 'expo-sqlite';

export default function App() {
  const [db, setDb] = useState(null);

  useEffect(() => {
    const openDatabase = async () => {
      const database = await SQLite.openDatabaseAsync('databaseName');
      setDb(database); // Set the database instance in state
    };
    openDatabase();
  }, []);

  const initializeDatabase = async () => {
    if (db) {
      await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY NOT NULL, value TEXT NOT NULL, intValue INTEGER);
      `);
    } else {
      console.log('Database not initialized');
    }
  };

  const createTable = async () => {
    await initializeDatabase();
    console.log('Table created or already exists.');
  };

  const addArray = async () => {
    if (db) {
      await db.runAsync('INSERT INTO test (value, intValue) VALUES (?, ?)', 'dsadassada', 567);
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

  const testeClick = async () => {
    try {
      if (db) {
        const allRows = await db.getAllAsync('SELECT * FROM test');
        console.log(allRows);
      } else {
        console.log('Database not initialized');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const updatePorId = async (value, id) => {
    try {
      if (db) {
        const row = await db.getFirstAsync('UPDATE test SET value = ? WHERE id = ?', [value, id]);
        if (row) {
          console.log(`ID: ${row.id}, Value: ${row.value}, IntValue: ${row.intValue}`);
        } else {
          console.log('No record found with that ID');
        }
      } else {
        console.log('Database not initialized');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const searchById = async (id) => {
    try {
      if (db) {
        const row = await db.getFirstAsync('SELECT * FROM test WHERE id = ?', [id]);
        if (row) {
          console.log(`ID: ${row.id}, Value: ${row.value}, IntValue: ${row.intValue}`);
        } else {
          console.log('No record found with that ID');
        }
      } else {
        console.log('Database not initialized');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity style={styles.button} onPress={createTable}>
          <Text>Create Table</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={dropTable}>
          <Text>Drop Table</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity style={styles.button} onPress={addArray}>
          <Text>Add Array</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={testeClick}>
          <Text>Fetch Data</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity style={styles.button} onPress={() => searchById(2)}>
          <Text>Buscar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={removeData}>
          <Text>Remove</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => updatePorId('funcionou', 2)}>
        <Text>UpdatePorId</Text>
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