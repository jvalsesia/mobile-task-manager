// src/modals/AddTaskModal.js
// Redesigned: bottom-sheet style, avatar member selector,
// alarm toggle with animated expand, +/- offset control.
//
// Install dependency: npm install @gorhom/bottom-sheet
// Then wrap your App root with <GestureHandlerRootView> and <BottomSheetModalProvider>
// (see README note at bottom of this file)

import React, { useState, useContext, useEffect, useCallback, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Animated,
} from 'react-native';
import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { TaskContext } from '../TaskContext';
import { C, PALETTE } from '../utils/theme';
import { t } from '../i18n';

// ── Avatar ────────────────────────────────────────────────────
function Avatar({ name, color, size = 28 }) {
  const initials = name.trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: '#fff', fontSize: size * 0.36, fontFamily: 'SpaceMono-Bold' }}>{initials}</Text>
    </View>
  );
}

// ── Toggle ────────────────────────────────────────────────────
function Toggle({ on, onChange, color = C.sky }) {
  const anim = useRef(new Animated.Value(on ? 1 : 0)).current;
  useEffect(() => {
    Animated.spring(anim, { toValue: on ? 1 : 0, useNativeDriver: false, speed: 20 }).start();
  }, [on]);
  const translateX = anim.interpolate({ inputRange: [0, 1], outputRange: [2, 20] });
  const bgColor = anim.interpolate({ inputRange: [0, 1], outputRange: [C.bg2, color] });
  return (
    <TouchableOpacity onPress={() => onChange(!on)} activeOpacity={0.8}>
      <Animated.View style={{ width: 44, height: 26, borderRadius: 13, backgroundColor: bgColor, justifyContent: 'center' }}>
        <Animated.View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: '#fff', transform: [{ translateX }], shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 2, shadowOffset: { width: 0, height: 1 } }} />
      </Animated.View>
    </TouchableOpacity>
  );
}

// ── Main modal ────────────────────────────────────────────────
export default function AddTaskModal({ bottomSheetRef, onSave }) {
  const { members } = useContext(TaskContext);
  const snapPoints = React.useMemo(() => ['75%', '90%'], []);

  const [memberId, setMemberId] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [durationMins, setDurationMins] = useState(60);
  const [alarmEnabled, setAlarmEnabled] = useState(false);
  const [alarmOffset, setAlarmOffset] = useState(5);

  const alarmHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(alarmHeight, {
      toValue: alarmEnabled ? 1 : 0,
      useNativeDriver: false,
      speed: 18,
    }).start();
  }, [alarmEnabled]);

  // Pre-select first member when sheet opens
  const handleSheetChanges = useCallback((index) => {
    if (index >= 0 && members.length > 0 && !memberId) {
      setMemberId(members[0].id);
    }
  }, [members, memberId]);

  const reset = () => {
    setDescription('');
    setDurationMins(60);
    setAlarmEnabled(false);
    setAlarmOffset(5);
  };

  const handleSave = () => {
    if (!description.trim() || !memberId) return;
    const [h, m] = startTime.split(':');
    onSave({
      memberId,
      description: description.trim(),
      date: new Date().toISOString().split('T')[0],
      startTime: `${h.padStart(2, '0')}:${m.padStart(2, '0')}`,
      durationMins,
      alarmEnabled,
      alarmOffsetMins: alarmOffset,
    });
    reset();
    bottomSheetRef.current?.dismiss();
  };

  const isValid = description.trim() && memberId;

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      backgroundStyle={styles.sheetBg}
      handleIndicatorStyle={styles.handle}
    >
      <BottomSheetScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{t('addTaskModal.title')}</Text>

        {members.length === 0 ? (
          <Text style={styles.errorText}>{t('addTaskModal.noMembersError')}</Text>
        ) : (
          <>
            {/* Member selector */}
            <Text style={styles.label}>ASSIGN TO</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 18 }}>
              <View style={{ flexDirection: 'row', gap: 10, paddingBottom: 2 }}>
                {members.map(m => (
                  <TouchableOpacity
                    key={m.id}
                    onPress={() => setMemberId(m.id)}
                    style={[
                      styles.memberChip,
                      {
                        backgroundColor: memberId === m.id ? `${m.color}25` : `${C.bg2}44`,
                        borderColor: memberId === m.id ? m.color : C.bg2,
                      },
                    ]}
                  >
                    <Avatar name={m.name} color={m.color} size={28} />
                    <Text style={[styles.memberChipLabel, { color: memberId === m.id ? m.color : C.muted }]}>
                      {m.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {/* Description */}
            <TextInput
              style={[styles.input, description ? { borderColor: C.sky } : {}]}
              placeholder={t('addTaskModal.descriptionPlaceholder')}
              placeholderTextColor={C.subtle}
              value={description}
              onChangeText={setDescription}
            />

            {/* Time + Duration */}
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>START TIME</Text>
                <TextInput
                  style={styles.input}
                  value={startTime}
                  onChangeText={setStartTime}
                  placeholder="09:00"
                  placeholderTextColor={C.subtle}
                  keyboardType="numbers-and-punctuation"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>DURATION (MIN)</Text>
                <TextInput
                  style={styles.input}
                  value={String(durationMins)}
                  onChangeText={v => setDurationMins(parseInt(v) || 60)}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Alarm toggle */}
            <View style={[styles.alarmRow, alarmEnabled && { borderColor: `${C.sky}55`, backgroundColor: `${C.sky}10` }]}>
              <View>
                <Text style={[styles.alarmLabel, alarmEnabled && { color: C.sky }]}>🔔 {t('addTaskModal.enableAlarm')}</Text>
                {alarmEnabled && <Text style={styles.alarmSub}>Notify before task starts</Text>}
              </View>
              <Toggle on={alarmEnabled} onChange={setAlarmEnabled} color={C.sky} />
            </View>

            {/* Alarm offset (animated expand) */}
            <Animated.View style={{
              overflow: 'hidden',
              maxHeight: alarmHeight.interpolate({ inputRange: [0, 1], outputRange: [0, 70] }),
              opacity: alarmHeight,
              marginBottom: alarmEnabled ? 16 : 0,
            }}>
              <View style={styles.offsetRow}>
                <Text style={styles.offsetLabel}>NOTIFY ME</Text>
                <View style={styles.offsetControls}>
                  <TouchableOpacity onPress={() => setAlarmOffset(o => Math.max(1, o - 1))} style={styles.offsetBtn}>
                    <Text style={styles.offsetBtnText}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.offsetValue}>{alarmOffset}</Text>
                  <TouchableOpacity onPress={() => setAlarmOffset(o => Math.min(60, o + 1))} style={styles.offsetBtn}>
                    <Text style={styles.offsetBtnText}>+</Text>
                  </TouchableOpacity>
                  <Text style={styles.offsetUnit}>min before</Text>
                </View>
              </View>
            </Animated.View>

            {/* Buttons */}
            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => bottomSheetRef.current?.dismiss()}>
                <Text style={styles.cancelBtnText}>{t('addTaskModal.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveBtn, { backgroundColor: isValid ? C.sky : '#1e3a4a', opacity: isValid ? 1 : 0.6 }]}
                onPress={handleSave}
                disabled={!isValid}
              >
                <Text style={styles.saveBtnText}>{t('addTaskModal.save')}</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  sheetBg: { backgroundColor: C.bg1, borderRadius: 22 },
  handle: { backgroundColor: C.bg2, width: 36 },
  content: { padding: 20, paddingBottom: 40 },
  title: { fontFamily: 'SpaceMono-Bold', fontSize: 16, color: C.text, marginBottom: 20 },
  label: { fontFamily: 'SpaceMono-Regular', fontSize: 9, color: C.muted, letterSpacing: 1.5, marginBottom: 7 },
  input: {
    backgroundColor: C.bg0, borderWidth: 1, borderColor: C.bg2,
    borderRadius: 10, padding: 12, fontSize: 13, color: C.text,
    marginBottom: 14,
  },
  row: { flexDirection: 'row', gap: 10 },
  memberChip: {
    borderRadius: 12, padding: 10, alignItems: 'center',
    minWidth: 80, borderWidth: 1.5, gap: 5,
  },
  memberChipLabel: { fontFamily: 'SpaceMono-Bold', fontSize: 9 },
  alarmRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: `${C.bg0}80`, borderRadius: 10, padding: 13,
    borderWidth: 1, borderColor: C.bg2, marginBottom: 10,
  },
  alarmLabel: { fontFamily: 'SpaceMono-Bold', fontSize: 11, color: C.muted, marginBottom: 2 },
  alarmSub: { fontFamily: 'SpaceMono-Regular', fontSize: 9, color: C.subtle },
  offsetRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: `${C.sky}0c`, borderRadius: 10, padding: 11,
    borderWidth: 1, borderColor: `${C.sky}28`, marginTop: 2,
  },
  offsetLabel: { fontFamily: 'SpaceMono-Regular', fontSize: 9, color: C.sky, letterSpacing: 1 },
  offsetControls: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  offsetBtn: { width: 30, height: 30, borderRadius: 15, backgroundColor: C.bg2, alignItems: 'center', justifyContent: 'center' },
  offsetBtnText: { color: C.text, fontSize: 18, lineHeight: 22 },
  offsetValue: { fontFamily: 'SpaceMono-Bold', fontSize: 15, color: C.text, minWidth: 22, textAlign: 'center' },
  offsetUnit: { fontFamily: 'SpaceMono-Regular', fontSize: 9, color: C.muted },
  btnRow: { flexDirection: 'row', gap: 10, marginTop: 6 },
  cancelBtn: { flex: 1, backgroundColor: C.bg2, borderRadius: 14, padding: 14, alignItems: 'center' },
  cancelBtnText: { fontFamily: 'SpaceMono-Bold', fontSize: 13, color: C.text },
  saveBtn: { flex: 2, borderRadius: 14, padding: 14, alignItems: 'center' },
  saveBtnText: { fontFamily: 'SpaceMono-Bold', fontSize: 13, color: '#fff' },
  errorText: { color: C.red, textAlign: 'center', marginBottom: 20, fontFamily: 'SpaceMono-Regular' },
});

/*
── README: Setup for @gorhom/bottom-sheet ──────────────────────

1. Install:
   npm install @gorhom/bottom-sheet @gorhom/portal react-native-gesture-handler react-native-reanimated

2. Wrap your App in App.js:
   import { GestureHandlerRootView } from 'react-native-gesture-handler';
   import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

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

3. In AppContent, create refs and pass them:
   const taskSheetRef = useRef(null);
   const memberSheetRef = useRef(null);
   ...
   <FABGroup
     onAddTask={() => taskSheetRef.current?.present()}
     onAddMember={() => memberSheetRef.current?.present()}
   />
   <AddTaskModal bottomSheetRef={taskSheetRef} onSave={addTask} />
   <AddMemberModal bottomSheetRef={memberSheetRef} onSave={addMember} />
*/
