const express = require('express');

const app = express();


const cors = require("cors");

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));


const {intializeDatabase} = require('./db/db.connect');

const Recipe = require('./models/recipe.models');

app.use(express.json());

intializeDatabase();


app.get('/', async(req, res) => {
    res.send('Welcome to Recipe Organiser App')
})

//create a recipe for form
async function createRecipe(newRecipe){
    try {
        const recipe = new Recipe(newRecipe);
        await recipe.save();
        return recipe;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

app.post('/createRecipe', async(req, res) => {
    try {
        const savedRecipe = await createRecipe(req.body);
        res.status(200).json({message: 'Recipe Added Successfully.', recipe: savedRecipe})
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Failed to add recipe'})
    }
})


// Read all recipes:

async function readRecipes(){
    try {
        const readAll = await Recipe.find();
        return readAll;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

app.get('/allRecipes', async(req, res) => {
    try {
        const allrecipes = await readRecipes();
        if(allrecipes){
            res.json(allrecipes)
        }else{
            res.status(404).json({error: 'Recipes not found.'})
        }
    } catch (error) {
        res.status(500).json({error: 'Server Error, Please try again later!'})
    }
})


async function readyByRecipeName(recName){
    try {
        const readByName = await Recipe.find({recipeName: recName});
        return readByName;
    } catch (error) {
        console.log(error);
        throw error;
    }
}


app.get('/recipe/:recipeName', async (req, res) => {
    try {
        const readRecipes = await readyByRecipeName(req.params.recipeName);
        
        if(readRecipes){
            res.json(readRecipes)
        }else{
            res.json(404).json({error: 'Recipe not found'})
        }
    } catch (error) {
        res.status(500).json({error: 'Server Error. Please try again later!'})
    }
})


//delete by recipe Name

async function deleteRecipeByName(recName){
    try {
        const deletedRecipe = await Recipe.findOneAndDelete({recipeName: recName});
        return deletedRecipe
        
    } catch (error) {
        console.log('Failed to delete', error);
        throw error
    }
}


app.delete('/recipe/delete/:delRecipeName', async(req, res) => {
    try {
        const deletedRecipe = await deleteRecipeByName(req.params.delRecipeName);

        res.json(deletedRecipe)
    } catch (error) {
        res.status(500).json({error: 'Failed to delete the recipe.'})
    }
})



const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})