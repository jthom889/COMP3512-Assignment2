let data = [];
let playlist = [];

//this variable will track the active page for the purpose of the exit button on single song
let page = "home";

document.addEventListener("DOMContentLoaded", () => {
   setData();
});
/*
SETS DATA AND GENERATES THE SEARCH SECTION
*/
function setData(){
   const api = 'https://www.randyconnolly.com/funwebdev/3rd/api/music/songs-nested.php';
   let songs = localStorage.getItem("songs");
   if(songs){
      data.push(...JSON.parse(songs));
      generateLandingPage();
   }else{
      fetch(api)
        .then(response => {
            if(response.ok)
                return response.json();
            else
                return Promise.reject({status:response.status, statusText:response.status.text})
        })
        .then(response => {
            localStorage.setItem("songs", JSON.stringify(response))
            data.push(...response);
            generateLandingPage();
        })
   }
   
}

/* 
==============
SEARCH SECTION
==============
*/

//shows search table, fills options, set main event listeners
function generateLandingPage(){
   generateSongView();
   generateTable(data, true);
   generateSearchBar(data,true);
            
   document.querySelector("#filterButton").addEventListener("click", (e) => filter(data,e));
   document.querySelector("#clearButton").addEventListener("click", () => clearSearch(data));
   document.querySelector("#playlistBtn").addEventListener("click", () => showPlaylist());
   document.querySelector("#aboutUs").addEventListener("mouseover", showAboutUs);
   
}
//generates the main search table
function generateTable(data, firstLoad){
   const table = document.querySelector("#song-list table tbody");
   table.innerHTML="";

   //we dont want to add event listeners every time a new table is generated
   //sort by title on first load
   if(firstLoad){
      document.querySelector("#song-list table thead tr").addEventListener('click', e => sortHandler(e,data));
      document.querySelector("#song-list table thead tr").children[0].children[0].classList.add("sorted")
      data.sort( (a,b) => a.title < b.title ? -1:1);
   }

   for(let s of data){
      //create row
      const row = document.createElement("tr");
      table.appendChild(row);

      //cleaner to add data into array and loop
      let data = [s.title, s.artist.name, s.year, s.genre.name, s.details.popularity]

      //add data into row
      for(let d of data){
         //create data element, add text into it
         const tableData = document.createElement("td");
         const text = document.createTextNode(d);
         tableData.appendChild(text);

         //put tableData into row
         row.appendChild(tableData);
         
      }
      //add button for playlist
      row.appendChild(createButton(s));
      row.children[0].dataset.song_id = s.song_id;
   }

   document.querySelectorAll("#song-list table tbody tr").forEach(
                     row => row.children[0].addEventListener("click", e => singleSong(e)));

}
//sets up search bar behavior, if first load sets up the OPTION elements
function generateSearchBar(data,firstLoad){
   if(firstLoad){
      fillOptions(data);
      document.querySelectorAll("input[type=radio]").forEach(r => {r.addEventListener("change", radioClick)})
   }else{
      const titleText = document.querySelector("#titleText");
      const artistSelect = document.querySelector("#artistSelect");
      const genreSelect = document.querySelector("#genreSelect");
      //set title radio back to selected
      document.querySelector("#titleRadio").checked = true;
      //reset title value and enable it
      titleText.disabled = false;
      titleText.value="";
      //reset artist value and disable it
      artistSelect.disabled = true;
      artistSelect.value = 0;
      //reset genre value and disable it
      genreSelect.disabled = true;
      genreSelect.value = 0;
      document.querySelector("#filterButton").disabled=false;
   }
   
}
//fills the SELECT elements with unique artists and genres
function fillOptions(data){

   const artistSelect = document.querySelector("#artistSelect");

   const artists = data.map(d => d.artist.name);
   const uniqueArtists = artists.filter((val, index) => artists.indexOf(val) === index).sort();

   for(let u of uniqueArtists){
      const newOptionArtist = document.createElement("option");
      const optionTextArtist = document.createTextNode(u);
      newOptionArtist.appendChild(optionTextArtist);
      artistSelect.appendChild(newOptionArtist);
   }

   const genreSelect = document.querySelector("#genreSelect");

   const genres = data.map(d => d.genre.name);
   const uniqueGenres = genres.filter((val, index) => genres.indexOf(val) === index).sort();

   for(let u of uniqueGenres){
      const newOptionGenre = document.createElement("option");
      const optionTextGenre = document.createTextNode(u);

      newOptionGenre.appendChild(optionTextGenre);
      genreSelect.appendChild(newOptionGenre);
   }
}
//clears search table to all songs, resets the search bar
function clearSearch(songs){
   generateTable(songs.sort( (a,b) => a.title.toLowerCase() < b.title.toLowerCase() ? -1:1)); 
   generateSearchBar();
   document.querySelector("#searchParams").textContent = "Browse Mode";
   document.querySelectorAll("#song-list table thead tr th span").forEach(e => {
      e.classList.remove("sorted")
   })
}

/*
====================
SORTING SEARCH TABLE
====================
*/
//resets search, sets styles for relevant TH element, calls sort method
function sortHandler(e, data){
   document.querySelectorAll("#song-list table thead tr th span").forEach(e => {
      e.classList.remove("sorted")
   })
   clearSearch(data);
   if(e.target.innerText == "Title" && e.target.nodeName === "SPAN"){
      sortByOneField("title",e,data);
      e.target.classList.add("sorted");
   }
   else if(e.target.innerText == "Artist" && e.target.nodeName === "SPAN"){
      e.target.classList.add("sorted");
      sortByTwoFields("artist","name",e,data);
   }
   else if(e.target.innerText == "Year" && e.target.nodeName === "SPAN"){
      e.target.classList.add("sorted");
      sortByOneField("year",e,data);
   }
   else if(e.target.innerText == "Genre" && e.target.nodeName === "SPAN"){
      e.target.classList.add("sorted");
      sortByTwoFields("genre","name",e,data);
   }
   else if(e.target.innerText == "Popularity" && e.target.nodeName === "SPAN"){
      e.target.classList.add("sorted");
      sortByTwoFields("details","popularity",e,data);
   }
      
}
//sorts by one field, if year we cannot call .toLowerCase()
//checks if dataset.sorted=true, if it is true, reverse the search
function sortByOneField(field,e,data){
   if(checkSorted(e)){
      if(field === "year")
         generateTable(data.sort( (a,b) => a[field] > b[field] ? -1:1));
      else
         generateTable(data.sort( (a,b) => a[field].toLowerCase() > b[field].toLowerCase() ? -1:1));
   }
   else{
      if(field === "year")
         generateTable(data.sort( (a,b) => a[field] < b[field] ? -1:1));
      else
         generateTable(data.sort( (a,b) => a[field].toLowerCase() < b[field].toLowerCase() ? -1:1));
   }
}
//sorts by two fields, if popularity we cannot .toLowerCase()
//checks if dataset.sorted=true, if it is true, reverse the search
function sortByTwoFields(field,field2,e,data){
   if(checkSorted(e)){
      if(field2 === "popularity")
         generateTable(data.sort( (a,b) => a[field][field2] > b[field][field2] ? -1:1));
      else
         generateTable(data.sort( (a,b) => a[field][field2].toLowerCase() > b[field][field2].toLowerCase() ? -1:1));
   }
   else{
      if(field2 === "popularity")
         generateTable(data.sort( (a,b) => a[field][field2] < b[field][field2] ? -1:1));
      else
         generateTable(data.sort( (a,b) => a[field][field2].toLowerCase() < b[field][field2].toLowerCase() ? -1:1));
   }
}
//for checking if the dataset is set to sorted or not
//if not sorted, set to sorted
function checkSorted(e){
   if(e.target.dataset.sorted == "true"){
      e.target.dataset.sorted = "false"
      return true
   }
   else{
      e.target.dataset.sorted = "true"
      return false
   }
      
}
/*
=================================
FILTERING BY ARTIST, TITLE, GENRE
=================================
*/
function filter(data,e){
   document.querySelector("#filterButton").disabled=true;
   const searchParams = document.querySelector("#searchParams")
   if(document.querySelector("#artistRadio").checked && document.querySelector("#artistSelect").value != 0){
      generateTable(data.filter(d => d.artist.name === document.querySelector("#artistSelect").value));
      searchParams.textContent = `Search by Artist: ${document.querySelector("#artistSelect").value}`
   }
   else if(document.querySelector("#titleRadio").checked && document.querySelector("#titleText").value != 0){
      generateTable(data.filter(d => d.title.includes(document.querySelector("#titleText").value)));
      searchParams.textContent = `Search by Title: ${document.querySelector("#titleText").value}`
   }
   else if(document.querySelector("#genreRadio").checked && document.querySelector("#genreSelect").value != 0){
      generateTable(data.filter(d => d.genre.name === document.querySelector("#genreSelect").value));
      searchParams.textContent = `Search by Genre: ${document.querySelector("#genreSelect").value}`
   }
   else{
      document.querySelector("#message").innerText = "Please Fill Out The Relevant Field";
      document.querySelector("#filterButton").disabled=false;
      setTimeout(()=>{
         document.querySelector("#message").innerText = "";
      },3000)
   }
}


/**
 * this function will generate the songview 
 * elements and make them all hidden 
 */
function generateSongView(){

   //create a variable that contains the songView section
   const songView = document.querySelector('.songView');

   const songData = document.createElement('div');
   songData.classList.add('songData');
   songView.appendChild(songData);

   const chartData = document.createElement('div');
   chartData.classList.add('chartData');
   songView.appendChild(chartData);

   //create the child divs with the necessary functions
   const songInfo = CreateSongInfoEmpty();
   const analysisData = createAnalysisDataEmpty();

   //append to the parent container
   songData.appendChild(songInfo);
   songData.appendChild(analysisData);
}




function radioClick(e){
   console.log("clicked")
   const titleText = document.querySelector("#titleText")
   const genreSelect = document.querySelector("#genreSelect");
   const artistSelect = document.querySelector("#artistSelect");

   genreSelect.disabled=true;
   artistSelect.disabled=true;
   titleText.disabled=true;
   

   if(e.target == document.querySelector("#titleRadio")){
      titleText.disabled = false;
   }
   else if(e.target == document.querySelector("#genreRadio")){
      genreSelect.disabled = false;
   }else
      artistSelect.disabled = false;
}

function createButton(song){
   const button = document.createElement("button");
   button.classList.add("playlistButton");
   button.textContent="Add";
   button.dataset.song_id=song.song_id;
   button.addEventListener("click", () => addToPlaylist(song));
   return button;

}



function addToPlaylist(song){
   //this needs to fade in and out and is just a placeholder for now
   const toast = document.querySelector("#toast");
   toast.style.display="flex";
   setTimeout(() => {
      toast.style.display="none";
   }, 2400);
   // console.log(song.target.dataset.song_id);
   const songExists = playlist.some((existingSong) => existingSong.song_id === song.song_id);

    if (!songExists) {
        playlist.push(song);
        displayPlaylist(playlist);
        avgPop(playlist);
    }
}


/**
 * this function will create single song page view
 */
function singleSong(song){
   //get the clicked on song
   const songChoice = data.find( d => song.target.dataset.song_id == d.song_id);

   //hide all main sections and playlist sections 
   //and make the appropriate sections visible
   hideMain();
   hidePlaylist();
   const songView = document.querySelector(".songView");
   const chartData = document.querySelector(".chartData");
   songView.style.display = "grid";
   //call the function to populate the songPage
   songPopulate(songChoice);
   showBackBtn();

   //create a chart and append it to its parent   
   const chart = document.createElement("canvas");
   chart.id = 'radarChart';
   chartData.appendChild(chart);

   //get the chart and draw it
   drawChart(document.querySelector('#radarChart'), songChoice);
}

/**
 * this funciton will add content to the created
 * elements for the contents of the song info
 */
function songPopulate(song){   
   //select the song info divs and add the information accordingly
   //set the header
   const header = document.querySelector('.SIheader h1');
   header.textContent = "Song Information";
   //add to title
   const titleDiv = document.querySelector('.SItitle');
   titleDiv.innerHTML = `<h2 style="font-weight: bolder;">${song.title}</h2>`;

   //add to artistName
   const artistNameDiv = document.querySelector('.SIaName');
   artistNameDiv.innerHTML = `By: <p style="font-weight: bolder;">${song.artist.name}</p>`;
   
   //add to genre
   const genreDiv = document.querySelector('.SIgenre');
   genreDiv.innerHTML = `Genre: <p style="font-weight: bolder;">${song.genre.name}</p>`;
   
   //add to genre
   const yearDiv = document.querySelector('.SIyear');
   genreDiv.innerHTML = `Released in: <p style="font-weight: bolder;">${song.year}</p>`;

   //add to genre
   const durationDiv = document.querySelector('.SIduration');
   durationDiv.innerHTML = `Length: <p style="font-weight: bolder;">${formatTime(song.details.duration)}</p>min`;

   //select the analysis info divs and add content to them
   //add to bpm
   const bpmDiv = document.querySelector('.ADbpm');
   bpmDiv.innerHTML = `bpm: <p style="font-weight: bolder;">${song.details.bpm}</p>`;

   //add to energy
   const energyDiv = document.querySelector('.ADenergy');
   energyDiv.innerHTML = `Energy: <p style="font-weight: bolder;">${song.analytics.energy}</p>`;

   //add to danceability
   const danceDiv = document.querySelector('.ADdanceability');
   danceDiv.innerHTML = `Danceability: <p style="font-weight: bolder;">${song.analytics.danceability}</p>`
   
   //add to liveness
   const livenessDiv = document.querySelector('.ADliveness');
   livenessDiv.innerHTML = `Liveness: <p style="font-weight: bolder;">${song.analytics.liveness}</p>`
   
   //add to valence
   const valenceDiv = document.querySelector('.ADvalence');
   valenceDiv.innerHTML = `Valence: <p style="font-weight: bolder;">${song.analytics.valence}</p>`

   //add to acousticness
   const acousticDiv = document.querySelector('.ADacousticness');
   acousticDiv.innerHTML = `Acoustics: <p style="font-weight: bolder;">${song.analytics.acousticness}</p>`

   //add to speechiness
   const speechDiv = document.querySelector('.ADspeechiness');
   speechDiv.innerHTML = `Speechiness: <p style="font-weight: bolder;">${song.analytics.speechiness}</p>`
   
   //add to popularity
   const popularityDiv = document.querySelector('.ADpopularity');
   popularityDiv.innerHTML = `Popularity: <p style="font-weight: bolder;">${song.details.popularity}</p>`
}



/**
 * this function will convert the time in seconds to minutes
 * @param {*} sec is the number of seconds to convert 
 * @returns formatted string for minutes
 */
function formatTime(sec) {
   let minutes = sec < 60 ? '0' : Math.floor(sec/60);
   calcSec = sec % 60;
   return minutes + ":" + calcSec;
}


/**
 * this funciton will hide all of the elements of the 
 * main body other than the header and footer for the main page
 */
function hideMain(){
   document.querySelector("#search-container").style.display = "none";
   document.querySelector("#playlistBtn").style.display = "none";
   
}

/**
 * this funciton will hide all of the elements of the 
 * songView other than the header and footer for the songView
 */
function hideSongView(){
   document.querySelector(".songView").style.display = "none";
   document.querySelector('#backBtn').style.display = "none";
   document.querySelector('.chartData').innerHTML = "";

}

/**
 * this function will hide the playlist view
*/
function hidePlaylist(){
   document.querySelector("#playlist-view").style.display = "none";
   document.querySelector("#homeBtn").style.display = "none";
}

/**
 * create all necessary divs for the the song info 
 * portion of the single song view
 * @returns song info div with all childeren appended to it
 */
function CreateSongInfoEmpty(){

   //create all necessary divs for each aspect of the song view
   //a hierarchy of divs is created to ensure easy maintenance and changing
   const songInfo = document.createElement('div')
   songInfo.classList.add('songInfo');

   //create all childeren nodes for the song info and append to the song info div
   const heading = document.createElement('div');
   const h1 = document.createElement('h1');
   heading.classList.add('SIheader');
   heading.appendChild(h1);
   songInfo.appendChild(heading);

   const titleDiv = document.createElement('div');
   titleDiv.classList.add('SItitle');
   songInfo.appendChild(titleDiv);

   const aNameDiv = document.createElement('div');
   aNameDiv.classList.add('SIaName');
   songInfo.appendChild(aNameDiv);

   const aTypeDiv = document.createElement('div');
   aTypeDiv.classList.add('SIaType');
   songInfo.appendChild(aTypeDiv);

   const genreDiv = document.createElement('div');
   genreDiv.classList.add('SIgenre');
   songInfo.appendChild(genreDiv);

   const yearDiv = document.createElement('div');
   yearDiv.classList.add('SIyear');
   songInfo.appendChild(yearDiv);

   const durationDiv = document.createElement('div');
   durationDiv.classList.add('SIduration');
   songInfo.appendChild(durationDiv);

   return songInfo;
}

/**
 * create necessary divs for the analysis data portion 
 * of the single song page
 * @returns the div with all childeren
 */
function createAnalysisDataEmpty(){

   //create divs in the analysis data section
   const analysisData = document.createElement('div')
   analysisData.classList.add('analysisdata');

   const bpmDiv = document.createElement('div');
   bpmDiv.classList.add('ADbpm');
   analysisData.appendChild(bpmDiv);

   const energyDiv = document.createElement('div');
   energyDiv.classList.add('ADenergy');
   analysisData.appendChild(energyDiv);

   const danceDiv = document.createElement('div');
   danceDiv.classList.add('ADdanceability');
   analysisData.appendChild(danceDiv);

   const livenessDiv = document.createElement('div');
   livenessDiv.classList.add('ADliveness');
   analysisData.appendChild(livenessDiv);

   const valenceDiv = document.createElement('div');
   valenceDiv.classList.add('ADvalence');
   analysisData.appendChild(valenceDiv);

   const acousticDiv = document.createElement('div');
   acousticDiv.classList.add('ADacousticness');
   analysisData.appendChild(acousticDiv);

   const speechDiv = document.createElement('div');
   speechDiv.classList.add('ADspeechiness');
   analysisData.appendChild(speechDiv);
   
   const popularityDiv = document.createElement('div');
   popularityDiv.classList.add('ADpopularity');
   analysisData.appendChild(popularityDiv);
   
   return analysisData;
   
   
}

/**
 * this function creates the chart for the 
 * single song page based on one songs attributes
*/
function drawChart(canvas, song) {
   new Chart(canvas, {
      type: 'radar',
      data: {
         labels: ['Danceability', 'Energy', 'Speechiness', 'Acoustics', 'Liveness', 'Valence'],
         datasets: [{
            label: 'Analysis Data',
            data: [song.analytics.danceability, song.analytics.energy, song.analytics.speechiness, song.analytics.acousticness, song.analytics.liveness, song.analytics.valence],
            fill: true,
            backgroundColor: 'rgb(177, 143, 207, 0.5)',
               borderColor: '#774C7B',
               
               pointBackgroundColor: 'rgb(177, 143, 207, 0.5)',
               pointBorderColor: '#fff',
               fillopacity: 50
               
         }]
      },
      options: {
         plugins: {
            legend:{
               display: true,
               labels: {color: "white"},
            },
            title: {
               display: true,
               text: `${song.title}`,
               align: 'center',
               color: 'white',
               font:{
                     family: 'serif',
                     color: 'white',
                     size: 40,
                     weight: 400
               }
            }
         },
         scales: {
            r: {
               ticks: {
                     color: "white",
                     backdropColor: "transparent",
                     textStrokeWidth: 5,
                     font:{
                        family: 'serif',
                        size: 10
                     }
               },
               pointLabels: {
                     color: 'white',
                     font:{
                        family: 'serif',
                        size: 14,
                        weight: 'bold'
                     }
               },
               grid: {
                  circular: true,
                  color: "white"
               },
               suggestedMin: 0,
            }
         },
         responsive: true,
         elements: {
            line: {
               borderWidth: 3,
               borderCapStyle: 'round',
               tension: 0.2
            }
         }
      }
   });
}



/**
 * This function will show the playlist view when the playlist button is clicked
*/
function showPlaylist(){
   const pView = document.querySelector("#playlist-view");
   const pTable = document.querySelector("#playlist-table");
   const clearBtn = document.querySelector("#clearPlaylist");
   hideMain();
   hideSongView();
   showHomeBtn();
   pView.style.display = "block";
   
   //set active page status
   page = "playlist";
   
   //display playlist content in the table
   displayPlaylist(playlist);
   
   //Event listner that removes a single song if the remove button is clicked by the user
   pTable.addEventListener('click', (e) => {
      if (e.target.classList.contains("removeBtn")) {
         console.log("remove button clicked");
         console.log(playlist);
         const removeSongId = e.target.dataset.song_id;
         playlist = playlist.filter(song => song.song_id != removeSongId);
         displayPlaylist(playlist);
         avgPop(playlist);
      }
   });

   
   
   //Removes all songs from the playlist array
   clearBtn.addEventListener("click", () => {
      playlist = [];
      displayPlaylist(playlist);//displays an empty playlist
      avgPop(playlist);
   });

  avgPop(playlist); //calculates average popularity and displays number of songs
}

/**
    * this function will set the main pages container to visible
    */
   function showMain(){
      document.querySelector("#search-container").style.display = "grid";
      document.querySelector("#playlistBtn").style.display = "inline-block";
      //set page status
      page = "home";
   }

/**
 * This function displays the contents of the playlist in the table on the HTML page.
 * @param {*} playlist playlist array created in the showPlaylist() function
 */
function displayPlaylist(playlist){
   const pBody = document.querySelector("#playlist-body");
   pBody.innerHTML = "";

   playlist.forEach( song => {

      const row = document.createElement("tr"); //create row element

      //create title cell, and append to parent (row)
      const titleCell = document.createElement("td");
      titleCell.textContent = song.title;
      titleCell.dataset.song_id = song.song_id;
      row.appendChild(titleCell);

      //create artist cell, and append to parent (row)
      const artistCell = document.createElement("td");
      artistCell.textContent = song.artist.name;
      row.appendChild(artistCell);

      //create year cell, and append to parent (row)
      const yearCell = document.createElement("td");
      yearCell.textContent = song.year;
      row.appendChild(yearCell);

      //create genre cell, and append to parent (row)
      const genreCell = document.createElement("td");
      genreCell.textContent = song.genre.name;
      row.appendChild(genreCell);

      //create popularity cell, and append to parent (row)
      const popCell = document.createElement("td");
      popCell.textContent = song.details.popularity;
      row.appendChild(popCell);

      //Create remove button
      const removeBtn = document.createElement("button");
      removeBtn.id = "removeBtn";
      removeBtn.textContent = "Remove";
      removeBtn.classList.add("removeBtn");
      removeBtn.dataset.song_id = song.song_id;

      //create remove cell, and append to button to the remove cell. 
      //Then append the remove cell to its parent (row) including the previously created remove button
      const removeCell = document.createElement("td");
      removeCell.appendChild(removeBtn);
      row.appendChild(removeCell);

      // Append the entire row to the playlist table
      pBody.appendChild(row);


   });

   //user can click on a song in the playlist and bring up the single song information
   document.querySelectorAll("#playlist-view table tbody tr").forEach(
      row => row.children[0].addEventListener("click", e => singleSong(e)));
}

/**
 * Computes the average popularity of the songs in the playlist, and shows the number of songs in the playlist.
 * This function also displays the information.
 * @param {*} playlist array, takes the average popularity from the songs in this array
 */
function avgPop(playlist){
   const pSummary = document.querySelector("#playlist-summary");
   pSummary.innerHTML="";
   const numSongs = playlist.length;
   const p1 = document.createElement("p");
   const p2 = document.createElement("p");
   let totalPop = 0;

   playlist.forEach( song => {
      totalPop += song.details.popularity;
   });

   const avg = totalPop / numSongs || 0;
   p1.textContent = `Total Songs in Playlist: ${numSongs}`; 
   p2.textContent = `Average Popularity of Playlist: ${avg.toFixed(2)}`;

   pSummary.appendChild(p1);
   pSummary.appendChild(p2);

}

function showHomeBtn(){
   const homeBtn = document.querySelector("#homeBtn");
   const pBtn = document.querySelector("#playlistBtn");
   homeBtn.style.display = "inline-block";
   homeBtn .addEventListener("click", () => {
      showMain();
      hidePlaylist();
      hideSongView();
       
   });
}

/**
 * this function will change the top 
 * left's button to the back button
 */
function showBackBtn(){
   //set all buttons status
   const backBtn = document.querySelector("#backBtn");
   backBtn.style.display = "inline-block"; 
   
   //add he event listener
   backBtn.addEventListener('click', ()=> {
      hideSongView();
      //check what status the previous page had and set the back button accordingly
      (page=="playlist") ? showPlaylist() : (page=="home") ? showMain() : alert("Error: No previous page");

   });
}

function showAboutUs(){
   document.querySelector("#aboutUsDiv").style.display = "inline-block";
   setTimeout(() => {
      document.querySelector("#aboutUsDiv").style.display = "none";
   }, 5000)
}