//General configurations file
module.exports = function () {
    let configs = {
        db: {
            path: 'mongodb://localhost:27017/asintProject',
            name: 'asintProject',
            host: 'localhost',
            port: 27017,
            options: {
                useNewUrlParser: true
            }
        },
    };

    return configs;
};
