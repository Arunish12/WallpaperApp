import { Colors } from "react-native/Libraries/NewAppScreen";

const Categories = [
    "backgrounds",
    "fashion",
    "nature",
    "science",
    "education",
    "feelings",
    "health",
    "people",
    "religion",
    "places",
    "animals",
    "industry",
    "computer",
    "food",
    "sports",
    "transportation",
    "travel",
    "buildings",
    "business",
    "music"
];

const filters = {
    order: ["popular", "latest"],
    orientation:["horizontal", "vertical"],
    type:["photo", "illustration","vector"],
    Colors:[
        "red", 
        "orange",
        "yellow",
        "green", 
        "turquoise", 
        "blue", 
        "pink",         
        "gray", 
        "black", 
        "brown",
        "white",
    ]
}


export const data = {
    Categories,filters
}

