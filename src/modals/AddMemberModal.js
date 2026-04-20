// src/modals/AddMemberModal.js
// Redesigned: live avatar preview, auto color, color swatch picker.

import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Animated,
} from 'react-native';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { C, PALETTE } from '../utils/theme';
import { t } from '../i18n';

function getNextColor(usedColors) {
  return PALETTE.find(c => !usedColors.includes(c)) || PALETTE[usedColors.length % PALETTE.length];
}

function getInitials(name) {
  return name.trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?';
}

export default function AddMemberModal({ bottomSheetRef, onSave, usedColors = [] }) {
  const snapPoints = React.useMemo(() => ['55%'], []);
  const [name, setName] = useState('');
  const [color, setColor] = useState('');

  const previewColor = color || getNextColor(usedColors);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Pulse avatar on name change
  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 1.12, useNativeDriver: true, speed: 30 }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 20 }),
    ]).start();
  }, [name, color]);

  const reset = () => { setName(''); setColor(''); };

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({ name: name.trim(), color: previewColor });
    reset();
    bottomSheetRef.current?.dismiss();
  };

  const isValid = name.trim().length > 0;

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      backgroundStyle={styles.sheetBg}
      handleIndicatorStyle={styles.handle}
    >
      <BottomSheetView style={styles.content}>
        <Text style={styles.title}>{t('addMemberModal.title') || 'New Member'}</Text>

        {/* Avatar preview */}
        <View style={styles.avatarWrapper}>
          <Animated.View style={[
            styles.avatarCircle,
            {
              backgroundColor: previewColor,
              transform: [{ scale: scaleAnim }],
              shadowColor: previewColor,
            },
          ]}>
            <Text style={styles.avatarText}>{getInitials(name)}</Text>
          </Animated.View>
        </View>

        {/* Name input */}
        <Text style={styles.label}>NAME</Text>
        <TextInput
          style={[styles.input, name ? { borderColor: C.violet } : {}]}
          placeholder="Enter name…"
          placeholderTextColor={C.subtle}
          value={name}
          onChangeText={setName}
          autoFocus
        />

        {/* Color picker */}
        <Text style={styles.label}>COLOR</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 24 }}>
          <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', paddingBottom: 4 }}>
            {/* Auto chip */}
            <TouchableOpacity
              onPress={() => setColor('')}
              style={[
                styles.autoChip,
                !color && { borderColor: C.sky, backgroundColor: `${C.sky}22` },
              ]}
            >
              <Text style={[styles.autoChipText, !color && { color: C.sky }]}>Auto ✦</Text>
            </TouchableOpacity>
            {/* Color swatches */}
            {PALETTE.map(col => (
              <TouchableOpacity
                key={col}
                onPress={() => setColor(col)}
                style={[
                  styles.swatch,
                  { backgroundColor: col },
                  color === col && styles.swatchSelected,
                ]}
              />
            ))}
          </View>
        </ScrollView>

        {/* Buttons */}
        <View style={styles.btnRow}>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => { reset(); bottomSheetRef.current?.dismiss(); }}
          >
            <Text style={styles.cancelBtnText}>{t('addTaskModal.cancel')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.saveBtn, { backgroundColor: isValid ? C.violet : '#2d1f4e', opacity: isValid ? 1 : 0.55 }]}
            onPress={handleSave}
            disabled={!isValid}
          >
            <Text style={styles.saveBtnText}>Add Member</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  sheetBg: { backgroundColor: C.bg1, borderRadius: 22 },
  handle: { backgroundColor: C.bg2, width: 36 },
  content: { flex: 1, padding: 20, paddingBottom: 36 },
  title: { fontFamily: 'SpaceMono-Bold', fontSize: 16, color: C.text, marginBottom: 22 },
  label: { fontFamily: 'SpaceMono-Regular', fontSize: 9, color: C.muted, letterSpacing: 1.5, marginBottom: 7 },
  input: {
    backgroundColor: C.bg0, borderWidth: 1, borderColor: C.bg2,
    borderRadius: 10, padding: 12, fontSize: 14, color: C.text, marginBottom: 18,
  },
  avatarWrapper: { alignItems: 'center', marginBottom: 22 },
  avatarCircle: {
    width: 68, height: 68, borderRadius: 34,
    alignItems: 'center', justifyContent: 'center',
    shadowOpacity: 0.4, shadowRadius: 16, shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  avatarText: { color: '#fff', fontSize: 26, fontFamily: 'SpaceMono-Bold' },
  autoChip: {
    paddingVertical: 6, paddingHorizontal: 13, borderRadius: 999,
    borderWidth: 1.5, borderColor: C.bg2,
  },
  autoChipText: { fontFamily: 'SpaceMono-Bold', fontSize: 9, color: C.muted },
  swatch: { width: 32, height: 32, borderRadius: 16 },
  swatchSelected: {
    transform: [{ scale: 1.18 }],
    shadowOpacity: 0.55, shadowRadius: 8, shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  btnRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  cancelBtn: { flex: 1, backgroundColor: C.bg2, borderRadius: 14, padding: 14, alignItems: 'center' },
  cancelBtnText: { fontFamily: 'SpaceMono-Bold', fontSize: 13, color: C.text },
  saveBtn: { flex: 2, borderRadius: 14, padding: 14, alignItems: 'center' },
  saveBtnText: { fontFamily: 'SpaceMono-Bold', fontSize: 13, color: '#fff' },
});
