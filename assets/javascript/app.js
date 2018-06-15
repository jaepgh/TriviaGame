//-----------  GLOBAL VARIABLES  -------------
var numberQuestions = 0;
var triviaCategory = "any";
var triviaDifficulty = "any";
var triviaType = "multiple";

var triviaQuestionsArray = [];

//-----------  EVENT MANIPULATION  -------------
$(document).ready(function () {
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
            console.log(triviaQuestionsArray);
        });
    });
});




