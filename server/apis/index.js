'use strict';
var express = require('express'), 
    router = express.Router();

router.use('/api/v1/users', require('./users'));
router.use('/api/v1/options', require('./options'));
router.use('/api/v1/upload', require('./upload'));

// nothing for root
router.get('/', function(req, res){
    res.send(JSON.stringify({}));
});

module.exports = router;
