// Global variables file
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
        host: {
            path: 'http://192.168.1.53:3000'
        },
        fenix: {
            client_id: '1414440104755255',
            client_secret: 'UAATyrvuFnd8TJoCTgOp8BQuvHC7Xfg71oKCrnyi5fziScTpmp/AxQxjYwN726IoYVR8JW43OJo2fgAK44VftA==',
            redirect_uri: 'http://192.168.1.53:3000/users/auth',
            api_url: 'https://fenix.tecnico.ulisboa.pt/api/fenix/v1',
            oauth_url: 'https://fenix.tecnico.ulisboa.pt/oauth'
        },
        default: {
            building_range: 20,
            user_range: 20,
            timeout_updateLocation: 60, // User periodic location update -- 1 min
            timeout_activeUser: 180, // User considered inactive -- 3 min
            timeout_checkGlobal: 60 // Periodic update on active users -- 1 min
        }
    };

    return configs;
};
