
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
            generateTable(data, true);
            generateSearchBar(data,true);
            document.querySelector("#clearButton").addEventListener("click", () => {generateTable(response);});
            document.querySelector("#filterButton").addEventListener("click", filter)
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

   }

   document.querySelectorAll("#song-list table tbody tr").forEach(
                                          row => row.children[0].addEventListener("click",singleSong));

}

function generateSearchBar(data,firstLoad){
   if(firstLoad){
      fillOptions(data);
      document.querySelectorAll("input[type=radio]").forEach(r => {r.addEventListener("change", radioClick)})
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
      generateTable(data.sort( (a,b) => a[field] > b[field] ? -1:1));
   }
   else{
      generateTable(data.sort( (a,b) => a[field] < b[field] ? -1:1));
   }
}

function sortByTwoFields(field,field2,e,data){
   if(checkSorted(e)){
      generateTable(data.sort( (a,b) => a[field][field2] > b[field][field2] ? -1:1));
   }
   else{
      generateTable(data.sort( (a,b) => a[field][field2] < b[field][field2] ? -1:1));
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
function filter(){
   
}
function singleSong(){
   //code here
   console.log("test");
}

