# exams-42-bot
A NodeJS bot for check if next 42's exams have available places

## Configuration

The `config.json` file need to be like this :

```json
{
  "api": {
     "client_id": "",
     "client_secret": ""
  },
  "notifications": {
    "SMS": {
      "enabled": false,
      "service": {
        "freeAPI": {
          "user": "",
          "pass": ""
        }
      }
    }
  }
}
```

### Credentials

You need to set `api.client_id` and `api.client_secret` with your 42's apps (you need to create an app [here](https://profile.intra.42.fr/oauth/applications/new)).

### Notifications

You can receive notification if the application detect one place on the next exam (every Tuesday) with Free Mobile API.
For that, you need to config your API credentials from Free Mobile.
