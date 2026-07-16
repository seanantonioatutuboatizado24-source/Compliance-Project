const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "inventory_db"
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("MySQL Connected");
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.get("/products", (req, res) => {
    db.query("SELECT * FROM products ORDER BY id DESC", (err, results) => {
        if (err) {
            return res.status(500).json(err);
        }

        res.json(results);
    });
});
app.post("/products", (req, res) => {
    const { name, qty, price } = req.body;

    const sql = "INSERT INTO products (name, qty, price) VALUES (?, ?, ?)";

    db.query(sql, [name, qty, price], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }

        res.json({
            message: "Product added successfully!",
            id: result.insertId
        });
    });
});
app.delete("/products/:id", (req, res) => {

    const id = req.params.id;

    db.query(
        "DELETE FROM products WHERE id=?",
        [id],
        (err) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                message: "Product deleted successfully!"
            });

        }
    );

});
app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});