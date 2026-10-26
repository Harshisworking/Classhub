import nodemailer from 'nodemailer';

export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail', // Or your preferred SMTP provider
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD, // Use App Passwords for Gmail
            },
        });
    }

    public async sendSubmissionAlert(studentName: string, assignmentName: string): Promise<void> {
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: process.env.TEACHER_EMAIL, // Your notification email
            subject: `ClassHub: New Submission - ${assignmentName}`,
            text: `${studentName} just submitted their work for "${assignmentName}".\n\nLog in to ClassHub to review it.`,
        };

        try {
            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.error("Failed to send notification email:", error);
            throw new Error("Email dispatch failed");
        }
    }

    public async sendNewAssignedAlert(type:string,studentMail:string,assignmentText:string,assignmentSubject: string, assignmentTitle: string): Promise<void> {
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: studentMail, // Your notification email
            subject: `ClassHub: New ${type} - ${assignmentTitle}`,
            text: `New ${type} just been assigned.\n\nLog in to ClassHub to review it.\n\n Title:-${assignmentTitle}\nSubject:-${assignmentSubject}\nWork:-${assignmentText}`,
        };

        try {
            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.error("Failed to send notification email:", error);
            throw new Error("Email dispatch failed");
        }
    }
}