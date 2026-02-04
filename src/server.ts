import express, { Request, Response } from "express"
import {Pool} from "pg"
import dotenv from "dotenv"
import path, { join } from "path"

dotenv.config({ path:path.join(process.cwd(), ".env")})
const app = express()
const port = 5000;

const pool = new Pool({
    connectionString:`postgresql://neondb_owner:npg_3OfbcvlZ9YBD@ep-morning-rain-aixpxm1b-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require`
})

app.use(express.json())


const initDB = async ()=>{
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        age INT,
        phone VARCHAR(15),
        address TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS todos(
            id SERIAL PRIMARY KEY,
            user_id INT REFERENCES users(id) ON DELETE CASCADE,
            title VARCHAR(200) NOT NULL,
            description TEXT,
            completed BOOLEAN DEFAULT false,
            due_date DATE,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
            )
            `)
}
initDB()

app.get('/', (req:Request, res:Response) => {
  res.send('Hello World!')
})
app.post("/users", async(req:Request, res:Response)=>{
    const {name,email}=req.body;

    try {
        const result= await pool.query(
            `
            INSERT INTO users(name,email) VALUES($1,$2) RETURNING *
            `,[name,email]
        )
        res.status(201).json({
            success:true,
            message:"data inserted",
            data: result.rows[0]
        })
        
        
    } catch (err:any) {
        res.status(500).json({
            success:false,
            message:err.message
        })
        
    }
    
  
})

app.get('/users',async (req:Request,res:Response)=>{
    try {
        const result = await pool.query(`SELECT * FROM users`)

        res.status(201).json({
            success:true,
            message:"Users retrieved successfully",
            data:result.rows
        })
    } catch (err:any) {
        res.status(500).json({
            success:false,
            message:err.message,
            details:err
        })
    }
})

app.get("/users/:id",async(req:Request, res:Response)=>{
    try {
        const result = await pool.query(`SELECT * FROM users WHERE id =$1`,[req.params.id])

        if(result.rows.length === 0){
            res.status(404).json({
                 success:false,
            message:"User not found"
            })
        }else{
            res.status(200).json({
                success:true,
                message: "user fetched successfully",
                data:result.rows[0],
            })
        }
    } catch (err:any) {
        res.status(500).json({
            success:false,
            message:err.message
        })
    }
    
})
app.put("/users/:id",async(req:Request, res:Response)=>{
    const {name,email}=req.body;
    try {
        const result = await pool.query(

            `
            UPDATE users SET name=$1 email=$2 WHERE id =$3 RETURNING * 
            `, [name, email, req.params.id]
        );

        if(result.rows.length === 0){
            res.status(404).json({
                 success:false,
            message:"User not found"
            })
        }else{
            res.status(200).json({
                success:true,
                message: "user fetched successfully",
                data:result.rows[0],
            })
        }
    } catch (err:any) {
        res.status(500).json({
            success:false,
            message:err.message
        })
    }
    
})
app.delete("/users/:id",async(req:Request, res:Response)=>{
    // const {name,email}=req.body;
    try {
        const result = await pool.query(

            `
            DELETE FROM users WHERE id=$1 
            `, [req.params.id]
        );

        if(result.rows.length === 0){
            res.status(404).json({
                 success:false,
            message:"User not found"
            })
        }else{
            res.status(200).json({
                success:true,
                message: "user fetched successfully",
                data:result.rows[0],
            })
        }
    } catch (err:any) {
        res.status(500).json({
            success:false,
            message:err.message
        })
    }
    
})

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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
