import React, { useState } from 'react';
import { tools } from '../../../../config/constants';
import { motion } from "framer-motion";

const ToolGroup = ({ data, items, onClick }) => {
  const [animatedCards, setAnimatedCards] = useState({}); // 每张卡牌的状态管理
  
  // 使用对象来计算每个道具的数量，并记录每个道具的索引
  const itemCounts = items.reduce((acc, item, index) => {
    if (!acc[item]) {
      acc[item] = { count: 0, indices: [] };
    }
    acc[item].count += 1;
    acc[item].indices.push(index + 1);
    return acc;
  }, {});

  // 处理点击卡牌，触发动画
  const handleCardClick = (item, indices) => {
    if (data?.leader !== "人类" || data?.gameOver) return;
    
    setAnimatedCards(prevState => ({
      ...prevState,
      [item]: { ...prevState[item], active: true, visible: true } // 设置卡牌为活动并可见
    }));
    onClick(item, indices); // 执行外部回调
  };

  // 动画结束后隐藏卡牌
  const handleAnimationComplete = (item) => {
    return
    setAnimatedCards(prevState => ({
      ...prevState,
      [item]: { ...prevState[item], visible: false } // 动画完成后隐藏卡牌
    }));
  };

  return (
    <>
      {Object.entries(itemCounts).map(([item, { count, indices }]) => (
        <div key={item} className="relative inline-block">
          {/* {!animatedCards[item]?.visible && (  // 初始状态时显示卡牌，动画后隐藏 */}
            <motion.img
              width={120}
              className="box"
              data-state={animatedCards[item]?.active ? "true" : "false"}
              style={{ objectFit: "fill" }}
              onClick={() => handleCardClick(item, indices)}  // 点击触发动画
              src={`/assets/${tools[item]?.img}`}
              initial={{ scale: 1, rotate: 0 }}
              whileHover={{ scale: 1.1, translateY: -10 }}
              whileTap={{ scale: 0.9 }}
              animate={{
                display: animatedCards[item]?.active ? 'none' : 'block',
                y: animatedCards[item]?.active ? -300 : 0,   // 向上飞出
                rotate: animatedCards[item]?.active ? 360 : 0, // 旋转
                scale: animatedCards[item]?.active ? 0.5 : 1, // 旋转
              }}
              transition={{ type: "spring", stiffness: 300, damping: 50 }}
              onAnimationComplete={() => handleAnimationComplete(item)}  // 动画完成后隐藏
            />
          {/* )} */}

          {count > 1 && (
            <div className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
              {count}
            </div>
          )}

          <style>
            {`
              .box {
                transition: transform 0.5s ease-out;
              }

              .box[data-state="true"] {
                transform: translateY(-500px) rotate(360deg) scale(0.2);
              }
            `}
          </style>
        </div>
      ))}
    </>
  );
};

export default ToolGroup;
