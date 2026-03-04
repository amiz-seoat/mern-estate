import React, { useEffect, useState } from "react";
import { FaEnvelope, FaPaperPlane } from "react-icons/fa";
import Button from "./ui/Button";

export default function Contact({ listing }) {
  const [landlord, setLandLord] = useState(null);
  const [message, setMessage] = useState("");

  const onChange = (e) => {
    setMessage(e.target.value);
  };

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

  return (
    <>
      {landlord && (
        <div className="animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-estate-50 p-2 rounded-lg">
              <FaEnvelope
                className="h-4 w-4 text-estate-600"
                aria-hidden="true"
              />
            </div>
            <div>
              <p className="text-sm text-slate-600">
                Send a message to{" "}
                <span className="font-semibold text-slate-800">
                  {landlord.username}
                </span>{" "}
                about{" "}
                <span className="font-semibold text-slate-800">
                  {listing.name.toLowerCase()}
                </span>
              </p>
            </div>
          </div>

          <textarea
            name="message"
            id="message"
            rows="3"
            value={message}
            onChange={onChange}
            placeholder="Hi, I'm interested in this property. Could you share more details?"
            className="w-full border-2 border-slate-200 bg-slate-50/80 rounded-xl px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-estate-500 focus:bg-white focus:ring-4 focus:ring-estate-50 transition-colors resize-y min-h-[80px]"
            aria-label="Your message"
          />

          <Button
            onClick={() =>
              (window.location.href = `mailto:${
                landlord.email
              }?subject=Regarding ${listing.name}&body=${encodeURIComponent(
                message
              )}`)
            }
            className="mt-3"
          >
            <FaPaperPlane className="h-3.5 w-3.5" />
            Send Message
          </Button>
        </div>
      )}
    </>
  );
}
