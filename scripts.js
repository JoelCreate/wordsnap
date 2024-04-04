// Function to update the date
function updateDate() {
    const currentDate = new Date()
    const day = currentDate.getDate()
    const year = currentDate.getFullYear()
    const formattedDate = "April " + day + ', ' + year
    document.getElementById('date').innerText = formattedDate
}

// Run the updateDate function when the window loads
window.onload = function() {
    updateDate()
}

// Hide the play modal when clicked
const modal = document.getElementById("play-modal")
modal.addEventListener("click", function(){
    modal.style.display = "none"
})

// Add event listeners to word bank elements
const wordBank = document.querySelectorAll(".word-choice")
const playerAnswers = document.querySelectorAll('.player-answer')
const correctAnswers = document.querySelectorAll(".correct-answer")


wordBank.forEach(word => {
    word.addEventListener("click", function(){
        const selectedWord = this.textContent

        // Find the first empty player answer element
        const emptyPlayerAnswer = Array.from(playerAnswers).find(answer => !answer.textContent.trim())
        
        if (emptyPlayerAnswer) {
            // Set the selected word as the text content of the empty player answer element
            emptyPlayerAnswer.textContent = selectedWord

            // Move focus to the next empty player answer element if available
            const nextIndex = Array.from(playerAnswers).indexOf(emptyPlayerAnswer)
            if (nextIndex < playerAnswers.length) {
                playerAnswers[nextIndex].focus()
            }
            
            // Show the selected word in the correct answers area
            const correctAnswer = document.getElementById(`correct-answer${nextIndex + 1}`)
            if (correctAnswer) {
                correctAnswer.textContent = selectedWord
            }
        }
        
    })
})

// Track the number of attempts
let clickCount = 0

// Check answers function
document.getElementById("submit-btn").addEventListener("click", function() {
    checkAnswers()
})

function checkAnswers() {
    const correctAnswers = document.querySelectorAll('#correct-answers [data-answer]')
    let allCorrect = true

    const dataAnswerValues = []

    // Iterate over each element with data-answer attribute and push its value to the array
    correctAnswers.forEach(function(element) {
        dataAnswerValues.push(element.dataset.answer)
    })

    correctAnswers.forEach(function(correctAnswer, index) {
        // Check if playerAnswers[index] is defined
        if (playerAnswers[index]) {
            const selectedWord = playerAnswers[index].textContent.trim()
            const correctWord = correctAnswer.dataset.answer
            if (selectedWord !== correctWord) {
                allCorrect = false
            }
        } 
    })

    clickCount++    

    //Determine alert message based on the attempt count and correctness of answers
    if (clickCount === 1 && allCorrect) {
        alert("All answers are correct!") 
    } else if (clickCount === 1) {
        alert("Some answers are incorrect. Please try again.")
        document.getElementById("try3").style.display = "none"
        document.getElementById("die1").style.display = "block"
        resetAnswers()
    } else if (clickCount === 2) {
        alert("Some answers are incorrect. Please try again.")
        document.getElementById("try2").style.display = "none"
        document.getElementById("die2").style.display = "block"
        resetAnswers()
    } else {
        alert("Game over! No more tries for you!")
    }
}

// Function to reset player answers
function resetAnswers() {
    playerAnswers.forEach(answer => {
        answer.textContent = ""
    })

    correctAnswers.forEach(answer => {
        answer.textContent = ""
    })
}


// Disable focus on input fields
const inputField = document.querySelectorAll('.input')
inputField.forEach(input => {
    input.addEventListener('focus', function(event) {
        event.preventDefault()   
        input.blur()
    })
})
