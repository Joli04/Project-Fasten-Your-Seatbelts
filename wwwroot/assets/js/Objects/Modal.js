import App from "../Classes/app.js";

export default class Modal {
    constructor(trigger) {
        this.id = null;
        this.trigger = trigger;
        this.initModal();
    }

    initModal() {
        const modal = document.createElement('div');
        modal.classList.add('modal');
        modal.id = (Math.random() + 1).toString(36).substring(7); //create random string
        this.id = modal.id;
        const modalContent = document.createElement('div');
        modalContent.classList.add('modal-content');

        const modalHeader = document.createElement('div');
        modalHeader.classList.add('modal-header');

        const modalClose = document.createElement('span');
        modalClose.classList.add('close');
        modalClose.innerHTML = "&times;";

        const modalTitle = document.createElement('h2');
        modalTitle.classList.add('title');
        modalTitle.innerHTML = "Header";

        modalHeader.appendChild(modalClose)
        modalHeader.appendChild(modalTitle);
        const modalBody = document.createElement('div');
        modalBody.classList.add('modal-body');

        const modalFooter = document.createElement('div');
        modalFooter.classList.add('modal-footer');

        modalContent.appendChild(modalHeader);
        modalContent.appendChild(modalBody);
        modalContent.appendChild(modalFooter);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        this.modal = modal;

        this.close_btn = document.querySelector("#" + this.modal.id + " .close");
        this.trigger.addEventListener('click', this.open.bind(this));
        this.close_btn.addEventListener('click', this.close.bind(this))

        // window.onclick = function (event) {
        //     if (event.target == this.modal) {
        //         this.modal.style.display = "none";
        //     }
        // }
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
        this.modal.querySelector(".modal-header .title").innerHTML = title;
    }

    setContent(html) {
        this.modal.querySelector(".modal-content .modal-body").innerHTML = html;
    }

    getId() {
        return this.modal.id;
    }

    open() {
        this.modal.style.display = "block";
    }

    close() {
        this.modal.style.display = "none";
    }
}
