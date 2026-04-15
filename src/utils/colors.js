export const AVAILABLE_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5',
  '#9B59B6', '#3498DB', '#1ABC9C', '#F1C40F', '#E67E22', '#E74C3C'
];

export const getRandomColor = (usedColors = []) => {
  const available = AVAILABLE_COLORS.filter(c => !usedColors.includes(c));
  if (available.length > 0) {
    return available[Math.floor(Math.random() * available.length)];
  }
  return AVAILABLE_COLORS[Math.floor(Math.random() * AVAILABLE_COLORS.length)];
};
