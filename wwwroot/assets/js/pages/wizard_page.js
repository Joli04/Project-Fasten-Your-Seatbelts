import Intressed from "../classes/Intressed.js";

//Create elements for each in intress table
const intress = new Intressed(document.querySelector("#interests_table"));
//Get intress

console.log(intress);

await intress.filter()

// async  function filter(data){
//     console.log("filter")
//     await intress.filter(data)
// }

//document.querySelector(".searchTerm").addEventListener('input', filter(document.querySelector(".searchTerm").value))