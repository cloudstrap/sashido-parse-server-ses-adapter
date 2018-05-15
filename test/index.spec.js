const assert = require('assert');
const nock = require('nock');

const SESAdapter = require('..');

const url = 'http://localhost:43843';
describe('sendMail', () => {
    const ses = new SESAdapter({
        appId: 'testAppId',
        masterKey: 'testMasterKey',
        from: 'test@test.test',
        proxyUrl: url
    });

    it('should configure properly', () => {
        assert.equal(ses.appId, 'testAppId');
        assert.equal(ses.masterKey, 'testMasterKey');
        assert.equal(ses.from, 'test@test.test');
        assert.equal(ses.proxyUrl, url);
    });

    it('should send correct headers', () => {
        return new Promise(resolve => {
            nock(url)
                .post('/send')
                .reply(function(uri, body) {
                    const headers = this.req.headers;

                    assert.equal(
                        headers['x-parse-application-id'],
                        'testAppId'
                    );
                    assert.equal(
                        headers['x-parse-master-key'],
                        'testMasterKey'
                    );

                    resolve();
                });

            ses.sendMail({});
        });
    });

    it('should send correct data', () => {
        return new Promise(resolve => {
            nock(url)
                .post('/send')
                .reply(function(uri, body) {
                    body = JSON.parse(body);
                    assert.equal(body.subject, 'test');
                    assert.equal(body.text, 'test');
                    assert.equal(body.to, 'test@test.test');

                    resolve();
                });

            ses.sendMail({
                subject: 'test',
                text: 'test',
                to: 'test@test.test'
            });
        });
    });
});
