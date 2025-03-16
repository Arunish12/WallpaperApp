import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, {  FadeInDown } from 'react-native-reanimated';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { Extrapolation, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { theme } from '../constants/theme';
import { hp } from '../helpers/common';
import { ColorFilter, CommonFilterRow, SectionView } from './filterViews';
import { capitalize } from 'lodash';
import { data } from '../constants/data';


const FiltersModel = ({ modalRef, onClose, onApply, onReset, filters, setFilters }) => {
  const snapPoints = useMemo(() => ['75%'], []);

  return (
    <BottomSheetModal
      ref={modalRef}
      index={0}
      snapPoints={snapPoints}
      enableDismissOnClose={true}
      backdropComponent={CustomBackdrop}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View style={styles.content}>
          <Text style={styles.filterText}>Filters</Text>
          {Object.keys(Sections).map((sectionName, index) => {
            const SectionViewComponent = Sections[sectionName];
            const sectionData = data.filters[sectionName];
            const title = capitalize(sectionName);
            return (
              <Animated.View 
               entering={FadeInDown.delay((index * 100)+100).springify().damping(11)}
               key={sectionName}
              >
                <SectionView
                  title={title}
                  content={ 
                    <SectionViewComponent
                      data={sectionData}
                      filters={filters}
                      setFilters={setFilters}
                      filterName={sectionName}
                    />
                  }
                />
              </Animated.View>
            );
          })}
          {/* actions */}
            <Animated.View 
             entering={FadeInDown.delay(500).springify().damping(11)}
             style={styles.buttons}
            >
                <Pressable style={styles.resetButton} onPress={onReset}>
                    <Text style={[styles.buttonText, {color: theme.colors.neutral(0.9)}]}>Reset</Text>
                                     
                </Pressable>
                <Pressable style={styles.applyButton} onPress={onApply}>
                    <Text style={[styles.buttonText,{color: theme.colors.white}]}>Apply</Text>
                </Pressable>
            </Animated.View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const Sections = {
  order: CommonFilterRow,
  orientation: CommonFilterRow,
  type: CommonFilterRow,
  Colors: ColorFilter,
};

const CustomBackdrop = ({ animatedIndex, style }) => {
  const containerAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(animatedIndex.value, [-1, 0], [0, 1], Extrapolation.CLAMP);
    return { opacity };
  });

  const containerStyle = [
    StyleSheet.absoluteFill,
    style,
    styles.overlay,
    containerAnimatedStyle,
  ];

  return (
    <Animated.View style={containerStyle}>
      <BlurView style={StyleSheet.absoluteFill} tint="dark" intensity={25} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  content: {
    flex: 1,

    gap: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  filterText: {
    fontSize: hp(4),
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.neutral(0.8),
    marginBottom: 5,
  },
  buttons: {
     flex:1,
     flexDirection: 'row',
     alignItems: 'center',
     gap: 10
  },
  resetButton: {
    flex: 1,
    backgroundColor: theme.colors.neutral(0.03),
    padding: 12,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:theme.radius.md,
    borderCurve: 'continuous',
    borderWidth:2,
    borderColor:theme.colors.grayBG
  },
  buttonText: {
    fontSize: hp(2.2)
  },
  applyButton: {
    flex: 1,
    backgroundColor: theme.colors.neutral(0.8),
    padding: 12,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:theme.radius.md,
    borderCurve: 'continuous'
  },

  

});

export default FiltersModel;
