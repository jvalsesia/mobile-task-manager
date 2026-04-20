// src/components/AlarmPopup.js
// Redesigned: pulse ring animation, member avatar, single dismiss CTA.

import React, { useEffect, useRef } from 'react';
import {
  View, Text, Modal, TouchableOpacity,
  StyleSheet, Animated,
} from 'react-native';
import { C } from '../utils/theme';

function Avatar({ name, color, size = 26 }) {
  const initials = name.trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: '#fff', fontSize: size * 0.36, fontFamily: 'SpaceMono-Bold' }}>{initials}</Text>
    </View>
  );
}

// Animated pulsing ring
function PulseRing({ color, delay = 0 }) {
  const scale = useRef(new Animated.Value(0.8)).current;
  const opacity = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(scale, { toValue: 1.8, duration: 1600, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0, duration: 1600, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(scale, { toValue: 0.8, duration: 0, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0.6, duration: 0, useNativeDriver: true }),
        ]),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <Animated.View style={[
      styles.pulseRing,
      { borderColor: color, transform: [{ scale }], opacity },
    ]} />
  );
}

export default function AlarmPopup({ visible, task, onDismiss }) {
  const cardScale = useRef(new Animated.Value(0.85)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(cardScale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 14,
        bounciness: 8,
      }).start();
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      cardScale.setValue(0.85);
      cardOpacity.setValue(0);
    }
  }, [visible]);

  if (!task) return null;

  const memberColor = task.memberColor || C.sky;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <Animated.View style={[
          styles.card,
          { transform: [{ scale: cardScale }], opacity: cardOpacity },
        ]}>
          {/* Pulse rings */}
          <View style={styles.iconContainer}>
            <PulseRing color={C.red} delay={0} />
            <PulseRing color={C.red} delay={500} />
            <View style={styles.bellCircle}>
              <Text style={styles.bellEmoji}>🔔</Text>
            </View>
          </View>

          {/* Label */}
          <Text style={styles.upcomingLabel}>
            TASK IN {task.alarmOffsetMins} MIN
          </Text>

          {/* Task name */}
          <Text style={styles.taskName}>{task.description}</Text>

          {/* Member + time */}
          <View style={styles.metaRow}>
            <Avatar name={task.memberName || '?'} color={memberColor} size={24} />
            <Text style={[styles.memberName, { color: memberColor }]}>
              {task.memberName}
            </Text>
            <Text style={styles.dot}>·</Text>
            <Text style={styles.startTime}>{task.startTime}</Text>
          </View>

          {/* Dismiss */}
          <TouchableOpacity style={styles.dismissBtn} onPress={onDismiss} activeOpacity={0.8}>
            <Text style={styles.dismissText}>Dismiss</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    backgroundColor: C.bg1,
    borderRadius: 22,
    padding: 28,
    borderWidth: 1,
    borderColor: C.bg2,
    alignItems: 'center',
    shadowColor: C.red,
    shadowOpacity: 0.15,
    shadowRadius: 32,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  iconContainer: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  pulseRing: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1.5,
  },
  bellCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: `${C.red}1a`,
    borderWidth: 2,
    borderColor: `${C.red}55`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellEmoji: {
    fontSize: 24,
  },
  upcomingLabel: {
    fontFamily: 'SpaceMono-Regular',
    fontSize: 9,
    color: C.red,
    letterSpacing: 2,
    marginBottom: 8,
  },
  taskName: {
    fontFamily: 'SpaceMono-Bold',
    fontSize: 19,
    color: C.text,
    textAlign: 'center',
    marginBottom: 14,
    lineHeight: 26,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 24,
  },
  memberName: {
    fontFamily: 'SpaceMono-Bold',
    fontSize: 12,
  },
  dot: {
    color: C.muted,
    fontSize: 12,
  },
  startTime: {
    fontFamily: 'SpaceMono-Regular',
    fontSize: 11,
    color: C.muted,
  },
  dismissBtn: {
    width: '100%',
    backgroundColor: C.red,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    shadowColor: C.red,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  dismissText: {
    fontFamily: 'SpaceMono-Bold',
    fontSize: 13,
    color: '#fff',
  },
});
