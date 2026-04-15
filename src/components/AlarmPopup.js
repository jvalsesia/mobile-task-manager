import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import * as Speech from 'expo-speech';
import { t, getCurrentLocale } from '../i18n';

export default function AlarmPopup({ visible, task, onDismiss }) {

  const taskId = task?.id;
  const memberName = task?.memberName;
  const description = task?.description;

  useEffect(() => {
    let loopTimeout;

    const playSpeech = () => {
      if (visible && memberName && description) {
        const message = t('alarmPopup.ttsMessage', { name: memberName, description: description });

        Speech.speak(message, {
          rate: 0.9,
          pitch: 0.95,
          language: getCurrentLocale(),
          onDone: () => {
            // Ensure exactly 5 seconds between messages
            loopTimeout = setTimeout(playSpeech, 5000);
          }
        });
      }
    };

    if (visible && description) {
      Speech.stop();
      playSpeech();
    } else {
      Speech.stop();
      if (loopTimeout) clearTimeout(loopTimeout);
    }

    return () => {
      Speech.stop();
      if (loopTimeout) clearTimeout(loopTimeout);
    };
  }, [visible, taskId, memberName, description]);

  if (!task) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{t('alarmPopup.title')}</Text>
          <Text style={styles.description}>{task.description}</Text>
          <Text style={styles.timeLabel}>{t('alarmPopup.startsAt')} {task.startTime}</Text>

          <TouchableOpacity style={styles.btn} onPress={onDismiss}>
            <Text style={styles.btnText}>{t('alarmPopup.dismiss')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    width: '80%',
    backgroundColor: '#1e293b',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    padding: 24,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0ea5e9',
    marginBottom: 12,
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    color: '#f8fafc',
    marginBottom: 8,
  },
  timeLabel: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 24,
  },
  btn: {
    backgroundColor: '#0ea5e9',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  }
});
