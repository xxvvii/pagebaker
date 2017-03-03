const rewriter = (req, res, next) => {
    if (req.url === '/index.html') {
        req.url = '/resources/9cce4876a946dae2cb353ade08cdf717';
    }

    next();
};

module.exports = rewriter;
