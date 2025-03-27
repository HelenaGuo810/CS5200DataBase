/*
  Warnings:

  - You are about to drop the `Tweet` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Tweet` DROP FOREIGN KEY `Tweet_userId_fkey`;

-- DropTable
DROP TABLE `Tweet`;

-- DropTable
DROP TABLE `User`;

-- CreateTable
CREATE TABLE `Student` (
    `StudentID` INTEGER NOT NULL AUTO_INCREMENT,
    `FirstName` VARCHAR(191) NOT NULL,
    `LastName` VARCHAR(191) NOT NULL,
    `TargetSchool` VARCHAR(191) NULL,
    `Track` VARCHAR(191) NULL,
    `Email` VARCHAR(191) NOT NULL,
    `Password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Student_Email_key`(`Email`),
    PRIMARY KEY (`StudentID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Mentor` (
    `MentorID` INTEGER NOT NULL AUTO_INCREMENT,
    `FirstName` VARCHAR(191) NOT NULL,
    `LastName` VARCHAR(191) NOT NULL,
    `Specialization` VARCHAR(191) NULL,
    `Availability` VARCHAR(191) NULL,
    `Email` VARCHAR(191) NOT NULL,
    `Password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Mentor_Email_key`(`Email`),
    PRIMARY KEY (`MentorID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Appointment` (
    `AppointmentID` INTEGER NOT NULL AUTO_INCREMENT,
    `StudentID` INTEGER NOT NULL,
    `MentorID` INTEGER NOT NULL,
    `Date` DATETIME(3) NOT NULL,
    `Time` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`AppointmentID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_StudentID_fkey` FOREIGN KEY (`StudentID`) REFERENCES `Student`(`StudentID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_MentorID_fkey` FOREIGN KEY (`MentorID`) REFERENCES `Mentor`(`MentorID`) ON DELETE RESTRICT ON UPDATE CASCADE;
