Use PAYROLLDB
CREATE DATABASE PAYROLLDB;
USE PAYROLLDB;
CREATE TABLE Employee (
    EmployeeID INT IDENTITY(1,1) PRIMARY KEY,
    FirstName VARCHAR(255) NOT NULL,
    LastName VARCHAR(255) NOT NULL,
    Address VARCHAR(255) NOT NULL,
    DOB DATE NOT NULL, -- Changed to DATE
    Email VARCHAR(255) NOT NULL,
    PhoneNo VARCHAR(25) NOT NULL,
    Gender VARCHAR(50),
    Position VARCHAR(255),
	Password VARCHAR(255),
    Schedule VARCHAR(255) NOT NULL,
    PhotoURL VARCHAR(255),
    Role VARCHAR(10)
);
 select * from Employee
 -- Employees table

 DROP TABLE Employee

CREATE TABLE Attendance (
    AttendanceID INT IDENTITY(1,1) PRIMARY KEY,
    EmployeeID INT,
    Date DATE,
    TimeIn TIME,
    TimeOut TIME,
    FOREIGN KEY (EmployeeID) REFERENCES Employee(EmployeeID)
);
Drop Table Attendance
-- Insert dummy data
INSERT INTO Attendance (EmployeeID, Date, TimeIn, TimeOut)
VALUES
    (2, '2024-03-17', '08:00:00', '17:00:00');
    -- (2, '2024-03-17', '09:15:00', '18:30:00');
    -- (3, '2024-03-17', '08:30:00', '16:45:00');
    select *  from Attendance

DROP TABLE Attendance

-- Create Comment Table
CREATE TABLE Overtime (
    OvertimeID INT IDENTITY(1,1) PRIMARY KEY,
    EmployeeID INT,
    Date DATE,
    Hours INT,
    Minutes INT,
    Rate DECIMAL(10,2),
    FOREIGN KEY (EmployeeID) REFERENCES Employee(EmployeeID)
);

select * from Overtime
DROP TABLE Overtime

-- Create Friendship Table
CREATE TABLE AdvanceCash (
    AdvanceCash INT IDENTITY(1,1) PRIMARY KEY,
    EmployeeID INT,
    Date DATE,
    Amount DECIMAL(10,2),
    FOREIGN KEY (EmployeeID) REFERENCES Employee(EmployeeID)
);
DROP TABLE AdvanceCash


-- Create Photo Table
CREATE TABLE Schedule (
    ScheduleID  INT IDENTITY(1,1) PRIMARY KEY,
    EmployeeID INT,
    StartTime TIME,
    EndTime TIME,
    Days VARCHAR(255),
    FOREIGN KEY (EmployeeID) REFERENCES Employee(EmployeeID)
);

SELECT * FROM Schedule
DROP TABLE Schedule

-- Create Group Table
CREATE TABLE Deduction (
    DeductionID INT IDENTITY(1,1) PRIMARY KEY,
    EmployeeID INT,
    AdvanceCashID INT,
    NHIF VARCHAR(255),
    NSSF VARCHAR(255),
    PAYE DECIMAL(10,2),
    FOREIGN KEY (EmployeeID) REFERENCES Employee(EmployeeID),
    FOREIGN KEY (AdvanceCashID) REFERENCES AdvanceCash(AdvanceCashID)
);

select * FROM Deduction
Drop TABLE Deduction


CREATE TABLE Position (
    PositionID INT IDENTITY(1,1) PRIMARY KEY,
    EmployeeID INT,
    Position VARCHAR(255),
    FOREIGN KEY (EmployeeID) REFERENCES Employee(EmployeeID)
)
Drop TABLE Position
Select * from Position
CREATE TABLE Payroll (
    PayrollID INT IDENTITY(1,1) PRIMARY KEY,
    EmployeeID INT,
    GrossPay DECIMAL(10,2),
    Deductions DECIMAL(10,2),
    NetPay DECIMAL(10,2),
    PayrollDate DATE,
    FOREIGN KEY (EmployeeID) REFERENCES Employee(EmployeeID)
);
DROP TABLE Payroll


INSERT INTO Position (PositionID) VALUES
(1, 'Manager'),
(2, 'Cashier'),
(3, 'Sales Associate');