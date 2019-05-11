'use strict';

const searchURL = 'https://api.github.com/users/';


function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson, query) {
  // if there are previous results, remove them
  console.log(responseJson);
  $('#results-list').empty();
  // iterate through the articles array, stopping at the max number of results
  for (let i = 0; i < responseJson.length; i++){
    // for each video object in the articles
    //array, add a list item to the results 
    //list with the article title, source, author,
    //description, and image
    if (responseJson[i].description === null) {
        responseJson[i].description = 'No description provided for this repository.';
    }
    $('#results-list').append(
      `<li><h3><a href="${responseJson[i].html_url}">${responseJson[i].name}</a></h3>
      <p class="last-updated">Last updated ${responseJson[i].updated_at}</p>
      <p>${responseJson[i].description}</p>
      </li>`
    )};
    $('.js-search-term').html(query);
  //display the results section  
  $('#results').removeClass('hidden');
};

function getRepos(query) {
    console.log(`getRepos ran with query: ${query}`);
    const url = searchURL + query + '/repos?sort=updated';
    console.log(url);

    fetch(url)
        .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error(response.statusText);
        })
        .then(responseJson => displayResults(responseJson, query))
        .catch(err => {
        $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-search-term').val();
    getRepos(searchTerm);
  });
}

$(watchForm);