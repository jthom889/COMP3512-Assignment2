
document.addEventListener("DOMContentLoaded", () => {
   generateLandingPage();
  
});

function generateLandingPage(){
   const api = 'http://www.randyconnolly.com/funwebdev/3rd/api/music/songs-nested.php';
   fetch(api)
        .then(response => {
            if(response.ok)
                return response.json();
            else
                return Promise.reject({status:response.status, statusText:response.status.text})
        })
        .then(response => {
            const data = response.slice();
            console.log(data);
            generateTable(data, true);
            generateSearchBar(data,true);
            generateSongView();
            document.querySelector("#filterButton").addEventListener("click", (e) => filter(data,e));
            document.querySelector("#clearButton").addEventListener("click", () => clearSearch(response));
            document.querySelector("#playlistButton").addEventListener("click", () => showPlaylist());
        })
}

function generateTable(data, firstLoad){
   const table = document.querySelector("#song-list table tbody");
   table.innerHTML="";

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

/**
 * this function will generate the songview elements and make them all hidden 
 * 
 */
function generateSongView(){

   //create a section that encompasses everything in the song view
   const songView = document.createElement('div');
   songView.classList.add('songView');

   //create a new div and append it to the parent section
   const songParent = document.createElement('div');
   songParent.classList.add("songParent");

   //append to parent
   songView.appendChild(songParent);

   //create the child divs with the necessary functions
   const songInfo = CreateSongInfoEmpty();
   const analysisData = createAnalysisDataEmpty();

   //append to the parent container
   songView.appendChild(songInfo);
   songView.appendChild(analysisData);
   //hide all information form the songView
   hideSongView();

}

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
   button.textContent="Add to Playlist"
   button.dataset.song_id=song.song_id
   button.addEventListener("click", addToPlaylist)
   return button;

}
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
function clearSearch(response){
   generateTable(response.sort( (a,b) => a.title.toLowerCase() < b.title.toLowerCase() ? -1:1)); 
   generateSearchBar();
   document.querySelector("#searchParams").textContent = "Browse Mode";
   document.querySelectorAll("#song-list table thead tr th span").forEach(e => {
      e.classList.remove("sorted")
   })
}

function addToPlaylist(e){
   //this needs to fade in and out and is just a placeholder for now
   toast = document.querySelector("#toast");
   toast.style.display="flex"
   setTimeout(() => {
      toast.style.display="none"
   }, 4000)
   console.log(e.target.dataset.song_id);
}


/**
 * this function will create single song page view
 */
function singleSong(song){
   //code here, this is how you can access the song id
   console.log(song.target.dataset.song_id);

   //hide all main sections
   hideMain();

  //show all of the song divs
   document.querySelector('.songView').style.display = "block";
   console.log("success");


}

/**
 * this funciton will add content to the created
 * elements for the contents of the song info
 */
function songPopulate(song){   

}


/**
 * this funciton will hide all of the elements of the 
 * body other than the header and footer for the main page
 */
function hideMain(){
   document.querySelector("#search-container").style.display = "none";
   
}

/**
 * this funciton will hide all of the elements of the 
 * body other than the header and footer for the songView
 */
function hideSongView(){
   document.querySelector(".songView").style.display = "none";
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
   danceDiv.classList.add('ADdancability');
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
 * This function will show the playlist view when the playlist button is clicked
 */
function showPlaylist(){
   const pView = document.querySelector("#playlist-view");
   const pTable = document.querySelector("#playlist-table");
   const clearBtn = document.querySelector("#clearPlaylistButton");
   hideMain();
   pView.style.display = "block";

   //Create an empty playlist array, favorited songs will be added to this array
   const playlist = [];

   //display playlist content in the table
   displayPlaylist(playlist);

   //Event listner that removes a single song if the remove button is clicked by the user
   pTable.addEventListener('click', (e) => {
      if (e.target.classList.contains("remove-button")) {
         const removeSong = e.target.dataset.song_id;
         playlist = playlist.filter(song => song.song_id !== removeSong);
         displayPlaylist(playlist);
         avgPop(playlist);  //calculates average popularity
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
 * This function displays the contents of the playlist in the table on the HTML page.
 * @param {*} playlist playlist array created in the showPlaylist() function
 */
function displayPlaylist(playlist){
   const pBody = document.querySelector("#playlist-body");
   pBody.innerHTML = "";

   playlist.forEach( song => {

      const row = document.createElement("tr"); //create row element
      const removeBtn = document.createElement("button"); //create remove button for each row
      const removeCell = document.createElement("td"); //create data cell that will hold the remove button

      removeBtn.textContent = "Remove";
      removeBtn.classList.add("remove-button");
      removeBtn.dataset.song_id = song.song_id;

      removeCell.appendChild(removeBtn);
      row.appendChild(removeCell);
      pBody.appendChild(row);

   });
}

/**
 * Computes the average popularity of the songs in the playlist, and shows the number of songs in the playlist.
 * This function also displays the information.
 * @param {*} playlist array, takes the average popularity from the songs in this array
 */
function avgPop(playlist){
   const pSummary = document.querySelector("#playlist-summary");
   const numSongs = playlist.length;
   let totalPop = 0;

   playlist.forEach( song => {
      totalPop += song.details.popularity;
   });

   const avg = totalPop / numSongs || 0;
   pSummary.textContent = `Total Songs in Playlist: ${numSongs}, Average Popularity of Playlist: ${avg.toFixed(2)}`;

}