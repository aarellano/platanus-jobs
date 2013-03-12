var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('submissiondb', server);

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

exports.addSubmission = function(req, res) {
    var submission = req.body;
    console.log('Adding submission: ' + JSON.stringify(submission));
    db.collection('submissions', function(err, collection) {
        collection.insert(submission, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
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