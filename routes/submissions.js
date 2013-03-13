var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('submissiondb', server, {safe: true});

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'submissiondb' database");
        db.collection('submissions', {safe:true}, function(err, collection) {
            if (err) {
                console.log("The 'submissions' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving submission: ' + id);
    db.collection('submissions', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findAll = function(req, res) {
    db.collection('submissions', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.showExplanation = function(req, res) {
    res.send('<code>It seems that you didn\'t GET it. You need to send us a <strong>POST</strong> request with the parameters "name" and "email", and with an extra\
        parameter "other", showing all the info that you want to share with us. </br></br>\
        Example: </br></br>\
        {"name": "Andres", "email": "andres@platan.us", "other": { </br>\
            "city": "Washington DC", </br>\
            "resume": "andres.io/resume.pdf", </br>\
            "github": "github.com/aarellano", </br>\
            "twitter": "@aarellanor"}} </code>');
};


exports.addSubmission = function(req, res) {
    var submission = req.body;
    console.log('Adding submission: ' + JSON.stringify(submission));
    if (verifyParameters(submission, res)) {
        db.collection('submissions', function(err, collection) {
            collection.insert(submission, {safe:true}, function(err, result) {
                if (err) {
                    res.send({'error':'An error has occurred'});
                } else {
                    console.log('Success: ' + JSON.stringify(result[0]));
                    res.send('Hey ' + submission.name + '! Thanks for your POST, we got it. We\'ll be in touch shortly ;)');
                    res.send(result[0]);
                }
            });
        });
    }
}

exports.updateSubmission = function(req, res) {
    var id = req.params.id;
    var submission = req.body;
    console.log('Updating submission: ' + id);
    console.log(JSON.stringify(submission));
    db.collection('submissions', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, submission, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating submission: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(submission);
            }
        });
    });
}

exports.deleteSubmission = function(req, res) {
    var id = req.params.id;
    console.log('Deleting submission: ' + id);
    db.collection('submissions', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}

verifyParameters = function(submission, res) {
    if (submission.name == undefined) {
        console.log('Missing name parameter');
        res.send('Hey, we need your name! Please post your application again');
    } else if (submission.email == undefined) {
        console.log('Missing email parameter');
        res.send('Hey, we need your email! Please post your application again');
    } else
        return true
}