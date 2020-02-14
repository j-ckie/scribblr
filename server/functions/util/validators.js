let emptyError = "Must not be empty";
let emailError = "Must be a valid email";
let passwordMatchError = "Passwords must match";

const isEmail = email => {
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.match(regEx)) return true;
    else return false;
};


const isEmpty = string => {
    if (string.trim() === "") return true;
    else return false;
}

exports.validateSignupData = data => {
    let errors = {};

    if (isEmpty(data.email)) {
        errors.email = emptyError;
    } else if (!isEmail(data.email)) {
        errors.email = emailError;
    }

    if (isEmpty(data.password)) errors.password = emptyError;
    if (data.password !== data.confirmPassword) errors.confirmPassword = passwordMatchError;

    if (isEmpty(data.handle)) errors.handle = emptyError;

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    };
};

exports.validateLoginData = data => {
    let errors = {};

    if (isEmpty(data.email)) errors.email = emptyError;
    if (isEmpty(data.password)) errors.password = emptyError;

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    };
};

exports.reduceUserDetails = data => {
    let userDetails = {};

    if (!isEmpty(data.bio.trim())) userDetails.bio = data.bio;
    if (!isEmpty(data.website.trim())) {
        if (data.website.trim().substring(0, 4) !== "http") {
            userDetails.website = `http://${data.website.trim()}`;
        } else userDetails.website = data.website;
    }

    if (!isEmpty(data.location.trim())) userDetails.location = data.location;

    return userDetails;
};