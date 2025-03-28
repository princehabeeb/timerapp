import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "expo-router"
import React, { useState, useEffect, useRef } from "react";
import Svg, { Circle } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { AntDesign } from "@expo/vector-icons";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const TIMER_DURATION = 5 * 60;

export default function Index() {
  const navigation = useNavigation();
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const radius = 100;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;

 const progress = useSharedValue(1);

useEffect(() => {
  navigation.setOptions({headerShown: false});
}, [navigation]);
 
 useEffect(() => {
   let timer: NodeJS.Timeout | null = null;
   if ( isRunning && timeLeft > 0){
     timer = setInterval(() => {
      setTimeLeft((prev : number) => prev - 1);
      progress.value = withTiming( timeLeft / TIMER_DURATION, {
        duration: 1000,
        easing: Easing.linear,
      });
     }, 1000);
   }else if (timeLeft === 0) {
    setIsRunning(false);
   }
   return () => {
    if (timer) clearInterval(timer);
   };
 }, [isRunning, timeLeft]);

const animatedProps = useAnimatedProps(() => ({
strokeDashoffset: circumference * progress.value,
}));

const toggleTimer = () => setIsRunning((prev) => !prev);

const resetTimer = () => {
  setTimeLeft(TIMER_DURATION);
  progress.value = withTiming(1);
  setIsRunning(false);
}


const formatTime = (seconds : number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};



  return (
    <View style={styles.container}>
      <Text style={styles.title}>Timer</Text>
      <Svg width={220} height={220} viewBox="0 0 220 220">
        <Circle
          cx="110"
          cy="110"
          r={radius}
          stroke="#333"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <AnimatedCircle
          cx="110"
          cy="110"
          r={radius}
          stroke="purple"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          animatedProps={animatedProps}
        />
      </Svg>
      <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
      <View style={styles.controls}>
        <TouchableOpacity onPress={resetTimer} style={styles.button}>
          <AntDesign name="delete" size={24} color="purple" />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleTimer} style={styles.buttonMain}>
          <AntDesign
            name={isRunning ? "pausecircle" : "play"}
            size={24}
            color="white"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={resetTimer} style={styles.button}>
          <AntDesign name="reload1" size={24} color="purple" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  timerText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "purple",
    position: "absolute",
    top: "43%",
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  button:{
    padding: 10,
    borderRadius: 50,
    backgroundColor: "#FFFFFF",
    elevation: 2,
    marginHorizontal: 10,
  },
  buttonMain:{
    padding: 15,
    borderRadius: 50,
    backgroundColor: "purple",
    elevation: 2,
    marginHorizontal: 10,
  }
});
