import { sql } from "../utils/dbConnect.js";
import { poolRequest } from "../utils/dbConnect.js";
import bcrypt from 'bcrypt';
import jwt  from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config()

export const getEmployeeServices =async ()=>{
    try {
        const result =await poolRequest().query("SELECT * FROM Employee");
        return result.recordset;
        
    } catch (error) {
        return error.message;
    }
}


export const addEmployeeService = async (employee) => {
    try {
        const result = await poolRequest()
            // .input('EmployeeID', sql.VarChar, employee.EmployeeID)
            .input('FirstName', sql.VarChar, employee.FirstName)
            .input('LastName', sql.VarChar, employee.LastName)
            .input('Address', sql.VarChar, employee.Address)
            .input('DOB', sql.VarChar, employee.DOB)
            .input('Email', sql.VarChar, employee.Email)
            .input('PhoneNo',sql.VarChar,employee.PhoneNo)
            .input('Gender',sql.VarChar,employee.Gender)
            .input('Position',sql.VarChar,employee.Position)
            .input('Password', sql.VarChar, employee.Password)
            .input('Schedule', sql.VarChar, employee.Schedule)
            .input('PhotoURL', sql.VarChar, employee.PhotoURL)
            .input('Role', sql.VarChar, employee.Role)
            .query("USE PAYROLLDB; INSERT INTO Employee (FirstName, LastName, Address, DOB, Email, PhoneNo, Gender, Position, Password, Schedule, PhotoURL, Role)  VALUES (@FirstName, @LastName, @Address, @DOB, @Email, @PhoneNo, @Gender, @Position, @Password, @Schedule, @PhotoURL, @Role)");
            
        return result;
    } catch (error) {
        return error;
    }
}
export const getEmployeeByEmailService = async (Email) => {
    try {
      const result = await poolRequest()
        .input("Email", sql.VarChar(255), Email)
        .query("SELECT * FROM Employee WHERE Email = @Email");
   
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  };
 export  const findByCredentialsService = async (employee) => {
    try {
        const employeeFoundResponse = await poolRequest()
            .input('Email', sql.VarChar, employee.Email)
            .query('SELECT * FROM Employee WHERE Email=@Email ');

        if (employeeFoundResponse.recordset[0]) {
            const storedPassword = employeeFoundResponse.recordset[0].Password;
            const isPasswordValid = await bcrypt.compare(employee.Password, storedPassword);

            if (isPasswordValid) {
                const token = jwt.sign({
                    EmployeeID: employeeFoundResponse.recordset[0].EmployeeID,
                    Password: storedPassword,
                    Email: employeeFoundResponse.recordset[0].Email
                }, process.env.JWT_SECRET, { expiresIn: "24h" });

                console.log("Token is", token);
                const { Password,role, ...employeeData } = employeeFoundResponse.recordset[0];
                return { employee: employeeData, role:role, token: `JWT ${token}` };
            } else {
                return { error: 'Invalid Credentials' };
            }
        } else {
            return { error: 'Invalid Credentials' };
        }
    } catch (error) {
        return error;
    }
};

export const updateEmployeeService = async (employee) => {
    try {
        const result = await poolRequest()
         // .input('EmployeeID', sql.VarChar, employee.EmployeeID)
         .input('FirstName', sql.VarChar, employee.FirstName)
         .input('LastName', sql.VarChar, employee.LastName)
         .input('Address', sql.VarChar, employee.Address)
         .input('DOB', sql.VarChar, employee.DOB)
         .input('Email', sql.VarChar, employee.Email)
         .input('PhoneNo',sql.VarChar,employee.PhoneNo)
         .input('Gender',sql.VarChar,employee.Gender)
         .input('Position',sql.VarChar,employee.Position)
         .input('Password', sql.VarChar, employee.Password)
         .input('Schedule', sql.VarChar, employee.Schedule)
         .input('PhotoURL', sql.VarChar, employee.PhotoURL)
         .query("USE PAYROLLDB; UPDATE Employee SET FirstName= @FirstName,LastName=@LastName,Address=@Address,DOB=@DOB,Email=@Email,PhoneNo=@PhoneNo,Gender=@Gender, Position=@Position,Password=@Password,Schedule=@Schedule,PhotoURL=@PhotoURL");
        return result;
    } catch (error) {
        return error;
    }
}


export const deleteEmployeeService = async (EmployeeID) => {
    try {
        const result = await poolRequest()
            .input('EmployeeID', sql.VarChar, EmployeeID)
            .query("DELETE FROM Employee WHERE EmployeeID = @EmployeeID");

        if (result.rowsAffected[0] === 0) {
            throw new Error('User not found');
        }
        return result;
    } catch (error) {
        throw error;
    }
}
export const getEmployeeByIdService = async (EmployeeID) => {
    try {
        const result = await poolRequest()
            .input('EmployeeID', sql.VarChar, EmployeeID)
            .query("SELECT * FROM Employee WHERE EmployeeID =@EmployeeID");

        // Check if any user is found
        if (result.recordset.length === 0) {
            throw new Error('User not found');
        }

        // Return the first (and presumably only) user found
        return result.recordset[0];
    } catch (error) {
        throw error;
    }
}




