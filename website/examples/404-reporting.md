# 404 errors reporting

Imagine you own a company website. Over the time the structure of your page changes (redesign?) and some pages are either deleted or moved to another URLs.  Unfortunately it's so easy to forget configuring redirect for some of these pages and that leads to the 404 (not found) screens. If you knew what pages you're missing you could redirect them to the proper URLs in seconds.

You can easily monitor what pages are missing on your site by adding the following snippet to the 404 (not found) page HTML. The exact steps to edit this page source code depend on your web server or hosting provider but each of them should have this option.

```markup
<script>
var spreadApiURL = 'TODO'; // Read further to get the URL
var xmlHttp = new XMLHttpRequest();
xmlHttp.open("post", spreadApiURL);
xmlHttp.send(JSON.stringify({
    method: "POST",
    sheet: "entries",
    payload: {
      time: new Date().toISOString(),
      url: document.location.href,
      referrer: document.referrer
    }
  })
);
</script>
```

The only thing missing in the above script is the value of variable `spreadApiURL`. To get this URL first create a spreadsheet with the following structure (single sheet called _entries_ with columns _time, url_ and _referrer_):

![](<../.gitbook/assets/image (13).png>)

Next, follow the [setup instructions](../setup.md) to configure API for your spreadsheet. While configuring authentication add the following line to the script so that everybody can add an entry to your sheet.

```javascript
User("anonymous", UNSAFE(""), { entries: POST });
```

Now simply put the Web App URL provided to you during the deployment step as a value of variable `spreadApiURL` and you are done!

Keep in mind that you can use all the power of Google Sheets to analyze your data! E.g. you can create an ordered list of URLs reported most frequently.
