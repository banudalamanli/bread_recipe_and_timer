// Recipe Constructor
function Recipe(flour, water, yeast, salt, numberOfFolds, bulkFermentation, proof, numberOfLoaves, startTime) {
  this.flour = flour
  this.water = water
  this.yeast = yeast
  this.salt = salt
  this.numberOfFolds = numberOfFolds
  this.bulkFermentation = bulkFermentation
  this.proof = proof
  this.numberOfLoaves = numberOfLoaves
  this.startTime = startTime
}

// UI Constructor
function UI() {
  // Calculate Times for the steps
  UI.prototype.setTimeForSteps = function(recipe) {
    let time = recipe.startTime // It will be a string
    let autolyseEndTime = calculateEndTime(time, 20)
  }

  UI.prototype.showRecipe = function(recipe) {
    document.getElementById('flour').value = recipe.flour
    document.getElementById('water').value = recipe.water
    document.getElementById('yeast').value = recipe.yeast
    document.getElementById('salt').value = recipe.salt
    document.getElementById('number-of-folds').value = recipe.numberOfFolds
    document.getElementById('bulk-fermentation').value = recipe.bulkFermentation
    document.getElementById('proof').value = recipe.proof
    document.getElementById('number-of-loaves').value = recipe.numberOfLoaves
   document.getElementById('start-time').value = recipe.startTime
  }
}

// Local Storage Class
class Store {
  static getRecipes() {
    let storedRecipes = []
    if (localStorage.getItem('recipes') === null) {
      storedRecipes = []
    } else {
      storedRecipes = JSON.parse(localStorage.getItem('recipes'))
    }
    return storedRecipes
  }

  static displayRecipe() {
    let recipes = Store.getRecipes()
    let recipe = recipes[0]
    // Instanciate UI
    const ui = new UI()
    ui.showRecipe(recipe)
  }

  static addRecipe(recipe) {
    let recipes = [recipe]
    localStorage.setItem('recipes', JSON.stringify(recipes))
  }

  static removeRecipe() {

  }
}

// Add hours and minutes to time
function calculateEndTime(startTime, addedTime) {
  let endHour = Number(startTime[0] + startTime[1])
  let endMinute = Number(startTime[3] + startTime[4])
  let addedHours = 0
  let addedMinutes = 0

  // Check if entered time has decimals i.e. 1,5 hours idicating 1 hour 30 minutes
  if (addedTime % 1 === 0) {
    addedHours = addedTime
  } else {
    addedHours = Math.floor(addedTime)
    addedMinutes = (addedTime % 1) * 60
  }

  endHour += addedHours
  endMinute += addedMinutes
  console.log(endMinute)
  endMinute == 0 ? (endMinute = "00") : endMinute
  
  console.log(endHour)

  return endHour + ":" + endMinute

}

// DOM Load Event Listener
document.addEventListener('DOMContentLoaded', Store.displayRecipe)

// Event Listeners
document.getElementById('recipe-form').addEventListener('submit', function(e) {
  e.preventDefault()
  // Get for values
  const flour = document.getElementById('flour').value
  const water = document.getElementById('water').value
  const yeast = document.getElementById('yeast').value
  const salt = document.getElementById('salt').value
  const numberOfFolds = document.getElementById('number-of-folds').value
  const bulkFermentation = document.getElementById('bulk-fermentation').value
  const proof = document.getElementById('proof').value
  const numberOfLoaves = document.getElementById('number-of-loaves').value
  const startTime = document.getElementById('start-time').value

  // Instanciate Recipe
  const recipe = new Recipe(flour, water, yeast, salt, numberOfFolds, bulkFermentation, proof, numberOfLoaves, startTime)

  // Add to Local Storage
  Store.addRecipe(recipe)

  // Instanciate UI
  const ui = new UI()
  // Calculate the times for steps
  ui.setTimeForSteps(recipe)

})