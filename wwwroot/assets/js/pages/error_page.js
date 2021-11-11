var back = document.getElementById('back');
back.addEventListener('click',Previous());

function Previous() {
    console.log("click?")
    window.history.back()
}