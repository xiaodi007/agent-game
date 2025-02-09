import React, { useEffect, useState } from 'react';
import { tools } from '../../../../config/constants';
import { motion } from "framer-motion";

const ToolGroup = ({ data, items, onClick }) => {
  // 使用 cardCounts 状态来管理每种卡牌的数量及索引，初始值基于 items 计算
  const [cardCounts, setCardCounts] = useState({});

  useEffect(() => {
    const itemCounts = items.reduce((acc, item, index) => {
      if (!acc[item]) {
        acc[item] = { count: 0, indices: [] };
      }
      acc[item].count += 1;
      acc[item].indices.push(index + 1);
      return acc;
    }, {});

    setCardCounts(itemCounts);
  }, [items])

  // animatedCard 保存当前正在做抽牌动画的卡牌（每次只抽取一张）
  const [animatedCard, setAnimatedCard] = useState(null);

  // 处理卡牌点击：启动动画，同时减少该卡牌的数量
  const handleCardClick = (item, indices) => {
    onClick(item, indices, () => {
      // 设置抽牌动画（浮层形式显示）
      setAnimatedCard({ item, indices });
      // 更新卡牌数量：减少 count，同时删除最末一个索引
      setCardCounts(prev => {
        const newCounts = { ...prev };
        if (newCounts[item]) {
          const newCount = newCounts[item].count - 1;
          if (newCount <= 0) {
            delete newCounts[item];
          } else {
            newCounts[item] = {
              ...newCounts[item],
              count: newCount,
              indices: newCounts[item].indices.slice(0, -1)
            };
          }
        }
        return newCounts;
      });

    });

  };

  return (
    <>
      {/* 静态卡牌列表 */}
      {Object.entries(cardCounts).map(([item, { count, indices }]) => (
        <div key={item} className="relative inline-block">
          <img
            width={120}
            style={{ objectFit: "fill" }}
            onClick={() => handleCardClick(item, indices)}
            src={`/assets/${tools[item]?.img}`}
            alt={`card ${item}`}
          />
          {count > 1 && (
            <div className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
              {count}
            </div>
          )}
        </div>
      ))}

      {/* 抽牌动画：当点击后显示一个浮层卡牌做动画 */}
      {animatedCard && (
        <motion.img
          width={120}
          style={{
            objectFit: "fill",
            position: 'absolute',
            zIndex: 1000,
            pointerEvents: 'none', // 防止动画期间触发鼠标事件
          }}
          src={`/assets/${tools[animatedCard.item]?.img}`}
          alt={`animated card ${animatedCard.item}`}
          initial={{ scale: 1, opacity: 1, rotate: 0, y: 0 }}
          whileHover={{ translateY: -10 }}
          animate={{
            y: -300,         // 向上飞出
            rotate: 360,     // 旋转360度
            scale: 0.5,      // 同时缩小
            opacity: 0       // 渐渐消失
          }}
          transition={{ type: "spring", stiffness: 300, damping: 50, duration: 0.8 }}
          onAnimationComplete={() => setAnimatedCard(null)}  // 动画完成后清除动画卡牌
        />
      )}
    </>
  );
};

export default ToolGroup;
