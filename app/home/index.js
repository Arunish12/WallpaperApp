import { View, StyleSheet, Text, Pressable, ScrollView, TextInput } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, FontAwesome6, Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme'; // Ensure this path is correct
import { hp, wp } from '../../helpers/common'; // Ensure this path is correct
import Categories from '../../components/Categories';
import { apiCall } from '../../api';
import ImageGrid from '../../components/imageGrid';
import { debounce } from 'lodash';
import FiltersModel from '../../components/filtersModal';
import { ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';



var page = 1;

const HomeScreen = () => {
  const { top } = useSafeAreaInsets();
  const paddingTop = top > 0 ? top : 0.5;
  const [search, setSearch] = useState('');
  const [images, setImages] = useState([]); // Initialize images state here
  const [filters, setFilters] = useState({});
  const [activeCategory, setActiveCategory] = useState(null);
  const searchInputRef = useRef(null);
  const modalRef = useRef(null);
  const scrollRef = useRef(null);
  const router = useRouter();
  const [isEndReached, setIsEndReached] = useState(false);


  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async (params = { page: 1 }, append = true) => {
    console.log('params: ', params, append);
    let res = await apiCall(params);
    if (res.success && res.data?.hits) {
      if (append) {
        setImages((prevImages) => [...prevImages, ...res.data.hits]);
      } else {
        setImages(res.data.hits);
      }
    }
  };
  
  const openFiltersModal = () =>{
    modalRef?.current?.present();
  }

  const closeFiltersModal = () =>{
    modalRef?.current?.close();
  }

  const applyFilters = () =>{
     if(filters){
      // console.log('Applying filters:', filters); // Debug line
        page = 1;
        setImages([]);
        let params = {
          page,
          ...filters
        }
      if(activeCategory) params.category = activeCategory;
      if(search) params.q = search;
      fetchImages(params,false);
     }
    closeFiltersModal();
  }



  const resetFilters = () =>{
    if(filters){     
        page = 1;
        setFilters(null);
        setImages([]);
        let params = {
          page,
        
        }
      if(activeCategory) params.category = activeCategory;
      if(search) params.q = search;
      fetchImages(params,false);
    }
    closeFiltersModal();
  } 

  const clearThisFilter = (filterName) =>{
    let filterz = {...filters};
    delete filterz[filterName];
    setFilters({...filterz});
    page = 1;
    setImages([]);
    let params = {
      page,
      ...filterz
    }
    if(activeCategory) params.category = activeCategory;
    if(search) params.q = search;
    fetchImages(params,false);
  }
 

  const handleChangeCategory = (cat) => {
    setActiveCategory(cat);
    // fetchImages({ category: cat, page: 1 });
    clearSearch();
    setImages([]);
    page = 1;
    let params = {
      page,
      ...filters
    }
    if(cat) params.category = cat;
    fetchImages(params, false);
  };

  const handleSearch = (text)=>{
    setSearch(text);
    if(text.length>2){
      // search for this text
      page = 1; 
      setImages([]);
      setActiveCategory(null); // clear the category when searching
      fetchImages({page, q: text , ...filters}, false);
    }

    if(text==""){
      // reset results
      page = 1;
      searchInputRef?.current?.clear();
      setImages([]);
      setActiveCategory(null); // clear the category when searching
      fetchImages({page, ...filters}, false);
    }
  }
  
  const clearSearch = ()=>{
    setSearch("");
    searchInputRef?.current?.clear();
  }
  
  const handleScroll = (event)=>{
     const contentHeight = event.nativeEvent.contentSize.height;
     const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
     const scrollOffset = event.nativeEvent.contentOffset.y;
     const bottomPosition = contentHeight- scrollViewHeight;

     if(scrollOffset>=bottomPosition-1){         
         if(!isEndReached){         
         console.log('reached the bottom of scrollview'); 
         setIsEndReached(true);
         ++page;
         let params = {
             page,
             ...filters
         }
         if(activeCategory) params.category = activeCategory;
         if(search) params.q = search;
         fetchImages(params);
         }
     }else if(isEndReached){
       setIsEndReached(false);
     }
  }
  

  const handleScrollUp = ()=> {
    scrollRef?.current?.scrollTo({
      y: 0,
      animated: true 

    })
  }

  const handleTextDebounce = useCallback(debounce(handleSearch, 400), []);
  
  console.log('filtes: ',filters);
  return (
    <View style={[styles.container, { paddingTop }]}>
      {/* Custom header */}
      <View style={styles.header}>
        <Pressable onPress={handleScrollUp}>
          <Text style={styles.title}>pixels</Text>
        </Pressable>
        <Pressable onPress={openFiltersModal}>
          <FontAwesome6 name="bars-staggered" size={22} color={theme.colors.neutral(0.7)} />
        </Pressable>
       </View>
      <ScrollView 
        onScroll={handleScroll}
        scrollEventThrottle={5} // how often scroll event will fire whiel scrolling (in ms)
        ref = {scrollRef}
        contentContainerStyle={{ gap: 15 }}
      >

        {/* Search bar */}
        <View style={styles.searchBar}>
          <View style={styles.searchIcon}>
            <Feather name="search" size={24} color={theme.colors.neutral(0.4)} />
          </View>
          <TextInput
            placeholder="Search for photos..."
            // value={search}
            ref={searchInputRef}
            onChangeText={handleTextDebounce}
            style={styles.searchInput}
          />
          {search && (
            <Pressable style={styles.closeIcon} onPress={() => handleSearch("")}>
              <Ionicons name="close" size={24} color={theme.colors.neutral(0.6)} />
            </Pressable>
          )}
        </View>
        {/* category */}
        <View style={styles.categories}>
          <Categories activeCategory={activeCategory} handleChangeCategory={handleChangeCategory} />
        </View>
        
        {/* filters */}
        <View>
             <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
                 {
                  Object.keys(filters).map((key, index)=>{
                    return (
                      <View key={key} style={styles.filterItem}>
                            {
                              key =='Colors'?(
                                 <View style={{
                                     height: 20,
                                     width: 30,
                                     borderRadius: 7,
                                     backgroundColor: filters[key]
                                 }} />
                              ):(
                                 <Text style={styles.filterItemText}>{filters[key]}</Text>
                              )
                            }
                           
                            <Pressable style={styles.filterCloseIcon} onPress={()=>clearThisFilter(key)}>
                               <Ionicons name="close" size={14} color={theme.colors.neutral(0.9)} />
                            </Pressable>
                      </View>
                    )
                  })
                 }
             </ScrollView>
        </View>

        

        {/* Images masonry grid */}
        <View>
          {images.length > 0 && <ImageGrid images={images} router={router} />}
        </View>

        {/* loading */}
        <View style = {{marginBottom: 70, marginTop: images.length>0?10: 70}}>
          <ActivityIndicator size="large" />
        </View>
        
      </ScrollView>
      {/* filter Model */}
      <FiltersModel
       modalRef={modalRef} 
       filters={filters}
       setFilters={setFilters}
       onClose={closeFiltersModal}
       onApply={applyFilters}
       onReset={resetFilters}
       />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 15,
  },
  header: {
    marginHorizontal: wp(4),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: hp(4),
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.neutral(0.9),
  },
  searchBar: {
    marginHorizontal: wp(4),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.grayBG,
    backgroundColor: theme.colors.white,
    padding: 6,
    paddingLeft: 10,
    borderRadius: theme.radius.lg,
  },
  searchIcon: {
    padding: 8,
  },
  searchInput: {
    flex: 1,
    borderRadius: theme.radius.sm,
    paddingVertical: 10,
    fontSize: hp(1.8),
  },
  closeIcon: {
    backgroundColor: theme.colors.neutral(0.1),
    padding: 8,
    borderRadius: theme.radius.sm,
  },
  categories: {
    marginHorizontal: wp(4),
  },
  filters: {
      paddingHorizontal: wp(4),
      gap: 10
  },
  filterItem: {
    backgroundColor: theme.colors.grayBG,
    padding: 3,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.radius.xs,
    gap: 10,
    paddingHorizontal: 10,
  },
  filterItemText: {
    fontSize: hp(1.9),

  },
  filterCloseIcon:{
    backgroundColor: theme.colors.neutral(0.2),
    padding: 4,
    borderRadius: 7,

  }


});

export default HomeScreen;

