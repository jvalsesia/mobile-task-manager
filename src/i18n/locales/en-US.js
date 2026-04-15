const enUS = {
  header: {
    addMember: '+ Member',
    addTask: '+ Task',
  },
  timeline: {
    removeTaskTitle: 'Remove Task',
    removeTaskDesc: 'Are you sure you want to delete "{description}"?',
    removeMemberTitle: 'Remove Member',
    removeMemberDesc: 'Are you sure you want to delete "{name}" and ALL their tasks?',
    cancel: 'Cancel',
    delete: 'Delete',
    noMembers: 'No members yet.',
  },
  addMemberModal: {
    title: 'Add Family Member',
    namePlaceholder: 'Member Name',
    cancel: 'Cancel',
    save: 'Save',
  },
  addTaskModal: {
    title: 'New Task',
    noMembersError: 'Please add a family member first.',
    assignTo: 'Assign to Member:',
    description: 'Description:',
    descriptionPlaceholder: 'e.g. Do homework',
    startTime: 'Start Time:',
    duration: 'Duration (minutes):',
    enableAlarm: 'Enable Alarm:',
    alarmOffset: 'Alarm Offset (minutes before):',
    cancel: 'Cancel',
    save: 'Save',
    close: 'Close',
  },
  alarmPopup: {
    title: '⏰ Time for Task!',
    startsAt: 'Starts at:',
    dismiss: 'Dismiss',
    ttsMessage: 'Hello {name}, it\'s time to graciously start your task: {description}. Best of luck!',
  }
};

export default enUS;
