import React, { useRef } from 'react';
import { Animated, PanResponder, StyleSheet, View, GestureResponderEvent, PanResponderGestureState } from 'react-native';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { colors } from '../config/globalColors';
import { globaltext } from '../config/globaltext';

interface SwipeButtonProps {
  onSwipeSuccess: () => void;
}
const SwipeButton: React.FC<SwipeButtonProps> = ({ onSwipeSuccess }) => {
  const pan = useRef(new Animated.Value(0)).current;
  const maxSwipe = responsiveWidth(100) - 100;
  //to move the swipe ball we need PanResponder and these are the panResponder events and functions
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return Math.abs(gestureState.dx) > 20;
    },
    onPanResponderMove: Animated.event([null, { dx: pan }], {
      useNativeDriver: false,
      listener: (event: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        if (gestureState.dx < 0) {
          pan.setValue(0);
        } else if (gestureState.dx > maxSwipe) {
          pan.setValue(maxSwipe);
        }
      },
    }),
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dx > 250) {
        onSwipeSuccess();
      }
      Animated.spring(pan, { toValue: 0, useNativeDriver: false }).start();
    },
  });
//animation for animated ball background to move the along with it 
  const backgroundWidth = pan.interpolate({
    inputRange: [0, maxSwipe],
    outputRange: [70, maxSwipe + 62],
    extrapolate: 'clamp',
  });
//animation for maximum limit for ball swiping towards the right edge
  const backgroundLeft = pan.interpolate({
    inputRange: [0, maxSwipe],
    outputRange: [0, 0],
    extrapolate: 'clamp',
  });
//animation for ball background color adjusting color values
  const backgroundColor = pan.interpolate({
    inputRange: [0, 200, 200],
    outputRange: [colors.white, colors.primary, colors.secondary],
    extrapolate: 'clamp',
  });
//animation for ball color adjusting opacity
  const ballColor = pan.interpolate({
    inputRange: [0, maxSwipe],
    outputRange: [colors.secondary, colors.white],
    extrapolate: 'clamp',
  });
//animated text color 
  const textOpacity = pan.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
//animated text adjusting distance travelling for some distance along with animated ball
  const textTranslateX = pan.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 50],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.progressBackground,
          {
            width: backgroundWidth,
            left: backgroundLeft,
            backgroundColor: backgroundColor,
          },
        ]}
      />
      <Animated.Text
        style={[
          styles.text,
          {
            opacity: textOpacity,
            transform: [{ translateX: textTranslateX }],
          },
        ]}
      >
        {globaltext.swipeText}
      </Animated.Text>
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.swipeButton,
          {
            backgroundColor: ballColor,
            transform: [{ translateX: pan }]
          }
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: responsiveHeight(9),
    justifyContent: 'center',
    borderRadius: responsiveHeight(9),
    backgroundColor: colors.white,
    overflow: 'hidden',
    paddingLeft: responsiveWidth(1),
  },
  progressBackground: {
    position: 'absolute',
    height: '100%',
    borderRadius: responsiveHeight(7),
  },
  swipeButton: {
    height: responsiveHeight(7),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: responsiveHeight(7),
    aspectRatio: 1,
    elevation: 1,
  },
  text: {
    position: 'absolute',
    left: responsiveWidth(30),
    fontSize: responsiveHeight(2.3),
    color: colors.swipeTextColor,
    fontWeight: 'bold',
  },
});

export default SwipeButton;