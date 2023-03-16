class User {
  constructor(name, lastname, birthday, email, password, role, recievesNotifications) {
    this.name = name;
    this.lastname = lastname;
    this.birthday = birthday;
    this.email = email;
    this.password = password;
    this.role = role;
    this.recievesNotifications = recievesNotifications;
  }
}

module.exports = { User };
