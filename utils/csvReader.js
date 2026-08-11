// const fs = require("fs");
// const csv = require("csv-parser");
// const path = require("path");

// function readCSV(fileName) {

//   return new Promise((resolve, reject) => {

//     const filePath = path.join(
//       __dirname,
//       "../data",
//       fileName
//     );

//     const results = [];

//     if (!fs.existsSync(filePath)) {

//       return reject(
//         new Error(`CSV file not found: ${fileName}`)
//       );

//     }

//     fs.createReadStream(filePath)
//       .pipe(csv())
//       .on("data", (data) => {

//         results.push(data);

//       })
//       .on("end", () => {

//         resolve(results);

//       })
//       .on("error", (error) => {

//         reject(error);

//       });

//   });

// }

// module.exports = {
//   readCSV
// };

const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");

function readCSV(fileName) {
    return new Promise((resolve, reject) => {

        const filePath = path.join(
            __dirname,
            "../data",
            fileName
        );

        if (!fs.existsSync(filePath)) {
            return reject(
                new Error(`CSV file not found: ${filePath}`)
            );
        }

        const results = [];

        fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", (row) => {
                results.push(row);
            })
            .on("end", () => {
                resolve(results);
            })
            .on("error", (error) => {
                reject(error);
            });
    });
}

module.exports = {
    readCSV
};