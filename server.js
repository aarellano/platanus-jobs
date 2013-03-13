var express = require('express'),
    submission = require('./routes/submissions');

var app = express();

app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
});

app.post('/submissions', submission.addSubmission);
// app.get('/submissions', submission.findAll);
// app.get('/submissions/:id', submission.findById);
// app.put('/submissions/:id', submission.updateSubmission);
// app.delete('/submissions/:id', submission.deleteSubmission);

app.listen(3000);
console.log('Listening on port 3000...');