const SwaggerClient = require('swagger-client');

let OAS_uri = "https://esi.evetech.net/latest/swagger.json?datasource=tranquility";

let OAS_client = SwaggerClient(OAS_uri).then(client => {
    console.log(client.spec)
})

