require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();

app.use(cors());
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/posts", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("id, content, user_id, created_at");

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

app.post("/posts", async (req, res) => {
  try {
    const { content, user_id } = req.body;

    const { data, error } = await supabase
      .from("posts")
      .insert([{ content, user_id }])
      .select();

    if (error) throw error;

    res.status(201).json(data);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to create post"
    });
  }
});





const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);




