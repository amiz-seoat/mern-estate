import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaEnvelope, FaPaperPlane } from "react-icons/fa";
import toast from "react-hot-toast";
import Button from "./ui/Button";

export default function Contact({ listing }) {
  const { currentUser } = useSelector((state) => state.user);
  const [landlord, setLandLord] = useState(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const fetchLandLord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setLandLord(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandLord();
  }, [listing.userRef]);

  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast.error("Please enter a message.");
      return;
    }

    setSending(true);
    try {
      const res = await fetch("/api/message/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          recipientId: listing.userRef,
          listingId: listing._id,
          message: message.trim(),
        }),
      });

      const data = await res.json();
      if (data.success === false) {
        toast.error(data.message || "Failed to send message.");
        return;
      }

      toast.success("Message sent successfully!");
      setSent(true);
      setMessage("");
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {landlord && (
        <div className="animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-estate-50 dark:bg-estate-900/50 p-2 rounded-lg">
              <FaEnvelope
                className="h-4 w-4 text-estate-600"
                aria-hidden="true"
              />
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Send a message to{" "}
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {landlord.username}
                </span>{" "}
                about{" "}
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {listing.name.toLowerCase()}
                </span>
              </p>
            </div>
          </div>

          {sent ? (
            <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 text-center">
              <p className="text-emerald-700 font-medium text-sm">
                Your message has been sent! The landlord will receive it via email.
              </p>
              <button
                onClick={() => setSent(false)}
                className="text-sm text-estate-600 hover:text-estate-700 font-medium mt-2 cursor-pointer"
              >
                Send another message
              </button>
            </div>
          ) : (
            <>
              <textarea
                name="message"
                id="message"
                rows="3"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Hi, I'm interested in this property. Could you share more details?"
                className="w-full border-2 border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 rounded-xl px-4 py-3 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-estate-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-estate-50 dark:focus:ring-estate-900/30 transition-colors resize-y min-h-[80px]"
                aria-label="Your message"
                maxLength={2000}
              />

              <Button
                onClick={handleSendMessage}
                loading={sending}
                disabled={sending || !message.trim()}
                className="mt-3"
              >
                <FaPaperPlane className="h-3.5 w-3.5" />
                {sending ? "Sending..." : "Send Message"}
              </Button>

              {!currentUser && (
                <p className="text-xs text-slate-400 mt-2">
                  You must be signed in to send a message.
                </p>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
}
