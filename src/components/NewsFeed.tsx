import React, { useState, } from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, Text, View } from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import useSWR from "swr";
import SwipeButton from './Swipte';
import { colors } from '../config/globalColors';
import { globaltext } from '../config/globaltext';
import { API_KEY, newsFeedUrl } from '../config/config';
interface NewsData {
  urlToImage?: string;
  title: string;
  content: string;
  description: string;
}
const API_URL = `${newsFeedUrl}${API_KEY}`;
const NewsFeed: React.FC = () => {
  const fetcher = (url: string) => fetch(url).then(res => res.json());
  const { data, error, mutate } = useSWR(API_URL, fetcher);
  const [displayData, setDisplayData] = useState<NewsData[]>([]);
  const [swipeCount, setSwipeCount] = useState(0);
  const [isButtonSwiped, setIsButtonSwiped] = useState(false);
  const [slides, setSlides] = useState(false);
//function for swiping news feed
  const handleSwipeButton = () => {
    setSlides(true);
    if (swipeCount >= data.length - 1) {
      handlelSwipeNews();
      setSlides(false);
    } else {
      setTimeout(() => {
        swipeCount >= 9 ? setSwipeCount(1) : setSwipeCount(prevSwipeCount => prevSwipeCount + 1);
        setSlides(false);
      }, 1000);
    }
  };
  //function for initial swipe button
  const handlelSwipeNews = async () => {
    if (error) { return Alert.alert(globaltext.alertText) }
    setDisplayData(data.articles);
    setIsButtonSwiped(true);
    setSwipeCount(0);
    mutate()
  };
  return (
    <View style={styles.mainContainer}>
      {!isButtonSwiped ? (
        <View style={styles.landingContainer}>
          <View>
            <Text style={styles.newsFeedText}>{globaltext.welcomeText}</Text>
            <SwipeButton onSwipeSuccess={handlelSwipeNews} />
          </View>
        </View>
      ) : slides ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <View style={styles.contentContainer}>
          <Text style={styles.headerText}>{globaltext.newsFeedApp}</Text>
          <View style={styles.newsCard}>
            {displayData[swipeCount]?.urlToImage && (
              <Image
                style={styles.newsImage}
                resizeMode="stretch"
                source={{ uri: displayData[swipeCount].urlToImage }}
              />
            )}
            <Text style={styles.titleText}>{displayData[swipeCount]?.title}</Text>
            <Text style={styles.contentText}>
              {displayData[swipeCount]?.content}
              {displayData[swipeCount]?.description.length < 60 ? displayData[swipeCount]?.description : `${displayData[swipeCount]?.description.slice(0, 60)} ...`}
            </Text>
          </View>
          <View style={styles.swipeButtonContainer}>
            <SwipeButton onSwipeSuccess={handleSwipeButton} />
          </View>
        </View>
      )}
    </View>
  );
};
export default NewsFeed;
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  landingContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: responsiveWidth(5),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: colors.lightGrey,
    paddingHorizontal: responsiveWidth(7),
  },
  headerText: {
    fontSize: responsiveFontSize(2.5),
    color: colors.white,
    fontWeight: '900',
    textAlign: 'center'
  },
  newsFeedText: {
    color: '#30d3d9',
    fontSize: responsiveFontSize(2.5),
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: responsiveHeight(2),
  },
  titleText: {
    color: colors.black,
    marginTop: responsiveFontSize(1.6),
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
  },
  contentText: {
    color: colors.black,
    marginVertical: 10,
    fontSize: responsiveFontSize(1.8),
  },
  newsCard: {
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: '80%',
    width: '100%',
    backgroundColor: colors.white,
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveHeight(2),
    borderRadius: responsiveFontSize(2),
  },
  newsImage: {
    height: '60%',
    width: '100%',
    borderRadius: responsiveFontSize(1.5),
  },
  swipeButtonContainer: {
    marginBottom: responsiveHeight(3),
    marginTop: responsiveHeight(2),
  },
});