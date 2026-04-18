require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
const bcrypt = require("bcrypt");
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

  app.post("/signup", async (req, res) => {
    try {
      const { user_id, password } = req.body;
      const password_hash = await bcrypt.hash(password, 10);
      const { data, error } = await supabase
        .from("users")
        .insert([
          {
            user_id,
            password_hash
          }
        ])
        .select();
      if (error) throw error;
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: "Signup failed" });
    }


  });





});

app.post("/signup", async (req, res) => {
  try {
    const { user_id, password } = req.body;
    const password_hash = await bcrypt.hash(password, 10);
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          user_id,
          password_hash
        }
      ])
      .select();
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Signup failed" });
  }
});



app.post("/login", async (req, res) => {
  try {
    const { user_id, password } = req.body;
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("user_id", user_id)
      .single();
    if (error || !data) {
      return res.status(401).json({ error: "Invalid username" });
    }
    const valid = await bcrypt.compare(password, data.password_hash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid password" });
    }
    res.json({
      success: true,
      user_id: data.user_id
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }

});





const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);


