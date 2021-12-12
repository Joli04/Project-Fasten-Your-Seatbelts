import App from "./Classes/app.js";
const app = new App();
//Load all first data
await app.load();

/**
 * Handle Links when route changes
 */
window.addEventListener("hashchange", function (){
    App.checkNeedsLogin(App.GetCurrentPage());
    App.setActivePage();
});