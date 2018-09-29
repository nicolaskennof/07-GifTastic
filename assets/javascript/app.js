var topics = ["food", "women", "great", "beer", "love", "anything"];
var retrievedSearches = localStorage.getItem("searchesArray");
console.log(retrievedSearches);

var apiKey = "JQpBAA3wMtLWt6v3YTAKVbKeSoGjssYQ";
const limit = 10;

// displayPizzaSearch function re-renders the HTML to display the appropriate content
function displayPizzaSearch() {
    var qSearch = $(this).attr("data-name") + " pizza";
    var qSearchForQueryURL = qSearch.replace(" ", "_");
    console.log(qSearchForQueryURL);
    var queryURL = "http://api.giphy.com/v1/gifs/search?q=" + qSearchForQueryURL + "&api_key=" + apiKey + "&limit=" + limit;
    console.log(queryURL);
    //$("#results").createNewResultCard();

    // Creating a card to hold the 10 gifs of the search
    // Function to push all the unique search results in a card
    function createNewResultCard(qSearchForQueryURL) {
        var resultsDivGlobal = $("<div>");
        resultsDivGlobal.addClass("card");
        var resultsHeader = $("<h5>");
        resultsHeader.addClass("card-header");
        resultsHeader.text("Your results for: " + "'" + qSearchForQueryURL + "'");
        $(resultsDivGlobal).append(resultsHeader);
        var resultsDiv = $("<div>");
        resultsDiv.addClass("card-body");
        resultsDiv.attr("id", qSearchForQueryURL);
        $(resultsDivGlobal).append(resultsDiv);
        $("#requests").prepend(resultsDivGlobal);
    };

    // Creating an AJAX call for the specific pizza button being clicked
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        var results = response.data;
        createNewResultCard(qSearchForQueryURL);

        // Looping through each result item
        for (var i = 0; i < results.length; i++) {

            // Storing the still image data
            var stillGif = results[i].images.fixed_width_still.url;

            // Storing the still image data
            var animatedGif = results[i].images.fixed_width.url;

            // Storing the rating data
            var rating = results[i].rating

            // Creating an element to hold the image
            var image = $("<img>");
            image.addClass("gif");
            image.attr("src", stillGif);
            image.attr("data-still", stillGif);
            image.attr("data-animate", animatedGif);
            image.attr("data-state", "still");
            console.log(image);
            // Appending the image
            $("#" + qSearchForQueryURL).append(image);

            // Creating an element to hold the rating
            var ratingDiv = $("<div>");
            ratingDiv.text("This gif rating is: " + rating);
            $("#" + qSearchForQueryURL).append(ratingDiv);
        }
        //On-click event to change state of the img
        $(".gif").on("click", function () {
            var state = $(this).attr("data-state");
            if (state === "still") {
                $(this).attr("src", $(this).attr("data-animate"));
                $(this).attr("data-state", "animate");
            } else {
                $(this).attr("src", $(this).attr("data-still"));
                $(this).attr("data-state", "still");
            }
        });
    });
};

// Function for displaying search data
function renderButtons() {
    $("#rendered-buttons").empty();

    // Looping through the array of topics
    for (var i = 0; i < topics.length; i++) {
        var button = $("<button type='button'>");
        button.addClass("btn btn-secondary");
        button.attr("data-name", topics[i]);
        button.text(topics[i]);
        $("#rendered-buttons").append(button);
    }
};

// This function handles events where a search button is clicked
$("#add-search").on("click", function (event) {
    event.preventDefault();
    var qSearch = $("#search-input").val().trim();
    var qSearchForQueryURL = qSearch.replace(" ", "_");
    topics.push(qSearchForQueryURL);
    localStorage.setItem("searchesArray", JSON.stringify(topics));
    renderButtons();
    $("#search-input").val("");
});

// Adding a click event listener to all elements with a class "btn btn-secondary"
$(document).on("click", ".btn-secondary", displayPizzaSearch);

// Calling the renderButtons function to display the intial buttons
renderButtons();

