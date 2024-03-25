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
    Role VARCHAR(10)
);
 select * from Employee
 -- Employees table

 DROP TABLE Employee

CREATE TABLE Attendance (
    AttendanceID INT IDENTITY(1,1) PRIMARY KEY,
    EmployeeID INT,
    CreatedDate DATETIME,
    TimeIn DATETIME,
    TimeOut DATETIME,
    FOREIGN KEY (EmployeeID) REFERENCES Employee(EmployeeID)
);
Drop Table Attendance
SELECT * FROM Attendance
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
    CreatedDate DATETIME,
    Hours INT,
    Minutes INT,
    Rate DECIMAL(10,2),
    FOREIGN KEY (EmployeeID) REFERENCES Employee(EmployeeID)
);

select * from Overtime
DROP TABLE Overtime

-- Create Friendship Table
CREATE TABLE AdvanceCash (
    AdvanceCashID INT IDENTITY(1,1) PRIMARY KEY,
    EmployeeID INT,
    Date DATE,
    Amount DECIMAL(10,2),
    FOREIGN KEY (EmployeeID) REFERENCES Employee(EmployeeID)
);
DROP TABLE AdvanceCash

SELECT * FROM AdvanceCash
-- Insert dummy data into the AdvanceCash table
INSERT INTO AdvanceCash (EmployeeID, Date, Amount)
VALUES
    (2, '2024-03-01', 500.00),
    (3, '2024-03-02', 700.00)


-- Create Photo Table
CREATE TABLE Schedule (
    ScheduleID  INT IDENTITY(1,1) PRIMARY KEY,
    EmployeeID INT,
    StartTime TIME,
    EndTime TIME,
    Duration VARCHAR(50), -- Define Duration column with appropriate length
    Days VARCHAR(255),
    FOREIGN KEY (EmployeeID) REFERENCES Employee(EmployeeID)
);


SELECT * FROM Schedule
DROP TABLE Schedule

-- Create Group Table
CREATE TABLE Deduction (
    DeductionID INT IDENTITY(1,1) PRIMARY KEY,
    EmployeeID INT,
    NHIF DECIMAL(12,2),
    NSSF DECIMAL(12,2),
    PAYE DECIMAL(12,2),
    TotalDeductions DECIMAL(12,2),
    FOREIGN KEY (EmployeeID) REFERENCES Employee(EmployeeID)
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
     NHIF DECIMAL(12,2),
    NSSF DECIMAL(12,2),
    PAYE DECIMAL(12,2),
    TotalDeductions DECIMAL(12,2),
    GrossPay DECIMAL(10,2),
    NetPay DECIMAL(10,2),
    PayrollDate DATE,
    FOREIGN KEY (EmployeeID) REFERENCES Employee(EmployeeID)
);
DROP TABLE Payroll
SELECT * FROM Payroll

INSERT INTO Position (PositionID) VALUES
(1, 'Manager'),
(2, 'Cashier'),
(3, 'Sales Associate');



	CREATE TABLE Attendance (
    AttendanceID INT IDENTITY(1,1) PRIMARY KEY,
    EmployeeID INT,
    CraetedDate DATETIME,
    TimeIn TIME,
    TimeOut TIME,
    FOREIGN KEY (EmployeeID) REFERENCES Employee(EmployeeID)
);
SELECT * FROM Attendance
DROP table Attendance

INSERT INTO Overtime (EmployeeID, Date, Hours, Minutes, Rate)
VALUES
    (1, '2024-03-19 18:30:00', 2, 30, 20.50),
    (2, '2024-03-19 21:45:00', 3, 15, 25.75)

SELECT * FROM Payroll

INSERT INTO Payroll (EmployeeID, GrossPay, Deductions, NetPay, PayrollDate)
VALUES
    (1, 5000.00, 500.00, 4500.00, '2024-01-05'),
    (2, 6000.00, 600.00, 5400.00, '2024-01-10'),
    (3, 7000.00, 700.00, 6300.00, '2024-01-15')

	Select * from Position

	INSERT INTO Schedule (EmployeeID, StartTime, EndTime, Days)
VALUES 
    (1, '08:00:00', '17:00:00', 'Monday, Wednesday, Friday'),
    (2, '09:00:00', '18:00:00', 'Tuesday, Thursday')



SELECT Payroll.*, E.*, P.*, A.*
    FROM Payroll
    JOIN
    Employee E ON E.EmployeeID = Payroll.EmployeeID
    JOIN
    Position P ON E.EmployeeID = P.EmployeeID
    JOIN
    AdvanceCash A ON E.EmployeeID = A.EmployeeID
    WHERE EmployeeID = 3;