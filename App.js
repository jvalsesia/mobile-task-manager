// App.js — Updated to use new components
// Replaces header buttons with FABGroup + bottom sheet refs.
//
// Setup (one-time):
//   npm install @gorhom/bottom-sheet @gorhom/portal react-native-gesture-handler react-native-reanimated
//   Add to babel.config.js plugins: ['react-native-reanimated/plugin']

import 'react-native-gesture-handler';
import React, { useState, useContext, useRef } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { TaskProvider, TaskContext } from './src/TaskContext';
import Header from './src/components/Header';
import TimelineGrid from './src/components/TimelineGrid';
import FABGroup from './src/components/FABGroup';
import AddTaskModal from './src/modals/AddTaskModal';
import AddMemberModal from './src/modals/AddMemberModal';
import AlarmPopup from './src/components/AlarmPopup';
import { C } from './src/utils/theme';

function AppContent() {
  const { members, addMember, addTask, activeAlarmTask, dismissAlarm } = useContext(TaskContext);

  const taskSheetRef = useRef(null);
  const memberSheetRef = useRef(null);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg0} />

      <Header />

      <TimelineGrid />

      <FABGroup
        onAddTask={() => taskSheetRef.current?.present()}
        onAddMember={() => memberSheetRef.current?.present()}
      />

      <AddTaskModal
        bottomSheetRef={taskSheetRef}
        onSave={addTask}
      />

      <AddMemberModal
        bottomSheetRef={memberSheetRef}
        onSave={addMember}
        usedColors={members.map(m => m.color)}
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <TaskProvider>
          <AppContent />
        </TaskProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg0,
  },
});
