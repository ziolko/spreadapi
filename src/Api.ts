/**
 * @OnlyCurrentDoc
 */

// Admin account that has read/write access to all sheets
User("admin", "sdf32rdsaSAF#24asdf", ALL);

// User account that can add entries to the "transactions" sheet
// User("user", "Passw0rd!", { transactions: POST });

// User account that can add entries to the "transactions" sheet and read from "summary"
User("user", "Passw0rd!", { transactions: POST, summary: GET });

// Anonymous account that has read access to a specified sheet
// User("anonymous", UNSAFE(""), { transactions: GET });

// Anonymous account that has read/write access to all sheets (NOT RECOMMENDED!)
// User("anonymous", UNSAFE(""), ALL);

// Anonymous account that has read access to all sheets (NOT RECOMMENDED!)
// User("anonymous", UNSAFE(""), GET);

import DoGet = GoogleAppsScript.Events.DoGet;
import DoPost = GoogleAppsScript.Events.DoPost;
import Sheet = GoogleAppsScript.Spreadsheet.Sheet;

function error(status, code, details) {
  return {
    status,
    error: { code, details }
  };
}

function data(status, data = undefined, params = {}) {
  return { status, ...params, data };
}

function get(sheet, _id, params) {
  const lastColumn = sheet.getLastColumn();
  const headers = sheet
    .getRange(1, 1, 1, lastColumn)
    .getValues()[0]
    .filter(x => x !== "");

  const mapRowToObject = (row, _id) => {
    const isEmpty = headers.every((_, i) => row[i] === "" || row[i] == null);
    if (isEmpty) {
      return null;
    }

    const result = { _id };
    for (let i = 0; i < headers.length; i++) {
      result[headers[i]] = row[i];
    }
    return result;
  };

  if (_id != null) {
    // Single row
    const rowData = sheet.getRange(_id, 1, 1, lastColumn).getValues()[0];
    const result = mapRowToObject(rowData, _id);

    if (!result) {
      return error(404, "row_not_found", { _id });
    }

    return data(200, result);
  } else {
    // multiple rows
    const firstRow = 2;
    const lastRow = sheet.getLastRow();
    const total = Math.max(lastRow - firstRow + 1, 0);
    const limit = params.limit != null ? +params.limit : total;

    const isAsc =
      typeof params.order !== "string" || params.order.toLowerCase() !== "desc";

    if (isNaN(limit) || limit < 0) {
      return error(404, "invalid_limit", { limit });
    }

    let firstPageRow = isAsc ? firstRow : lastRow - limit + 1;
    if (params.start_id != null) {
      const start_id = +params.start_id;

      if (start_id < firstRow || start_id > lastRow) {
        return error(404, "start_id_out_of_range", { start_id });
      }

      firstPageRow = start_id - (isAsc ? 0 : limit - 1);
    }

    const lastPageRow = Math.min(firstPageRow + limit - 1, lastRow);
    firstPageRow = Math.max(firstPageRow, firstRow);

    let rows = [];
    if (firstPageRow <= lastPageRow) {
      rows = sheet
        .getRange(firstPageRow, 1, lastPageRow - firstPageRow + 1, lastColumn)
        .getValues()
        .map((item, index) => mapRowToObject(item, firstPageRow + index));
    }

    if (!isAsc) {
      rows.reverse();
    }

    let next = isAsc ? lastPageRow + 1 : firstPageRow - 1;
    if (next < firstRow || next > lastRow) next = undefined;

    return data(200, rows.filter(x => x), { next });
  }
}

function post(sheet: Sheet, payload: any) {
  const lastColumn = sheet.getLastColumn();
  const headers = sheet
    .getRange(1, 1, 1, lastColumn)
    .getValues()[0]
    .filter(x => x != "");

  const row = headers.map(column =>
    payload[column] === undefined ? "" : payload[column]
  );
  sheet.appendRow(row);

  return data(201);
}

function del(sheet: Sheet, _id: number) {
  sheet.getRange(`${_id}:${_id}`).setValue("");
  return data(204);
}

function put(sheet: Sheet, _id: number, payload: any) {
  if (_id == null) {
    return error(400, "row_id_missing", {});
  }

  const lastColumn = sheet.getLastColumn();
  const headers = sheet
    .getRange(1, 1, 1, lastColumn)
    .getValues()[0]
    .filter(x => x != "");

  const row = headers.map(column =>
    payload[column] === undefined ? "" : payload[column]
  );
  sheet.getRange(_id, 1, 1, lastColumn).setValues([row]);
  return data(201);
}

function handleRequest(params) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const pathRegex = /^\/?(\w+)(\/(\d+)\/?)?$/;
  const path = params["path"] || "";

  const result = path.match(pathRegex);

  if (!result) {
    return error(404, "Invalid path format", {
      path: params["path"]
    });
  }

  const sheetName = (result[1] || "").toLowerCase();
  const _id = result[3] == null ? null : +result[3];
  const method = (params["method"] || "GET").toUpperCase();
  const key = params.key || "";

  if (!hasAccess(key, sheetName, method)) {
    return error(401, "unauthorized", {});
  }

  if (!isStrongKey(key)) {
    return error(401, "weak_key", {
      message:
        "Authentication key should be at least 8 characters long " +
        "and contain at least one lower case, upper case, number and special character. " +
        "Update your password or mark it as UNSAFE. Refer to the documentation for details."
    });
  }

  const sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    return error(404, "sheet_not_found", { sheet: sheetName });
  }

  if (_id != null && _id <= 1) {
    return error(400, "row_index_invalid", { _id });
  }

  const payload = params["payload"];

  switch (method) {
    case "GET":
      return get(sheet, _id, params);
    case "POST":
      return post(sheet, payload);
    case "PUT":
      return put(sheet, _id, payload);
    case "DELETE":
      return del(sheet, _id);
    default:
      return error(404, "unknown_method", { method });
  }
}

function res(data) {
  return ContentService.createTextOutput(JSON.stringify(data));
}

function doGet(request: DoGet) {
  if (request.parameter["payload"]) {
    try {
      request.parameter["payload"] = JSON.parse(request.parameter["payload"]);
    } catch (e) {
      return error(400, "payload_invalid_json", request.parameter["payload"]);
    }
  }
  return res(handleRequest(request.parameter));
}

function doPost(request: DoPost) {
  let data;
  try {
    data = JSON.parse(request.postData.contents);
  } catch {
    return error(400, "invalid_post_payload", {
      payload: request.postData.contents
    });
  }

  if (Array.isArray(data)) {
    return res(data.map(handleRequest));
  }

  return res(handleRequest(data));
}

let users;
function User(name, key, permissions) {
  if (!users) {
    users = [];
  }
  users.push({ name, key, permissions });
}

function find(array, predicate) {
  if (!Array.isArray(array)) return;

  for (let i = 0; i < array.length; i++) {
    if (predicate(array[i])) {
      return array[i];
    }
  }
}

function getUserWithKey(key) {
  return find(
    users,
    x => x.key === key || (typeof x === "object" && x.key.__unsafe === key)
  );
}

function isStrongKey(key) {
  const strongKeyRegex = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
  );
  const user = getUserWithKey(key);

  if (!user) return false;
  if (user.key.__unsafe === key) return true;

  return user.key.match(strongKeyRegex);
}

function getPermissions(user, spreadsheet) {
  if (Array.isArray(user.permissions)) return user.permissions;
  if (typeof user.permissions === "function") return user.permissions;

  return user.permissions[spreadsheet] || user.permissions["ALL"];
}

function hasAccess(key, spreadsheet, method) {
  const user = getUserWithKey(key);

  if (!user) return false;
  const permission = getPermissions(user, spreadsheet);
  if (!permission) return false;

  return !!(
    permission === ALL ||
    permission.toString() === method ||
    find(permission, x => x === ALL) ||
    find(permission, x => x.toString() === method)
  );
}

function GET() {}
function POST() {}
function PUT() {}
function DELETE() {}
function ALL() {}
function UNSAFE(key) {
  return { __unsafe: key };
}

GET.toString = () => "GET";
POST.toString = () => "POST";
PUT.toString = () => "PUT";
DELETE.toString = () => "DELETE";
ALL.toString = () => "*";
