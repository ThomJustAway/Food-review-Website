class account {
    constructor(id,
        username,
        email,
        password,
        first_name,
        last_name,
        profile,
        date,
        like_type1,
        like_type2,
        like_type3) {
        this.id = id
        this.username = username;
        this.email = email;
        this.password = password;
        this.first_name = first_name;
        this.last_name = last_name;
        this.profile = profile;
        this.date = date;
        this.like_type1 = like_type1;
        this.like_type2 = like_type2;
        this.like_type3 = like_type3
    }
    getId() {
        return this.id;
    }
    getUsername() {
        return this.username;
    }
    getEmail() {
        return this.email;
    }
    getPassword() {
        return this.password;
    }
    getFirst_name() {
        return this.first_name;
    }
    getLast_name() {
        return this.last_name;
    }
    getProfile() {
        return this.profile;
    }
    getDate() {
        return this.date;
    }
    getLike_type() {
        return ([this.like_type1, this.like_type2, this.like_type3])
    }
}

module.exports = account;