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
            setInterval(async () => {
                reloadData()
            }, 1500);
        } else {
            document.querySelector('#chat').innerHTML = "";
            //App.ShowNotifyError("Chat", "Chat id is missing");
        }

        this.other_id = await this.messages.getOther(this.chat_id)
        this.other_profile = new Profile();
        await this.other_profile.setProfile(this.other_id);
        this.other_profile = await this.other_profile.getData()


        let allChats = await this.messages.getAllChats(this.profiel.id)
        let menu_element = document.querySelector('.contacts__users')
        const otherUserProfilePic = document.querySelector('#profile_pic');
        const otherUserProfileName = document.querySelector('.bar .name');

        // otherUserProfilePic.style.backgroundImage = this.other_profile.profile
        otherUserProfileName.innerHTML = this.other_profile.first_name + " " + this.other_profile.last_name

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

                otherUserProfilePic.innerHTML +=
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
            uplaudBtn = form.querySelector(".input__imgUpload"),
            chatBox = document.querySelector(".chat-box");


        const DeelVoorkeuren = new Modal(uplaudBtn);
        DeelVoorkeuren.setTitle("Deel mijn voorkeuren");
        DeelVoorkeuren.setContent(`
        <div> 
            <h4>Mijn interesses:</h4> <br>
            ${await this.profiel.GetIntressString()} <br> <br>
             <h4>Geinteresserde landen:</h4> <br> 
            ${await this.profiel.GetIntressCountryString()} :<br> 
            <button class="btn-share"><span class="btn-text">Deel</span><span class="btn-icon">
                <svg t="1580465783605" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9773" width="18" height="18">
                  <path d="M767.99994 585.142857q75.995429 0 129.462857 53.394286t53.394286 129.462857-53.394286 129.462857-129.462857 53.394286-129.462857-53.394286-53.394286-129.462857q0-6.875429 1.170286-19.456l-205.677714-102.838857q-52.589714 49.152-124.562286 49.152-75.995429 0-129.462857-53.394286t-53.394286-129.462857 53.394286-129.462857 129.462857-53.394286q71.972571 0 124.562286 49.152l205.677714-102.838857q-1.170286-12.580571-1.170286-19.456 0-75.995429 53.394286-129.462857t129.462857-53.394286 129.462857 53.394286 53.394286 129.462857-53.394286 129.462857-129.462857 53.394286q-71.972571 0-124.562286-49.152l-205.677714 102.838857q1.170286 12.580571 1.170286 19.456t-1.170286 19.456l205.677714 102.838857q52.589714-49.152 124.562286-49.152z" p-id="9774"
                    fill="#ffffff"
                  ></path>
                </svg>
              </span>
              <ul class="social-icons">
                <li>
                  <a type="button" onclick="this.createShareMyPref()"><svg t="1580195676506" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2099" width="18" height="18" >
                      <path
                        d="M962.267429 233.179429q-38.253714 56.027429-92.598857 95.451429 0.585143 7.972571 0.585143 23.990857 0 74.313143-21.723429 148.260571t-65.974857 141.970286-105.398857 120.32-147.456 83.456-184.539429 31.158857q-154.843429 0-283.428571-82.870857 19.968 2.267429 44.544 2.267429 128.585143 0 229.156571-78.848-59.977143-1.170286-107.446857-36.864t-65.170286-91.136q18.870857 2.852571 34.889143 2.852571 24.576 0 48.566857-6.290286-64-13.165714-105.984-63.707429t-41.984-117.394286l0-2.267429q38.838857 21.723429 83.456 23.405714-37.741714-25.161143-59.977143-65.682286t-22.308571-87.990857q0-50.322286 25.161143-93.110857 69.12 85.138286 168.301714 136.265143t212.260571 56.832q-4.534857-21.723429-4.534857-42.276571 0-76.580571 53.979429-130.56t130.56-53.979429q80.018286 0 134.875429 58.294857 62.317714-11.995429 117.174857-44.544-21.138286 65.682286-81.115429 101.741714 53.174857-5.705143 106.276571-28.598857z"
                        p-id="2100"
                        fill="white"
                      ></path></svg
                  ></a>
                </li>
                <li>
                  <a type="button" onclick="this.createShareMyPref()" ><svg t="1580195734305" class="icon" viewBox="0 0 1024 1024"  version="1.1"  xmlns="http://www.w3.org/2000/svg" p-id="2429" width="18" height="18">
                      <path d="M123.52064 667.99143l344.526782 229.708899 0-205.136409-190.802457-127.396658zM88.051421 585.717469l110.283674-73.717469-110.283674-73.717469 0 147.434938zM556.025711 897.627196l344.526782-229.708899-153.724325-102.824168-190.802457 127.396658 0 205.136409zM512 615.994287l155.406371-103.994287-155.406371-103.994287-155.406371 103.994287zM277.171833 458.832738l190.802457-127.396658 0-205.136409-344.526782 229.708899zM825.664905 512l110.283674 73.717469 0-147.434938zM746.828167 458.832738l153.724325-102.824168-344.526782-229.708899 0 205.136409zM1023.926868 356.00857l0 311.98286q0 23.402371-19.453221 36.566205l-467.901157 311.98286q-11.993715 7.459506-24.57249 7.459506t-24.57249-7.459506l-467.901157-311.98286q-19.453221-13.163834-19.453221-36.566205l0-311.98286q0-23.402371 19.453221-36.566205l467.901157-311.98286q11.993715-7.459506 24.57249-7.459506t24.57249 7.459506l467.901157 311.98286q19.453221 13.163834 19.453221 36.566205z" p-id="2430" fill="white" ></path></svg></a>
                </li>
                <li>
                  <a type="button" onclick="this.createShareMyPref()"><svg t="1580195767061" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"  p-id="2759" width="18" height="18" >
                      <path  d="M950.930286 512q0 143.433143-83.748571 257.974857t-216.283429 158.573714q-15.433143 2.852571-22.601143-4.022857t-7.168-17.115429l0-120.539429q0-55.442286-29.696-81.115429 32.548571-3.437714 58.587429-10.313143t53.686857-22.308571 46.299429-38.034286 30.281143-59.977143 11.702857-86.016q0-69.12-45.129143-117.686857 21.138286-52.004571-4.534857-116.589714-16.018286-5.12-46.299429 6.290286t-52.589714 25.161143l-21.723429 13.677714q-53.174857-14.848-109.714286-14.848t-109.714286 14.848q-9.142857-6.290286-24.283429-15.433143t-47.689143-22.016-49.152-7.68q-25.161143 64.585143-4.022857 116.589714-45.129143 48.566857-45.129143 117.686857 0 48.566857 11.702857 85.723429t29.988571 59.977143 46.006857 38.253714 53.686857 22.308571 58.587429 10.313143q-22.820571 20.553143-28.013714 58.88-11.995429 5.705143-25.746286 8.557714t-32.548571 2.852571-37.449143-12.288-31.744-35.693714q-10.825143-18.285714-27.721143-29.696t-28.306286-13.677714l-11.410286-1.682286q-11.995429 0-16.603429 2.56t-2.852571 6.582857 5.12 7.972571 7.460571 6.875429l4.022857 2.852571q12.580571 5.705143 24.868571 21.723429t17.993143 29.110857l5.705143 13.165714q7.460571 21.723429 25.161143 35.108571t38.253714 17.115429 39.716571 4.022857 31.744-1.974857l13.165714-2.267429q0 21.723429 0.292571 50.834286t0.292571 30.866286q0 10.313143-7.460571 17.115429t-22.820571 4.022857q-132.534857-44.032-216.283429-158.573714t-83.748571-257.974857q0-119.442286 58.88-220.306286t159.744-159.744 220.306286-58.88 220.306286 58.88 159.744 159.744 58.88 220.306286z" p-id="2760" fill="white"  ></path></svg
                  ></a>
                </li>
              </ul>
            </button>
         </div>`);
        //add click listner to share
        document.querySelector(".modal-content .btn-share").addEventListener("click",this.createShareMyPref.bind(this));
       
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
                    if(!message.msg.includes("chat__block")){
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
                    }else{
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
        console.log("Share")
        await this.profiel.getIntress();
        await this.profiel.getCountry();

        for (const countries in this.profiel.countries) {
            const countrie = document.createElement("div");
            this.profiel.countries[countries];
        }
        for (const intresses in this.profiel.intressed) {
            const instressDiv = document.createElement("div");
            instressDiv.innerHTML = this.profiel.intressed[intresses];
        }
        const html = `<div class='chat__block'>` +
            `<div class='header'><h1>reis voorkeuren ${this.profiel.getFullName()}:</h1></div>` +
            "<div class='content'> " +
            "<button>" +
            "<svg class=\"w-6 h-6\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\">" +
            "<path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5\"></path>" +
            "</svg>" +
            "Vergelijk</button>" +
            "</div>" +
            "</div>";

        //await this.messages.send(this.chat_id, Base64.encode(html), this.other_id);
        return null;
    }
    async findBooking() {
        console.log("Share")
        const intresses = await this.profiel.getIntress();
        const countries = await this.profiel.getCountry();

        const html = "<div class='chat__block'> " +
            "<div class='header'><h1>Mijn reis voorkeuren:</h1></div>" +
            "<div class='content'> " +
            "<button>" +
            "<svg class=\"w-6 h-6\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\">" +
            "<path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5\"></path>" +
            "</svg>" +
            "Like</button>" +
            "</div>" +
            "</div>";

        //await this.messages.send(this.chat_id, Base64.encode(html), this.other_id);
        return null;
    }
    render() {
        return new view('chat.html', "CommonFlight | Chat").extends("blank.html");
    }


}