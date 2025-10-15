import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack } from "expo-router";
import { View, FlatList, Text, StyleSheet, Pressable, TextInput, Dimensions } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

export default function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isVisibleModal, setIsVisibleModal] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskImportance, setTaskImportance] = useState<'low' | 'medium' | 'high'>('low');
  const [error, setError] = useState<string | null>(null);
  const screenWidth = Dimensions.get('window').width;
  

  interface Task {
    id: string;
    name: string;
    description?: string | null;
    importance: 'low' | 'medium' | 'high';
  }

  const sortTasksByImportance = (tasks: Task[]) => {
  const importanceOrder = { high: 0, medium: 1, low: 2 };
  return tasks.sort((a, b) => importanceOrder[a.importance] - importanceOrder[b.importance]);
};

  useEffect(() => {
    const loadTasks = async () => {
      const saved = await AsyncStorage.getItem('tasks');
      if (saved) {
        const loadedTasks = JSON.parse(saved);
        setTasks(sortTasksByImportance(loadedTasks));
      }
    }
    loadTasks();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleSubmit = () => {
    if(!taskName) {
      setError('Task name is required');
      return;
    }
    const newTask: Task = { id: Date.now().toString(), name: taskName, description: taskDescription || null, importance: taskImportance };
    const newTasks = sortTasksByImportance([...tasks, newTask]);
    setTasks(newTasks);
    
    // empty form after submit
    setError(null);
    setTaskName('');
    setTaskDescription('');
    setTaskImportance('low');
    setIsVisibleModal(false);
  }

  const handleDelete = async(id: string) => {
    const newTasks = tasks.filter(task => task.id !== id);
    setTasks(newTasks);
  }
  return (
    <>
    <Stack.Screen options={{ title: 'To do' }} />
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>To do app</Text>
      </View>
      <FlatList
        style={{ width: '100%' }}
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Swipeable
            overshootLeft={false}
            overshootRight={false}
            friction={2}
            leftThreshold={30}
            rightThreshold={30}
            renderLeftActions={() => <View style={{ flex: 1 }} />}
            renderRightActions={() => <View style={{ flex: 1 }} />}
            onSwipeableOpen={() => handleDelete(item.id)}
          >
      <View style={styles.taskContainer}>
        <Text style={styles.taskName}>{item.name}</Text>
        <Text style={styles.taskDescription}>{item.description}</Text>
        <Text style={[styles.taskImportance, { backgroundColor: item.importance === 'high' ? '#6DC7A0' : item.importance === 'medium' ? '#9EEBC8' : '#DAFFEF' }]}>
          {item.importance}
        </Text>
      </View>
    </Swipeable>
          )}
      />
        <Pressable style={styles.btnContainer} onPress={() => setIsVisibleModal(true)}>
          <Text style={styles.plusBtn}>+</Text>
        </Pressable>
      {isVisibleModal && (
        <View style={styles.modalOverlay}>
        <Pressable style={styles.overlayBackground} onPress={() => setIsVisibleModal(false)} />
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>New task</Text>
          <TextInput placeholder="Task name" style={styles.input} value={taskName} onChangeText={setTaskName} />
          {error && <Text style={{ color: '#E85D75' }}>{error}</Text>}
          <TextInput placeholder="Description" style={styles.description} value={taskDescription} onChangeText={setTaskDescription} />
          <View style={styles.importanceContainer}>
            <Text>Importance</Text>
            <View style={styles.importanceRange}>
              <Pressable style={[styles.importanceButton, taskImportance === 'low' && styles.activeImportanceButton]} onPress={() => setTaskImportance('low')}><Text>Low</Text></Pressable>
              <Pressable style={[styles.importanceButton, taskImportance === 'medium' && styles.activeImportanceButton]} onPress={() => setTaskImportance('medium')}><Text>Medium</Text></Pressable>
              <Pressable style={[styles.importanceButton, taskImportance === 'high' && styles.activeImportanceButton]} onPress={() => setTaskImportance('high')}><Text>High</Text></Pressable>
            </View>
          </View>
          <Pressable style={styles.btnSubmit} onPress={handleSubmit}>
            <Text style={styles.btnSubmitText}>Add task</Text>
          </Pressable>
        </View>
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
    width: '100%',
    backgroundColor: '#E4EAEC',
    alignItems: 'flex-start',
    justifyContent: 'center',
    color: '#171A21',
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
    width: '100%',
    gap: 10,
    padding: 20,
    flexGrow: 1,
  },
  taskContainer: {
    width: '90%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#FCFFFD',
    borderRadius: 10,
    gap: 7,
    alignSelf: 'center',
    marginBottom: 10,
    backgroundColor: '#FCFFFD',
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
    backgroundColor: '#6DC7A0',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  plusBtn: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#171A21',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },

  overlayBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // tamna prozirna pozadina
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
    padding: 5,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
  },
  activeImportanceButton: {
    borderColor: '#6DC7A0'
  },
  btnSubmit: {
    width: '100%',
    padding: 10,
    backgroundColor: '#6DC7A0',
    borderRadius: 8,
    marginTop: 8,
    alignItems: 'center',
  },
  btnSubmitText: {
    fontWeight: 'bold',
  }
});