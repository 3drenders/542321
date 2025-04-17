import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from 'react-native';

const steps = [
  { count: 5, label: 'things you can see' },
  { count: 4, label: 'things you can touch' },
  { count: 3, label: 'things you can hear' },
  { count: 2, label: 'things you can smell' },
  { count: 1, label: 'thing you can taste' },
];

export default function App() {
  const [stepIndex, setStepIndex] = useState(0);
  const [currentCount, setCurrentCount] = useState(steps[0].count);
  const initialCount = steps[stepIndex].count;

  const handleTap = () => {
    if (currentCount > 1) {
      setCurrentCount(currentCount - 1);
    } else {
      const nextStep = stepIndex + 1;
      if (nextStep < steps.length) {
        setStepIndex(nextStep);
        setCurrentCount(steps[nextStep].count);
      } else {
        // End of all grounding steps
        console.log('All steps completed');
      }
    }
  };

  const handleReset = () => {
    setStepIndex(0);
    setCurrentCount(steps[0].count);
  };

  const currentStep = steps[stepIndex];
  const progress =
    (currentStep.count - currentCount) / currentStep.count;

  return (
    <Pressable style={styles.container} onPress={handleTap}>
      <View style={styles.centerContent}>
        <Text style={styles.bigNumber}>{currentCount}</Text>
        <Text style={styles.instructionText}>
          {currentStep.label}
        </Text>
        <Text style={styles.hintText}>Tap anywhere to count a thing</Text>
      </View>

      <View style={styles.bottomUI}>
        <View style={styles.progressBarBackground}>
          <View
            style={[styles.progressBarFill, { width: `${progress * 100}%` }]}
          />
        </View>

        <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
          <Text style={styles.resetText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    paddingBottom: 100,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  bigNumber: {
    fontSize: 80,
    color: '#4ade80',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 26,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 6,
  },
  hintText: {
    fontSize: 14,
    color: '#888',
    marginTop: 50,
  },
  bottomUI: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    alignItems: 'center',
  },
  progressBarBackground: {
    width: 400, 
    height: 10,
    backgroundColor: '#333',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 50,
  },
  
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4ade80',
  },
  resetButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#222',
    borderRadius: 8,
  },
  resetText: {
    color: '#ccc',
    fontSize: 14,
  },
});
