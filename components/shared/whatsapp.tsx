import React from "react";
import Image from "next/image";

const Whatsapp = () => {
  return (
    <div className="fixed bottom-16 right-4 cursor-pointer">
      <a 
        href={
          "https://api.whatsapp.com/send/?phone=998917767714&text&type=phone_number&app_absent=0"
        }
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image src="/whatsapp.png" alt="WhatsApp" width={40} height={40} className="mb-2" />
      </a>
    </div>
  );
};

export default Whatsapp;
