import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Switch, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TaskContext } from '../TaskContext';
import { t } from '../i18n';

export default function AddTaskModal({ visible, onClose, onSave }) {
  const { members } = useContext(TaskContext);
  
  const [memberId, setMemberId] = useState('');
  const [description, setDescription] = useState('');
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [duration, setDuration] = useState('60'); // String to handle TextInput
  const [alarmEnabled, setAlarmEnabled] = useState(false);
  const [alarmOffsetMins, setAlarmOffsetMins] = useState('5');

  // Initialize with first member if available when modal opens
  React.useEffect(() => {
    if (visible && members.length > 0 && !memberId) {
      setMemberId(members[0].id);
    }
  }, [visible, members]);

  const handleSave = () => {
    if (description.trim() && memberId) {
      const hours = time.getHours().toString().padStart(2, '0');
      const minutes = time.getMinutes().toString().padStart(2, '0');
      
      onSave({
        memberId,
        description: description.trim(),
        date: time.toISOString().split('T')[0],
        startTime: `${hours}:${minutes}`,
        durationMins: parseInt(duration, 10) || 60,
        alarmEnabled,
        alarmOffsetMins: parseInt(alarmOffsetMins, 10) || 5,
      });
      
      // Reset form
      setDescription('');
      setDuration('60');
      setAlarmEnabled(false);
      setAlarmOffsetMins('5');
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <ScrollView keyboardShouldPersistTaps="handled">
            <Text style={styles.title}>{t('addTaskModal.title')}</Text>

            {members.length === 0 ? (
              <Text style={styles.errorText}>{t('addTaskModal.noMembersError')}</Text>
            ) : (
              <>
                <Text style={styles.label}>{t('addTaskModal.assignTo')}</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={memberId}
                    onValueChange={(itemValue) => setMemberId(itemValue)}
                    style={{ color: '#f8fafc' }}
                    dropdownIconColor="#94a3b8"
                  >
                    {members.map(m => (
                      <Picker.Item key={m.id} label={m.name} value={m.id} />
                    ))}
                  </Picker>
                </View>

                <Text style={styles.label}>{t('addTaskModal.description')}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t('addTaskModal.descriptionPlaceholder')}
                  placeholderTextColor="#64748b"
                  value={description}
                  onChangeText={setDescription}
                />

                <Text style={styles.label}>{t('addTaskModal.startTime')}</Text>
                <TouchableOpacity style={styles.timeBtn} onPress={() => setShowTimePicker(true)}>
                  <Text style={styles.timeBtnText}>
                    {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </TouchableOpacity>

                {showTimePicker && (
                  <DateTimePicker
                    value={time}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowTimePicker(false);
                      if (selectedDate) setTime(selectedDate);
                    }}
                  />
                )}

                <Text style={styles.label}>{t('addTaskModal.duration')}</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={duration}
                  onChangeText={setDuration}
                />

                <View style={styles.switchRow}>
                  <Text style={styles.label}>{t('addTaskModal.enableAlarm')}</Text>
                  <Switch value={alarmEnabled} onValueChange={setAlarmEnabled} />
                </View>

                {alarmEnabled && (
                  <View style={{ marginBottom: 16 }}>
                    <Text style={styles.label}>{t('addTaskModal.alarmOffset')}</Text>
                    <TextInput
                      style={styles.input}
                      keyboardType="numeric"
                      value={alarmOffsetMins}
                      onChangeText={setAlarmOffsetMins}
                    />
                  </View>
                )}

                <View style={styles.buttonRow}>
                  <TouchableOpacity style={[styles.btn, styles.cancelBtn]} onPress={onClose}>
                    <Text style={styles.cancelBtnText}>{t('addTaskModal.cancel')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.btn, styles.saveBtn]} onPress={handleSave}>
                    <Text style={styles.saveBtnText}>{t('addTaskModal.save')}</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
            
            {members.length === 0 && (
               <TouchableOpacity style={[styles.btn, styles.cancelBtn, {marginTop: 20}]} onPress={onClose}>
                 <Text style={styles.cancelBtnText}>{t('addTaskModal.close')}</Text>
               </TouchableOpacity>
            )}
          </ScrollView>
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
  modalContainer: {
    width: '90%',
    maxHeight: '90%',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    padding: 24,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#f8fafc',
    textAlign: 'center'
  },
  label: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 6,
    fontWeight: '600'
  },
  input: {
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#f8fafc',
    marginBottom: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden'
  },
  timeBtn: {
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#1e293b',
  },
  timeBtnText: {
    fontSize: 16,
    color: '#f8fafc'
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelBtn: {
    backgroundColor: '#334155',
  },
  saveBtn: {
    backgroundColor: '#0ea5e9',
  },
  cancelBtnText: {
    color: '#f8fafc',
    fontWeight: '600',
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
  errorText: {
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 20,
  }
});
