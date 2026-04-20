// src/components/FABGroup.js
// Dual floating action buttons — replaces the old header buttons.
// Place this inside App.js as an absolute-positioned overlay above everything.
//
// Usage in App.js:
//   <FABGroup
//     onAddTask={() => setTaskModalVisible(true)}
//     onAddMember={() => setMemberModalVisible(true)}
//   />

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { C } from '../utils/theme';
import { t } from '../i18n';

function FABButton({ onPress, size, bg, shadow, children }) {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.8}
            style={[styles.fab, { width: size, height: size, borderRadius: size / 2, backgroundColor: bg }, shadow]}
        >
            {children}
        </TouchableOpacity>
    );
}

export default function FABGroup({ onAddTask, onAddMember }) {
    return (
        <View style={styles.container} pointerEvents="box-none">
            {/* Member FAB (smaller, violet) */}
            <View style={styles.row}>
                <View style={styles.chip}>
                    <Text style={styles.chipText}>{t('header.addMember')}</Text>
                </View>
                <FABButton
                    onPress={onAddMember}
                    size={44}
                    bg={C.violet}
                    shadow={styles.shadowViolet}
                >
                    <Text style={styles.plusIcon}>+</Text>
                </FABButton>
            </View>

            {/* Task FAB (larger, sky) */}
            <View style={styles.row}>
                <View style={styles.chip}>
                    <Text style={styles.chipText}>{t('header.addTask')}</Text>
                </View>
                <FABButton
                    onPress={onAddTask}
                    size={56}
                    bg={C.sky}
                    shadow={styles.shadowSky}
                >
                    <Text style={[styles.plusIcon, { fontSize: 26 }]}>+</Text>
                </FABButton>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 24,
        right: 16,
        alignItems: 'flex-end',
        gap: 12,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    chip: {
        backgroundColor: C.bg1,
        borderRadius: 20,
        paddingVertical: 5,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: C.bg2,
        opacity: 0.92,
    },
    chipText: {
        fontFamily: 'SpaceMono-Regular',
        fontSize: 10,
        color: C.muted,
    },
    fab: {
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 6,
    },
    plusIcon: {
        color: '#fff',
        fontSize: 22,
        lineHeight: 26,
        fontWeight: '300',
    },
    shadowSky: {
        shadowColor: C.sky,
        shadowOpacity: 0.45,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
    },
    shadowViolet: {
        shadowColor: C.violet,
        shadowOpacity: 0.45,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
    },
});
