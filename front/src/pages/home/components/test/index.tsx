import React from 'react';

export default function GlowingBorderDiv() {
  return (
    <div className="container">
      <div className="glow-border">
        <p>流光边框效果</p>
      </div>
      <style jsx>{`
        .container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: #111;
        }
        .glow-border {
          position: relative;
          padding: 20px 40px;
          border: 2px solid #fff;
          border-radius: 10px;
          background: #222;
          color: #fff;
          z-index: 1;
          overflow: hidden;
        }
        /* 使用伪元素实现流光边框效果 */
        .glow-border::before {
          content: "";
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg, red, yellow, blue, green, purple);
          background-size: 400% 400%;
          filter: blur(8px);
          animation: flow 3s linear infinite;
          z-index: -1;
        }
        /* 限制伪元素只显示在边框区域内 */
        .glow-border::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: #222;
          z-index: -1;
          border-radius: 10px;
        }
        /* 流光动画 */
        @keyframes flow {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  );
}
