// Global variables file
var user = "asint";
var passwd = "asint2019";

module.exports = function () {
    let configs = {
        db: {
            path: 'mongodb://'+user+':'+passwd+'@ds055689.mlab.com:55689/project_asint_vajb',
            name: 'project_asint_vajb',
            host: 'ds055689.mlab.com',
            port: 55689,
            options: {
                useNewUrlParser: true
            }
        },
        host: {
            //path: 'http://192.168.1.53:3000',
            path: 'https://asint2019jbva.appspot.com',
            port: 3000,
            sslPort: 18000
        },
        fenix: {
            client_id: '1414440104755264',
            client_secret: 'v1rGK/oExNdH3jGRJK4XfC5QM/rU/zDCHFvy7J1eVpqDI8u9PL7PXxB/kM9jP1+g4dqfdBHftciUcAYCGl17vg==',
            redirect_uri: 'https://asint2019jbva.appspot.com/users/auth',
            //client_id: '1414440104755255',
            //client_secret: 'UAATyrvuFnd8TJoCTgOp8BQuvHC7Xfg71oKCrnyi5fziScTpmp/AxQxjYwN726IoYVR8JW43OJo2fgAK44VftA==',
            //redirect_uri: 'http://192.168.1.53:3000/users/auth',
            api_url: 'https://fenix.tecnico.ulisboa.pt/api/fenix/v1',
            oauth_url: 'https://fenix.tecnico.ulisboa.pt/oauth'
        },
        default: {
            building_range: 90,
            user_range: 150,
            timeout_updateLocation: 1, // User periodic location update -- 1 sec
            timeout_activeUser: 3, // User considered inactive -- 3 sec
            timeout_checkGlobal: 1 // Periodic update on active users -- 1 sec
        }
    };

    return configs;
};
