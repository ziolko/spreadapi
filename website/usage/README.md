# Usage

### API design

SpreadAPI has to deal with limitations imposed by the Google Apps Script engine. There are two limitations that make running a _state-of-art_ REST API impossible in this environment:

1. Each script can respond only on one hardcoded URL. It can't handle request comming at subpaths like _/users_ or _/transactions/15_.
2. Only _GET_ and _POST_ methods are supported.

Due to the these limitations the SpreadAPI script handles only _POST_ requests on a single URL. The actual HTTP method and resource path are provided in request body as shown in the example below:

```javascript
{
    "method": "GET",
    "sheet": "users"
}
```

Other parameters (like payload for _POST_ and _PUT_  requests) are provided as additional fields in the request body:

```javascript
{
    "method": "PUT",
    "sheet": "users",
    "id": "2",
    "payload": {
        "firstname": "John",
        "lastname": "Smith"
    }
}

```

For more information on this topic visit [API Reference](usage.md) documentation page.

{% hint style="info" %}
For each request Google App Scripts first returns status 302 (redirect). To get result of your request you need to make a follow-up GET request (without any payload) to the  URL shared in the Location response headers. Some libraries do this automatically, but that's not always the case.
{% endhint %}
