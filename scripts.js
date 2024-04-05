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

const almostModal = document.getElementById("almost-modal")
almostModal.addEventListener("click", function(){
    almostModal.style.display = "none"
})

const oneTryModal = document.getElementById("onetry-modal")
oneTryModal.addEventListener("click", function(){
    oneTryModal.style.display = "none"
})

const gameOver = document.getElementById("gameover-modal")
// gameOverl.addEventListener("click", function(){
//     gameOverl.style.display = "none"
// })

// Add event listeners to word bank elements
const wordBank = document.querySelectorAll(".word-choice")
const playerAnswers = document.querySelectorAll('.player-answer')
const correctAnswers = document.querySelectorAll(".correct-answer")

function addAnimationAndBorder(answerElement) {
    answerElement.classList.add('animate__animated', 'animate__bounceIn')
    answerElement.classList.add('border')
}

wordBank.forEach(word => {
    word.addEventListener("click", function(){
        const selectedWord = this.textContent

        playerAnswers.forEach(function(bubble) {            
            bubble.classList.remove('border')
        })
        
        for (let i = 0; i < playerAnswers.length; i++) {
            if (!playerAnswers[i].value) {
                playerAnswers[i].value = selectedWord
                // Move focus to the next input field if available
                if (i < playerAnswers.length - 1) {
                    playerAnswers[i + 1].focus()
                    document.getElementById("player-answer1").style.border = "none"
                    addAnimationAndBorder(playerAnswers[i + 1])                    
                }  break
            }
        }

        let allBubblesFilled = true
        for (let i = 0; i < playerAnswers.length; i++) {
            if (!playerAnswers[i].value) {
                allBubblesFilled = false                
            }
        }

        if (allBubblesFilled) {
            document.getElementById("submit-btn").classList.add('glow')
        }
        
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
    if (allCorrect) {
        document.getElementById("win-modal").style.display = "block"
    } else if (clickCount === 1) {
        almostModal.style.display = "block"
        document.getElementById("try3").style.display = "none"
        document.getElementById("die1").style.display = "block" 
        resetAnswers()       
    } else if (clickCount === 2) {
        oneTryModal.style.display = "block"
        document.getElementById("try2").style.display = "none"
        document.getElementById("die2").style.display = "block"
        resetAnswers()        
    } else {
        gameOver.style.display = "block"
    }    

}

// Function to reset player answers
function resetAnswers() {
    
    const clearValues = document.querySelectorAll(".clear")
    
    clearValues.forEach(word => {
        word.textContent = ""
        word.value = ""
    })

    document.getElementById("submit-btn").classList.remove('glow')
    document.getElementById("player-answer1").style.border = "2px solid #ffb404"

}

