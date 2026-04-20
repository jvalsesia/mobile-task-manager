// src/components/TimelineGrid.js
// Redesigned: avatar column headers, color-coded task cards,
// left accent bars, red "now" line, delete buttons.

import React, { useContext, useRef, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert,
} from 'react-native';
import { TaskContext } from '../TaskContext';
import { C, HOUR_HEIGHT, TIME_AXIS_W, COL_MIN_W } from '../utils/theme';
import { t } from '../i18n';

const PIXELS_PER_MINUTE = HOUR_HEIGHT / 60;

function Avatar({ name, color, size = 30 }) {
  const initials = name.trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <View style={{
      width: size, height: size, borderRadius: size / 2,
      backgroundColor: color, alignItems: 'center', justifyContent: 'center',
    }}>
      <Text style={{ color: '#fff', fontSize: size * 0.36, fontFamily: 'SpaceMono-Bold' }}>
        {initials}
      </Text>
    </View>
  );
}

export default function TimelineGrid() {
  const { members, tasks, removeTask, removeMember } = useContext(TaskContext);
  const scrollViewRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    if (containerHeight === 0) return;
    const now = new Date();
    const timeInPixels = (now.getHours() * 60 + now.getMinutes()) * PIXELS_PER_MINUTE;
    let offset = timeInPixels - containerHeight / 2;
    const totalHeight = 24 * HOUR_HEIGHT;
    offset = Math.max(0, Math.min(offset, totalHeight - containerHeight));
    scrollViewRef.current?.scrollTo({ y: offset, animated: true });
    const interval = setInterval(() => {
      const n = new Date();
      const y = (n.getHours() * 60 + n.getMinutes()) * PIXELS_PER_MINUTE;
      let o = y - containerHeight / 2;
      o = Math.max(0, Math.min(o, totalHeight - containerHeight));
      scrollViewRef.current?.scrollTo({ y: o, animated: true });
    }, 60000);
    return () => clearInterval(interval);
  }, [containerHeight]);

  const confirmRemoveTask = (task) => {
    Alert.alert(
      t('timeline.removeTaskTitle'),
      t('timeline.removeTaskDesc', { description: task.description }),
      [
        { text: t('timeline.cancel'), style: 'cancel' },
        { text: t('timeline.delete'), style: 'destructive', onPress: () => removeTask?.(task.id) },
      ]
    );
  };

  const confirmRemoveMember = (member) => {
    Alert.alert(
      t('timeline.removeMemberTitle'),
      t('timeline.removeMemberDesc', { name: member.name }),
      [
        { text: t('timeline.cancel'), style: 'cancel' },
        { text: t('timeline.delete'), style: 'destructive', onPress: () => removeMember?.(member.id) },
      ]
    );
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getTaskTop = (startTime) => {
    const [h, m] = startTime.split(':').map(Number);
    return (h * 60 + m) * PIXELS_PER_MINUTE;
  };

  // Current time in pixels for the "now" line
  const now = new Date();
  const nowY = (now.getHours() * 60 + now.getMinutes()) * PIXELS_PER_MINUTE;

  return (
    <View style={styles.container}>
      <ScrollView horizontal bounces={false} contentContainerStyle={{ flexGrow: 1, minWidth: '100%' }}>
        <View style={styles.gridWrapper}>

          {/* ── Member header row ── */}
          <View style={styles.headerRow}>
            <View style={styles.timeHeaderCell} />
            {members.map(member => (
              <View key={member.id} style={[styles.memberHeaderCell, { borderLeftColor: C.bg2 }]}>
                <Avatar name={member.name} color={member.color} size={30} />
                <Text style={[styles.memberName, { color: member.color }]}>{member.name}</Text>
                <TouchableOpacity
                  style={styles.deleteMemberBtn}
                  onPress={() => confirmRemoveMember(member)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={styles.deleteMemberBtnText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
            {members.length === 0 && (
              <View style={styles.emptyMembersCell}>
                <Text style={styles.emptyMembersText}>{t('timeline.noMembers')}</Text>
              </View>
            )}
          </View>

          {/* ── Scrollable timeline body ── */}
          <ScrollView
            ref={scrollViewRef}
            onLayout={e => setContainerHeight(e.nativeEvent.layout.height)}
          >
            <View style={styles.bodyContainer}>

              {/* Time axis */}
              <View style={styles.timeAxis}>
                {hours.map(h => (
                  <View key={h} style={styles.timeSlot}>
                    <Text style={styles.timeLabel}>
                      {String(h).padStart(2, '0')}:00
                    </Text>
                  </View>
                ))}
              </View>

              {/* Member columns */}
              <View style={styles.columnsContainer}>
                {/* Guide lines */}
                <View style={styles.guideLines} pointerEvents="none">
                  {hours.map(h => <View key={h} style={styles.guideLine} />)}
                </View>

                {/* Now line */}
                <View
                  pointerEvents="none"
                  style={[styles.nowLine, { top: nowY }]}
                >
                  <View style={styles.nowDot} />
                </View>

                {/* Per-member task columns */}
                {members.map(member => {
                  const memberTasks = tasks.filter(tk => tk.memberId === member.id);
                  return (
                    <View key={member.id} style={styles.memberColumn}>
                      {memberTasks.map(task => (
                        <View
                          key={task.id}
                          style={[
                            styles.taskBlock,
                            {
                              top: getTaskTop(task.startTime),
                              height: Math.max(task.durationMins * PIXELS_PER_MINUTE, 38),
                              backgroundColor: `${member.color}18`,
                              borderLeftColor: member.color,
                            },
                          ]}
                        >
                          <View style={styles.taskHeader}>
                            <Text style={[styles.taskTimeText, { color: member.color }]}>
                              {task.startTime}
                              {task.alarmEnabled && !task.alarmDismissed ? ' 🔔' : ''}
                            </Text>
                            <TouchableOpacity
                              style={styles.deleteButton}
                              onPress={() => confirmRemoveTask(task)}
                              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                            >
                              <Text style={styles.deleteButtonText}>✕</Text>
                            </TouchableOpacity>
                          </View>
                          <Text style={styles.taskText} numberOfLines={2}>
                            {task.description}
                          </Text>
                        </View>
                      ))}
                    </View>
                  );
                })}
              </View>

            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg0,
  },
  gridWrapper: {
    flex: 1,
    flexDirection: 'column',
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: C.bg2,
    backgroundColor: C.bg1,
  },
  timeHeaderCell: {
    width: TIME_AXIS_W,
    borderRightWidth: 1,
    borderRightColor: C.bg2,
  },
  memberHeaderCell: {
    flex: 1,
    minWidth: COL_MIN_W,
    paddingVertical: 8,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderLeftColor: C.bg2,
    gap: 4,
    position: 'relative',
  },
  memberName: {
    fontFamily: 'SpaceMono-Bold',
    fontSize: 10,
    letterSpacing: 0.3,
  },
  deleteMemberBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteMemberBtnText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: 'bold',
  },
  emptyMembersCell: {
    width: 260,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyMembersText: {
    color: C.muted,
    fontStyle: 'italic',
    fontSize: 12,
  },
  bodyContainer: {
    flexDirection: 'row',
    height: 24 * HOUR_HEIGHT,
  },
  timeAxis: {
    width: TIME_AXIS_W,
    borderRightWidth: 1,
    borderRightColor: C.bg2,
    backgroundColor: C.bg0,
  },
  timeSlot: {
    height: HOUR_HEIGHT,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: `${C.bg2}30`,
  },
  timeLabel: {
    fontSize: 9,
    color: C.subtle,
    fontFamily: 'SpaceMono-Regular',
  },
  columnsContainer: {
    flex: 1,
    flexDirection: 'row',
    position: 'relative',
  },
  guideLines: {
    ...StyleSheet.absoluteFillObject,
  },
  guideLine: {
    height: HOUR_HEIGHT,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: `${C.bg2}20`,
  },
  nowLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1.5,
    backgroundColor: C.red,
    zIndex: 5,
  },
  nowDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.red,
    marginTop: -3.25,
    marginLeft: -1,
  },
  memberColumn: {
    flex: 1,
    minWidth: COL_MIN_W,
    position: 'relative',
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: `${C.bg2}30`,
  },
  taskBlock: {
    position: 'absolute',
    left: 4,
    right: 4,
    borderRadius: 8,
    borderLeftWidth: 3,
    padding: 5,
    paddingRight: 22,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 2,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  taskTimeText: {
    fontFamily: 'SpaceMono-Bold',
    fontSize: 9,
    fontWeight: '700',
  },
  taskText: {
    color: C.text,
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 15,
  },
  deleteButton: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 8,
    fontWeight: 'bold',
  },
});
