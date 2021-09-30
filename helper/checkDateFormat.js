const checkFormat = (value) => {
    const regex = new RegExp(/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/)
        
    if(!regex.test(value)){
        throw Error('Date Format is Incorrect, Format example: dd-mm-yyyy');
    }

    return true;
}

module.exports = {
    checkFormat
}