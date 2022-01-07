import App from "../Classes/app.js";

export default class Modal {
    constructor(trigger) {
        this.initModal();
        this.trigger = trigger;

        this.trigger.addEventListener('click', open);
        this.close_btn.addEventListener('click', close)
        window.onclick = function (event) {
            if (event.target === this.modal) {
                this.modal.style.display = "none";
            }
        }
    }

    initModal() {
        const modal = document.createElement('div');
        modal.classList.add('modal');
        modal.id  = (Math.random() + 1).toString(36).substring(7); //create random string

        const modalContent = document.createElement('div');
        modalContent.classList.add('modal-content');

        const modalHeader = document.createElement('div');
        modalHeader.classList.add('modal-header');
        modalHeader.innerHTML = " <span className=\"close\">&times;</span> <h2 className=\"title\">Header</h2>";

        const modalBody = document.createElement('div');
        modalBody.classList.add('modal-body');

        const modalFooter = document.createElement('div');
        modalFooter.classList.add('modal-footer');

        modalContent.appendChild(modalHeader);
        modalContent.appendChild(modalBody);
        modalContent.appendChild(modalFooter);
        modal.appendChild(modalContent);

        this.modal = modal;
        this.close_btn = this.modal.getElementsByClassName("close")[0];
        document.body.appendChild(modal);
        // <div className="modal">
        //     <!-- Modal content -->
        //     <div className="modal-content">
        //         <div className="modal-header">
        //             <span className="close">&times;</span>
        //             <h2 className="title">Header</h2>
        //         </div>
        //         <div className="modal-body">
        //             <p>Some text in the Modal Body</p>
        //             <p>Some other text...</p>
        //         </div>
        //         <div className="modal-footer">
        //             <h3>Footer</h3>
        //         </div>
        //     </div>
        // </div>
    }

    setTitle(title) {
        this.modal.getElementsByClassName("modal-header title")[0].innerHTML = title;
    }

    setContent(html) {
        this.modal.getElementsByClassName("al-content modal-body")[0].innerHTML = html;
    }

    open() {
        this.modal.style.display = "block";
    }

    close() {
        this.modal.style.display = "none";
    }
}
// Get the modal
// var modal = document.getElementById("myModal");
//
// // Get the button that opens the modal
// var btn = document.getElementById("myBtn");
//
// // Get the <span> element that closes the modal
// var span = document.getElementsByClassName("close")[0];
//
// // When the user clicks the button, open the modal
// btn.onclick = function() {
//     modal.style.display = "block";
// }
//
// // When the user clicks on <span> (x), close the modal
// span.onclick = function() {
//     modal.style.display = "none";
// }

// When the user clicks anywhere outside of the modal, close it
