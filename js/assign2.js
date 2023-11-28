
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
            document.querySelector("#filterButton").addEventListener("click", (e) => filter(data,e));
            document.querySelector("#clearButton").addEventListener("click", () => clearSearch(response));
        })
}

function generateTable(data, firstLoad){
   const table = document.querySelector("#song-list table tbody");
   table.innerHTML="";

   if(firstLoad){
      document.querySelector("#song-list table thead tr").addEventListener('click', e => sortHandler(e,data));
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
                                          row => row.children[0].addEventListener("click",singleSong));

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
   clearSearch(data);
   if(e.target.innerText == "Title" && e.target.nodeName === "SPAN")
      sortByOneField("title",e,data);
   else if(e.target.innerText == "Artist" && e.target.nodeName === "SPAN")
      sortByTwoFields("artist","name",e,data);
   else if(e.target.innerText == "Year" && e.target.nodeName === "SPAN")
      sortByOneField("year",e,data);
   else if(e.target.innerText == "Genre" && e.target.nodeName === "SPAN")
      sortByTwoFields("genre","name",e,data);
   else if(e.target.innerText == "Popularity" && e.target.nodeName === "SPAN")
      sortByTwoFields("details","popularity",e,data);
}

function sortByOneField(field,e,data){
   if(checkSorted(e)){
      generateTable(data.sort( (a,b) => a[field].toLowerCase() > b[field].toLowerCase() ? -1:1));
   }
   else{
      generateTable(data.sort( (a,b) => a[field].toLowerCase() < b[field].toLowerCase() ? -1:1));
   }
}

function sortByTwoFields(field,field2,e,data){
   if(checkSorted(e)){
      generateTable(data.sort( (a,b) => a[field][field2].toLowerCase() > b[field][field2].toLowerCase() ? -1:1));
   }
   else{
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
   button.id="playlistButton";
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
   document.querySelector("#searchParams").textContent = "Browse Mode"
}
function singleSong(e){
   //code here, this is how you can access the song id
   console.log(e.target.dataset.song_id);
}
function addToPlaylist(e){
   //code here, this is how you can access the song id
   console.log(e.target.dataset.song_id);
}

