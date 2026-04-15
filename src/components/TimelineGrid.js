import React, { useContext, useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { TaskContext } from '../TaskContext';
import { t } from '../i18n';

const PIXELS_PER_MINUTE = 1;
const HOUR_HEIGHT = 60 * PIXELS_PER_MINUTE;

export default function TimelineGrid() {
  const { members, tasks, removeTask, removeMember } = useContext(TaskContext);
  const scrollViewRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    if (containerHeight === 0) return;

    const scrollToCurrentTime = () => {
      const now = new Date();
      const h = now.getHours();
      const m = now.getMinutes();
      const timeInPixels = (h * 60 + m) * PIXELS_PER_MINUTE;
      
      let offset = timeInPixels - (containerHeight / 2);
      const totalHeight = 24 * HOUR_HEIGHT;
      if (offset < 0) offset = 0;
      if (offset > totalHeight - containerHeight) offset = totalHeight - containerHeight;
      
      scrollViewRef.current?.scrollTo({ y: offset, animated: true });
    };

    // Initial scroll
    scrollToCurrentTime();

    // Re-center every minute
    const interval = setInterval(scrollToCurrentTime, 60000);
    return () => clearInterval(interval);
  }, [containerHeight]);

const confirmRemoveTask = (task) => {
  Alert.alert(
    t('timeline.removeTaskTitle'),
    t('timeline.removeTaskDesc', { description: task.description }),
    [
      { text: t('timeline.cancel'), style: "cancel" },
      { text: t('timeline.delete'), style: "destructive", onPress: () => removeTask && removeTask(task.id) }
    ]
  );
};

const confirmRemoveMember = (member) => {
  Alert.alert(
    t('timeline.removeMemberTitle'),
    t('timeline.removeMemberDesc', { name: member.name }),
    [
      { text: t('timeline.cancel'), style: "cancel" },
      { text: t('timeline.delete'), style: "destructive", onPress: () => removeMember && removeMember(member.id) }
    ]
  );
};

const hours = Array.from({ length: 24 }, (_, i) => i); // 0 to 23

// Format time (e.g., "08:00")
const formatTimeInfo = (h) => {
  return h.toString().padStart(2, '0') + ':00';
};

const getTaskTopPosition = (startTimeStr) => {
  const [h, m] = startTimeStr.split(':').map(Number);
  return (h * 60 + m) * PIXELS_PER_MINUTE;
};

return (
  <View style={styles.container}>
    <ScrollView horizontal bounces={false} contentContainerStyle={{ flexGrow: 1, minWidth: '100%' }}>
      <View style={styles.gridWrapper}>

        {/* Header Row for Members */}
        <View style={styles.headerRow}>
          <View style={styles.timeHeaderCell} />
          {members.map(member => (
            <View key={member.id} style={[styles.memberHeaderCell, { backgroundColor: '#2563eb' }]}>
              <Text style={[styles.memberName, { color: '#ffffff' }]}>{member.name}</Text>
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

        {/* Timeline Content */}
        <ScrollView ref={scrollViewRef} onLayout={(e) => setContainerHeight(e.nativeEvent.layout.height)}>
          <View style={styles.bodyContainer}>
            {/* Time axis */}
            <View style={styles.timeAxis}>
              {hours.map(h => (
                <View key={h} style={styles.timeSlot}>
                  <Text style={styles.timeLabel}>{formatTimeInfo(h)}</Text>
                </View>
              ))}
            </View>

            {/* Columns for members */}
            <View style={styles.columnsContainer}>
              {/* Horizontal Guide Lines */}
              <View style={styles.guideLines} pointerEvents="none">
                {hours.map(h => (
                  <View key={h} style={styles.guideLine} />
                ))}
              </View>

              {members.map(member => {
                const memberTasks = tasks.filter(t => t.memberId === member.id);
                return (
                  <View key={member.id} style={styles.memberColumn}>
                    {memberTasks.map(task => (
                      <View
                        key={task.id}
                        style={[
                          styles.taskBlock,
                          {
                            backgroundColor: 'rgba(71, 85, 105, 0.85)',
                            top: getTaskTopPosition(task.startTime),
                            height: Math.max(task.durationMins * PIXELS_PER_MINUTE, 40),
                          }
                        ]}
                      >
                        <View style={styles.taskHeader}>
                          <Text style={styles.taskTimeText}>{task.startTime}</Text>
                          <TouchableOpacity 
                            style={styles.deleteButton} 
                            onPress={() => confirmRemoveTask(task)}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                          >
                            <Text style={styles.deleteButtonText}>✕</Text>
                          </TouchableOpacity>
                        </View>
                        <Text style={styles.taskText} numberOfLines={2}>{task.description}</Text>
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
    backgroundColor: '#1e293b'
  },
  gridWrapper: {
    flex: 1,
    flexDirection: 'column',
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    backgroundColor: '#1e293b',
  },
  timeHeaderCell: {
    width: 60,
    borderRightWidth: 1,
    borderRightColor: '#334155',
  },
  memberHeaderCell: {
    flex: 1,
    minWidth: 100,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#334155',
  },
  memberName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyMembersCell: {
    width: 250,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyMembersText: {
    color: '#94a3b8',
    fontStyle: 'italic',
  },
  bodyContainer: {
    flexDirection: 'row',
    height: 24 * HOUR_HEIGHT,
  },
  timeAxis: {
    width: 60,
    borderRightWidth: 1,
    borderRightColor: '#334155',
    backgroundColor: '#1e293b',
  },
  timeSlot: {
    height: HOUR_HEIGHT,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 4,
  },
  timeLabel: {
    fontSize: 12,
    color: '#94a3b8',
  },
  columnsContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  guideLines: {
    ...StyleSheet.absoluteFillObject,
  },
  guideLine: {
    height: HOUR_HEIGHT,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  memberColumn: {
    flex: 1,
    minWidth: 100,
    borderRightWidth: 1,
    borderRightColor: '#1e293b',
    position: 'relative',
  },
  taskBlock: {
    position: 'absolute',
    left: 4,
    right: 4,
    borderRadius: 6,
    padding: 6,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  deleteButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  deleteMemberBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteMemberBtnText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  taskTimeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    opacity: 0.9,
  },
  taskText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600'
  }
});
