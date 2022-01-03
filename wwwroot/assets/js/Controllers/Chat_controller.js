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
            if(query.checknew == 1) {
                const result = await this.messages.checkNew(this.chat_id)
            
                if(result !== false) {
                    App.redirect(`#/chat?id=${result[0].id}`)
                }
                return
            }


            let valid = await this.messages.checkValid(this.chat_id)

            if (valid == false) {
                document.getElementsByClassName('chat_wrapper')[0].innerHTML = ""
                App.ShowNotifyError("Chat", "Chat bestaat niet / of geen toegang");
                return;
            }
            App.ShowNotifySuccess("Chat", "Chat met id: " + query.id);
        } else {
            document.getElementsByClassName('chat_wrapper')[0].innerHTML = ""
            App.ShowNotifyError("Chat", "Chat id is missing");
            return
        }

        this.other_id = await this.messages.getOther(this.chat_id)
        this.other_profile = new Profile();
        await this.other_profile.setProfile(this.other_id);
        this.other_profile = await this.other_profile.getData()

        let allChats = await this.messages.getAllChats(this.profiel.id)
        let menu_element = document.getElementById('menu')

        for (let i = 0; i < allChats.length; i++) {
            let currentChat = allChats[i]
            var otherUserId = new Profile()
            if(currentChat.first_user == this.profiel.id) {
                otherUserId.setProfile(currentChat.second_user)
            } else {
                otherUserId.setProfile(currentChat.first_user)
            }

            otherUserId = await otherUserId.getData()

            if(currentChat.id == this.chat_id) {
                menu_element.innerHTML += `<a href="#/chat?id=${currentChat.id}" class="active">${otherUserId.first_name} ${otherUserId.last_name}</a>`
            } else {
                menu_element.innerHTML += `<a href="#/chat?id=${currentChat.id}">${otherUserId.first_name} ${otherUserId.last_name}</a>`
            }
        }

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
                chatBox.classList.remove("active");
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

            let chat_element = document.getElementById('chat')

            if(messages.length <= 0){
                chat_element.innerHTML = `<p>Start de chat met het sturen van een leuk bericht naar ${this.other_profile.first_name}!</p>`
                this.empty_chat = true
            } else {
                if(this.empty_chat == true) {
                    chat_element.innerHTML = ""
                    this.empty_chat = false
                }
            }

            for (let i = 0; i < messages.length; i++) {
                let message = messages[i]
                if (this.message_id_set.has(message.msg_id)) {
                } else {
                    this.message_id_set.add(message.msg_id)
                    this.message_list.push(message);

                    if (message.from_user_id == this.profiel.id) {
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