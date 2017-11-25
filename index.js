var fs = require('fs')
var config = fs.readFileSync('./config.json')
config = JSON.parse(config.toString())
var OAuth2 = require('oauth').OAuth2
var moment = require('moment')
var request = require('request')
var cron = require('node-cron')

// Init
var oauth2 = new OAuth2(
    config.api.client_id,
    config.api.client_secret,
    'https://api.intra.42.fr',
    null,
    '/oauth/token',
    null)
var eventId

// debug
function debug(msg) {
    if (config.debug)
        console.info(msg)
}

// Launch
cron.schedule('*/5 * * * *', function () {
    debug('Get app oauth token...')
    oauth2.getOAuthAccessToken('', {'grant_type': 'client_credentials'}, function (e, access_token) {
        if (e)
            return console.error(e);
        debug('Get exams...')
        oauth2.get('https://api.intra.42.fr/v2/exams ', access_token, function (err, result) {
            if (err)
                return console.error(err)
            var next = moment().weekday(9).format('YYYY-MM-DD');
            result = JSON.parse(result)

            debug('Check exams...')
            for (var i = 0; i < result.length; i++) {
                if (result[i].name === 'Exam C' && result[i].campus[0].name === 'Paris' && moment(result[i].begin_at).isSame(next, 'day')) {
                    eventId = result[i].id
                    var available = result[i].max_people - result[i].nbr_subscribers;

                    debug('Exam found! (' + result[i].nbr_subscribers + '/' + result[i].max_people + ')')
                    if (config.notifications.SMS && config.notifications.SMS.enabled && available > 0) {
                        // message
                        var message = available + ' places disponibles pour l\'exam du ' + next + ' !'

                        if (config.notifications.SMS.service.freeAPI.user && config.notifications.SMS.service.freeAPI.pass) { // send with Free Mobile API
                            // request
                            var endpoint = 'https://smsapi.free-mobile.fr/sendmsg'
                            endpoint += '?user=' + config.notifications.SMS.service.freeAPI.user
                            endpoint += '&pass=' + config.notifications.SMS.service.freeAPI.pass
                            endpoint += '&msg=' + message
                            request.get(endpoint)
                        }
                    }
                    break
                }
            }
        })
    })
})