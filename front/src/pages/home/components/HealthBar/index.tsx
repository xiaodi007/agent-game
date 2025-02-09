// src/components/HealthBar.jsx
import React from "react";

const HealthBar = ({ health, role }) => {
  const isAi = role === "ai";
  const maxHealth =isAi ? 6 : 4;
  const healthBars = Array.from({ length: maxHealth }, (_, index) => (
    <>
      {index < health ? (
        <img
          src="/assets/icon/heart1.png"
          width={isAi ? 20 : 30}
          style={{ objectFit: "fill" }}
        />
      ) : (
        <div
          className={`w-[30px] h-[28.7px] mr-[1px] border border-[#FFCCF5] bg-[#071432]`}
        ></div>
      )}
      {/* <div
        key={index}
        className={`w-4 h-5 mr-2 ${
          index < health
            ? `${role === "ai" ? "bg-[#df0748]" : "bg-[#26b2b9]"}`
            : "bg-[#7891b6]"
        }`}
      ></div> */}
    </>
  ));

  return <div className="flex">{healthBars}</div>;
};

export default HealthBar;
