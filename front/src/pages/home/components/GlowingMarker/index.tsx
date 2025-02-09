import { motion } from 'framer-motion';
import React from "react";

const GlowingMarker = ({ left, top, label, onChange }) => {

    // 添加 CSS 样式
const styles = {
    '@keyframes ripple': {
      '0%': {
        transform: 'scale(0)',
        opacity: 1,
      },
      '100%': {
        transform: 'scale(3)',
        opacity: 0,
      },
    },
  };

  return (
    <motion.div
      onClick={onChange}
      className="absolute"
      style={{
        left: `${left}px`,
        top: `${top}px`,
        width: '12px',
        height: '12px',
        padding: '10px',
        backgroundColor: 'rgba(255, 255, 0, 0.6)',
        borderRadius: '50%',
        boxShadow: '0 0 10px rgba(255, 255, 0, 0.6)',
        transform: 'translate(-50%, -50%)',
      }}
      animate={{
        boxShadow: [
          '0 0 10px rgba(255, 255, 0, 0.8)',
          '0 0 20px rgba(255, 0, 0, 1)',
          '0 0 10px rgba(255, 0, 0, 0.5)',
        ],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut',
      }}
    >
         {/* 水波纹效果 */}
      <div
        className="absolute top-0 left-0 w-full h-full"
        style={{
          borderRadius: '50%',
          background: 'rgba(255, 255, 0, 0.5)',
          animation: 'ripple 1.5s infinite',
          pointerEvents: 'none',
        }}
      />
      <div
        className="absolute top-0 left-0 w-full h-full"
        style={{
          borderRadius: '50%',
          background: 'rgba(255, 255, 0, 0.3)',
          animation: 'ripple 2s infinite',
          pointerEvents: 'none',
        }}
      />
      <div
        className="absolute top-0 left-0 w-full h-full"
        style={{
          borderRadius: '50%',
          background: 'rgba(255, 255, 0, 0.05)',
          animation: 'ripple 2.5s infinite',
          pointerEvents: 'none',
        }}
      />
      <p
        className="absolute text-lg text-white"
        style={{
          top: '100%',
          left: '50%',
          width: 'max-content',
          transform: 'translateX(-50%)',
          marginTop: '5px',
        }}
      >
        {label}
      </p>
    </motion.div>
  );
};


export default GlowingMarker;
