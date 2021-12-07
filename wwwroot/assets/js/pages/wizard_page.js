import Intressed from "../classes/Intressed.js";

//Create elements for each in intress table
const intress = new Intressed(document.querySelector("#intress_table"));
//Get intress
await intress.filter()
async  function filter(data){
    console.log("filter")
    await intress.filter(data)
}
document.querySelector(".searchTerm").addEventListener('input', filter(document.querySelector(".searchTerm").value))