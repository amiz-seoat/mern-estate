import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendMessage = async (req, res, next) => {
  try {
    const { recipientId, listingId, message } = req.body;
    const senderId = req.user.id;

    if (!recipientId || !listingId || !message?.trim()) {
      return next(errorHandler(400, "Recipient, listing, and message are required."));
    }

    if (message.trim().length > 2000) {
      return next(errorHandler(400, "Message is too long (max 2000 characters)."));
    }

    const [sender, recipient, listing] = await Promise.all([
      User.findById(senderId),
      User.findById(recipientId),
      Listing.findById(listingId),
    ]);

    if (!recipient) return next(errorHandler(404, "Recipient not found."));
    if (!listing) return next(errorHandler(404, "Listing not found."));

    const saved = await Message.create({
      senderRef: senderId,
      recipientRef: recipientId,
      listingRef: listingId,
      message: message.trim(),
    });

    try {
      await transporter.sendMail({
        from: `"AmizEstate" <${process.env.EMAIL_USER}>`,
        to: recipient.email,
        subject: `New inquiry about "${listing.name}" — AmizEstate`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#f8fafc;border-radius:16px;">
            <h2 style="color:#0e2240;margin:0 0 8px;">New Message About Your Listing</h2>
            <p style="color:#64748b;font-size:15px;line-height:1.6;">
              <strong>${sender?.username || "A user"}</strong> (${sender?.email || "unknown"}) sent you a message about <strong>${listing.name}</strong>:
            </p>
            <blockquote style="margin:16px 0;padding:12px 16px;background:#fff;border-left:4px solid #0e2240;border-radius:8px;color:#334155;font-size:14px;line-height:1.6;">
              ${message.trim().replace(/\n/g, "<br>")}
            </blockquote>
            <p style="color:#94a3b8;font-size:13px;">You can reply directly to ${sender?.email || "the sender"}.</p>
          </div>
        `,
      });
    } catch {
      // Email delivery is best-effort; message is already saved
    }

    res.status(201).json({ success: true, message: "Message sent successfully.", data: saved });
  } catch (error) {
    next(error);
  }
};
