function doPost(e: any) {
  const props = PropertiesService.getScriptProperties().getProperties();
  const spreadsheetId = props["spreadsheetId"];

  const params = JSON.parse(e.postData.getDataAsString());
  const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(
    params["sheetname"]
  );

  let result = {};

  if (sheet) {
    appendRow(sheet, params);
    result = { success: true };
  } else {
    result = { success: false, error: "Sheet not found" };
  }

  // https://developers.google.com/apps-script/guides/content
  const response = ContentService.createTextOutput();
  response.setMimeType(ContentService.MimeType.JSON);
  response.setContent(JSON.stringify(result));

  return response;
}

// レスポンスのリダイレクト用
// https://developers.google.com/apps-script/guides/content#redirects
function doGet(e: any) {
  const params = JSON.stringify(e);
  return HtmlService.createHtmlOutput(params);
}

function appendRow(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  parameter: object
) {
  parameter["timestamp"] = new Date();
  const row = createRow(sheet, parameter);
  sheet.appendRow(row);
}

function createRow(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  parameter: object
) {
  const keys = sheet.getDataRange().getValues()[0];
  return keys.map(key => parameter[key] || "");
}

//////////////////////////////// test
function testAppendRow() {
  const sheet = SpreadsheetApp.getActive().getSheetByName("code_lines");
  appendRow(sheet, {
    Total: "10000",
    Controllers: "14393",
    commit: "1f28bf63fca84e47fe922657c2ef6fa762fd9262",
    invalidKey: "this will not be shown"
  });
}
