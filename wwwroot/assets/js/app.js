import App from "./Classes/app.js";
const app = new App();
await app.load();

window.addEventListener("hashchange", function (){
    App.checkNeedsLogin(App.GetCurrentPage());
    App.setActivePage();
    //App.HandleLinks();
});