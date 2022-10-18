// url: https://opentdb.com/api.php?amount=5&category=9&difficulty=easy&type=multiple

const startBtn = document.getElementById('start-btn')
const responseBtn = document.querySelectorAll('.answer')
const quizContainer = document.getElementById('quiz-container')
const questionElement = document.querySelector('.question')
const answersElement = document.querySelector('.answers')

let currentIndex = 0
let point = 0
let data = []
const userAnsers = []

startBtn.addEventListener('click', startGame)

//Funcion que realiza la peticion 
async function startGame() {
    const url = 'https://opentdb.com/api.php?amount=5&category=9&difficulty=easy&type=multiple'
    const questions = await getQuestions(url)
    data = [...questions]
    console.log(data)
    setNextQuestion(questions)
}

//Funcion que llama a resetState -> Borra los botones con las respuestas, y llama a renderQuestions -> renderiza las preguntas 
function setNextQuestion(questions) {
    resetState()
    renderQuestion(questions)
}

//Funcion que realiza la peticion a la API
async function getQuestions(url) {
    try {
        const request = await fetch(url)
        const response = await request.json()

        if(response.response_code !== 0) {
            console.log(response) //Hacer funcion de error
            throw Error(`Error: ${response.response_code}`)
        }
        console.log(response)
        return response.results
    } catch (error) {
        console.error(error)
    }
}

//Funcion que toma las questions, renderiza una y aumenta el valor de currentIndex
function renderQuestion(questions) {
    if(questions[currentIndex]) {
        questionElement.innerHTML = `<p><span>${currentIndex+1}.</span> ${questions[currentIndex].question}</p>`
        
        const [a, b, c, d] = [...questions[currentIndex].incorrect_answers, questions[currentIndex].correct_answer]
        const shuffleAnswers = [a, b, c, d].sort(() => Math.random() - 0.5);

        const correctAnswer = questions[currentIndex].correct_answer //Toma la respuesta correcta

        const fragment = new DocumentFragment()

        shuffleAnswers.forEach(answer => {
            const btn = document.createElement('button')
            btn.className = 'answer box'
            btn.textContent = answer

            btn.addEventListener('click', e => {
                selectAnswer(e, questions, correctAnswer)
            })
            fragment.appendChild(btn)
        })

        currentIndex++
        answersElement.appendChild(fragment)
        startBtn.classList.add('hide')
        quizContainer.classList.remove('hide')
    }
    else {
        console.log('Se terminaron las preguntas')
        endGame()
    }
}

//Funcion que borra los responseBtn y question si existen dentro del div contenedor
function resetState() {
    while(answersElement.firstChild) {
        answersElement.removeChild(answersElement.firstChild)
    }
    while(questionElement.firstChild){
        questionElement.removeChild(questionElement.firstChild)
    }
}

//Callback que al seleccionar el boton con la respuesta, guarda dicha respuesta y muestra estilos al usuario
function selectAnswer(e, questions, correctAnswer) {
    const selectedAnswer = e.target.textContent
    userAnsers.push(selectedAnswer)

    if(selectedAnswer !== correctAnswer){
        e.target.style.backgroundColor="red"
        e.target.style.color="white"
    }else {
        e.target.style.backgroundColor="green"
        e.target.style.color="white"
        point++
    }
    setTimeout(() => {
        setNextQuestion(questions)
    }, 500);
}

//Funcion que renderiza las respuestas seleccionadas y las correctas cuando termina el quiz

function endGame() {
    const fragment = new DocumentFragment()

    for (let i = 0; i < data.length; i++) {
        const div = document.createElement('div')
        div.innerHTML = `
            <div class="question box">
            <p><span>${i+1}.</span> ${data[i].question}</p>
            </div>
            <div id="answer-container" class="answers">
                <p style="color: black;">Your Answer: ${userAnsers[i]}</p>
                <p style="color: black;">Correct Answer: ${data[i].correct_answer}</p>
            </div>
            `
        fragment.appendChild(div)
    }

    while(quizContainer.firstChild){
        quizContainer.removeChild(quizContainer.firstChild)
    }

    quizContainer.appendChild(fragment)
}