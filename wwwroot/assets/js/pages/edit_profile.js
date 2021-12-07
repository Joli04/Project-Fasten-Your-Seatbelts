import Profile from "../classes/Profile.js";
import Countries from "../Objects/Countries.js";
import FYSCloud from "https://cdn.fys.cloud/fyscloud/0.0.4/fyscloud.es6.min.js";
import "../config.js";

const profiel = new Profile();
await profiel.setProfile();
document.getElementById("avatar").src = profiel.getProfilePicture();
console.log(profiel);
var quill = new Quill('#editor', {
    theme: 'snow'
});

const fileInput = document.getElementById('uplaud_img');
const preview = document.getElementById('avatar');

fileInput.onchange = () => {
    uplaud()
}
function uplaud(){
    console.log("click")
    profiel.setProfilePicture(fileInput,preview);
}

