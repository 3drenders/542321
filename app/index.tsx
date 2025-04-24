import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Animated,
  AppState,
} from 'react-native';
import { useFonts, Quicksand_400Regular, Quicksand_600SemiBold } from '@expo-google-fonts/quicksand';

const steps = [
  { count: 5, label: 'things you can see', backgroundColor: '#A7DFFF' },
  { count: 4, label: 'things you can touch', backgroundColor: '#EAC8C0' },
  { count: 3, label: 'things you can hear', backgroundColor: '#CDB4DB' },
  { count: 2, label: 'things you can smell', backgroundColor: '#B2DAD1' },
  { count: 1, label: 'thing you can taste', backgroundColor: '#F0EAD6' },
];

const adjustColor = (hex, factor = 0.85) => {
  const num = parseInt(hex.slice(1), 16);
  const r = Math.floor(((num >> 16) & 255) * factor);
  const g = Math.floor(((num >> 8) & 255) * factor);
  const b = Math.floor((num & 255) * factor);
  return `rgb(${r}, ${g}, ${b})`;
};

export default function App() {
  const [fontsLoaded] = useFonts({
    Quicksand_400Regular,
    Quicksand_600SemiBold,
  });

  const [stepIndex, setStepIndex] = useState(0);
  const [currentCount, setCurrentCount] = useState(steps[0].count);
  const [visibleStepIndex, setVisibleStepIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(steps[0].count);
  const [prevColor, setPrevColor] = useState(steps[0].backgroundColor);

  const backgroundAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const countFadeAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'inactive' || nextAppState === 'background') {
        handleReset();
      }
    });
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    const newProgress = (steps[stepIndex].count - currentCount) / steps[stepIndex].count;
    Animated.timing(progressAnim, {
      toValue: newProgress,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [currentCount, stepIndex]);

  useEffect(() => {
    if (currentCount !== visibleCount) {
      Animated.timing(countFadeAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }).start(() => {
        setVisibleCount(currentCount);
        Animated.timing(countFadeAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }).start();
      });
    }
  }, [currentCount]);

  const triggerStepChange = (nextStep) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(backgroundAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start(() => {
      backgroundAnim.setValue(0);
      setPrevColor(steps[nextStep].backgroundColor);
      setVisibleStepIndex(nextStep);
      setVisibleCount(steps[nextStep].count);
      setStepIndex(nextStep);
      setCurrentCount(steps[nextStep].count);
      progressAnim.setValue(0);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleTap = () => {
    if (currentCount > 1) {
      setCurrentCount(currentCount - 1);
    } else {
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start(() => {
        const nextStep = stepIndex + 1;
        if (nextStep < steps.length) {
          triggerStepChange(nextStep);
        } else {
          console.log('All steps completed');
        }
      });
    }
  };

  const handleReset = () => {
    triggerStepChange(0);
  };

  const interpolatedBgColor = backgroundAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [prevColor, steps[stepIndex].backgroundColor],
  });

  const resetColor = adjustColor(steps[visibleStepIndex].backgroundColor);

  const renderLabelWithBoldLastWord = (label) => {
    const words = label.trim().split(' ');
    const lastWord = words.pop();
    const start = words.join(' ');
    return (
      <Text style={styles.instructionText} selectable={false}>
        {start + ' '}
        <Text style={styles.boldWord}>{lastWord}</Text>
      </Text>
    );
  };

  if (!fontsLoaded) return null;

  return (
    <Animated.View style={[styles.container, { backgroundColor: interpolatedBgColor }]}>
      <Pressable style={{ flex: 1 }} onPress={handleTap}>
        <View style={styles.centerContent}>
          <Animated.Text style={styles.instructionText} selectable={false}>
            Name
          </Animated.Text>
          <Animated.Text style={styles.bigNumber} selectable={false}>
            {visibleCount}
          </Animated.Text>
          <Animated.View>
            {renderLabelWithBoldLastWord(steps[visibleStepIndex].label)}
          </Animated.View>
          <View style={styles.progressBarBackground}>
            <Animated.View
              style={[
                styles.progressBarFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                  backgroundColor: resetColor,
                },
              ]}
            />
          </View>
        </View>

        <View style={styles.bottomUI}>
          <Text style={styles.hintText} selectable={false}>Tap anywhere to count a thing</Text>
          {currentCount !== 5 && (
            <TouchableOpacity onPress={handleReset} style={[styles.resetButton, { backgroundColor: resetColor }]}>
              <Text style={styles.resetText} selectable={false}>Restart</Text>
            </TouchableOpacity>
          )}
        </View>
      </Pressable>
    </Animated.View>
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
    fontSize: 80,
    color: '#222',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'Quicksand_600SemiBold',
  },
  instructionText: {
    fontSize: 28,
    color: '#333',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 6,
    paddingHorizontal: 30,
    paddingVertical: 10,
    fontFamily: 'Quicksand_400Regular',
  },
  boldWord: {
    fontFamily: 'Quicksand_600SemiBold',
    color: '#333',
  },
  progressBarBackground: {
    width: '80%',
    maxWidth: 300,
    backgroundColor: '#E0E4E7',
    borderRadius: 50,
    height: 12,
    overflow: 'hidden',
    marginTop: 50,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#88BDBC',
  },
  bottomUI: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    alignItems: 'center',
  },
  hintText: {
    fontSize: 18,
    color: '#444',
    marginBottom: 40,
    fontFamily: 'Quicksand_400Regular',
  },
  resetButton: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  resetText: {
    color: '#222',
    fontSize: 18,
    fontFamily: 'Quicksand_400Regular',
  },
});
