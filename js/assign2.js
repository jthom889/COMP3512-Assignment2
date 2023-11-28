
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
            const data = response;
            generateTable(data);
            fillOptions(data);
        })
}

function generateTable(data){
   const table = document.querySelector("#song-list table tbody");
   table.innerHTML="";

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
   document.querySelector("#song-list table thead tr").addEventListener('click', e => sortHandler(e,data));
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
      console.log("title");
   else if(e.target.innerText == "Artist" && e.target.nodeName === "SPAN")
      console.log("artist");
   else if(e.target.innerText == "Year" && e.target.nodeName === "SPAN")
      console.log("year");
   else if(e.target.innerText == "Genre" && e.target.nodeName === "SPAN")
      console.log("genre");
   else if(e.target.innerText == "Popularity" && e.target.nodeName === "SPAN")
      console.log("pop");
}

function tableSorter(column){
   //clear sorting indicators for all
   let spans = document.querySelectorAll(".tableSpan");
   for(let s of spans){
      s.innerText = "";
   }
   
   //now sort
   let switchMade = true;
   let direction = "ascend";
   let count = 0;
   let span = document.querySelector("#song-list table thead tr").children[column].lastChild;
   span.innerText = "^"

   while(switchMade){
      const rows = document.querySelectorAll("#song-list table tbody tr");

      for(let i = 0; i < rows.length - 1; i++){
         let compare1 = rows[i].children[column];
         let compare2 = rows[i+1].children[column];
         switchMade = false;
   
         if(compare1.innerText > compare2.innerText && direction == "ascend"){
            rows[i].parentNode.insertBefore(rows[i+1], rows[i]);
            switchMade = true;
            console.log("here1");
            count ++;
            break;
         }else if(compare1.innerText < compare2.innerText && direction == "descend"){
            rows[i].parentNode.insertBefore(rows[i+1], rows[i]);
            switchMade = true;
            console.log("here2");
            count ++;
            break;
         }
      }

      if(count == 0 && direction == "ascend"){
         direction = "descend";
         console.log("here3");
         span.innerText = "⌄"
         switchMade = true;
      }

   }
   

   
   
}

