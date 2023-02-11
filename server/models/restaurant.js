class restaurant {
    constructor(
        id,
        name,
        image,
        location,
        location_url,
        cost,
        rating = 0,
        amountOfLikes,
        type1 = null,
        type2 = null,
        type3 = null) {
        this.id = id;
        this.name = name;
        this.image = image;
        this.location = location;
        this.location_url = location_url;
        this.cost = cost;
        this.rating = rating;
        this.amountOfLikes = amountOfLikes;
        this.type1 = type1;
        this.type2 = type2;
        this.type3 = type3
    }
    getId() {
        return this.id
    }
    getName() {
        return this.name;
    }
    getImage() {
        return this.image;
    }
    getLocation() {
        return this.location;
    }
    getLocationURL() {
        return this.location_url;
    }
    getCost() {
        return this.cost;
    }
    getRating() {
        return this.rating;
    }
    getAmountOfLikes() {
        return this.amountOfLikes;
    }
    getType() {
        return [this.type1, this.type2, this.type3]
    }
}