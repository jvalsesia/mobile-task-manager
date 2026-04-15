import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { t, getCurrentLocale } from '../i18n';

export default function Header({ onAddMember, onAddTask }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const dateOptions = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
  const formattedDate = now.toLocaleDateString(getCurrentLocale(), dateOptions);
  
  const formattedTime = now.toLocaleTimeString(getCurrentLocale(), {
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });

  return (
    <View style={styles.container}>
      <View style={styles.headerInfo} pointerEvents="none">
        <Text style={styles.dateText}>{formattedDate}</Text>
        <Text style={styles.clockText}>{formattedTime}</Text>
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.button, styles.btnMember]} onPress={onAddMember}>
          <Text style={styles.buttonText}>{t('header.addMember')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.btnTask]} onPress={onAddTask}>
          <Text style={styles.buttonText}>{t('header.addTask')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50, // safe area approx
    paddingBottom: 16,
    backgroundColor: '#1e293b',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  headerInfo: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
  },
  dateText: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  clockText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#f8fafc',
    fontVariant: ['tabular-nums'],
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    zIndex: 1,
  },
  button: {
    width: 100,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    backgroundColor: '#0ea5e9', // Consistent light blue highlight
  },
  btnMember: {
    // Optionally a slightly different hue if desired, or same
    backgroundColor: '#0284c7', 
  },
  btnTask: {
    backgroundColor: '#0ea5e9',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  }
});
