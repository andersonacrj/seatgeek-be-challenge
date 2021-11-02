var { verb, status } = require('../helpers/constants');
const arrayData = [];

exports.Run = async message => {

    const verbAndPredicate = message.split(':');

    if (verbAndPredicate.length != 2) {
        return status.FAIL;
    }
    var verb = verbAndPredicate[0];
    var predicate = verbAndPredicate[1].replace('\n', '');
    var predicateWithoutNoise = predicate.replace(' ', '');

    if (verb === "QUERY") {
        return QuerySeat(arrayData, predicateWithoutNoise);
    }
    else if (verb == "RESERVE") {
        return AllocateSeats(arrayData, predicateWithoutNoise);
    }
    else if (verb == "BUY") {
        return BuySeats(arrayData, predicateWithoutNoise);
    }
    return status.FAIL;
};

const QuerySeat = (arrayData, predicateWithoutNoise) => {

    let resp = arrayData.find(el => el.name === predicateWithoutNoise);

    if (typeof resp === 'undefined') {
        arrayData.push({ "name": predicateWithoutNoise.toString(), "status": "FREE" })
        return status.FREE;
    }
    else if (resp.status === "FREE") {
        return status.FREE;
    } else if (resp.status === "RESERVED") {
        return status.RESERVED
    }
    return status.SOLD;
};

const AllocateSeats= (arrayData, predicateWithoutNoise) => {

    let resp = arrayData.find(el => el.name === predicateWithoutNoise);
    if (typeof resp === 'undefined') {
        //console.log(`IS UNDEFINED : `);
    }
    else if (resp.status === "FREE") {

        const index = arrayData.findIndex((element, index) => {
            if (element.name === predicateWithoutNoise) {
                return true;
            }
        });
        arrayData[index].status = "RESERVED";

        return status.OK;
    }
    return status.FAIL;
};

const BuySeats = (arrayData, predicateWithoutNoise) => {
    let resp = arrayData.find(el => el.name === predicateWithoutNoise);
        if (typeof resp === 'undefined') {
            //console.log(`IS UNDEFINED : `);
        }
        else if (resp.status === "RESERVED") {

            const index = arrayData.findIndex((element, index) => {
                if (element.name === predicateWithoutNoise) {
                    return true;
                }
            });
            arrayData[index].status = "SOLD";

            return status.OK;
        }
        return status.FAIL;
	
};