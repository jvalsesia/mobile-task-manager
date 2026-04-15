import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getRandomColor } from './utils/colors';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activeAlarmTask, setActiveAlarmTask] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('@task_manager_data');
        if (storedData) {
          const { members: storedMembers, tasks: storedTasks } = JSON.parse(storedData);
          if (storedMembers) setMembers(storedMembers);
          if (storedTasks) setTasks(storedTasks);
        }
      } catch (e) {
        console.error('Failed to load storage data:', e);
      } finally {
        setIsLoaded(true);
      }
    };
    loadData();
  }, []);

  // Save data on changes
  useEffect(() => {
    const saveData = async () => {
      if (isLoaded) {
        try {
          await AsyncStorage.setItem('@task_manager_data', JSON.stringify({ members, tasks }));
        } catch (e) {
          console.error('Failed to save to storage:', e);
        }
      }
    };
    saveData();
  }, [members, tasks, isLoaded]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      
      for (const task of tasks) {
        if (!task.alarmEnabled || task.alarmDismissed) continue;
        
        // Format: task.date="YYYY-MM-DD", task.startTime="14:30"
        const taskDate = new Date(`${task.date}T${task.startTime}:00`);
        if (isNaN(taskDate.getTime())) continue;

        const offsetMins = parseInt(task.alarmOffsetMins, 10) || 5;
        const alarmTime = new Date(taskDate.getTime() - offsetMins * 60000);
        
        if (now >= alarmTime) {
          const matchingMember = members.find(m => m.id === task.memberId);
          setActiveAlarmTask({ ...task, memberName: matchingMember?.name || 'there' });
          break; // Show one at a time
        }
      }
    }, 5000); // Check every 5 seconds
    
    return () => clearInterval(interval);
  }, [tasks, members]);

  const dismissAlarm = (taskId) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, alarmDismissed: true } : t));
    setActiveAlarmTask(null);
  };

  // Examples:
  // { id: 'm1', name: 'Alice', color: '#FF6B6B' }
  // { id: 't1', memberId: 'm1', description: 'Homework', date: '2026-04-15', startTime: '14:30', durationMins: 60, alarmEnabled: true }

  const addMember = (memberData) => {
    // memberData can be a string (old format) or an object { name, color }
    const memberName = typeof memberData === 'string' ? memberData : memberData.name;
    const memberColor = typeof memberData === 'object' && memberData.color 
      ? memberData.color 
      : getRandomColor(members.map(m => m.color));

    const newMember = {
      id: Date.now().toString(),
      name: memberName,
      color: memberColor
    };
    setMembers([...members, newMember]);
  };

  const addTask = (taskObj) => {
    const newTask = {
      id: Date.now().toString(),
      ...taskObj
    };
    setTasks([...tasks, newTask]);
  };

  const removeTask = (taskId) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  const removeMember = (memberId) => {
    setMembers(members.filter(m => m.id !== memberId));
    setTasks(tasks.filter(t => t.memberId !== memberId));
  };

  return (
    <TaskContext.Provider value={{ members, tasks, addMember, addTask, removeTask, removeMember, activeAlarmTask, dismissAlarm }}>
      {children}
    </TaskContext.Provider>
  );
};
