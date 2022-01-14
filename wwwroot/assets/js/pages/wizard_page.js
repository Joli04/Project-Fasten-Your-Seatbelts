var currentTab = 0;
showTab(currentTab)
function showTab(n) {
    // This function will display the specified tab of the form...
    var x = document.getElementsByClassName("tab");

    x[n].style.display = "block";
    //... and fix the Previous/Next buttons:
    if (n === 0) {
        document.getElementById("prevBtn").style.display = "none";
    } else {
        document.getElementById("prevBtn").style.display = "inline";
    }
    if (n === (x.length - 1)) {
        document.getElementById("nextBtn").innerHTML = "Submit";
    } else {
        document.getElementById("nextBtn").innerHTML = "Volgende";
    }
    //... and run a function that will display the correct step indicator:
    this.fixStepIndicator(n)
}

function nextPrev(tab) {

    // This function will figure out which tab to display
    var x = document.getElementsByClassName("tab");
    // Exit the function if any field in the current tab is invalid:
    if (tab === 1 && !this.validateForm()) return false;
    // Hide the current tab:
    x[this.currentTab].style.display = "none";
    // Increase or decrease the current tab by 1:
    this.currentTab = this.currentTab + tab;
    // if you have reached the end of the form...
    if (this.currentTab >= x.length) {
        const FinishEvent = document.createEvent('Event');
        // Define that the event name is 'build'.
        FinishEvent.initEvent('wizard_finished', true, true);
        document.dispatchEvent(FinishEvent);
        return false;
    }else{
        // Otherwise, display the correct tab:
        this.showTab(this.currentTab);
    }
}

function validateForm() {
    // This function deals with validation of the form fields
    var x, y, i, valid = true;
    x = document.getElementsByClassName("tab");

    if(x[this.currentTab]){
        y = x[this.currentTab].getElementsByTagName("input");
        // A loop that checks every input field in the current tab:

        for (i = 0; i < y.length; i++) {
            // If a field is empty...
            if(x[this.currentTab].classList.contains("bio")){
                //Skip
                continue;
            }
            if(y[i].classList.contains("searchTerm")){
                //Skip
                continue;
            }
            if (y[i].value === "") {
                // add an "invalid" class to the field:
                y[i].className += " errorWrapper";
                // and set the current valid status to false
                valid = false;
            }
        }
    }
    // If the valid status is true, mark the step as finished and valid:
    if (valid) {
        document.getElementsByClassName("step")[this.currentTab].className += " finish";
    }
    return valid; // return the valid status
}

function fixStepIndicator(n) {
    // This function removes the "active" class of all steps...
    var i, x = document.getElementsByClassName("step");
    for (i = 0; i < x.length; i++) {
        x[i].className = x[i].className.replace(" active", "");
    }
    //... and adds the "active" class on the current step:
    x[n].className += " active";
}