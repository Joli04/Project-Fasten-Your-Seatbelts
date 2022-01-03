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
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "./vendors/EmojiPicker/emojiPicker.js";
        document.head.appendChild(script);

        this.message_id_set = new Set()
        this.message_list = []

        this.profiel = new Profile();
        await this.profiel.setProfile();
        this.messages = new Messages(this.profiel);
        const query = App.getFromQueryObject();
        var chat = document.getElementById('chat');
        chat.scrollTop = chat.scrollHeight - chat.clientHeight;
        const time = document.querySelector('.time');
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
            App.ShowNotifySuccess("Chat", "Chat met profiel: " + query.id);
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
        let menu_element = document.querySelector('.contacts')
        const otherUserProfilePic = document.querySelector('#profile_pic');
        const otherUserProfileName =  document.querySelector('.bar .name');



        for (let i = 0; i < allChats.length; i++) {
            let currentChat = allChats[i]
            var otherUserId = new Profile()
            if(currentChat.first_user == this.profiel.id) {
                await otherUserId.setProfile(currentChat.second_user)
                otherUserProfilePic.style.backgroundImage = otherUserId.getProfilePicture();
                otherUserProfileName.innerHTML = otherUserId.getFullName();
            } else {
                await otherUserId.setProfile(currentChat.first_user)
            }

            if(currentChat.id == this.chat_id) {
                const messages = await this.messages.get(this.chat_id);
                menu_element.innerHTML += `<div class="contact" onclick=""><div class="pic" style="background-image: url(${otherUserId.getProfilePicture()});"` +
                   `></div><div class="badge">${messages.length}</div><div class="name">${otherUserId.getFullName()}</div>\n` +
                    `                <div class="message">` +
                    `                    Last chat` +
                    `                </div>` +
                    `            </a></div>`;
                //menu_element.innerHTML += `<a href="#/chat?id=${currentChat.id}" class="active">${otherUserId.first_name} ${otherUserId.last_name}</a>`
            } else {
                //Show non active user
                const messages = await this.messages.get(currentChat.id);
                menu_element.innerHTML += `<div class="contact"><div class="pic" style="background-image: url(${otherUserId.getProfilePicture()});"` +
                    `></div><div class="badge">${messages.length}</div><div class="name">${otherUserId.getFullName()}</div>\n` +
                    `                <div class="message">` +
                    `                    Last chat` +
                    `                </div>` +
                    `            </div>`;
               // menu_element.innerHTML += `<a href="#/chat?id=${currentChat.id}">${otherUserId.first_name} ${otherUserId.last_name}</a>`
            }

        }

        const form = document.querySelector(".typing-area"),
            inputField = form.querySelector(".input-field"),
            sendBtn = form.querySelector(".send"),
            chatBox = document.querySelector(".chat-box");

        new FgEmojiPicker({
            trigger: ['.emojiBtn'],
            position: ['bottom', 'right'],
            dir:'vendors/EmojiPicker/',
            emit(obj, EmojiBtn) {
                const emoji = obj.emoji;
                inputField.value += emoji;
            }
        });
        form.onsubmit = (e) => {
            e.preventDefault();
            scrollToBottom()
        }

        //inputField.focus();


        sendBtn.onclick = async () => {
            await this.messages.send(this.chat_id, inputField.value, this.other_id)
            if (true) {
                inputField.value = "";
                scrollToBottom();
            }


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
            const Latest_chat = new Date(Math.max(...messages.map(e => new Date(e.message_send_at))));
            var time_text = "";
            if(isToday(Latest_chat)){
                time_text = "Today";
            }
            time.innerHTML= time_text +' '+Latest_chat.getUTCHours() + ':' + Latest_chat.getUTCMinutes();

            for (let i = 0; i < messages.length; i++) {
                let message = messages[i]
                if (this.message_id_set.has(message.msg_id)) {
                } else {
                    this.message_id_set.add(message.msg_id)
                    this.message_list.push(message);

                    if (message.from_user_id == this.profiel.id) {
                        chat_element.innerHTML += `<div class="message parker">
                            ${message.msg}
                        </div>`
                    } else {

                        chat_element.innerHTML += `
                    <div class="message stark">
                        ${message.msg}
                    </div>`
                    }
                    scrollToBottom()
                }
            }
        }, 500);

        function scrollToBottom() {
            var chat = document.getElementById('chat');
            chat.scrollTop = chat.scrollHeight - chat.clientHeight;
        }
        const isToday = (someDate) => {
            const today = new Date()
            return someDate.getDate() == today.getDate() &&
                someDate.getMonth() == today.getMonth() &&
                someDate.getFullYear() == today.getFullYear()
        }
    }

    render() {
        return new view('chat.html', "Commonflight Home");
    }
}