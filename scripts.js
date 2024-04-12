// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-analytics.js";
import { getDatabase, ref, push, get } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBugassGcenNxGm-bJZwDDOTbgogl3p2JM",
  authDomain: "word-snap-id.firebaseapp.com",
  projectId: "word-snap-id",
  storageBucket: "word-snap-id.appspot.com",
  messagingSenderId: "943849233817",
  appId: "1:943849233817:web:b20c7193fce5b0d1bc0708",
  measurementId: "G-JTR1CG8N82"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase();


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
    startTimer()
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
        stopTimerAndSendScore()
        stopTimer()
        displayFastestTime()
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
           
        correctAnswers.forEach((correctAnswer, index) => {
            const correctAnswerElement = document.getElementById(`correct-answer${index + 1}`)
            if (correctAnswerElement) {
               correctAnswerElement.textContent = correctAnswer.dataset.answer
               setTimeout(() => {
                    addAnimationAndBorder(correctAnswerElement);
               }, index * 200)
            }
        })

        const playerAnswerDivs = document.querySelectorAll(".player-answer")

        playerAnswerDivs.forEach(div => {
            div.style.color = "transparent"
            div.style.border = "2px solid #D1F6F4"
        })

        stopTimer()
        setTimeout(displayGameOver, 3000)
        
    }    

}

function displayGameOver() {
    gameOver.style.display = "block"
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

// Timer variables
let startTime;
let timerInterval;

// Function to start the timer
function startTimer() {
    startTime = new Date().getTime(); // Get current time in milliseconds
    timerInterval = setInterval(updateTimer, 120); // Update timer every 1 second
}

function stopTimer() {
    clearInterval(timerInterval); // Clear the interval to stop the timer
    const stoppedTime = document.getElementById('timer').innerText; // Get the current displayed time on the timer
    document.getElementById('stopped-time').innerText = stoppedTime
}

// Function to stop the timer and send the stop time as score to Firebase
function stopTimerAndSendScore() {
    const stopTime = new Date().getTime();
    const stopTimeInSeconds = (stopTime - startTime) / 1000; // Calculate stop time in seconds

    // Sending the stop time as score to Firebase Realtime Database
    const scoreRef = ref(database, 'Times');
    push(scoreRef, { times: stopTimeInSeconds });
}


// Function to update the timer
function updateTimer() {
    const currentTime = new Date().getTime(); // Get current time in milliseconds
    const elapsedTime = currentTime - startTime; // Calculate elapsed time
    const milliseconds = Math.floor((elapsedTime % 1000) / 10); // Calculate milliseconds
    const seconds = Math.floor((elapsedTime / 1000) % 60); // Calculate seconds
    const minutes = Math.floor((elapsedTime / 1000 / 60) % 60); // Calculate minutes
    //const hours = Math.floor((elapsedTime / 1000 / 60 / 60) % 24); // Calculate hours (optional)

    // Display the timer in desired format (e.g., HH:MM:SS:MS)
    const formattedTime = padNumber(minutes) + ":" + padNumber(seconds) + ":" + padNumber(milliseconds);

    // Output the formatted time to a HTML element
    document.getElementById('timer').innerText = formattedTime;
}

// Function to pad numbers with leading zeros
function padNumber(number) {
    return (number < 10 ? '0' : '') + number; // Add leading zero if number is less than 10
}


function displayFastestTime() {
    const scoreRef = ref(database, 'Times');
    get(scoreRef).then((snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            let fastestTime = Infinity; // Initialize fastest time as infinity
            // Iterate over the database records to find the fastest time
            Object.values(data).forEach((record) => {
                if (record.times < fastestTime) {
                    fastestTime = record.times;
                }
            });
            document.getElementById('fastest-time').innerText = fastestTime;
        } else {
            // Handle case where no data is available
            document.getElementById('fastest-time').innerText = "NEW HIGH SCORE!!";
        }
    }).catch((error) => {
        // Handle errors
        console.error(error);
        document.getElementById('fastest-time').innerText = "N/A";
    });
}

