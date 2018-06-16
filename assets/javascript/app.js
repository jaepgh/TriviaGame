//-----------  GLOBAL VARIABLES  -------------
var numberQuestions = 0;
var triviaCategory = "any";
var triviaDifficulty = "any";
var triviaType = "multiple";

var timer_id = 0;
var time_question_id = 0;

var triviaQuestionsArray = [];
var questionIndex = 0;
var correctAnswers = 0;
var incorrectAnswers = 0;
var unansweredAnswers = 0;

//-----------  EVENT MANIPULATION  -------------
$(document).ready(function () {
    //-------- START BUTTON PRESSED -------------
    $("#startButton").on("click", function () {
        numberQuestions = $("#trivia_amount").val();
        triviaCategory = $("#trivia_category").val();
        triviaDifficulty = $("#trivia_difficulty").val();

        var queryURL = "https://opentdb.com/api.php?amount=" + numberQuestions;

        if (triviaCategory != "any") {
            queryURL += "&category=" + triviaCategory;
        }
        if (triviaDifficulty != "any") {
            queryURL += "&difficulty=" + triviaDifficulty;
        }

        queryURL += "&type=" + triviaType;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            triviaQuestionsArray = response;
            renderQuestion();
        });
    });

    $('.posible-options').on('click', function () {
        clearTimeout(time_question_id);
        clearInterval(timer_id);
        renderQuestionResult($(this).text());
    });

    $('#start-over').on('click', function () {
        renderNewGame();
    });
});

//-----------  MAIN FUNCTIONS  -------------
function renderQuestion() {
    showQuestionsTab();

    var counter = 29;
    timer_id = setInterval(function () { $('#remaining-time').text('Time Remaining: ' + counter-- + ' seconds'); }, 1000);
    time_question_id = setTimeout(outOfTime,30000);

    $('#image-tag').attr("src", "assets/images/loading.gif");

    if (questionIndex >= getTotalQuestions()) {
        //Game Over
        clearTimeout(time_question_id);
        clearInterval(timer_id);

        renderGameStats();
    } else {
        //Fill question
        $('#current-question').html(getQuestion());

        //Fill options
        var randomQuestions = shuffle(getPossibleOptions());

        for (let index = 0; index < randomQuestions.length; index++) {
            $('#option' + index).html(randomQuestions[index]);
        }
    }

    
}

function renderQuestionResult(selected) {
    showResultsTab();
    if (isCorrectAnswer(selected)) {
        //Show congrats response
        $('#select-result').text("Correct!");
        $('#correct-answer').hide();
        correctAnswers++;
    } else {
        //Show defeated response
        $('#select-result').text("Nope!");

        $('#correct-answer').html("The correct answer was: " + getCorrectAnswer());
        $('#correct-answer').show();
        incorrectAnswers++;
    }

    questionIndex++;
    setTimeout(renderQuestion, 8000);
}

function renderGameStats() {
    showStatsTab();
    $('#number-correct').text('Correct answers: ' + correctAnswers);
    $('#number-incorrect').text('Incorrect answers: ' + incorrectAnswers);
    $('#number-unanswered').text('Unanswered answers: ' + unansweredAnswers);

}

function renderNewGame() {
    showOptionsTab();
    resetVariables();
}

function renderImage() {
    var formattedAnswer = getCorrectAnswer().replace(/\s/g, '+');
    var queryURL = "https://api.giphy.com/v1/gifs/random?api_key=fXhM70lStyUoO0fA7UVKnRjm0ADkzZgL&rating=G&tag=" + formattedAnswer;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        var imageUrl = response.data.images.fixed_height_downsampled.url;
        $('#image-tag').attr("src", imageUrl);
        $('#image-tag').attr("alt", getCorrectAnswer());
    });

}

function outOfTime(){
    clearInterval(timer_id);
    showResultsTab();
    $('#select-result').text("Out of Time!");
    $('#correct-answer').html("The correct answer was: " + getCorrectAnswer());
    $('#correct-answer').show();
    
    unansweredAnswers++;
    questionIndex++;
    setTimeout(renderQuestion, 5000);
}
//-----------  TRIVIA ACCESS FUNCTIONS  -------------

function getQuestion() {
    return triviaQuestionsArray.results[questionIndex].question;
}

function getCorrectAnswer() {
    return triviaQuestionsArray.results[questionIndex].correct_answer;
}

function isCorrectAnswer(selected) {
    return (selected === triviaQuestionsArray.results[questionIndex].correct_answer);
}

function getPossibleOptions() {
    var resultsArray = [];

    //Push correct response
    resultsArray.push(triviaQuestionsArray.results[questionIndex].correct_answer);

    //Push incorrect reponses
    var incorrect_response = triviaQuestionsArray.results[questionIndex].incorrect_answers;

    incorrect_response.forEach(element => {
        resultsArray.push(element);
    });

    return resultsArray;
}

function getTotalQuestions() {
    return triviaQuestionsArray.results.length;
}

//----------- AUXILIAR FUNCTIONS ----------------

function shuffle(array) {
    var copy = [], n = array.length, i;

    while (n) {

        i = Math.floor(Math.random() * array.length);

        if (i in array) {
            copy.push(array[i]);
            delete array[i];
            n--;
        }
    }

    return copy;
}

function showOptionsTab() {
    $('#options-selector').show();
    $('#question-selector').hide();
    $('#question-results').hide();
    $('#game-results').hide();

    $('#trivia_amount').val(10);
    $('#trivia_category').val('any');
    $('#trivia_difficulty').val('any');

}

function showQuestionsTab() {
    $('#options-selector').hide();
    $('#question-selector').show();
    $('#question-results').hide();
    $('#game-results').hide();
}

function showResultsTab() {
    $('#options-selector').hide();
    $('#question-selector').hide();
    $('#question-results').show();
    $('#game-results').hide();

    //Render the image
    renderImage();
}

function showStatsTab() {
    $('#options-selector').hide();
    $('#question-selector').hide();
    $('#question-results').hide();
    $('#game-results').show();
}

function resetVariables() {
    triviaQuestionsArray = [];
    questionIndex = 0;
    correctAnswers = 0;
    incorrectAnswers = 0;
    unansweredAnswers = 0;
}