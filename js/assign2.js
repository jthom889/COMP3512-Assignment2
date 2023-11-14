/* url of song api --- https versions hopefully a little later this semester */	
const api = 'http://www.randyconnolly.com/funwebdev/3rd/api/music/songs-nested.php';
const songlist = JSON.parse(song);
const genrelist = JSON.parse(genres);
const artistlist = JSON.parse(artists);

document.addEventListener("DOMContentLoaded", () => {
   generateTable();
   fillOptions();

   document.querySelector("#song-list table thead tr").addEventListener('click', sortHandler);

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

function sortHandler(e){
   if(e.target.innerText == "Title")
      tableSorter(0);
   else if(e.target.innerText == "Artist")
      tableSorter(1);
   else if(e.target.innerText == "Year")
      tableSorter(2);
   else if(e.target.innerText == "Genre")
      tableSorter(3);
   else if(e.target.innerText == "Popularity")
      tableSorter(4);
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

