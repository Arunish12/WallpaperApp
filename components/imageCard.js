import { View, Text, Pressable,StyleSheet } from 'react-native'
import React from 'react'
import { Image } from 'expo-image';
import { getImageSize } from '../helpers/common';
import { theme } from '../constants/theme';
import { wp } from '../helpers/common';


const ImageCard = ({item, index ,columns, router}) => {

    const isLastInRow = () => {
        return (index+1) % columns === 0;
    }
   
    const getImageHeight = () => {
        let {imageHeight: height, imageWidth: width} = item;
        return {height: getImageSize(height, width)};
    }

  return (
    <Pressable onPress={()=> router.push({pathname: 'home/image', params: {...item}})} style={[styles.imagewrapper,!isLastInRow() && styles.spacing]}>
        <Image
        style={[styles.image, getImageHeight()]}
        source={item?.webformatURL}
        transition={100}
      />
      

    </Pressable>
  )
}

const styles = StyleSheet.create({
    image: {
      height: 300,
      width: '100%'
    },
    imagewrapper: {
        backgroundColor: theme.colors.grayBG,
        borderRadius: theme.radius.xl,
        borderCurve: 'continuous',
        overflow: 'hidden',
        marginBottom: wp(2)
    },
    spacing: {
        marginRight: wp(2)
    }

})

export default ImageCard


