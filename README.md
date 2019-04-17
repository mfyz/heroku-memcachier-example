# heroku-memcachier-example

Initial Heroku app config

1. heroku login
2. heroku create
3. git push heroku master

To add the service to the heroku app

```heroku addons:create memcachier:dev```

to see the config variables (memcachier server, username, password)

```heroku config```

Copy the env variables to local .env file to set up local environment then refresh bash session and re-run the app.
