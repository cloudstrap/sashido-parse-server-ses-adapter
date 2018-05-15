const request = require('request-promise');

class SESAdapter {
    constructor({ appId, masterKey, proxyUrl, from }) {
        this.appId = appId;
        this.masterKey = masterKey;
        this.proxyUrl = proxyUrl;
        this.from = from;
    }

    async sendMail({ to, subject, text }) {
        try {
            const res = await request.post(`${this.proxyUrl}/send`, {
                headers: {
                    'X-Parse-Application-Id': this.appId,
                    'X-Parse-Master-Key': this.masterKey
                },
                body: JSON.stringify({
                    to,
                    subject,
                    text
                })
            });

            return res;
        } catch (e) {
            throw new Error(`error while sending email to ${to} - ${e}`);
        }
    }
}

module.exports = SESAdapter;
