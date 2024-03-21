import { sql } from "../utils/dbConnect.js";
import { poolRequest } from "../utils/dbConnect.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config()


export const getAllPositionsService = async () => {
    try {
        const result = await poolRequest().query("SELECT * FROM Position"); // Assuming "Position" is the name of your positions table
        // return result.recordset;
        return result
    } catch (error) {
        throw error; // Rethrow the error to be caught and handled elsewhere
    }
}

export const getPositionByIdService = async (PositionID) => {
    try {
        const result = await poolRequest()
            .input('PositionID', sql.Int, PositionID)
            // .input('Position', sql.VarChar, Position)
            .query("SELECT * FROM Position WHERE PositionID = @PositionID");

        if (result.recordset.length === 0) {
            throw new Error('Position not found');
        }

        return result.recordset[0];
    } catch (error) {
        throw error;
    }
}

export const addPositionService = async (employeeID, position) => {
    try {
        const result = await poolRequest()
            .input('EmployeeID', sql.Int, employeeID)
            .input('Position', sql.VarChar, position)
            .query("INSERT INTO Position (EmployeeID, Position) VALUES (@EmployeeID, @Position)");

        return result;
    } catch (error) {
        throw error;
    }
}

export const updatePositionService = async (positionID, position) => {
    try {
        const result = await poolRequest()
            .input('PositionID', sql.Int, positionID)
            .input('Position', sql.VarChar, position)
            .query("UPDATE Position SET Position = @Position WHERE PositionID = @PositionID");

        return result;
    } catch (error) {
        throw error;
    }
}

export const deletePositionService = async (positionID) => {
    try {
        const result = await poolRequest()
            .input('PositionID', sql.Int, positionID)
            .query("DELETE FROM Position WHERE PositionID = @PositionID");

        if (result.rowsAffected[0] === 0) {
            throw new Error('Position not found');
        }

        return result;
    } catch (error) {
        throw error;
    }
}
