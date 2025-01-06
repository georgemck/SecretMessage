//main function that uses Document URL
//in case one is not passed in, uses this one by default
function myFunction(
  documentURL = "https://docs.google.com/document/d/1kDTf1FWVS_8IJMHhWE4oE6A1J_su4-AJuU5D4txHVqo/edit?tab=t.0"
) {
  //parse the documentId from document URL
  documentURL = documentURL
    ? documentURL
    : "https://docs.google.com/document/d/1kDTf1FWVS_8IJMHhWE4oE6A1J_su4-AJuU5D4txHVqo/edit?tab=t.0";
  const st = documentURL.search(/\/d\//);
  const en = documentURL.search(/\/edit?/);
  const documentId = documentURL.substring(st + 1, en);

  //load document, its body and the target table
  let DOC = DocumentApp.openByUrl(`${documentURL}`);
  const BODY = DOC.getBody();
  const TABLE = BODY.getTables()[0];
  const tableArray = fillArrayWithTableDataAppsScript(TABLE);

  //print out and return the message from the table to the user interface
  message = getMessage(tableArray[0], tableArray[2]);
  console.log(message[0]);
  return message[0];
}

function fillArrayWithTableDataAppsScript(TABLE) {
  //determine number of rows and columns in the table
  const NUMBEROFROWSINTABLE = TABLE.getNumRows();
  const NUMBEROFCOLUMNSINTABLE = numCols(TABLE);
  console.log(NUMBEROFROWSINTABLE, "NUMBEROFROWSINTABLE");
  console.log(NUMBEROFCOLUMNSINTABLE, "NUMBEROFCOLUMNSINTABLE");

  let maxCols = 0; //save the largest value of columns
  let maxRows = 0; //save the largest value of rows
  //populate the array with data from the table
  for (let i = 1; i < NUMBEROFROWSINTABLE; i++) {
    let x = stripSlashes(getCellText(TABLE, i, 0));
    let y = stripSlashes(getCellText(TABLE, i, 2));
    let v = stripSlashes(getCellText(TABLE, i, 1));
    if (parseInt(y) > maxRows) {
      maxRows = parseInt(y);
    }
    if (x > maxCols) {
      maxCols = x;
    }
    //spaceArray[y][x] = v;
    console.log(i, x, y, v);
  }
  console.log(maxCols, maxRows);

  //create empty array large enough to hold the table
  let spaceArray = Array(NUMBEROFROWSINTABLE)
    .fill("null")
    .map(() => Array(NUMBEROFCOLUMNSINTABLE));
  // console.log(spaceArray, "spaceArray");
  for (let i = 1; i < NUMBEROFROWSINTABLE; i++) {
    let x = stripSlashes(getCellText(TABLE, i, 0));
    let y = stripSlashes(getCellText(TABLE, i, 2));
    let v = stripSlashes(getCellText(TABLE, i, 1));
    if (parseInt(y) > maxRows) {
      maxRows = parseInt(y);
    }
    if (x > maxCols) {
      maxCols = x;
    }
    spaceArray[y][x] = v;
  }
  return [spaceArray, maxCols, maxRows];
}

function fillArrayWithTableDataJavaScript(TABLE) {
  //determine number of rows and columns in the table
  const NUMBEROFROWSINTABLE = TABLE.children[0].children.length;
  const NUMBEROFCOLUMNSINTABLE = TABLE.children[0].children[0].children.length;
  console.log(NUMBEROFROWSINTABLE, "NUMBEROFROWSINTABLE");
  console.log(NUMBEROFCOLUMNSINTABLE, "NUMBEROFCOLUMNSINTABLE");

  let maxCols = 0; //save the largest value of columns
  let maxRows = 0; //save the largest value of rows
  //populate the array with data from the table
  for (let i = 1; i < NUMBEROFROWSINTABLE; i++) {
    let x = stripSlashes(TABLE.children[0].children[i].children[0].innerText);
    let y = stripSlashes(TABLE.children[0].children[i].children[2].innerText);
    let v = stripSlashes(TABLE.children[0].children[i].children[1].innerText);

    if (parseInt(y) > maxRows) {
      maxRows = parseInt(y);
    }
    if (x > maxCols) {
      maxCols = x;
    }
    //spaceArray[y][x] = v;
    console.log(i, x, y, v);
  }
  console.log(maxCols, maxRows);

  //create empty array large enough to hold the table
  let spaceArray = Array(NUMBEROFROWSINTABLE)
    .fill("null")
    .map(() => Array(NUMBEROFCOLUMNSINTABLE));
  // console.log(spaceArray, "spaceArray");
  for (let i = 1; i < NUMBEROFROWSINTABLE; i++) {
    let x = stripSlashes(TABLE.children[0].children[i].children[0].innerText);
    let y = stripSlashes(TABLE.children[0].children[i].children[2].innerText);
    let v = stripSlashes(TABLE.children[0].children[i].children[1].innerText);
    if (parseInt(y) > maxRows) {
      maxRows = parseInt(y);
    }
    if (x > maxCols) {
      maxCols = x;
    }
    spaceArray[y][x] = v;
  }
  return [spaceArray, maxCols, maxRows];
}

//below are the helper functions getMessage, GetCellText and numCols

//display the results of the decoded message
function getMessage(sa = [], rows) {
  let messageDecodedString = [];
  let messageDecodedHTML = [];
  for (r = rows - 1; r > -1; r--) {
    messageDecodedString += sa[r]; //separate each line of symbols
    messageDecodedHTML += sa[r]; //separate each line of symbols
    messageDecodedString = messageDecodedString.replace(/,/g, ""); //remove commas
    messageDecodedHTML = messageDecodedHTML.replaceAll(",", ""); //remove commas
    messageDecodedString +=  "\n"; //separate each line of symbols
    messageDecodedHTML += "<br>"; //separate each line of symbols
  
  }
  console.log("display decoded cells");
  //   console.log(messageDecoded); //display decoded letter
  return [messageDecodedString, messageDecodedHTML];
}

function stripSlashes(input) {
  let output = input;
  output = output.replace(/\n/, "");
  return output;
}

//found on the internet
const isValidUrl = (urlString) => {
  var urlPattern = new RegExp(
    "^(https?:\\/\\/)?" + // validate protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // validate domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // validate OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // validate port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // validate query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // validate fragment locator
  return !!urlPattern.test(urlString);
};

//required by Google Apps Script to display visual output
function doGet(e) {
  return ContentService.createTextOutput(myFunction(e.parameter.documentURL));
}

//get number of columns in Google Doc table
function numCols(table) {
  cols = 0;
  table = table.asTable();
  while (true) {
    try {
      table.getColumnWidth(cols);
      cols++;
    } catch {
      break;
    }
  }
  return cols;
}

//get contents of cell from the Google Doc table located at specific row and column
function getCellText(TABLE, rowIndex, colIndex) {
  let cell = TABLE.getRow(rowIndex).getCell(colIndex);
  return cell.getText();
}
