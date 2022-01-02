/**
 * Chat controller
 */
import Controller from './Controller.js';

import view from "../Classes/View.js";
import Profile from "../Classes/Profile.js";
import Messages from "../Objects/Messages.js";
export default class Chat_controller extends Controller {
    async chat() {
        this.profiel = new Profile();
        await this.profiel.setProfile();
        this.messages = new Messages(this.profiel);
        const form = document.querySelector(".typing-area"),
            inputField = form.querySelector(".input-field"),
            sendBtn = form.querySelector("button"),
            chatBox = document.querySelector(".chat-box");
            form.onsubmit = (e) => {
                e.preventDefault();
            }

        inputField.focus();
        inputField.onkeyup = () => {
            if (inputField.value !== "") {
                sendBtn.classList.add("active");
            } else {
                sendBtn.classList.remove("active");
            }
        }

        sendBtn.onclick = async () => {
           console.log(await this.messages.send(inputField.value, 30));
            if (true) {
                inputField.value = "";
                scrollToBottom();
            }


        }
        chatBox.onmouseenter = () => {
            chatBox.classList.add("active");
        }

        chatBox.onmouseleave = () => {
            chatBox.classList.remove("active");
        }

        setInterval(() => {
            // let xhr = new XMLHttpRequest();
            // xhr.open("POST", "php/get-chat.php", true);
            // xhr.onload = () => {
            //     if (xhr.readyState === XMLHttpRequest.DONE) {
            //         if (xhr.status === 200) {
            //             let data = xhr.response;
            //             chatBox.innerHTML = data;
            //             if (!chatBox.classList.contains("active")) {
            //                 scrollToBottom();
            //             }
            //         }
            //     }
            // }
            // xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            // xhr.send("incoming_id=" + incoming_id);
        }, 500);

        function scrollToBottom() {
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    }

    render() {
        return new view('chat.html', "Commonflight Home");
    }
}