# API Reference

{% hint style="info" %}
SpreadAPI is maintained by the author of [Roombelt](https://roombelt.com) - simple and reliable meeting room display system.\
\
If you want to support SpreadAPI consider trying [Roombelt](https://roombelt.com) in your company!
{% endhint %}

{% hint style="success" %}
Check out [this live example ](https://jsfiddle.net/mkzL9ver/27/)to see how to use SpreadAPI from a browser application.
{% endhint %}

## Get multiple rows

<mark style="color:green;">`POST`</mark> `https://script.google.com/macros/s/SCRIPT_ID/exec/`

Return list of rows. Empty rows are skipped. Each row has an _\_id_ field which is equal to row number in Google Sheets.

#### Request Body

| Name      | Type   | Description                                                                                             |
| --------- | ------ | ------------------------------------------------------------------------------------------------------- |
| method    | string | _GET_                                                                                                   |
| sheet     | string | Sheet name, e.g. _transactions_ or _users_                                                              |
| key       | string | Authentication key. See page _Setup_ -> _authentication_ for details.                                   |
| order     | string | Order of results. Ascending by default. For descending use _DESC._                                      |
| start\_id | number | ID of the first row to return. By default first row in the spreadsheet (or last row if _order = DESC_). |
| limit     | number | Maximum number of rows in response. By default all rows are returned.                                   |

{% tabs %}
{% tab title="200 " %}
```
```
{% endtab %}
{% endtabs %}

## Get single row

<mark style="color:green;">`POST`</mark> `https://script.google.com/macros/s/SCRIPT_ID/exec/`

#### Request Body

| Name   | Type   | Description                                                         |
| ------ | ------ | ------------------------------------------------------------------- |
| method | string | _GET_                                                               |
| sheet  | string | Sheet name, e.g. _transactions_ or _users._                         |
| id     | number | ID of row to get.                                                   |
| key    | string | Authentication key. See page _Setup -> authentication_ for details. |

{% tabs %}
{% tab title="200 " %}
```
```
{% endtab %}
{% endtabs %}

## Insert row

<mark style="color:green;">`POST`</mark> `https://script.google.com/macros/s/SCRIPT_ID/exec/`

Adds a row to the end of sheet. To add multiple rows pass an array of objects e.g.:

```json
[ 
    { "method": "POST", "sheet": "users", "payload": { "Name": "Adam" } },
    { "method": "POST", "sheet": "users", "payload": { "Name": "John" } },
    { "method": "POST", "sheet": "users", "payload": { "Name": "Alex" } }
]
```

#### Request Body

| Name    | Type   | Description                                                           |
| ------- | ------ | --------------------------------------------------------------------- |
| method  | string | _POST_                                                                |
| sheet   | string | Sheet name, e.g. _transactions_ or _users._                           |
| key     | string | Authentication key. See page _Setup_ -> _authentication_ for details. |
| payload | object | Object with new row content.                                          |

{% tabs %}
{% tab title="200 " %}
```
```
{% endtab %}
{% endtabs %}

## Update row

<mark style="color:green;">`POST`</mark> `https://script.google.com/macros/s/SCRIPT_ID/exec/`

Update content of a single row. To update multiple rows pass an array of objects e.g.:

```json
[ 
    { "method": "PUT", "sheet": "users", "payload": { "id": 2, "Name": "Adam" } },
    { "method": "PUT", "sheet": "users", "payload": { "id": 10, "Name": "John" } },
    { "method": "PUT", "sheet": "users", "payload": { "id": 5, "Name": "Alex" } }
]
```

#### Request Body

| Name    | Type   | Description                                                           |
| ------- | ------ | --------------------------------------------------------------------- |
| method  | string | _PUT_                                                                 |
| sheet   | string | Sheet name, e.g. _transactions_ or _sheets._                          |
| id      | string | ID of row to update.                                                  |
| key     | string | Authentication key. See page _Setup_ -> _authentication_ for details. |
| payload | object | Object with the updated row content.                                  |

{% tabs %}
{% tab title="200 " %}
```
```
{% endtab %}
{% endtabs %}

## Remove row

<mark style="color:green;">`POST`</mark> `https://script.google.com/macros/s/SCRIPT_ID/exec/`

Clear a single row. Notice, that the row is not physically removed so that ids of the following rows don't change.

To remove multiple rows pass an array of objects e.g.:

```json
[ 
    { "method": "DELETE", "sheet": "users", "id": 2 },
    { "method": "DELETE", "sheet": "users", "id": 10 },
    { "method": "DELETE", "sheet": "users", "id": 5 }
]
```

#### Request Body

| Name   | Type   | Description                                                           |
| ------ | ------ | --------------------------------------------------------------------- |
| method | string | _DELETE_                                                              |
| sheet  | string | Sheet name, e.g. _transations_ or _users_                             |
| id     | number | ID ofrow to remove                                                    |
| key    | string | Authentication key. See page _Setup_ -> _authentication_ for details. |

{% tabs %}
{% tab title="200 " %}
```
```
{% endtab %}
{% endtabs %}
