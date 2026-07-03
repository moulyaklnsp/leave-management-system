import nodemailer from "nodemailer";
import env from "../config/env.js";
import logger from "../config/logger.js";
import prisma from "../config/prisma.js";

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: false,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

async function sendMail({ to, subject, html }) {
  if (!env.SMTP_USER || !env.SMTP_PASS) {
    logger.info(`[Email skipped - SMTP not configured] To: ${to} | Subject: ${subject}`);
    return;
  }
  try {
    await transporter.sendMail({ from: env.EMAIL_FROM || env.SMTP_USER, to, subject, html });
    await prisma.emailLog.create({ data: { recipient: to, subject, status: "SENT" } });
    logger.info(`Email sent to ${to}: ${subject}`);
  } catch (err) {
    await prisma.emailLog.create({ data: { recipient: to, subject, status: "FAILED" } });
    logger.error(`Email failed to ${to}: ${err.message}`);
  }
}

export async function sendLeaveAppliedEmail(employee, leave) {
  await sendMail({
    to: employee.email,
    subject: "Leave Request Submitted",
    html: `
      <h2>Leave Request Submitted</h2>
      <p>Hi ${employee.firstName},</p>
      <p>Your <strong>${leave.leaveType}</strong> leave request has been submitted successfully.</p>
      <ul>
        <li><strong>From:</strong> ${new Date(leave.startDate).toDateString()}</li>
        <li><strong>To:</strong> ${new Date(leave.endDate).toDateString()}</li>
        <li><strong>Days:</strong> ${leave.totalDays}</li>
        <li><strong>Status:</strong> PENDING</li>
      </ul>
      <p>You will be notified once your manager reviews the request.</p>
    `,
  });
}

export async function sendLeaveApprovedEmail(employee, leave) {
  await sendMail({
    to: employee.email,
    subject: "Leave Request Approved ✅",
    html: `
      <h2>Leave Request Approved</h2>
      <p>Hi ${employee.firstName},</p>
      <p>Your <strong>${leave.leaveType}</strong> leave request has been <strong style="color:green">approved</strong>.</p>
      <ul>
        <li><strong>From:</strong> ${new Date(leave.startDate).toDateString()}</li>
        <li><strong>To:</strong> ${new Date(leave.endDate).toDateString()}</li>
        <li><strong>Days:</strong> ${leave.totalDays}</li>
      </ul>
      <p>Enjoy your time off!</p>
    `,
  });
}

export async function sendLeaveRejectedEmail(employee, leave, managerComments) {
  await sendMail({
    to: employee.email,
    subject: "Leave Request Rejected ❌",
    html: `
      <h2>Leave Request Rejected</h2>
      <p>Hi ${employee.firstName},</p>
      <p>Your <strong>${leave.leaveType}</strong> leave request has been <strong style="color:red">rejected</strong>.</p>
      <ul>
        <li><strong>From:</strong> ${new Date(leave.startDate).toDateString()}</li>
        <li><strong>To:</strong> ${new Date(leave.endDate).toDateString()}</li>
        <li><strong>Reason:</strong> ${managerComments}</li>
      </ul>
      <p>Please contact your manager for more details.</p>
    `,
  });
}
