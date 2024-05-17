# Sign-up form

You can create newsletter sign-up in a few minutes with SpreadAPI. In this tutorial we will create a simple sign-up form with only an email field.

This example shows how to create a simple newsletter sign-up form in just a few minutes using SpreadAPI, allowing users to register their email with a single field.

![The sign-up form that we will create in this tutorial](<../.gitbook/assets/image (20).png>)

First, create a Google Sheet like the one below. It's just a single sheet called _emails_ with a single column _email_.

![](<../.gitbook/assets/image (18).png>)

Next, follow the [setup instructions](../setup.md) to configure API for your spreadsheet. While configuring authentication add the following line to the script so that everybody can add an entry to the `emails` sheet.

```javascript
User("anonymous", UNSAFE(""), { emails: POST });
```

Now you can now create your site with an HTML form. The code below is a good self-contained starting point, using Bulma CSS and jQuery. I added a nice confirmation message shown after signing up.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/bulma@1.0.0/css/bulma.min.css"
    />
    <script
      src="https://code.jquery.com/jquery-3.7.1.min.js"
      integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo="
      crossorigin="anonymous"
    ></script>
    <title>Spreadapi Example Sign-up Form</title>
  </head>
  <body>
    <form id="newsletter-form">
      <div class="columns is-multiline">
        <div class="column is-6">
          <input
            class="input is-medium is-fullwidth"
            type="email"
            id="email"
            placeholder="Enter your Email"
          />
        </div>
        <div class="column is-6">
          <button
            class="button is-medium is-primary is-fullwidth is-clear"
            id="sign-up"
          >
            Sign up
          </button>
        </div>
      </div>
    </form>

    <!-- A dialog shown after successfully signing-up -->
    <div id="subscription-success-modal" class="modal">
      <div class="modal-background"></div>
      <div class="modal-content">
        <div class="box is-clearfix">
          <div>You've been added to the SpreadAPI subscription list!</div>
          <button
            class="button is-primary is-pulled-right"
            id="modal-ok-button"
          >
            OK
          </button>
        </div>
      </div>
      <button class="modal-close is-large" aria-label="close" />
    </div>

    <script>
      // This code requires jQuery

      var $form = $("#newsletter-form");
      var $email = $("#email");

      var $modal = $("#subscription-success-modal");
      var $signUp = $("#sign-up");

      var $modalOK = $("#modal-ok-button");

      $form.submit(function (e) {
        e.preventDefault();

        // Don't do anything if email field is empty
        var email = $email.val();
        if (!email) {
          return;
        }

        // Mark the "signup" button as "loading"
        $signUp.addClass("is-loading");

        // make the request
        $.post({
          // Replace the URL with the one specific for your script
          url: "https://script.google.com/macros/s/AKfycbzoEi2wm45iNgmtsLf6nzMIo4hxFpZvUKKFTXxJc1jEtN4W9gRo/exec",
          data: JSON.stringify({
            method: "POST",
            sheet: "emails",
            payload: { email },
          }),
        }).then(function () {
          // Remove the "loading" state from the "signup" button
          $signUp.removeClass("is-loading");

          // Show the popup saying that user has been added
          // to the subscription list
          $modal.addClass("is-active");
        });
      });

      // Once user clicks "OK" on the popup saying that he
      // has been added to the subscription list we want to
      // close the popup
      $modalOK.click(function () {
        $modal.removeClass("is-active");
      });
    </script>
  </body>
</html>
```

That's it. Now your users can sign up to the newsletter and you will add their emails on Google Sheets!
