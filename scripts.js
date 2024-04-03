function updateDate() {
    const currentDate = new Date()

    const day = currentDate.getDate()
    const year = currentDate.getFullYear()
    const formattedDate = "April " +  + day + ', ' + year

    document.getElementById('date').innerText = formattedDate
}

window.onload = function() {
    updateDate()
}

document.addEventListener('DOMContentLoaded', function() {
    const inputField = document.querySelectorAll('.input')
    
    inputField.forEach(input => {
        input.addEventListener('touchstart', function(event) {
            event.preventDefault()    
            input.blur()
        })
    })
})

const modal = document.getElementById("play-modal")

modal.addEventListener("click", function(){
    modal.style.display = "none"
})


const wordBank = document.querySelectorAll(".word-choice")
const answerFields = document.querySelectorAll(".right")
const answerFieldLeft = document.querySelectorAll(".left")

wordBank.forEach(word => {
    word.addEventListener("click", function(){
        const selectedWord = this.textContent

        answerFields.forEach(function(inputField) {            
            inputField.classList.remove('border');
        });

        for (let i = 0; i < answerFields.length; i++) {
            if (!answerFields[i].value) {
                answerFields[i].value = selectedWord
                // Move focus to the next input field if available
                if (i < answerFields.length - 1) {
                    answerFields[i + 1].focus()
                    document.getElementById("player-answer1").style.border = "none"
                    answerFields[i + 1].classList.add('animate__animated', 'animate__bounceIn')
                    answerFields[i + 1].classList.add('border')
                }
                break
            }
        }
        for (let i = 0; i < answerFieldLeft.length; i++) { 
            if (!answerFieldLeft[i].value) {       
                answerFieldLeft[i].value = selectedWord;                          
                // Move focus to the next input field in the second set if available
                if (i < answerFieldLeft.length - 1) {
                    answerFieldLeft[i + 1].focus() 
                }
                break
            }
        }
    })
})

let clickCount = 0


document.getElementById("submit-btn").addEventListener("click", function() {
    checkAnswers()
})

function checkAnswers() {
    const correctAnswerInputs = document.querySelectorAll('.left')
    let allCorrect = true
     
    clickCount++

    correctAnswerInputs.forEach(function(input, index) {
        const selectedWord = input.value
        const placeholder = input.placeholder
        if (selectedWord !== placeholder) {
            allCorrect = false
        }
    })

    if (clickCount === 1 && allCorrect) {
        alert("All answers are correct!") 
    } else if(clickCount === 1) {
        alert("Some answers are incorrect. Please try again.")
        document.getElementById("try3").style.display = "none"
        document.getElementById("die1").style.display = "block"
        const inputValues = document.querySelectorAll(".clear")
        
        inputValues.forEach(input => {
            input.value = ""
        })
    } else if(clickCount === 2) {
        alert("Some answers are incorrect. Please try again.")
        document.getElementById("try2").style.display = "none"
        document.getElementById("die2").style.display = "block"
        const inputValues = document.querySelectorAll(".clear")
        
        inputValues.forEach(input => {
            input.value = ""
        })
    } else {
        alert("Game over! No more trys for you!")
    }
}

// const retryBtn = document.getElementById("retry-btn")

// retryBtn.addEventListener("click", function(){    

//     const inputValues = document.querySelectorAll(".clear")
    
//     inputValues.forEach(input => {
//         input.value = ""
//     })

//     // if(clickCount === 1) {
//     //     document.getElementById("try3").style.display = "none"
//     //     document.getElementById("die1").style.display = "block"        
//     // } else if (clickCount === 2) {
//     //     document.getElementById("try2").style.display = "none"
//     //     document.getElementById("die2").style.display = "block"
//     // } else {
//     //     alert("Game Over! No more trys for you")
//     // }

// })



