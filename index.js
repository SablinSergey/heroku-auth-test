const http = require('http');
const url = require('url');

http.createServer(function(req, res) {
    const { pathname, query, protocol, host } = url.parse(req.url, true);

    console.log('New query received:', req.url);
    console.log('Pathname:', pathname);

    if(req.headers.origin){
        res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    }

    res.setHeader('Access-Control-Allow-Credentials', true);

    if( pathname === '/get-authorization') {
        const cookie = req.headers.cookie;

        console.log('Cookie:', req.headers.cookie);

        const tokenCookiePair = (req.headers.cookie || '')
            .split('; ')
            .find((item) => item.startsWith('token='));

        res.setHeader('Content-Type', 'application/json');

        if (!tokenCookiePair) {
            res.end(`{ "status": "failed" }`);
            return;
        }

        const token = tokenCookiePair.replace('token=','');

        res.end(`{ "status": "ok", "token": "${token}"}`);
        return;
    }

    if( pathname === '/store-authorization') {
        console.log('token:', query.token);
        if(!query.token) {
            res.writeHead(400);
            res.end();
            return;
        }

        res.writeHead(200, {
            "Set-Cookie": `token=${query.token}; SameSite=None; Secure`,
            "Content-Type": 'application/json'
        });

        res.end(`{ "status": "ok", "session_id": "${query.token}"}`);
        return;
    }

    res.writeHead(404);
    res.end();
})
    .listen(process.env.PORT || 4000);
