const http = require('http');

const PORT = 9000;

let db = {myNumber: 123};

const server = http.createServer((req, res) =>{
    const {url, method} = req;
    res.setHeader('Content-Type', 'application/json');

    const [urlWithoutQueryParams] = url.split('?');
    const [ , domain, uriParam] = urlWithoutQueryParams.split('/');

    if(domain === 'myNumber'){
        if(db.myNumber === null && method !== 'PUT'){
            res.statusCode = 404;
            return res.end(JSON.stringify({
                message: 'No value stored!',
            }));
        }
    

        if(urlWithoutQueryParams === '/myNumber' && method === 'GET') {
            return res.end(JSON.stringify(db.myNumber));
        }

        
        const numbers = /^\d+$/;
        if(urlWithoutQueryParams === "/myNumber" && method === 'PUT'){
                const rawBody = [];
                req.on('data', (chunk) => {
                    rawBody.push(chunk);
                });
                req.on('end', () => {   
                    const buffer = Buffer.concat(rawBody).toString();  
                    const body = JSON.parse(buffer);
                    if(!numbers.test(body.myNumber) || typeof body.myNumber !== 'number'){
                        res.statusCode = 400;
                        return res.end(JSON.stringify({
                        message: 'myNumber not valid, put a numeric value please :)',
                        }));
                    }
                    Object.assign(db, body);
                    res.end(JSON.stringify({
                    message: 'myNumber successfully updated!!!',
                    data: db,
                    })); 
                });
                return;
        }
        
        if(uriParam){
            if (numbers.test(uriParam)) {
                return res.end(JSON.stringify(db.myNumber * uriParam));
            }
            res.statusCode = 400;
            return res.end(JSON.stringify({
                message: 'Multiplier not valid',
            }));
        }
    }

    if(domain === 'reset'){
        if(db.myNumber === null){
            res.statusCode = 404;
            return res.end(JSON.stringify({
            message: 'No value stored!',
            }));
        }
        db.myNumber = null;
        res.statusCode = 205;
        return res.end(JSON.stringify({
            message: 'myNumber successfully deleted!!!',
        }));
    }
    res.statusCode = 404;
    return res.end(JSON.stringify({
    message: 'Resource not found',
  }));
});

server.listen(PORT, 'localhost', null, () =>{
    console.log(`Server connected at ${PORT}`);
});