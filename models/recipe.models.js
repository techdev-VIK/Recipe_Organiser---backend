const mongoose = require('mongoose');

//create schema

const recipeSchema = new mongoose.Schema({
    
    recipeName: {
        type: String,
        require: true
    },
    cuisineType: {
        type: String,
        require: true
    },
    imageLink: {
        type: String,
        require: true
    },
    ingredients: [
        {
            type: String,
            require: true
        }
    ],
    instructions: [
        {
            type: String,
            require: true
        }
    ]
}, {
    timestamps: true
})

// create model:

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;