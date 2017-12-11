const APIKEY = "bedd17f5e8e69d86e9c9e2aa4c7b9a28";
const BASEURL = 'https://api.themoviedb.org/3/';
const BASEIMAGEURL = "http://image.tmdb.org/t/p/w185";
let history = [];
let currentResults = null;

function search(){
    document.getElementById("loading").classList.remove("not");
    let keyWord = document.getElementById("search-input").value;
    let url = ''.concat(BASEURL, "search/movie?api_key=", APIKEY, "&query=", keyWord);
    fetch(url)
    .then(result=>result.json())
    .then((data)=>{
        switchView();
        data.results.searchTerm = document.getElementById("search-input").value;
        data.results.isNewSearch = true;
        currentResults = data.results;
        history.push(data.results);
        displayResults(data.results);
    })
    .catch(function(err){
        document.getElementById("loading").classList.add("not"); 
        alert(err);
    });
}

function related(movieID, movieTitle){
    document.getElementById("loading").classList.remove("not");
    let url = ''.concat(BASEURL, "movie/", movieID, "/recommendations?api_key=", APIKEY, "&language=en-US&page=1");
    console.log(url);
    fetch(url)
    .then(result=>result.json())
    .then((data)=>{
        console.log(data);
        data.results.searchTerm = movieTitle;
        data.results.isNewSearch = false;
        currentResults = data.results;
        history.push(data.results);
        displayResults(data.results);
    })
    .catch(function(err){
        document.getElementById("loading").classList.remove("not");
        alert(err);
    });
}

function displayResults(results){
    if (document.getElementById("search-results").innerHTML != ""){
        document.getElementById("search-results").innerHTML = "";
    }
    let movieInfo = "";
    displaySearchDescription(results);
    results.forEach(function(movie){
        movieInfo = '<div class="movie" onclick="related(' + movie.id + ', \'' + escape(movie.title) + '\')">';
        movieInfo += '<h2>'+ movie.title +'</h2>';
        if (movie.poster_path == null){
            movieInfo += '<img class="moviePoster" src="images/Poster_Not_Found.png" alt="Poster for "' + movie.title + '" not found"/>'; 
        }
        else{
            movieInfo += '<img class="moviePoster" src="' + BASEIMAGEURL + movie.poster_path + '" alt="Poster for ' + movie.title + '"/>';
        }
        movieInfo += '<div><h3>' + movie.release_date + '</h3>';
        movieInfo += '<h3 class="material-icons rating">' + getRating(movie.vote_average / 2) + '</h3></div>';
        movieInfo += '<p>' + movie.overview + '</p></div>';

        document.getElementById("search-results").innerHTML += movieInfo;
    });
    document.getElementById("search-input").value = "";
    document.getElementById("back-button").classList.remove("not");
    document.getElementById("loading").classList.add("not");    
}

function displaySearchDescription(results){
    if (results.isNewSearch == true){
        document.getElementById("search-results").innerHTML = '<p class="searchDescription">Showing results for "<i>' + unescape(results.searchTerm) + '</i>"</p>';       
    }
    else{
        document.getElementById("search-results").innerHTML = '<p class="searchDescription">Showing recommendations based on "<i>' + unescape(results.searchTerm) + '</i>"</p>'; 
    }
}

function getRating(numRating){
    let rating = "";
    for (let x = 1; x <= 5; x++){
        if (rating.length != 0){
            rating += " ";
        }
        if (numRating >= 1){
            rating += "star";
        }
        else if (numRating > 0 && numRating < 1){
            if (numRating >= 0.5){
                rating += "star_half";
            }
            else{
                rating += "star_border";
            }
        }
        else{
            rating += "star_border";
        }
        numRating --;
    }
    return rating;
}

function switchView(){
    document.getElementById("homePage").classList.add("hide");
    document.getElementById("search-results").classList.add("show");
    document.getElementById("search-bar").classList.add("resultsSearchBar");
}
function back(){
    document.getElementById("search-results").innerHTML = "";
    if (history[history.length - 1] == currentResults){
        history.pop();
        currentResults = null;
    }
    if (history.length == 0){
        document.getElementById("back-button").classList.add("not");
        document.getElementById("homePage").classList.remove("hide");
        document.getElementById("search-results").classList.remove("show");
        document.getElementById("search-bar").classList.remove("resultsSearchBar");
        history.pop();
    }
    else{
        displayResults(history.pop());
    }
}

document.getElementById("search-button").addEventListener("click", search);
document.getElementById("search-input").addEventListener("keypress", function (pressed){
    var key = pressed.which || pressed.keyCode;
    if (key === 13) {
        search();
    }
});
document.getElementById("back-button").addEventListener("click", back);