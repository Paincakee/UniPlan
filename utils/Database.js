/*
|*   NodeJS MySQL helper class by Albert Lourensen (83350)
|*
|*   Dependencies:
|*   - mysql
|*   - dotenv
|*   - fs/promises
|*   - path
|*
*/

const mysql = require("mysql")
const dotenv = require("dotenv")
const fs = require('fs/promises');
const path = require('path')

dotenv.config()

let conn

const connect = async () => {
    conn = mysql.createConnection({
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASS,
        database: process.env.DATABASE_NAME,
    })

    conn.connect(err => {
        if (err) {
            console.log()
            console.error('Unable to connect to MySQL database.')
            console.log()
            return
        } else {
            console.log()
            console.log('Connection to MySQL database established successfully.')
            console.log()
        }
    })
}

const query = async (sql) => {
    return new Promise((resolve, reject) => {
        conn.query(sql, (err, result) => {
            if (err) return reject(err)
            return resolve(result)
        })
    })
}

function checkString(str, obj) {
    const regex = /%([^%]+)%/g; // matches any string enclosed in % symbols
    let matches = str.match(regex); // find all matches
    if (matches === null) {
        return str; // no matches found
    }
    for (let i = 0; i < matches.length; i++) {
        const match = matches[i];
        const key = match.substring(1, match.length - 1); // extract the key from the matched string
        if (obj.hasOwnProperty(key)) {
            const value = escapeSqlString(obj[key]);
            if (Array.isArray(value) || typeof value === "object") {
                throw new Error(`Value for key '${key}' is not a scalar`);
            }
            str = str.replaceAll(match, value);
        }
    }
    return str;
}

function escapeSqlString(str) {
    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
      switch (char) {
        case "\0":
          return "\\0";
        case "\x08":
          return "\\b";
        case "\x09":
          return "\\t";
        case "\x1a":
          return "\\z";
        case "\n":
          return "\\n";
        case "\r":
          return "\\r";
        case "\"":
        case "'":
        case "\\":
        case "%":
          return "\\" + char; // escape these characters with a backslash
        default:
          return char;
      }
    });
  }

function escapeString(str) {
    // Create a map of escapable characters and their escape sequences
    const escapeMap = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': '&quot;',
      "'": '&#39;',
      "/": '&#x2F;'
    };
  
    // Replace every escapable character with its escape sequence
    return str.replace(/[&<>"'\/]/g, function(match) {
      return escapeMap[match];
    });
  }

const sql = async (file, obj) => {
    try {
        const matchingFile = await fs.readFile(`./sql/${file}.sql`)
        let result = matchingFile ? matchingFile.toString().replaceAll('\t', '').replaceAll('\r', ' ').split('\n').join('') : false

        if (!result) return false

        let checkedResult = true
        let data = ""

        if (obj) {
            try {
                let queryStr = checkString(result, obj)
                data = await query(queryStr)
            } catch (err2) {
                console.error(err2);
                checkedResult = false
            }
        } else {
            data = await query(result)
        }

        let success = false
        let isArray = false
        if (typeof data === 'object' && Object.prototype.toString.call(data) === '[object Object]') {
          success = data.affectedRows > 0
        } else {
          isArray = true
        }

        if (!success) success = data.length > 0 ? true : false

        return {
            success: success,
            data: success ? (isArray ? data : [data]) : []
        }

    } catch (err) {
        console.error({
            message: "An error occured while trying to execute SQL",
            error: err
        })
        return false
    }
}

module.exports = {
    conn,
    connect,
    query,
    sql
}