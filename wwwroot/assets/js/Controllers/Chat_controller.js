/**
 * Chat controller
 */
import Controller from './Controller.js';

import App from '../Classes/app.js';
import view from "../Classes/View.js";
import Profile from "../Classes/Profile.js";
import Messages from "../Objects/Messages.js";
export default class Chat_controller extends Controller {

    async chat() {
        this.message_id_set = new Set()
        this.message_list = []

        this.profiel = new Profile();
        await this.profiel.setProfile();
        this.messages = new Messages(this.profiel);

        const query = App.getFromQueryObject();
        if (query.id > 0) {
            this.chat_id = query.id;
            let valid = await this.messages.checkValid(this.chat_id)

            if(valid == false) {
                document.getElementsByClassName('chat_wrapper')[0].innerHTML = ""
                App.ShowNotifyError("Chat","Chat bestaat niet / of geen toegang");
                return;
            }
            App.ShowNotifySuccess("Chat", "Chat met id: " + query.id);
        } else {
            App.ShowNotifyError("Chat","Chat id is missing");
        }

        this.other_id = await this.messages.getOther(this.chat_id)

        const form = document.querySelector(".typing-area"),
            inputField = form.querySelector(".input-field"),
            sendBtn = form.querySelector("button"),
            chatBox = document.querySelector(".chat-box");
            form.onsubmit = (e) => {
                e.preventDefault();
                scrollToBottom()
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
            await this.messages.send(this.chat_id, inputField.value, this.other_id)
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

        setInterval(async () => {
            const messages = await this.messages.get(this.chat_id);

            for (let i = 0; i < messages.length; i++) {
                let message = messages[i]
                if(this.message_id_set.has(message.msg_id)){
                } else {
                    this.message_id_set.add(message.msg_id)
                    this.message_list.push(message);

                    let chat_element = document.getElementById('chat')

                    if(message.from_user_id == this.profiel.id){
                        chat_element.innerHTML += `<div class="chat outgoing">
                        <div class="details">
                            <p>${message.msg}</p>
                        </div>
                    </div>`
                    } else {
                        chat_element.innerHTML += `<div class="chat incoming">
                        <div class="details">
                            <p>${message.msg}</p>
                        </div>
                    </div>`
                    }
                    scrollToBottom()
                }
            }
        }, 500);

        function scrollToBottom() {
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    }

    render() {
        return new view('chat.html', "Commonflight Home");
    }
}