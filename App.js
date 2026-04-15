import React, { useState, useContext } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { TaskProvider, TaskContext } from './src/TaskContext';
import Header from './src/components/Header';
import TimelineGrid from './src/components/TimelineGrid';
import AddMemberModal from './src/modals/AddMemberModal';
import AddTaskModal from './src/modals/AddTaskModal';
import AlarmPopup from './src/components/AlarmPopup';

function AppContent() {
  const { addMember, addTask, activeAlarmTask, dismissAlarm } = useContext(TaskContext);
  const [memberModalVisible, setMemberModalVisible] = useState(false);
  const [taskModalVisible, setTaskModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Header 
        onAddMember={() => setMemberModalVisible(true)}
        onAddTask={() => setTaskModalVisible(true)}
      />
      
      <TimelineGrid />

      <AddMemberModal 
        visible={memberModalVisible} 
        onClose={() => setMemberModalVisible(false)} 
        onSave={addMember}
      />

      <AddTaskModal
        visible={taskModalVisible}
        onClose={() => setTaskModalVisible(false)}
        onSave={addTask}
      />

      <AlarmPopup
        visible={!!activeAlarmTask}
        task={activeAlarmTask}
        onDismiss={() => dismissAlarm(activeAlarmTask?.id)}
      />
    </View>
  );
}

export default function App() {
  return (
    <TaskProvider>
      <AppContent />
    </TaskProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
});
