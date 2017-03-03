const express = require('express');
const bodyParser = require('body-parser');
const cons = require('consolidate');

module.exports = (port = 8765) => {
    const app = express();

    app.use(bodyParser.json());       // to support JSON-encoded bodies
    app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
        extended: true
    }));

    // const DynamicView = require('./dynamic-view');

    // assign the handlebars engine to .hbs files
    app.engine('hbs', cons.handlebars);

    // set .hbs as the default extension
    app.set('view engine', 'hbs');
    app.set('views', '../views');

    // using rewriter middleware
    app.use(require('./rewriter'));
    
    // app.set('view', DynamicView);
    app.use('/renderer', require('./views'));
    app.use('/resources', require('./resources'));

    app.listen(port, () => {
        console.log(`RenderServer listening on port ${port}!`)
    });

    return app;
};
