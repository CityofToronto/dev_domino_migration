process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const https = require('https');

const dataaccessRequestOptions = {
    protocol: 'https:',
    host: 'was-intra-qa.toronto.ca',
    port: 443,
    path: '/c3api_data/v2/DataAccess.svc/human_rights/human_rights'
};

Promise.resolve()
    .then(() => {
        return new Promise((resolve, reject) => {
            const protocol = dataaccessRequestOptions.protocol || 'https:';
            const host = dataaccessRequestOptions.host;
            const port = dataaccessRequestOptions.port || 443;
            const path = `${dataaccessRequestOptions.path}?$count=true&$select=id&$skip=0&$top=1`;

            const method = 'GET';
            const headers = {
                'Accept': 'application/json',
                'Authorization': 'AuthSession c55d86d9-b3b2-4132-a8af-489a109780d2'
            };

            console.log(method, protocol, host, port, path);
            const request = https.request({ protocol, host, port, path, method, headers }, (response) => {
                let chunks = [];

                response.on('data', (chunk) => {
                    chunks.push(chunk);
                });

                response.on('end', () => {
                    let data;

                    if (chunks.length > 0) {
                        data = JSON.parse(Buffer.concat(chunks).toString('utf8'));
                    }

                    if (response.statusCode === 200) {
                        resolve(data);
                    } else {
                        reject(data);
                    }
                });
            });

            request.on('error', (error) => {
                reject(error);
            });

            request.end();
        });
    })
    .then((data) => {
        return new Promise((resolve, reject) => {
            const protocol = dataaccessRequestOptions.protocol || 'https:';
            const host = dataaccessRequestOptions.host;
            const port = dataaccessRequestOptions.port || 443;
            const path = `${dataaccessRequestOptions.path}?$select=id,dominoDocId,uploadedFilesPath&$skip=0&$top=${data['@odata.count']}`;

            const method = 'GET';
            const headers = {
                'Accept': 'application/json',
                'Authorization': 'AuthSession c55d86d9-b3b2-4132-a8af-489a109780d2'
            };

            console.log(method, protocol, host, port, path);
            const request = https.request({ protocol, host, port, path, method, headers }, (response) => {
                let chunks = [];

                response.on('data', (chunk) => {
                    chunks.push(chunk);
                });

                response.on('end', () => {
                    let data;

                    if (chunks.length > 0) {
                        data = JSON.parse(Buffer.concat(chunks).toString('utf8'));
                    }

                    if (response.statusCode === 200) {
                        resolve(data);
                    } else {
                        reject(data);
                    }
                });
            });

            request.on('error', (error) => {
                reject(error);
            });

            request.end();
        })
    })
    .then((data) => {
        data.forEach(item => {
            console.log(item);
        });
    })
    .catch((error) => {
        console.log(error);
    });
