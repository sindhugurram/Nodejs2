var restify = require('restify');
var mongojs = require('mongojs');
var server = restify.createServer();
server.use(restify.bodyParser());


var db = mongojs('mydb', ['mycollection'])

server.get("/mycollection", function (req, res, next) {
    db.mycollection.find(function (err, mycollection) {
        res.writeHead(200, {
            'Content-Type': 'application/json; charset=utf-8'
        });
        res.end(JSON.stringify(mycollection));
    });
    return next();
});

server.post('/mycollection', function (req, res, next) {
    var mycollection = req.params;
    db.mycollection.save(mycollection,
        function (err, data) {
            res.writeHead(200, {
                'Content-Type': 'application/json; charset=utf-8'
            });
            res.end(JSON.stringify(data));
        });
    return next();
});

server.put('/mycollection/:id', function (req, res, next) {
    // get the existing product
    db.mycollection.findOne({
        id: req.params.id
    }, function (err, data) {
        // merge req.params/product with the server/product

        var updProd = {}; // updated products 
        // logic similar to jQuery.extend(); to merge 2 objects.
        for (var n in data) {
            updProd[n] = data[n];
        }
        for (var n in req.params) {
            updProd[n] = req.params[n];
        }
        db.mycollection.update({
            id: req.params.id
        }, updProd, {
                multi: false
            }, function (err, data) {
                res.writeHead(200, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
                res.end(JSON.stringify(data));
            });
    });
    return next();
});

server.listen(8020, function () {
    console.log("Server started @ 8020");
});