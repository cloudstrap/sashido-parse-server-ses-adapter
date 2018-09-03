const request = require('request-promise');
const url = require('url');
const querystring = require('querystring');

class SESAdapter {
    constructor({ appId, masterKey, proxyUrl, from }) {
        this.appId = appId;
        this.masterKey = masterKey;
        this.proxyUrl = proxyUrl;
        this.from = from;
    }

    _request(path, body) {
        return request.post(`${this.proxyUrl}/${path}`, {
            headers: {
                'X-Parse-Application-Id': this.appId,
                'X-Parse-Master-Key': this.masterKey
            },
            body: JSON.stringify(body)
        });
    }

    _templateParams({ appName, link, user }) {
        const locale = user.get('localeIdentifier');
        if (locale) {
            const u = url.parse(link);
            const qs = querystring.parse(u.query);
            qs.locale = locale;
            u.search = '?' + querystring.stringify(qs);
            link = url.format(u);
        }

        return {
            user: {
                id: user.id,
                localeIdentifier: user.get('localeIdentifier'),
                email: user.get('email') || user.get('username'),
                username: user.get('username')
            },
            appName,
            link
        };
    }

    async sendVerificationEmail(params) {
        try {
            const res = await this._request(
                'sendVerificationEmail',
                this._templateParams(params)
            );

            return res;
        } catch (e) {
            throw new Error(
                `error while sending verification email to ${
                    params.user.objectId
                } - ${e.message || e}`
            );
        }
    }

    async sendPasswordResetEmail(params) {
        try {
            const res = await this._request(
                'sendPasswordResetEmail',
                this._templateParams(params)
            );

            return res;
        } catch (e) {
            throw new Error(
                `error while sending password reset email to ${
                    params.user.objectId
                } - ${e.message || e}`
            );
        }
    }

    async sendMail({ to, subject, text }) {
        try {
            const res = await this._request('send', {
                to,
                subject,
                text
            });

            return res;
        } catch (e) {
            throw new Error(
                `error while sending email to ${to} - ${e.message || e}`
            );
        }
    }
}

module.exports = SESAdapter;
