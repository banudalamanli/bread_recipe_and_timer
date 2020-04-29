class Recipe {
  constructor(whiteFlour, wholeWheatFlour, water, yeast, salt, numberOfFolds, bulkFermentation, proof, numberOfLoaves, startTime) {
    this.whiteFlour = whiteFlour
    this.wholeWheatFlour = wholeWheatFlour
    this.water = water
    this.yeast = yeast
    this.salt = salt
    this.numberOfFolds = numberOfFolds
    this.bulkFermentation = bulkFermentation
    this.proof = proof
    this.numberOfLoaves = numberOfLoaves
    this.startTime = startTime
  }
}

class UI {
  setTimeForSteps(recipe) {
    let time = recipe.startTime // It will be a string
    // Times in strings format
    let autolyseEndTime = calculateEndTime(time, (20 / 60))
    let mixingEndTime = calculateEndTime(autolyseEndTime, (10 / 60))
    let bulkFermentationEndTime = calculateEndTime(mixingEndTime, recipe.bulkFermentation)
    let divideAndShapeDone = calculateEndTime(bulkFermentationEndTime, (10 / 60))
    let proofingEnds = calculateEndTime(divideAndShapeDone, recipe.proof)
    let turnOnOven = calculateEndTime(proofingEnds, -1) //1 hour before proofing ends
    let takeLidOff = calculateEndTime(proofingEnds, (40 / 60)) // 40 minutes later
    let takeOut = calculateEndTime(takeLidOff, (10 / 60))

    setTime('autolyse-end', autolyseEndTime)
    setTime('mixing-end', mixingEndTime)

    // Add rows for folding
    addFoldingRowsWithTime(recipe, mixingEndTime)

    setTime('bulk-fermentation-end', bulkFermentationEndTime)
    setTime('divide-shape', divideAndShapeDone)
    setTime('turn-on-oven', turnOnOven)
    setTime('proofing-end', proofingEnds)
    setTime('take-lid-off', takeLidOff)
    setTime('take-out', takeOut)
  }


  showRecipe(recipe) {
    Object.keys(recipe).forEach(key => {
      let id = dashify(key)
      document.getElementById(id).value = recipe[key]
    })
  }

  static showAlert(message, className) {
    // Create div
    const div = document.createElement('div')
    // Add classes to div
    div.className = `alert ${className}`
    // Add alert message
    div.appendChild(document.createTextNode(message))
    // Get parent
    const container = document.querySelector('.container')
    console.log(container)
    // Get form
    const form = document.querySelector('#recipe-form')
    console.log(form)
    // Insert alert
    container.insertBefore(div, form)
    // Timeout after 3 seconds
    setTimeout((() => document.querySelector('.alert').remove()), 3000)
  }
}

// Local Storage Class
class Store {
  static hasNoRecipe() {
    return Store.getRecipe()[0] === undefined
  }

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

// ============ HELPER FUNCTIONS ===============
// To change strings to camel case - String
const camelize = string => string.replace(/(\-[a-z])/g, $1 => $1.toUpperCase().replace('-', ''))

// To change to dash case - String
const dashify = string => string.replace(/([A-Z])/g, $1 => "-" + $1.toLowerCase());


// Set time for step
const setTime = (id, time) => document.getElementById(id).innerHTML = time

// Add rows to table for extra folds and their times
const addFoldingRowsWithTime = (recipe, endTimeOfPrevFold) => {
  const timeTable = document.getElementById('time-table-body')
  const refNode = document.getElementById('bulk-fermentation-end') // Node before which the new row will be inserted
  let numOfFoldingRows = recipe.numberOfFolds
  let foldNumber = 1
  let lastFoldTime = endTimeOfPrevFold
  let timeIntervalBetweenFolds = 20 //mins

  do {
    // Create row
    const row = document.createElement('tr')
    row.innerHTML = `
      <td>Fold #${foldNumber}</td>
      <td id="fold-${foldNumber}"></td>`
    // Insert row before "bulk fermentation ends" node
    timeTable.insertBefore(row, refNode.parentNode)
    // Calculate the time
    lastFoldTime = calculateEndTime(lastFoldTime, 20 / 60)
    // Set the time
    setTime(`fold-${foldNumber}`, lastFoldTime)

    numOfFoldingRows -= 1
    foldNumber++
  } while (numOfFoldingRows > 0)
}

// Remove extra fold rows
const removeFoldingRows = newRecipe => {
  let prevRecipe = Store.getRecipe()[0]

  if (prevRecipe === undefined) { // First time on page; no saved recipe in LS, inital DOM
    return
  } else { // LS has recipe from previous visit
    let numOfRowsToDelete = prevRecipe.numberOfFolds
    let foldNum = 1
    // Check if recipes have different fold numbers
    if (prevRecipe.numberOfFolds !== newRecipe.numberOfFolds) {
      do {
        let row = document.getElementById(`fold-${foldNum}`).parentNode
        row.parentNode.removeChild(row)
        numOfRowsToDelete -= 1
        foldNum++
      } while (numOfRowsToDelete > 0)
    }
  }
}

// Add hours and minutes to time - String
const calculateEndTime = (startTime, addedTime) => {
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

// Add leading 0 to single digit time and stringify - String
const makeTimeDoubleDigitsString = time => time < 10 ? ("0" + time) : (time.toString())

// Check if Start Timer button was clicked accidentally - Boolean
const accidentalClick = recipe => {
  if (Store.getRecipe().length !== 0) {
    let prevRecipe = Store.getRecipe()[0]
    return ((JSON.stringify(prevRecipe) === JSON.stringify(recipe)) && (document.getElementById('autolyse-end').innerHTML != ""))
  }
  return false
}

// ======================== END OF HELPER FUNCTIONS


// DOM Load Event Listener
document.addEventListener('DOMContentLoaded', Store.displayRecipe)

// Event Listeners
document.getElementById('recipe-form').addEventListener('submit', function (e) {
  e.preventDefault()
  // Get for values
  const whiteFlour = document.getElementById('white-flour').value
  const wholeWheatFlour = document.getElementById('whole-wheat-flour').value
  const water = document.getElementById('water').value
  const yeast = document.getElementById('yeast').value
  const salt = document.getElementById('salt').value
  const numberOfFolds = document.getElementById('number-of-folds').value
  const bulkFermentation = document.getElementById('bulk-fermentation').value
  const proof = document.getElementById('proof').value
  const numberOfLoaves = document.getElementById('number-of-loaves').value
  const startTime = document.getElementById('start-time').value

  // Instanciate Recipe
  const recipe = new Recipe(whiteFlour, wholeWheatFlour, water, yeast, salt, numberOfFolds, bulkFermentation, proof, numberOfLoaves, startTime)

  // Check if there are empty fields
  const areThereEmptyFields = Object.values(recipe).some(function (field) {
    return field == ""
  })

  // Alert if there are empty fields
  if (areThereEmptyFields) {
    UI.showAlert("Please fill in fields before starting the timer :)", 'error')
  } else if (accidentalClick(recipe)) {
    return
  } else {
    // Remove previous folding rows if there are any
    removeFoldingRows(recipe)
    // Add recipe to Local Storage
    Store.addRecipe(recipe)
  }

  // Instanciate UI
  const ui = new UI()

  // Calculate and display times for steps
  ui.setTimeForSteps(recipe)
})

document.getElementById('clear-recipe').addEventListener('click', function (e) {
  Store.removeRecipe()
  window.location.reload()
})

document.getElementById('divide').addEventListener('click', function (e) {
  if (Store.hasNoRecipe()) {
    UI.showAlert("Please click Start Timer button first!", 'error')
  } else {
    let initalRecipe = Store.getRecipe()[0]
    let newRecipe = initalRecipe
    newRecipe.whiteFlour = (Number(initalRecipe.whiteFlour) / 2).toString()
    newRecipe.wholeWheatFlour = (Number(initalRecipe.wholeWheatFlour) / 2).toString()
    newRecipe.water = (Number(initalRecipe.water) / 2).toString()
    newRecipe.yeast = (Number(initalRecipe.yeast) / 2).toString()
    newRecipe.salt = (Number(initalRecipe.salt) / 2).toString()
    Store.addRecipe(newRecipe)

    let ui = new UI()
    ui.showRecipe(newRecipe)
  }
})

document.getElementById('multiply').addEventListener('click', function (e) {
  if (Store.hasNoRecipe()) {
    UI.showAlert("Please click Start Timer button first!", 'error')
  } else {
    let initalRecipe = Store.getRecipe()[0]
    let newRecipe = initalRecipe
    newRecipe.whiteFlour = (Number(initalRecipe.whiteFlour) * 2).toString()
    newRecipe.wholeWheatFlour = (Number(initalRecipe.wholeWheatFlour) * 2).toString()
    newRecipe.water = (Number(initalRecipe.water) * 2).toString()
    newRecipe.yeast = (Number(initalRecipe.yeast) * 2).toString()
    newRecipe.salt = (Number(initalRecipe.salt) * 2).toString()
    Store.addRecipe(newRecipe)

    let ui = new UI()
    ui.showRecipe(newRecipe)
  }
})