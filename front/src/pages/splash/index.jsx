import {
  ConnectButton,
  useCurrentAccount,
  useSuiClientQuery,
  useSignAndExecuteTransactionBlock,
  useSuiClient,
} from "@mysten/dapp-kit";
import { useState, useEffect, useRef } from "react";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { TypeAnimation } from "react-type-animation";
import { PACKAGE_ID, ROLES } from "../../config/constants";
import AudioPlay from "../../components/AudioPlay";

import { useNavigate } from "react-router-dom";
import "./index.less";

const typeTextStyle = {
  whiteSpace: "pre-line",
  height: "30px",
  display: "inline-block",
  fontSize: 13,
  color: "white",
  paddingTop: 10,
  paddingLeft: 10,
};
const Splash = () => {
  const [showLoading, setShowLoading] = useState(false);
  const navigate = useNavigate();
  const client = useSuiClient();

  let counterPackageId = PACKAGE_ID;

  const { mutate: signAndExecute } = useSignAndExecuteTransactionBlock();

  useEffect(() => {
    // 随机生成角色
    const randomIndex = Math.floor(Math.random() * 6) + 1;
    const role = ROLES[randomIndex - 1];
    localStorage.setItem("role", JSON.stringify(role));
  }, []);

  function StartGameBtnWrapper() {
    const account = useCurrentAccount();

    if (!account) {
      return null;
    }

    return (
      <div onClick={handleInitGame}>
        {/* <div
          className="startGameBtn w-[280px] m-auto p-2 border border-white text-center cursor-pointer"
        >
          开始游戏
        </div> */}
        <img src="/assets/btn/start.png" className="hover:scale-105 transition-transform duration-300 m-auto cursor-pointer" />
        {showLoading && firstLoadTextWrapper()}
      </div>
    );
  }

 async function handleInitGame() {
    const txb = new TransactionBlock();
    // txb.setSender('0x67856930d275218936b720bdcbcb251e735a2c4f1a3800f098bab85426c0fe1b')
    setShowLoading(true);

    txb.moveCall({
      arguments: [
        txb.object("0x8"), // r: &Random
      ],
      target: `${counterPackageId}::game::rollDice`,
    });
    const dryRunRes = await client.dryRunTransactionBlock({
      transactionBlock: await txb.build({ client }),
    });
    if (dryRunRes.effects.status.status === "failure") {
      return;
    }
    signAndExecute(
      {
        transactionBlock: txb,
        options: {
          showEffects: true,
          showObjectChanges: true,
        },
      },
      {
        onSuccess: (tx) => {
          client
            .waitForTransactionBlock({
              digest: tx.digest,
            })
            .then(() => {
              const objectId = tx.effects?.created?.[0]?.reference?.objectId;
              localStorage.setItem("gameId", objectId + "");

              navigate("/character");
            });
        },
        onError: (e) => {
          console.error(e);
        },
      }
    );
  }

  const firstLoadTextWrapper = () => {
    return (
      <TypeAnimation
        style={typeTextStyle}
        omitDeletionAnimation={true}
        speed={40}
        sequence={[`Open Sui wallet to confirm the transaction...`, 5000, `Coming soon, please wait...`]}
      />
    );
  };
  return (
    <div className="startPage w-full h-screen py-6 relative">
      {/* <div className="absolute top-[20px] m-auto"> */}
      {/* <img src="/assets/title.png" className="w-[300px] m-auto mb-10" /> */}
      {/* <div className="description">
        这种方法确保了在用户交互后音频才会播放，符合现代浏览器的自动播放策略。您可以根据需要添加更多的控制，例如暂停、停止、调整音量等。
      </div> */}
      {/* 标题 */}
      <div className=" m-auto absolute top-[200px] left-[50%] translate-x-[-50%] font-bold text-[66px]">
      Apocalyptic World
      </div>
      <div className="w-[300px] m-auto absolute bottom-40 left-[50%] translate-x-[-50%]">
        <div className=" pb-4 flex justify-center align-middle">
          <p className=" pt-3 text-lg">Player：</p>
          <ConnectButton connectText="Connect the SUI wallet" />
        </div>
        <StartGameBtnWrapper />
      </div>
      <div className="absolute top-3 right-3">
        <AudioPlay src="/assets/music/rush1.mp3"/>
      </div>
    </div>
  );
};

export default Splash;
