"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";

// Dynamically import react-qr-code so it only runs on the client
const QRCode = dynamic(() => import("react-qr-code"), { ssr: false });

interface QrModalProps {
  ticketId: string;
}

const QrModal: React.FC<QrModalProps> = ({ ticketId }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      {/* Button that opens the modal */}
      <Button variant="outline" onClick={handleOpen}>
        Show QR
      </Button>

      {/* Our basic modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-sm rounded bg-white p-6 shadow-xl">
            {/* Close button */}
            <button
              className="absolute right-3 top-3 text-black"
              onClick={handleClose}
            >
              X
            </button>

            <h3 className="mb-4 text-center text-xl font-bold">
              Your Ticket QR
            </h3>

            {/* Generate the QR code based on ticketId or any unique value */}
            <div className="flex justify-center">
              <QRCode value={`ticket-${ticketId}`} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QrModal;
