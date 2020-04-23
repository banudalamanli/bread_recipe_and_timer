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
    let autolyseEndTime = calculateEndTime(time, (20/60))
    let mixingEndTime = calculateEndTime(autolyseEndTime, (10/60))
    let firstFold = calculateEndTime(mixingEndTime, (15/60))
    let secondFold = calculateEndTime(firstFold, (30/60))
    let bulkFermentationEnds = calculateEndTime(mixingEndTime, recipe.bulkFermentation)
    // console.log(bulkFermentationEnds)
    let divideAndShapeDone = calculateEndTime(bulkFermentationEnds, (10/60))
    let proofingEnds = calculateEndTime(divideAndShapeDone, recipe.proof)
    let turnOnOven = calculateEndTime(proofingEnds, -1) //1 hour before proofing ends
    let takeLidOff = calculateEndTime(proofingEnds, (40/60)) // 40 minutes later
    let takeOut = calculateEndTime(takeLidOff, (10/60))

    document.getElementById('autolyse-end').innerHTML = autolyseEndTime
    document.getElementById('mixing-end').innerHTML = mixingEndTime
    document.getElementById('fold-1').innerHTML = firstFold
    document.getElementById('fold-2').innerHTML = secondFold
    document.getElementById('bulk-fermentation-end').innerHTML = bulkFermentationEnds
    document.getElementById('divide-shape').innerHTML = divideAndShapeDone
    document.getElementById('turn-on-oven').innerHTML = turnOnOven
    document.getElementById('proofing-end').innerHTML = proofingEnds
    document.getElementById('take-lid-off').innerHTML = takeLidOff
    document.getElementById('take-out').innerHTML = takeOut
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
  static getRecipe() {
    let storedRecipe = []
    if (localStorage.getItem('recipes') === null) {
      storedRecipe = []
    } else {
      storedRecipe = JSON.parse(localStorage.getItem('recipes'))
    }
    return storedRecipe
  }

  static displayRecipe() {
    let recipes = Store.getRecipe()
    if (recipes.length !== 0) {
      let recipe = recipes[0]
      // Instanciate UI
      const ui = new UI()
      ui.showRecipe(recipe)
    }
  }

  static addRecipe(recipe) {
    let recipes = [recipe]
    localStorage.setItem('recipes', JSON.stringify(recipes))
  }

  static removeRecipe() {
    localStorage.clear()
  }
}

// Add hours and minutes to time
function calculateEndTime(startTime, addedTime) {
  addedTime = +addedTime
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

  if (endMinute >= 60) {
    endHour += 1
    endMinute = endMinute % 60
  }
  
  if (endHour > 24) {
    let nextDayEndHour = endHour % 24
    return makeTimeDoubleDigitsString(nextDayEndHour) + ":" + makeTimeDoubleDigitsString(endMinute) + " *** This is the next day!!!"
  } else {
    return makeTimeDoubleDigitsString(endHour) + ":" + makeTimeDoubleDigitsString(endMinute)
  }

}

// Add leading 0 to single digit time and stringify
function makeTimeDoubleDigitsString(time) {
  return time < 10 ? ("0" + time) : (time.toString())
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

document.getElementById('clear-recipe').addEventListener('click', function (e) {
  Store.removeRecipe()
  window.location.reload()
})

document.getElementById('divide').addEventListener('click', function(e) {
  e.preventDefault()
  let initalRecipe = Store.getRecipe()[0]
  let newRecipe = initalRecipe
  newRecipe.flour = (Number(initalRecipe.flour) / 2).toString()
  newRecipe.water = (Number(initalRecipe.water) / 2).toString()
  newRecipe.yeast = (Number(initalRecipe.yeast) / 2).toString()
  newRecipe.salt = (Number(initalRecipe.salt) / 2).toString()
  Store.addRecipe(newRecipe)

  let ui = new UI()

  ui.showRecipe(newRecipe)
})

document.getElementById('multiply').addEventListener('click', function (e) {
  e.preventDefault()
  let initalRecipe = Store.getRecipe()[0]
  let newRecipe = initalRecipe
  newRecipe.flour = (Number(initalRecipe.flour) * 2).toString()
  newRecipe.water = (Number(initalRecipe.water) * 2).toString()
  newRecipe.yeast = (Number(initalRecipe.yeast) * 2).toString()
  newRecipe.salt = (Number(initalRecipe.salt) * 2).toString()
  Store.addRecipe(newRecipe)

  let ui = new UI()

  ui.showRecipe(newRecipe)
})