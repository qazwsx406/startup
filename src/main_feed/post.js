export class Post {
    constructor(name, field, agreeImg, disagreeImg) {
        this.name = name;
        this.field = field;
        this.date = new Date().toJSON().slice(0, 10);
        this.agree = [];
        this.disagree = [];
        this.agreeImg = agreeImg;
        this.disagreeImg = disagreeImg;
    }
}