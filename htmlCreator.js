import { writeFileSync, readFileSync } from "fs";

function createAttrTable({
  attributes: { globalAttributes, localAttributes },
}) {
  let table = `
  <div class="fixed-width">
    <table>
      <tr>
        <th colspan="2">Global Attributes</th>
      </tr>
      <tr>
        <td colspan="2">
          ${
            globalAttributes
              ? globalAttributes.replaceAll("<", "&lt;").replaceAll(">", "&gt;")
              : ""
          }
        </td>
      </tr>
      ${
        localAttributes.length > 0
          ? `<tr>
          <th colspan="2">Local Attributes</th>
        </tr>
        <tr>
          <th>name</th>
          <th>description</th>
        </tr>
        ${localAttributes
          .map(
            (attr) => `<tr>
        <td>${attr?.name}</td>
        <td>${attr?.description}</td>
      </tr>`
          )
          .join("")}`
          : ""
      }
    </table>
    </div>
  `;
  return table;
}

const createExamples = (tag) => {
  let examples = "<ul>";
  let exceptions = [
    "col",
    "colgroup",
    "th",
    "thead",
    "tbody",
    "tr",
    "td",
    "tfoot",
  ];
  tag.samples.forEach((sm) => {
    if (!exceptions.includes(tag.tag)) {
      examples += `<div style="padding: 0.5rem;">${sm}</div>`;
    }
  });

  return examples + "</ul>";
};

const createTableRows = () => {
  let rows = "";
  let dataJson = readFileSync("./cleanedData.json", "utf8");
  dataJson = JSON.parse(dataJson);

  dataJson.forEach((tag) => {
    rows += `
      <tr>
      <td class='tagname'>&lt;${tag.tag}&gt;</td>
      <td class="wide"><p>${tag?.description
        ?.replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")}</p></td>
      <td>${createAttrTable(tag)}</td>
      <td>${tag.samples
        .map(
          (smp) =>
            `<div>${smp.replaceAll("<", "&lt;").replaceAll(">", "&gt;")}</div>`
        )
        .join("")}</td>
        <td>${createExamples(tag)}</td>
      </tr>
    `;
  });
  return rows;
};

const generateHtml = () => {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>HTML Cheatsheet</title>
  </head>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    .styled-table {
      border-collapse: collapse;
      margin: 25px 0;
      font-size: 0.9em;
      font-family: sans-serif;
      min-width: 400px;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
    }
    .styled-table thead tr {
      background-color: #009879;
      color: #ffffff;
      text-align: left;
    }
    .styled-table th,
    .styled-table td {
      padding: 12px 15px;
    }
    .styled-table tbody tr {
      border-bottom: 1px solid #dddddd;
    }

    .styled-table tbody tr:nth-of-type(even) {
      background-color: #f3f3f3;
    }

    .styled-table tbody tr:last-of-type {
      border-bottom: 2px solid #009879;
    }
    .fixed-width{
      max-height:20rem;
      overflow-x:hidden;
      overflow-y:scroll;
      border: 1px solid gray;
      border-radius: .5rem;
    }
    .tagname {
      font-weight: 600;
      background-color: #f3f3f3;
    }
    .wide{
      min-width:25rem
    }

    *::-webkit-scrollbar {
      width: 6px;
      background-color: rgb(255, 255, 255); /* or add it to the track */
    }
    *::-webkit-scrollbar-track {
      border-radius: 1rem;
      width: 5px;
      height: 10px;
      background-color: transparent;
    }
    *::-webkit-scrollbar-thumb {
      border-radius: 1.5rem;
      background-color: rgba(56, 72, 82, 0.548);
    }
    </style>
  <body>
    <table class="styled-table">
      <thead>
        <tr>
          <th>Tagname</th>
          <th>Description</th>
          <th>Attributes</th>
          <th>Code</th>
          <th>Examples</th>
        </tr>
      </thead>
      <tbody>
      ${createTableRows()}
        </tbody>
    </table>
</body>
</html>`;
};

function main() {
  const outputFile = "output.html";
  console.log("Generating please wait....");
  writeFileSync(outputFile, generateHtml(), "utf8");
  console.log("Completed.");
  console.log(`Changes have been written to ${outputFile}`);
}
main();
