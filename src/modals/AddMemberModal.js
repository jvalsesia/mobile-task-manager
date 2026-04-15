import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { t } from '../i18n';

export default function AddMemberModal({ visible, onClose, onSave }) {
  const [name, setName] = useState('');

  const handleSave = () => {
    if (name.trim()) {
      onSave({ name: name.trim() });
      setName('');
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>{t('addMemberModal.title')}</Text>
          
          <TextInput
            style={styles.input}
            placeholder={t('addMemberModal.namePlaceholder')}
            placeholderTextColor="#64748b"
            value={name}
            onChangeText={setName}
            autoFocus
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.btn, styles.cancelBtn]} onPress={onClose}>
              <Text style={styles.cancelBtnText}>{t('addMemberModal.cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.saveBtn]} onPress={handleSave}>
              <Text style={styles.saveBtnText}>{t('addMemberModal.save')}</Text>
            </TouchableOpacity>
          </View>
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
    width: '80%',
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
  input: {
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#f8fafc',
    marginBottom: 20,
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
  }
});
