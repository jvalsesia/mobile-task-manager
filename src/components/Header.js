// src/components/Header.js
// Live clock + date. No action buttons — those moved to FABGroup.

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { C } from '../utils/theme';
import { t, getCurrentLocale } from '../i18n';

export default function Header() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const locale = getCurrentLocale();
  const formattedDate = now.toLocaleDateString(locale, {
    weekday: 'long', month: 'long', day: 'numeric',
  });
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');

  return (
    <View style={styles.container}>
      <Text style={styles.date}>{formattedDate.toUpperCase()}</Text>
      <View style={styles.clockRow}>
        <Text style={styles.clock}>{hh}:{mm}</Text>
        <Text style={styles.seconds}>:{ss}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 18,
    paddingTop: 52,
    paddingBottom: 12,
    backgroundColor: C.bg1,
    borderBottomWidth: 1,
    borderBottomColor: C.bg2,
  },
  date: {
    fontFamily: 'SpaceMono-Regular',
    fontSize: 9,
    color: C.muted,
    letterSpacing: 2,
    marginBottom: 4,
  },
  clockRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  clock: {
    fontFamily: 'SpaceMono-Bold',
    fontSize: 28,
    color: C.text,
    letterSpacing: -2,
    lineHeight: 32,
  },
  seconds: {
    fontFamily: 'SpaceMono-Regular',
    fontSize: 13,
    color: C.subtle,
    letterSpacing: -0.5,
    marginBottom: 2,
  },
});
