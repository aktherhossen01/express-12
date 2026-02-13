import express, { Request, Response } from "express"
import {Pool} from "pg"
import config from "./config";
import initDB, { pool } from "./config/db";
import { userRouter } from "./route/user.route";

const app = express()
const port = config.port;



app.use(express.json())



initDB()

app.get('/', (req:Request, res:Response) => {
  res.send('Hello World!')
})

app.use("/users",userRouter)


// app.get('/users',)

// app.get("/users/:id",)
// app.put("/users/:id",)
app.delete("/users/:id",)

// todos
app.post("/todos",async(req:Request, res:Response)=>{
    const {user_id, title}=req.body;

    try {
        const result = await pool.query(`INSERT INTO todos(user_id,title) VALUES ($1, $2)RETURNING *`, [user_id,title]);
        res.status(201).json({
            success:true,
            message:"Todo Created",
            data: result.rows[0]
        })
    } catch (err:any) {
        res.status(500).json({
            success:false,
            message:err.message,
           
        })
    }
})


// Get single todo
app.get("/todos/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM todos WHERE id = $1", [
      req.params.id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch todo" });
  }
});

// Update todo
app.put("/todos/:id", async (req, res) => {
  const { title, completed } = req.body;

  try {
    const result = await pool.query(
      "UPDATE todos SET title=$1, completed=$2 WHERE id=$3 RETURNING *",
      [title, completed, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to update todo" });
  }
});

// Delete todo
app.delete("/todos/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM todos WHERE id=$1 RETURNING *",
      [req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json({ success: true, message: "Todo deleted", data: null });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
