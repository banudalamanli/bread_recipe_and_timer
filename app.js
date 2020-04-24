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
    // Times in strings format
    let autolyseEndTime = calculateEndTime(time, (20/60))
    let mixingEndTime = calculateEndTime(autolyseEndTime, (10/60))
    let firstFold = calculateEndTime(mixingEndTime, (10/60))
    let secondFold = calculateEndTime(firstFold, (20/60))
    let bulkFermentationEndTime = calculateEndTime(mixingEndTime, recipe.bulkFermentation)
    // console.log(bulkFermentationEnds)
    let divideAndShapeDone = calculateEndTime(bulkFermentationEndTime, (10/60))
    let proofingEnds = calculateEndTime(divideAndShapeDone, recipe.proof)
    let turnOnOven = calculateEndTime(proofingEnds, -1) //1 hour before proofing ends
    let takeLidOff = calculateEndTime(proofingEnds, (40/60)) // 40 minutes later
    let takeOut = calculateEndTime(takeLidOff, (10/60))

    setTime('autolyse-end', autolyseEndTime)
    setTime('mixing-end', mixingEndTime)
    setTime('fold-1', firstFold)
    setTime('fold-2', secondFold)
    setTime('bulk-fermentation-end', bulkFermentationEndTime)
    setTime('divide-shape', divideAndShapeDone)
    setTime('turn-on-oven', turnOnOven)
    setTime('proofing-end', proofingEnds)
    setTime('take-lid-off', takeLidOff)
    setTime('take-out', takeOut)

    // Check number of folds and add field for extra folds
    if (recipe.numberOfFolds > 2) {
      addFoldingRowsWithTime(recipe, secondFold)
    }
  }

  UI.prototype.showRecipe = function(recipe) {
    Object.keys(recipe).forEach(key => {
      let id = dashify(key)
      document.getElementById(id).value = recipe[key]
    })
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

// To change strings to camel case
function camelize(string) {
  return string.replace(/(\-[a-z])/g, $1 => $1.toUpperCase().replace('-', ''));
}
// ES6 version
// const camelize = string => string.replace(/(\-[a-z])/g, $1 => $1.toUpperCase().replace('-', ''))

// To change to dash case
function dashify(string) {
  return string.replace(/([A-Z])/g, $1 => "-" + $1.toLowerCase());
}


// Set time for step
function setTime(id, time) {
  document.getElementById(id).innerHTML = time
}

// Add rows to table for extra folds and their times
function addFoldingRowsWithTime(recipe, endTimeOfPrevFold) {
  const timeTable = document.getElementById('time-table-body')
  const refNode = document.getElementById('bulk-fermentation-end') // Node before which the new row will be inserted
  let numOfExtraFoldingRows = recipe.numberOfFolds - 2 // Default is 2
  let nextFoldNumber = 3
  let lastFoldTime = endTimeOfPrevFold

  do {
    // Create row
    const row = document.createElement('tr')
    row.innerHTML = `
      <td>Fold #${nextFoldNumber}</td>
      <td id="fold-${nextFoldNumber}"></td>`
    // Insert row before "bulk fermentation ends" node
    timeTable.insertBefore(row, refNode.parentNode)
    // Calculate the time
    lastFoldTime = calculateEndTime(lastFoldTime, 20/60)
    // Set the time
    setTime(`fold-${nextFoldNumber}`, lastFoldTime)

    numOfExtraFoldingRows -= 1
    nextFoldNumber++
  } while (numOfExtraFoldingRows > 0)
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
  const areThereEmptyFields = Object.values(recipe).some(function(field) {
    return field == ""
  })
  
  if (areThereEmptyFields) {
    alert("Please fill in fields before starting the timer :)")
  } else {
    // Add to Local Storage
    Store.addRecipe(recipe)
    // Instanciate UI
    const ui = new UI()
    // Calculate the times for steps
    ui.setTimeForSteps(recipe)
  }


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