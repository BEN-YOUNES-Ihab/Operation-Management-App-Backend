class Event {
    constructor(title, date, description, type, category, value) {
      this.title = title;
      this.date = date;
      this.description = description;
      this.type = type;
      this.category = category;
      this.value = value;
    }
  }
  
  module.exports = { Event };
  