import { useSuiClientQuery } from "@mysten/dapp-kit";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";


import "./index.less";
import AudioPlay from "../../components/AudioPlay";
import SelectedTools from "./components/SelectedTools";
import { TypeAnimation } from "react-type-animation";
import HealthBar from "./components/HealthBar";
import ToolGroup from "./components/ToolGroup";
import CurrentPlayerRing from "./components/CurrentPlayerRing";
import GrowDoor from "./components/GrowDoor";
import GlowingBorderDiv from './components/test'
import GameLife from "./action/GameLife";
import { characters, localization } from "../../config/constants";
import { waitTime } from "../../utils/utils";

const typeTextStyle = {
  whiteSpace: "pre-line",
  height: "160px",
  display: "block",
  fontSize: 16,
  color: "white",
};

const Home = () => {
  const [step, setStep] = useState();
  const [gameId, setGameId] = useState(0);
  const [game, setGame] = useState();
  const [character, setCharacter] = useState(); // 玩家性格
  const [scene, setScene] = useState(); // 场景
  const [usingTools, setUsingTools] = useState([]);
  const [usingToolTip, setUsingToolTip] = useState({});
  const [ignored, forceUpdate] = useState(0); // 用于强制更新组件
  const [currentRole, setCurrentRole] = useState({});
  const [aiSpeak, setAiSpeak] = useState();
  const [toolSelectedModalOpen, setToolSelectedModalOpen] = useState(false);
  const [isShowAiSpeak, setIsShowAiSpeak] = useState(false);

  const navigate = useNavigate();

  const { data, isPending, error, refetch } = useSuiClientQuery("getObject", {
    id: gameId,
    options: {
      showContent: true,
      showOwner: true,
    },
  });

  useEffect(() => {
    const gameId = localStorage.getItem("gameId");
    const role = JSON.parse(localStorage.getItem("role") || "{}");
    console.log(role);
    setGameId(gameId);
    setCurrentRole(role);

    // 加载玩家和场景
    initGameInfo();
  }, []);

  useEffect(() => {
    console.log("effect: ", game);
    game?.setEventListener("onGameEvent", async (name, data) => {
      // console.log('onGameEvent: ', name, data);
      if (
        name === "useTool" ||
        name === "roundResult" ||
        name === "resetWorld"
      ) {
        setUsingToolTip(data);
        setToolSelectedModalOpen(true);
      } else if (name === "aiSpeek") {
        setAiSpeak(data);
        setIsShowAiSpeak(true);
        setTimeout(() => {
          setIsShowAiSpeak(false);
        }, 7000);
      } else if (name === "castKill") {
        setUsingToolTip(data);
        setToolSelectedModalOpen(true);
        setTimeout(() => {
          setToolSelectedModalOpen(false);
        }, 7000);
      } else if (name === "gameOver") {
        setStep(5);
      }
      forceUpdate((x) => x + 1);
    });
  }, [game]);

  useEffect(() => {
    initData(data);
  }, [data]);

  const initGameInfo = () => {
    const character = JSON.parse(localStorage.getItem("character") || "{}");
    const scene = JSON.parse(localStorage.getItem("scene") || "{}");

    const originalCharacter = characters.find(
      (item) => item.name === character.name
    );
    setCharacter(originalCharacter);
    setScene(scene);
    console.log("character: ", character);
    console.log("scene: ", scene);
  };

  const generateDifferentDiceResults = (array) => {
    const [first, second] = array || [];

    if (first === second) {
      let firstDice = Math.floor(Math.random() * 6) + 1;
      let secondDice;
      do {
        secondDice = Math.floor(Math.random() * 6) + 1;
      } while (firstDice === secondDice);
      return [firstDice, secondDice];
    }
    return [first, second];
  };

  const formatData = (data) => {
    const { turn_begin, turn_item, ...reset } = data || {};
    return {
      ...reset,
      turn_begin: generateDifferentDiceResults(turn_begin),
      turn_item: generateDifferentDiceResults(turn_item),
    };
  };
  const initData = async (data) => {
    if (!data) {
      setStep(0);
      return;
    }
    setStep(1);
    setTimeout(() => {
      const fields = getCounterFields(data?.data);
      const _gameData = formatData(fields);
      const game = new GameLife();
      _gameData.roleAppId = currentRole?.app_id;
      game?.prepareGame(_gameData);
      console.log("inti game: ", game);
      setGame(game);
    }, 1000);
  };

  function getCounterFields(data) {
    if (!data || data?.content?.dataType !== "moveObject") {
      return null;
    }

    return data?.content?.fields || {};
  }

  // 使用主动技能
  const handleCastKill = () => {
    game?.castActiveSkill(character, () => {
      character.isCast = false;
    });
  };

  // 触发被动技能
  const handlePassiveSkill = async (tool) => {
    // 只触发一次
    if (!character?.isPassiveCast) return;
    await game?.castPassiveSkill(character, scene, tool, () => {
      character.isPassiveCast = false;
    });
  };
  
  const handleToolClick = async (role, type, indexList) => {
    if (role !== game?.leader || game?.gameOver) return;

    const [first] = indexList || [];

    // 使用道具时 触发被动技能
    await handlePassiveSkill(type);
    game?.makeDecision?.(`c-${first}`);
    const tempTools = [...usingTools];
    console.log("tempTools: ", tempTools, type);
    tempTools.push(type);
    setUsingTools(tempTools);
    // setToolSelectedModalOpen(true);
  };

  const errorWrapper = () => {
    return (
      <>
        <div className="text-center">
          {/* <div className="text-3xl font-bold mt-10 mb-40">异世界出现了未知错误</div> */}
          <div
            className=" w-[280px] m-auto p-2 text-lg text-[#26b2b9] border-2 border-[#26b2b9] text-center cursor-pointer"
            onClick={() => {
              localStorage.removeItem("gameId");
              navigate("/");
            }}
          >
            Re-enter
          </div>
        </div>
      </>
    );
  };
  const firstLoadTextWrapper = () => {
    return (
      <TypeAnimation
        style={typeTextStyle}
        omitDeletionAnimation={true}
        speed={60}
        sequence={[
          `Game Starting...\n
Loading data...\n
Game initialization complete\n
Ready to play!`,
          3000,
          () => {
            setStep(2);
          },
        ]}
      />
    );
  };

  const nextActionTextWrapper = () => (
    <TypeAnimation
      sequence={[
        `This round consists of: ${localization[game?.leader]} first select\n`,
        // `本回合由: ${game?.leader} 先选择\n`,
        2000,
        () => {
          setStep(4);
          if (game?.leader !== "人类") {
            game?.startRound?.();
          }
        },
      ]}
      cursor={true}
      style={typeTextStyle}
    />
  );

  const selectedPlayer = () => {
    return (
      <>
        <div className="w-[500px] ml-[80px] mb-[40px]">
          {game?.leader === "人类" ? (
            <div className="mb-4">
              The time has come to face the challenge. Should we venture in ourselves, or let our opponents enter the unknown zone?
              <br />
              You can also use different cards to make the zone even more interesting.
            </div>
          ) : (
            <div className="mb-4">AI is joining the challenge, so you’d better watch out!</div>
          )}
          {/* <div className="w-full flex flex-wrap">
            {usingTools?.length > 0 && <div>使用道具：</div>}
            {usingTools?.map((item, index) => {
              return (
                <img
                  width={60}
                  key={index}
                  className="mr-2"
                  style={{ objectFit: "fill" }}
                  src={`/assets/tool/${item}.png`}
                />
              );
            })}
          </div> */}
        </div>
        {game?.leader === "人类" && (
          <>
            <div
              className=" w-[280px] m-auto my-4 p-2 text-lg text-center cursor-pointer"
              style={{
                backgroundImage: `url(/assets/btn/scene.png)`,
                backgroundSize: "100% 100%",
              }}
              onClick={() => {
                game?.makeDecision?.("b");
              }}
            >
              Opponent
            </div>
            <div
              className=" w-[280px] m-auto my-4 p-2 text-lg text-center cursor-pointer"
              style={{
                backgroundImage: `url(/assets/btn/bt1.png)`,
                backgroundSize: "100% 100%",
              }}
              onClick={async () => {
                await handlePassiveSkill();
                await waitTime(2000);
                game?.makeDecision?.("a");
              }}
            >
              Own
            </div>
          </>
        )}
        {/* <div className=" absolute left-[50%] bottom-[0px] translate-x-[-280px]">
          <GrowDoor />
        </div> */}
      </>
    );
  };

  const winner = () => (
    <>
      <div className="text-center">
        <div className="mb-6">End Of Turn</div>
        <div className="text-3xl font-bold mb-10">{localization[game?.leader]} win</div>
        <div className="text-2xl font-bold">Game data will be stored on Walrus</div>
        <div className="text-2xl font-bold mb-10">Walrus blob_id: {game?.conversations_blob_id} </div>
        <div
          className=" w-[280px] m-auto p-2 text-lg text-[#26b2b9] border-2 border-[#26b2b9] text-center cursor-pointer"
          onClick={() => {
            localStorage.removeItem("gameId");
            navigate("/");
          }}
        >
          Play Again
        </div>
      </div>
    </>
  );

  return (
    <div
      className="home"
      style={{ backgroundImage: `url("/assets/${scene?.img}")` }}
    >
      {/* AI玩家 */}
      <div className=" absolute left-0 top-4 w-full m-auto flex justify-center align-middle">
        <div
          className=" w-auto min-w-[500px] min-h-[168px] flex gap-2 px-4 py-6"
          style={{
            backgroundImage: `url("/assets/border2.png")`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "100% 100%",
          }}
        >
          <ToolGroup
            items={game?.aiItems || []}
            onClick={undefined}
            // onClick={(type, indexList) =>
            //   handleToolClick("人工智能", indexList)
            // }
          />
          {!game?.aiItems?.length && (
            <div className="w-full text-right">No card yet</div>
          )}
        </div>
        <div
          className="border border-red-500 ml-4 relative"
          // style={{
          //   backgroundRepeat: "no-repeat",
          //   backgroundSize: "100% 100%",
          // }}
        >
          <div className="w-full absolute left-0 top-0 bg-slate-600 opacity-80 text-center">
            {currentRole?.type || "default"}
          </div>
          <img
            width={120}
            style={{ objectFit: "fill" }}
            className="mt-4"
            src={`/assets/role/ai_a.png`}
          />
          <div
            className="w-[280px] absolute right-[-300px] top-0 px-4 py-2 text-sm "
            style={{
              backgroundImage: `url("/assets/icon/border_info.png")`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "100% 100%",
            }}
          >
            {aiSpeak || "Thinking about。。。"}
          </div>
          <CurrentPlayerRing show={game?.leader === "人工智能"} />
          <div className="w-full absolute left-0 bottom-0 bg-slate-600 opacity-80">
            <HealthBar health={game?.aiHealth} role="ai" />
          </div>
        </div>
      </div>
      {/* 公告区域 */}
      <div
        className=" absolute top-[200px] left-0 w-[240px] p-6 py-10"
        style={{
          backgroundImage: `url("/assets/icon/border1.png")`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "100% 100%",
        }}
      >
        <div className="mb-2">Welcome To {scene?.type}</div>
        <div className="mb-4 text-sm">{scene?.interaction?.description}</div>
        {/* <div className="mt-4 pt-4 text-center">信息牌</div> */}
        <div>
          Shelter：
          <span className="text-lg text-[#25b9b4] font-bold">
            {game?.safeWorlds || 0}
          </span>
          {/* 个 */}
        </div>
        <div>
        Radiation Zone：
          <span className="text-lg text-[#FD0813] font-bold">
            {game?.dangerousWorlds || 0}
          </span>
          {/* 个 */}
        </div>
      </div>
      {/* 游戏区域 */}
      <div className=" absolute top-[200px] left-0 w-full flex justify-center align-middle">
        <div
          className="gameCenter w-[660px] h-[400px]  px-10 pt-14 relative"
          style={{
            backgroundImage: `url("/assets/border2.png")`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
          }}
        >
          {/* {renderUsingTools()} */}
          {step === 0 && errorWrapper()}
          {step === 1 && firstLoadTextWrapper()}
          {step === 2 && nextActionTextWrapper()}
          {step === 4 && selectedPlayer()}
          {step === 5 && winner()}
        </div>
      </div>

      {/* 真人玩家 */}
      <div className=" absolute left- bottom-4 w-full m-auto flex justify-center align-middle">
        <div className="border mr-4 relative">
          <div className="w-full absolute left-0 top-0 bg-slate-600 opacity-80 text-center">
            {character?.type || "默认"}
          </div>
          <img
            width={120}
            className="mt-4"
            style={{ objectFit: "fill" }}
            src={`/assets/${character?.avatar}`}
          />
          <CurrentPlayerRing show={game?.leader === "人类"} />
          <div className="w-full absolute left-0 bottom-0 bg-slate-600 opacity-80">
            <HealthBar health={game?.playerHealth} />
          </div>
          {/* 施放技能 */}
          {character?.isCast && step === 4 && game?.leader === "人类" && (
            <div
              onClick={handleCastKill}
              className="w-[80px] absolute left-[-80px] top-0 bg-slate-600 opacity-80 text-center cursor-pointer"
            >
              Skills
              <div className="py-2 text-sm text-[#25b9b4] bg-[#00000033]">
                {character?.activeSkill?.name}
              </div>
            </div>
          )}
        </div>
        <div
          className=" w-auto min-w-[500px] min-h-[168px] flex gap-2 px-4 py-6"
          style={{
            backgroundImage: `url("/assets/border2.png")`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "100% 100%",
          }}
        >
          <ToolGroup
            data={game}
            items={game?.playerItems || []}
            onClick={(type, indexList) =>
              handleToolClick("人类", type, indexList)
            }
          />
          {!game?.playerItems?.length && <div>No card yet</div>}
        </div>
      </div>
      <SelectedTools
        open={toolSelectedModalOpen}
        values={usingToolTip}
        onCancel={() => setToolSelectedModalOpen(false)}
      />

      <div className="absolute top-3 right-3">
        <AudioPlay
          src={
            game?.playerHealth <= 2
              ? "/assets/music/rush1.mp3"
              : "/assets/music/begin2-4.mp3"
          }
        />
      </div>
    </div>
  );
};

export default Home;
