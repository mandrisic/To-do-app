import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack } from "expo-router";
import { View, ScrollView, Text, StyleSheet, Pressable, TextInput } from 'react-native';

export default function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isVisibleModal, setIsVisibleModal] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskImportance, setTaskImportance] = useState<'low' | 'medium' | 'high'>('low');

  interface Task {
    name: string;
    description?: string | null;
    importance: 'low' | 'medium' | 'high';
  }

  useEffect(() => {
    const loadTasks = async () => {
      const saved = await AsyncStorage.getItem('tasks');
      if (saved) {
        setTasks(JSON.parse(saved));
      }
    }
    loadTasks();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleSubmit = () => {
    if(!taskName) return;
    const newTask: Task = { name: taskName, description: taskDescription || null, importance: taskImportance };
    setTasks([...tasks, newTask]);
    // empty form after submit
    setTaskName('');
    setTaskDescription('');
    setTaskImportance('low');
    setIsVisibleModal(false);
  }
  return (
    <>
    <Stack.Screen options={{ headerShown: false, title: 'To do' }} />
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>To do app</Text>
      </View>
      <ScrollView contentContainerStyle={styles.body}>
        {tasks.length === 0 ? (
        <Text>Write some tasks and complete them!</Text>) : (
          tasks.map((task, index) => (
            <Pressable key={index} style={styles.taskContainer} onPress={() => {}} > 
              <Text style={styles.taskName}>{task.name}</Text> 
              <Text style={styles.taskDescription}>{task.description}</Text>
              <Text style={styles.taskImportance}>{task.importance}</Text>
            </Pressable>
          ))
        )}
      </ScrollView>
        <Pressable style={styles.btnContainer} onPress={() => setIsVisibleModal(true)}>
          <Text style={styles.plusBtn}>+</Text>
        </Pressable>
      {isVisibleModal && (
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>New task</Text>
          <TextInput placeholder="Task name" style={styles.input} value={taskName} onChangeText={setTaskName} />
          <TextInput placeholder="Description" style={styles.description} value={taskDescription} onChangeText={setTaskDescription} />
          <View style={styles.importanceContainer}>
            <Text>Importance</Text>
            <View style={styles.importanceRange}>
              <Pressable style={styles.importanceButton} onPress={() => setTaskImportance('low')}><Text>Low</Text></Pressable>
              <Pressable style={styles.importanceButton} onPress={() => setTaskImportance('medium')}><Text>Medium</Text></Pressable>
              <Pressable style={styles.importanceButton} onPress={() => setTaskImportance('high')}><Text>High</Text></Pressable>
            </View>
          </View>
          <Pressable style={styles.btnSubmit} onPress={handleSubmit}>
            <Text style={styles.btnSubmitText}>Add task</Text>
          </Pressable>
        </View>
      )}
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  header: {
    width: '100%',
    padding: 25,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  body: {
    position: 'relative',
    flex: 1,
    gap: 10,
    padding: 20,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  taskContainer: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    gap: 7,
    flexGrow: 1,
    flex: 1,
  },
  taskName: {
    fontSize: 16,
    fontWeight: 'bold', 
  },
  taskDescription: {
    fontStyle: 'italic',
    color: '#555',
  },
  taskImportance: {
    fontWeight: 'bold',
    backgroundColor: '#e0e0e0',
    padding: 5,
    paddingHorizontal: 8,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  btnContainer: {
    position: 'absolute',
    bottom: 30,
    right: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    width: 60,
    height: 60,
    padding: 10,
    backgroundColor: '#2ea99a',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  plusBtn: {
    color: '#000',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modal: {
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 14,
    top: '42%',
    left: '50%',
    transform: [{ translateX: -0.5 * 300 }, { translateY: -0.5 * 200 }],
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  description: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  importanceContainer: {
    width: '100%',
    gap: 10,
  },
  importanceRange: {
    gap: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  importanceButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
  },
  btnSubmit: {
    width: '100%',
    padding: 10,
    backgroundColor: '#2ea99a',
    borderRadius: 8,
    marginTop: 8,
    alignItems: 'center',
  },
  btnSubmitText: {
    fontWeight: 'bold',
  }
});