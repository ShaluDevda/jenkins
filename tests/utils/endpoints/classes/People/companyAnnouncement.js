// companyAnnouncement.js

class CompanyAnnouncement {
    constructor(title, message, date) {
        this.title = title;
        this.message = message;
        this.date = date;
    }

    announce() {
        return `${this.date}: ${this.title} - ${this.message}`;
    }
}

module.exports = CompanyAnnouncement;