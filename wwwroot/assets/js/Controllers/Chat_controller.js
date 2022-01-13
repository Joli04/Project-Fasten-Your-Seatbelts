/**
 * Chat controller
 */
import Controller from './Controller.js';


import App from '../Classes/app.js';
import view from "../Classes/View.js";
import Profile from "../Classes/Profile.js";
import Messages from "../Objects/Messages.js";
import Modal from "../Objects/Modal.js";
import Base64 from "../Objects/Base64.js";

export default class Chat_controller extends Controller {


    async chat() {
        var stopped = false
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
        const chatbox = document.querySelector('.chatbox__chat');
        if (query.id > 0) {
            this.chat_id = query.id;
            if (query.checknew == 1) {
                const result = await this.messages.checkNew(this.chat_id)

                if (result !== false) {
                    App.redirect(`#/chat?id=${result[0].id}`)
                }
                return
            }
            let valid = await this.messages.checkValid(this.chat_id)

            if (valid == false) {
                document.querySelector('#chat').innerHTML = ""
                App.ShowNotifyError("Chat", "Chat bestaat niet / of geen toegang");
                return;
            }
            App.ShowNotifySuccess("Chat", "Chat met profiel: " + query.id);

            stopped = false
            setInterval(async () => {
                if(stopped == true) {
                    return;
                }
                reloadData()
            }, 1500);

            this.other_id = await this.messages.getOther(this.chat_id)
            this.other_profile = new Profile();
            await this.other_profile.setProfile(this.other_id);
            this.other_profile = await this.other_profile.getData()

            this.otherUserProfilePic = document.querySelector('#profile_pic');
            this.otherUserProfileName = document.querySelector('.bar .name');

            this.otherUserProfileName.innerHTML = this.other_profile.first_name + " " + this.other_profile.last_name
            chatbox.style.visibility = "visible";
            // otherUserProfilePic.style.backgroundImage = this.other_profile.profile
        } else {
            document.querySelector('#chat').innerHTML = "";
            chatbox.style.visibility = "hidden";
            //App.ShowNotifyError("Chat", "Chat id is missing");
        }


        let allChats = await this.messages.getAllChats(this.profiel.id)
        let menu_element = document.querySelector('.contacts__users')

        // otherUserProfilePic.style.backgroundImage = this.other_profile.profile

        for (let i = 0; i < allChats.length; i++) {
            let currentChat = allChats[i]
            var otherUserId = new Profile()
            if (currentChat.first_user == this.profiel.id) {
                await otherUserId.setProfile(currentChat.second_user)
            } else {
                await otherUserId.setProfile(currentChat.first_user)
            }

            if (currentChat.id == this.chat_id) {
                const messages = await this.messages.get(this.chat_id);
                menu_element.innerHTML += `<div class="contact activeChat">
                    <img class="pic" src="${otherUserId.getProfilePicture()}" alt="profile picture">
                    <div class="contact__info">
                    <div class="badge">${messages.length}</div>
                    <div class="name">${otherUserId.getFullName()}</div>\n` +
                    `</div>` +
                    `</a></div>`;

                this.otherUserProfilePic.innerHTML +=
                    `<img class="contactInfo__image" src="${otherUserId.getProfilePicture()}" alt="other user profile picture">`;
                //menu_element.innerHTML += `<a href="#/chat?id=${currentChat.id}" class="active">${otherUserId.first_name} ${otherUserId.last_name}</a>`
            } else {
                //Show non active user
                const messages = await this.messages.get(currentChat.id);
                menu_element.innerHTML += `<a href="#/chat?id=${currentChat.id}">
                    <div class="contact">
                    <img class="pic" src="${otherUserId.getProfilePicture()}" alt="profile picture">
                    <div class="contact__info">
                    <div class="badge">${messages.length}</div>
                    <div class="name">${otherUserId.getFullName()}</div>\n` +
                    `</div>` +
                    `</a>`;
                // menu_element.innerHTML += `<a href="#/chat?id=${currentChat.id}">${otherUserId.first_name} ${otherUserId.last_name}</a>`
            }

        }


        const form = document.querySelector(".typing-area"),
            inputField = form.querySelector(".input-field"),
            sendBtn = form.querySelector(".send"),
            uploadBtn = form.querySelector(".input__imgUpload"),
            preferenceBtn = document.querySelector(".deals__preference"),
            bookingBtn = document.querySelector(".deals__booking")
        ;

        const DeelVoorkeuren = new Modal(preferenceBtn);
        DeelVoorkeuren.setTitle("Deel mijn reis voorkeuren");

        const DeelBooking = new Modal(bookingBtn);

        await this.profiel.getCountry();

        const other_profile = new Profile();
        await other_profile.setProfile(this.other_id);
        await other_profile.getCountryNames();
        const countriesOfOtherUser = await other_profile.getCountryNames();
        let comparedCountries = [];
        for (let i = 0; i < this.profiel.countries.length; i++) {
            if (countriesOfOtherUser.includes(this.profiel.countries[i].names)) {
                comparedCountries.push(this.profiel.countries[i].names);
            }
        }
        DeelBooking.setTitle("Deel booking");
        DeelBooking.setContent(`
        <div> 
             <h4>Zoek een boeking</h4> <br> 
            <p>Jullie overeenkomende landen zijn: ${comparedCountries.toString()}</p>
            <button class="btn-share" id="shareBooking">
                <span class="btn-text">Deel met elkaar</span>
                <span class="btn-icon">
                    <svg t="1580465783605" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9773" width="18" height="18">
                        <path d="M767.99994 585.142857q75.995429 0 129.462857 53.394286t53.394286 129.462857-53.394286 129.462857-129.462857 53.394286-129.462857-53.394286-53.394286-129.462857q0-6.875429 1.170286-19.456l-205.677714-102.838857q-52.589714 49.152-124.562286 49.152-75.995429 0-129.462857-53.394286t-53.394286-129.462857 53.394286-129.462857 129.462857-53.394286q71.972571 0 124.562286 49.152l205.677714-102.838857q-1.170286-12.580571-1.170286-19.456 0-75.995429 53.394286-129.462857t129.462857-53.394286 129.462857 53.394286 53.394286 129.462857-53.394286 129.462857-129.462857 53.394286q-71.972571 0-124.562286-49.152l-205.677714 102.838857q1.170286 12.580571 1.170286 19.456t-1.170286 19.456l205.677714 102.838857q52.589714-49.152 124.562286-49.152z" p-id="9774" fill="#ffffff"></path>
                    </svg>
                </span>
            </button>
         </div>`);
        DeelVoorkeuren.setContent(`
        <div> 
             <h4>Geinteresserde landen:</h4> <br> 
            ${await this.profiel.GetIntressCountryString()} :<br> 
            <button class="btn-share" id="shareCountry">
                <span class="btn-text">Deel</span>
                <span class="btn-icon">
                    <svg t="1580465783605" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9773" width="18" height="18">
                        <path d="M767.99994 585.142857q75.995429 0 129.462857 53.394286t53.394286 129.462857-53.394286 129.462857-129.462857 53.394286-129.462857-53.394286-53.394286-129.462857q0-6.875429 1.170286-19.456l-205.677714-102.838857q-52.589714 49.152-124.562286 49.152-75.995429 0-129.462857-53.394286t-53.394286-129.462857 53.394286-129.462857 129.462857-53.394286q71.972571 0 124.562286 49.152l205.677714-102.838857q-1.170286-12.580571-1.170286-19.456 0-75.995429 53.394286-129.462857t129.462857-53.394286 129.462857 53.394286 53.394286 129.462857-53.394286 129.462857-129.462857 53.394286q-71.972571 0-124.562286-49.152l-205.677714 102.838857q1.170286 12.580571 1.170286 19.456t-1.170286 19.456l205.677714 102.838857q52.589714-49.152 124.562286-49.152z" p-id="9774" fill="#ffffff"></path>
                    </svg>
                </span>
            </button>
         </div>`);
        this.sharePrefModal = DeelVoorkeuren;
        this.shareBooking = DeelBooking;
        //add click listener to share
        document.querySelector("#shareCountry").addEventListener("click", this.createShareMyPref.bind(this));
        document.querySelector("#shareBooking").addEventListener("click", this.findBooking.bind(this));

        if (!window.FgEmojiPicker) {
            new FgEmojiPicker({
                trigger: ['.emojiBtn'],
                position: ['bottom', 'right'],
                dir: 'vendors/EmojiPicker/',
                emit(obj) {
                    const emoji = obj.emoji;
                    inputField.value += emoji;
                }
            });
        }

        form.onsubmit = (e) => {
            e.preventDefault();
            scrollToBottom()
        }

        //inputField.focus();


        sendBtn.onclick = async () => {
            await this.messages.send(this.chat_id, Base64.encode(inputField.value), this.other_id)
            if (true) {
                inputField.value = "";
                scrollToBottom();
                reloadData()
            }


        }

        var self = this;

        async function reloadData() {
            const query = App.getFromQueryObject()

            if (query.id != self.chat_id) {
                stopped = true
                console.log("Stopped")
                return
            }

            const messages = await self.messages.get(self.chat_id);

            let chat_element = document.getElementById('chat')

            if (messages.length <= 0) {
                chat_element.innerHTML = `<p>Start de chat met het sturen van een leuk bericht naar ${self.other_profile.first_name}!</p>`
                self.empty_chat = true
            } else {
                if (self.empty_chat == true) {
                    chat_element.innerHTML = ""
                    self.empty_chat = false
                }
            }
            const Latest_chat = new Date(Math.max(...messages.map(e => new Date(e.message_send_at))));
            var time_text = "";
            if (isToday(Latest_chat)) {
                time_text = "Today at";
            }
            time.innerHTML = time_text + ' ' + Latest_chat.getUTCHours() + ':' + Latest_chat.getUTCMinutes();

            for (let i = 0; i < messages.length; i++) {
                var message = messages[i]
                if (self.message_id_set.has(message.msg_id)) {
                } else {
                    self.message_id_set.add(message.msg_id)
                    self.message_list.push(message);

                    message.msg = Base64.decode(message.msg);

                    const messageTime = new Date(message.message_send_at);
                    let messageTimeHours = messageTime.getHours() - 1;
                    let messageTimeMinutes = messageTime.getMinutes();

                    if (messageTimeHours < 10) {
                        messageTimeHours = "0" + messageTimeHours;
                    } else if (messageTimeMinutes < 10) {
                        messageTimeMinutes = "0" + messageTimeMinutes;
                    }
                    if (!message.msg.includes("chat__block")) {
                        if (message.from_user_id == self.profiel.id) {
                            chat_element.innerHTML += `<div class="message parker">` +
                                `<div class="message__content">${message.msg}</div>` +
                                `<div class="message__time">${messageTimeHours + ':' + messageTimeMinutes}</div>` +
                                `</div>`
                        } else {

                            chat_element.innerHTML += `<div class="message stark">` +
                                `<div class="message__content">${message.msg}</div>` +
                                `<div class="message__time">${messageTimeHours + ':' + messageTimeMinutes}</div>` +
                                `</div>`
                        }
                    } else {
                        chat_element.innerHTML += `<div class="message parker">` +
                            `<div class="message__content">${message.msg}</div>` +
                            `<div class="message__time">${messageTimeHours + ':' + messageTimeMinutes}</div>` +
                            `</div>`
                    }

                    scrollToBottom()
                }
            }
        }

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

        // Removes chat button on the chat page
        const chatBtn = document.querySelector(".chatBtn");
        chatBtn.style.display = "none";
    }

    async createShareMyPref() {
        const html = `<div class='chat__block'>` +
            `<div class='block__header'><h2>Reis voorkeuren van <span>${this.profiel.getFullName()}</span>:</h2></div>` +
            "<div class='block__content'> " +
            "<div class='block__preferences'>" +
            await this.profiel.GetIntressCountryString() +
            "</div>" +
            "<button>" +
            "<svg class=\"w-6 h-6\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\">" +
            "<path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5\"></path>" +
            "</svg>" +
            "<div class='block__btnText'>Vergelijk</div>" +
            "</button>" +
            "</div>" +
            "</div>";

        await this.messages.send(this.chat_id, Base64.encode(html), this.other_id);
        this.sharePrefModal.close();
        return null;
    }

    async findBooking() {
        await this.profiel.getCountry();

        const other_profile = new Profile();
        await other_profile.setProfile(this.other_id);
        await other_profile.getCountryNames();
        const countriesOfOtherUser = await other_profile.getCountryNames();
        let comparedCountries = [];
        for (let i = 0; i < this.profiel.countries.length; i++) {
            if (countriesOfOtherUser.includes(this.profiel.countries[i].names)) {
                comparedCountries.push(this.profiel.countries[i].names);
            }
        }
        const url = "https://corendon.nl/" + comparedCountries[0];
        const html = "<div class='chat__block'> " +
            "<div class='header'><h1>Mijn voorstel booking:</h1></div>" +
            "<div class='content'> " +
            "<a href='"+url+"'>" +
            "<svg class=\"w-6 h-6\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\">" +
            "<path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5\"></path>" +
            "</svg>" +
            "Bekijk deal op corendon</a>" +
            "</div>" +
            "</div>";

          await this.messages.send(this.chat_id, Base64.encode(html), this.other_id);
        this.shareBooking.close();
        return null;
    }

    render() {
        return new view('chat.html', "CommonFlight | Chat").extends("blank.html");
    }


}