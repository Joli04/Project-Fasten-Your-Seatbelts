import Profile from "../classes/Profile.js";
import Filter from "../classes/Filter.js";
import {redirect} from "../app.js";
//Create elements for each in intress table
const profiel = new Profile();
const intressFilter = new Filter(document.querySelector("#interests_table"),"intressed","name","name",profiel.id);
const CountrieFilter = new Filter(document.querySelector("#countries_table"),"countries","names","lang_short",profiel.id);


//Get intress


await intressFilter.filter();
await CountrieFilter.filter();


var quill = new Quill('#editor', {
    theme: 'snow'
});

// async  function filter(data){
//     console.log("filter")
//     await intress.filter(data)
// }
document.addEventListener("submitWizard", function (e) {
    finishProfile();
    redirect('matching.html');
});


/**
 * Finish a profile
 * Inset all data to the correct table
 */

function finishProfile(){
    console.log("finish item")
    intressFilter.submit();
    CountrieFilter.submit();
}
//document.querySelector(".searchTerm").addEventListener('input', filter(document.querySelector(".searchTerm").value))