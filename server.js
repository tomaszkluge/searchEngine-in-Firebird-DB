const express = require("express");
const fbird = require("node-firebird");

const app = express();
const port = 3000;

const config = {
  host: "127.0.0.1",
  port: 3050,
  database: "C:/BAZA.FDB",
  user: "SYSDBA",
  password: "masterkey",
};


app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

function polishLetters(word) {
  const polskieLitery = {
    ą: "a",
    ć: "c",
    ę: "e",
    ł: "l",
    ń: "n",
    ó: "o",
    ś: "s",
    ź: "z",
    ż: "z",
  };

  let newWord = "";
  for (let i = 0; i < word.length; i++) {
    const sign = word[i];
    const newSign = polskieLitery[sign.toLowerCase()] || sign;
    newWord += newSign;
  }

  return newWord.toLowerCase();
}

app.get("/search", (req, res) => {
  const searchTerm = req.query.term.toLowerCase();
  console.log("Szukaj:", searchTerm);
  console.log("Data i czas zapytania:", new Date().toLocaleString());

  const searchConditionsArray = [];
  let searchConditions = "";

  if (/[ąęćżźółśń]/i.test(searchTerm)) {
    const searchOptimalize = polishLetters(searchTerm);
    searchConditionsArray.push(`LOWER(cast(b.TRESC as blob sub_type text character set win1250)) LIKE '%${searchOptimalize}%'`);
    searchConditionsArray.push(`LOWER(cast(b.TRESC as blob sub_type text character set win1250)) LIKE '%${searchTerm}%'`);
   // searchConditionsArray.push(`LOWER(OPIS) LIKE '%${searchOptimalize}%'`);
   // searchConditionsArray.push(`LOWER(OPIS) LIKE '%${searchTerm.toLowerCase()}%'`);
} else {
    searchConditionsArray.push(`LOWER(cast(b.TRESC as blob sub_type text character set win1250)) LIKE '%${searchTerm}%'`);
   // searchConditionsArray.push(`LOWER(OPIS) LIKE '%${searchTerm.toLowerCase()}%'`);
}

  searchConditions = `(${searchConditionsArray.join(" OR ")})`;

  const sql = `
  SELECT
    z.id,
    z.root,
    z.status,
    z.opis,
    SUBSTRING(z.czasins FROM 1 FOR 10) AS CZASINS, 
    b.KLUCZ,
    cast(b.TRESC as blob sub_type text character set win1250) AS TRESC,
    CASE
      WHEN z.ROOT = 0 THEN z.ID
      WHEN z.ROOT <> 0 THEN z.ROOT
    END AS IDROOTA
  FROM
    tab_zglo z,
    tab_blob b
  WHERE
    b.klucz LIKE 'ZGL%'
    AND CAST(SUBSTRING(b.klucz FROM 5) AS INTEGER) = z.ID
    AND ${searchConditions}
    ORDER BY z.ID DESC`; 

  fbird.attach(config, (err, db) => {
    if (err) {
      console.log("err:", err);
      console.error(err.message);
      return res.status(500).send("Błąd serwera");
    }

    db.query(sql, (err, result) => {
      if (err) {
        console.log("err:", err);
        console.error(err.message);
        return res.status(500).send("Błąd serwera");
      }

      console.log("Ilość wyników:", result.length);
      res.json(result);

      db.detach();
    });
  });
});

app.listen(port, () => {
  console.log(`Serwer nasłuchuje na porcie ${port}`);
});
