/* url of song api --- https versions hopefully a little later this semester */	
const api = 'http://www.randyconnolly.com/funwebdev/3rd/api/music/songs-nested.php';
const songlist = JSON.parse(song);
const genrelist = JSON.parse(genres);
const artistlist = JSON.parse(artists);

document.addEventListener("DOMContentLoaded", () => {
   generateTable();
   fillOptions();

   

});

function generateTable(){

   const table = document.querySelector("#song-list table tbody");
   
   for(let s of songlist){
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
}

function fillOptions(){
   const artistSelect = document.querySelector("#artistSelect");
   const genreSelect = document.querySelector("#genreSelect");
   
   for(let a of artistlist){
      const newOption = document.createElement("option");
      const optionText = document.createTextNode(a.name);

      newOption.appendChild(optionText);
      artistSelect.appendChild(newOption);
   }

   for(let g of genrelist){
      const newOption = document.createElement("option");
      const optionText = document.createTextNode(g.name);

      newOption.appendChild(optionText);
      genreSelect.appendChild(newOption);
   }
}


