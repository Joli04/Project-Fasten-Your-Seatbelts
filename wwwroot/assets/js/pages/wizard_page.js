
import Filter from "../classes/Filter.js";
//Create elements for each in intress table
const intressFilter = new Filter(document.querySelector("#interests_table"),"intressed","name","name");
const CountrieFilter = new Filter(document.querySelector("#countries_table"),"countries","names","lang_short");


//Get intress


await intressFilter.filter()
await CountrieFilter.filter()
// async  function filter(data){
//     console.log("filter")
//     await intress.filter(data)
// }

//document.querySelector(".searchTerm").addEventListener('input', filter(document.querySelector(".searchTerm").value))