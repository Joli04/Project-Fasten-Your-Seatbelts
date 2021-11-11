import FYSCloud from "https://cdn.fys.cloud/fyscloud/0.0.4/fyscloud.es6.min.js";
import md5 from '../../../vendors/md5/md5.js';
import "../config.js";
import { hashing} from "../hashing.js";


document.addEventListener("DOMContentLoaded", async function () {
    var login_bt = document.querySelector(".login_button");
    login_bt.addEventListener('click', login());
});

function isLoggedIn () {
    localStorage.setItem('user_id', '');
}
/**
 * Local storage logout
 */
function logout () {
    localStorage.removeItem('user_Id');
}

console.log(hashing.hash('demo'));
/**
 *
 const rawPassword = 'password'

 console.log(crypt.hash(rawPassword))
 //1563995248971$10$58e0867f3acc11de363e03389bb27167

 console.log(crypt.compare('password','1563995248971$10$58e0867f3acc11de363e03389bb27167'));
 //true

 console.log(crypt.hash(rawPassword, {salt: 'someRandomString', rounds: 20}))
 //someRandomString$20$199d9de71859a87cdd22e52d93f4522a

 console.log(crypt.compare('password', 'someRandomString$20$199d9de71859a87cdd22e52d93f4522a'));
 //true
 */
function login(){
    //Valideer input
    if(validate()){
        FYSCloud.API.queryDatabase(
            "SELECT id, email, password FROM users WHERE email = ?", ["demo@demo.nl"]
        ).then(function(data) {
            console.log(data);
        }).catch(function(reason) {
            console.log(reason);
        });

        FYSCloud.Session.set("loggedin", true);
        FYSCloud.URL.redirect("profile.html");
    }else{
        console.log('niks')
    }
}
function validate() {
    var isValid = true;
    var elements = document.querySelectorAll("input");
    const errors = document.querySelectorAll('.error');
    errors.forEach(e => {
        e.remove();
    });
    elements.forEach(e => {
        if(e.type === "submit"){
            console.log(e);
        }
        if(e.type === "email"){
            if(validateEmail(e.value)){
                addError(e);
                isValid = false;
            }
        }else{
            if(e.value) {
                return true;
            }else{
                addError(e);
                isValid = false;
            }
        }
    });
    return isValid;
}

/**
 * Add Custom error block
 * @param e
 */
function addError(e){
    const error = document.createElement("p");
    error.className = "error";
    error.style.display = 'block';
    error.innerText = "Dit veld is een verplicht veld";
    e.parentElement.appendChild(error);
}

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}