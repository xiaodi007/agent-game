// src/components/CurrentPlayerRing.jsx
import React from "react";
import { motion } from "framer-motion";
// import './index.less'

const CurrentPlayerRing = ({ show }) => {
  return (
    <>
      {show && (
        // <div className="playerRing w-full absolute left-0 top-[80px] px-2 ">
        //   <img
        //     width={120}
        //     style={{ objectFit: "fill" }}
        //     src={`/assets/role/ring.webp`}
        //   />
        // </div>
        <motion.img
          width={140}
          style={{ objectFit: "fill", height: 160 }}
          className="mt-4 absolute top-[-10px] left-0"
          src={`/assets/icon/role_active.png`}
          animate={{
            scale: [1.2, 1.3, 1.2],
            opacity: [1, 0.6, 0.8]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </>
  );
};

export default CurrentPlayerRing;
