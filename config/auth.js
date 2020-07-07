/ expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'      : '313732185721366', // your App ID
        'clientSecret'  : '89c6c065f690a779a2cffbad7b572f0f', // your App Secret
        'callbackURL'   : 'http://localhost:4800/auth/facebook/callback',
        'profileURL'    : 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
        'profileFields' : ['id', 'email', 'name'] // For requesting permissions from Facebook API
    }
  }
