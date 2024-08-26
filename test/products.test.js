const supertest = require('supertest');
const assert = require('assert');
const requester = supertest('http://localhost:8080');

describe('Testing de productos', () => {
    it('El endpoint GET api/products/ debe obtener todos los productos', async () => {
        const {statusCode, ok, _body} = await requester.get('/api/products/');
        assert.strictEqual(Array.isArray(_body.payload.docs), true);
    })

    it('El endpoint GET api/products/665397a2a11f42b6131fbaec debe obtener el producto segun su id', async () => {
        const {statusCode, ok, _body} = await requester.get('/api/products/665397a2a11f42b6131fbaec');
        assert.strictEqual((typeof _body.payload == typeof {}), true);
    })
})