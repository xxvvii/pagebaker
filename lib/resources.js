const express = require('express');
const store = require('./store');
const router = express.Router();
const app = express();

router.get('/:id', (req, res) => {
    store.getAsync('res:' + req.params.id).then(resource => {
        res.set({
            'Content-Encoding': 'gzip',
            'Content-Type': 'text/html'
        });
        res.send(resource);
    });
});

app.use(router);

module.exports = app;
