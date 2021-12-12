import App from "./Classes/app.js";


const app = new App();

document.addEventListener("DOMContentLoaded", async function () {
    await app.load();
});


