// Recipe Constructor
function Recipe(flour, water, yeast, salt, numberOfFolds, bulkFermentation, proof, numberOfLoaves) {
  this.flour = flour
  this.water = water
  this.yeast = yeast
  this.salt = salt
  this.numberOfFolds = numberOfFolds
  this.bulkFermentation = bulkFermentation
  this.proof = proof
  this.numberOfLoaves = numberOfLoaves
  // this.startTime = startTime
}

// UI Constructor
function UI() {
  
}

// Event Listeners
document.getElementById('recipe-form').addEventListener('submit', function(e) {
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

  // console.log(flour, water, yeast, salt, numberOfFolds, bulkFermentation, proof, numberOfLoaves, startTime)

  // Instasiate Recipe
  const recipe = new Recipe(flour, water, yeast, salt, numberOfFolds, bulkFermentation, proof, numberOfLoaves, startTime)

  e.preventDefault()
})