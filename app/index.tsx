import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Animated,
} from 'react-native';

const steps = [
  { count: 5, label: 'things you can see 👀', backgroundColor: '#AED9FF' },
  { count: 4, label: 'things you can touch 👆', backgroundColor: '#FFD8D8' },
  { count: 3, label: 'things you can hear 🦻', backgroundColor: '#D6CCE4' },
  { count: 2, label: 'things you can smell 👃', backgroundColor: '#E5D8FF' },
  { count: 1, label: 'thing you can taste 👅', backgroundColor: '#B2F1E4' },
];

export default function App() {
  const [stepIndex, setStepIndex] = useState(0);
  const [currentCount, setCurrentCount] = useState(steps[0].count);
  const progressAnim = useRef(new Animated.Value(0)).current;

  const currentStep = steps[stepIndex];
  const initialCount = currentStep.count;

  useEffect(() => {
    const newProgress = (currentStep.count - currentCount) / currentStep.count;
    Animated.timing(progressAnim, {
      toValue: newProgress,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [currentCount, stepIndex]);

  const handleTap = () => {
    if (currentCount > 1) {
      setCurrentCount(currentCount - 1);
    } else {
      // Animate the final progress bar to 100%
      Animated.timing(progressAnim, {
        toValue: 1, // Full bar
        duration: 200,
        useNativeDriver: false,
      }).start(() => {
        // Only after animation completes, proceed to next step
        const nextStep = stepIndex + 1;
        if (nextStep < steps.length) {
          setStepIndex(nextStep);
          setCurrentCount(steps[nextStep].count);
          progressAnim.setValue(0); // Reset animation for next step
        } else {
          console.log('All steps completed');
        }
      });
    }
  };

  const handleReset = () => {
    setStepIndex(0);
    setCurrentCount(steps[0].count);
  };

  return (
    <Pressable
      style={[styles.container, { backgroundColor: currentStep.backgroundColor }]}
      onPress={handleTap}
    >
      <View style={styles.centerContent}>
        <Text style={styles.bigNumber}>{currentCount}</Text>
        <Text style={styles.instructionText}>{currentStep.label}</Text>
        <View style={styles.progressBarBackground}>
          <Animated.View
            style={[
              styles.progressBarFill,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>
      </View>

      <View style={styles.bottomUI}>
        <Text style={styles.hintText}>Tap anywhere to count a thing</Text>
        <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
          <Text style={styles.resetText}>🔃 Reset</Text>
        </TouchableOpacity>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 100,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  bigNumber: {
    fontSize: 100,
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 40,
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 6,
  },
  progressBarBackground: {
    width: '80%',
    maxWidth: 300,
    height: 20,
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 50,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#66B2A7',
  },
  bottomUI: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    alignItems: 'center',
  },
  hintText: {
    fontSize: 20,
    color: '#000',
    marginBottom: 50,
  },
  resetButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#000',
    borderRadius: 8,
  },
  resetText: {
    color: '#fff',
    fontSize: 20,
  },
});
