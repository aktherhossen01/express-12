import { Request, Response } from "express";
import { pool } from "../config/db";
import { userServices } from "./user.service";

const createUser =async(req:Request, res:Response)=>{
    const {name,email}=req.body;

    try {
        const result= await userServices.createUser(name,email)
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
    
  
}

const getUser = async (req:Request,res:Response)=>{
    try {
        const result =await userServices.getUser()

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
}

const getSingleUser = async()=>{
    async(req:Request, res:Response)=>{
        try {
            const result =await userServices.getSingleUser(req.params.id as string) ;
    
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
        
    }
}

const updateUser = async()=>{
    async(req:Request, res:Response)=>{
        const {name,email}=req.body;
        try {
            const result = await userServices.updateUser(name,email,req.params.id as string) ;
    
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
        
    }
}

const userDelete = 
    async(req:Request, res:Response)=>{
        // const {name,email}=req.body;
        try {
            const result = await userServices.UserDelete(req.params.id as string) ;
    
            if(result.rows?.length === 0){
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
        
    }


export const userControllers={
    createUser,
    getUser,
    getSingleUser,updateUser,userDelete
}