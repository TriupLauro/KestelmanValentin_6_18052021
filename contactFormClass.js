import {isNotEmptyString, lockScroll, unlockScroll, validEmailRegex} from "./photographersFunctions.js";

export default class ContactForm {
    constructor(mainPageDOM,photographerData,
                contactBtn = document.querySelector('button.contact'),
                modalbg = document.querySelector('div.modalbg'),
                closebtn = document.querySelector('button.close'),
                modalForm = document.querySelector('form.modal')) {
        this.contactBtn = contactBtn;
        this.modalbg = modalbg;
        this.closebtn = closebtn;
        this.modalForm = modalForm;
        this.mainPage = mainPageDOM;
        this.photographerData = photographerData;
    }

    displayModalForm() {
        this.modalbg.style.display = 'block';
        const firstInput = this.modalForm.querySelector('input#firstname');
        this.mainPage.setAttribute('aria-hidden', 'true');
        firstInput.focus();
        lockScroll();
    }

    exitModalForm(e) {
        e.preventDefault();
        this.modalbg.style.display = 'none';
        this.mainPage.setAttribute('aria-hidden','false');
        this.contactBtn.focus();
        unlockScroll();
    }

    submitContactForm(e) {
        e.preventDefault();
        const firstNameElt = this.modalForm.querySelector('#firstname');
        const lastNameElt = this.modalForm.querySelector('#lastname');
        const emailElt = this.modalForm.querySelector('#email');
        const contactMsgElt = this.modalForm.querySelector('#message');

        const formDataObject = {
            firstName : {
                value : firstNameElt.value,
                isValid : isNotEmptyString,
                errorMsg : 'First Name must have at least one character'
            },
            lastName : {
                value : lastNameElt.value,
                isValid : isNotEmptyString,
                errorMsg : 'Last Name must have at least one character'
            },
            email : {
                value : emailElt.value,
                isValid : validEmailRegex,
                errorMsg : 'Please enter a valid e-mail address'
            },
            message : {
                value : contactMsgElt.value,
                isValid : isNotEmptyString,
                errorMsg : 'The message must have at least one character'
            }
        }

        const errorMsgs = this.formDataErrorCollection(formDataObject);

        if (errorMsgs.length > 0) {
            console.log(errorMsgs);
            return false;
        }

        const contentToDisplay = this.formDataValueCollection(formDataObject);

        console.log(contentToDisplay);
        this.contactBtn.focus();
    }

    formDataErrorCollection(objectToValidate) {
        const errorMessagesList = [];

        for (let [key,subObject] of Object.entries(objectToValidate)) {
            if (!subObject.isValid(subObject.value)) {
                errorMessagesList.push(`${key} error : ${subObject.errorMsg}`);
            }
        }

        return errorMessagesList;
    }

    formDataValueCollection(validatedObject) {
        const valueList = [];

        for (let key of Object.keys(validatedObject)) {
            valueList.push(validatedObject[key].value);
        }

        return valueList;
    }

    attachListenersToContactForm () {
        this.contactBtn.addEventListener('click', this.displayModalForm.bind(this));
        this.closebtn.addEventListener('click', this.exitModalForm.bind(this));
        this.modalForm.addEventListener('submit', this.submitContactForm.bind(this));
    }

    setContactName() {
        const contactTitle = this.modalForm.querySelector('h1#contact-name');
        contactTitle.append(this.photographerData.name);
    }

    // Hiding and showing the contact button on mobile

    hideContactBtn() {
        this.contactBtn.style.transform = 'translate(-50%, 200%)'
    }

    showContactBtn () {
        this.contactBtn.style.transform = ''
    }

    toggleButtonVisibility () {
        if (window.innerWidth <= 1100) {
            window.clearTimeout(this.scrollingHappens);
            this.hideContactBtn();
            this.scrollingHappens = setTimeout(this.showContactBtn.bind(this), 500);
        }
    }

    attachListenerToWindow() {
        window.addEventListener('scroll', this.toggleButtonVisibility.bind(this));
    }
}