const express = require('express');
const router = express.Router();
const app = express();
const kue = require('kue');
const queue = kue.createQueue();
const Promise = require('bluebird');
const hash = require('json-hash');
const crypto = require('crypto');
const store = require('./store');
const zlib = require('zlib');

const gzip = buf => {
    return new Promise((resolve, reject) => {
        zlib.gzip(buf, (err, result) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(result);
        });
    });
};


/**
 * Render
 *
 * @param name name of view
 * @param options
 * @param done
 */
const renderView = (name, options, done) => {
    const digest = hash.digest({
        view: name,
        options: options
    }, {
        algorithm: 'md5',
        crypto: crypto
    });
    
    const key = 'res:' + digest;

    // Try use cached resource
    store.existsAsync(key).then(data => {
        if (data) {
            done(null, digest);
        } else {
            // Render view with data into resource
            app.render(name, options, (err, buf) => {
                gzip(buf).then(result => {
                    store.setAsync(key, result);
                    done(err, digest);
                });
            });
        }
    }).catch(done);
};

/**
 *
 * @param view
 */
const createRenderViewJob = (view) => {
    return new Promise((resolve, reject) => {
        const job = queue.create('render-view', {
            name: view.name,
            options: view.data,
        }).save((err) => {
            if (err) {
                console.log(job.id);
            }
        });

        job.on('complete', (data) => {
            resolve(data);
        }).on('failed', (err) => {
            reject(err);
        });
    });

};

queue.process('render-view', (job, done) => {
    renderView(job.data.name, job.data.options, done);
});

router.get('/views/:name', (req, res) => {

});

/**
 * Render a view with data
 */
router.post('/views/:name', (req, res, next) => {
    const view = {
        name: req.params.name,
        data: req.body
    };
    
    createRenderViewJob(view).then(result => {
        res.json({
            digest: result
        });
    }).catch(next);
});

/**
 * Create a new view
 */
router.get('/views', (req, res) => {
    store.get('views').then(list => {

    });
});

/**
 * Create a new view
 */
router.post('/views', (req, res) => {
    const body = req.body;

    store.set();
});

/**
 * Delete a view by given name
 */
router.delete('/views/:name', () => {

});

// router
app.use(router);

module.exports = app;
