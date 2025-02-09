import axios from "axios";
import { waitTime } from "../../../utils/utils";
import { localization } from "../../../config/constants";

interface InitData {
  roleAppId: string;
  ai_random: number;
  hp: number;
  items: number[];
  player_random: number;
  turn_begin: number[];
  turn_item: number[];
  worlds: number[];
}

class LifeAndDeathGame {
  roleAppId: string;
  maxHealth: number;
  playerHealth: number;
  aiHealth: number;
  worlds: string[];
  items: number[];
  playerDice: number;
  aiDice: number;
  playerItems: number[];
  aiItems: number[];
  currentRound: number;
  leader: string;
  safeWorlds: number;
  dangerousWorlds: number;
  worldsLeft: number;
  danger: number;
  useEMP: boolean;
  useEye: boolean;
  lastUseItem: string;
  playerRandom: number;
  aiRandom: number;
  gameOver: boolean;
  aiMsg: string;
  sessionId: string;
  conversations: any[];
  conversations_blob_id: any;
  listeners: any;

  constructor() {
    this.roleAppId = "";
    this.maxHealth = 0;
    this.playerHealth = 0;
    this.aiHealth = 0;
    this.worlds = [];
    this.items = [];
    this.playerDice = 0;
    this.aiDice = 0;
    this.playerItems = [];
    this.aiItems = [];
    this.currentRound = 1;
    this.leader = "";
    this.safeWorlds = 0;
    this.dangerousWorlds = 0;
    this.worldsLeft = 0;
    this.danger = 1;
    this.useEMP = false;
    this.useEye = false;
    this.lastUseItem = ''
    this.playerRandom = 0;
    this.aiRandom = 0;
    this.gameOver = false;
    this.aiMsg = "";
    this.sessionId = "";
    this.conversations = [];
    this.conversations_blob_id = "";
    this.listeners = {
      onGameEvent: () => { },
    };
  }

  async prepareGame(initData: InitData) {
    console.log("Preparing game...");
    this.initializeGame(initData);
    // await this.startRound();
  }

  initializeGame(initData: InitData) {
    this.roleAppId = initData?.roleAppId;
    // this.roleAppId = 'f9578d1ea9d94831be776ee794d50d44';
    this.maxHealth = initData.hp;
    this.aiHealth = initData.hp + 2
    this.playerHealth = initData.hp;
    // this.worlds = initData.worlds?.map((world) => '致命世界');
    this.worlds = initData.worlds?.map((world) =>
      world === 1 ? "致命世界" : "安全世界"
    );
    this.worldsLeft = this.worlds.length;
    this.dangerousWorlds = this.worlds.filter(
      (world) => world === "致命世界"
    ).length;
    this.safeWorlds = this.worlds.length - this.dangerousWorlds;
    this.items = initData.items;
    // this.items = [1, 2, 3, 4, 1, 5, 3, 4, 3, 4];
    this.playerDice = initData.turn_begin[1];
    this.aiDice = initData.turn_begin[0];
    this.leader = this.playerDice > this.aiDice ? "人类" : "人工智能";
    // this.leader = "人类";
    this.playerRandom = initData.player_random;
    this.aiRandom = initData.ai_random;
    this.distributeItems();
    console.log(`游戏准备完毕，开始进行第一回合。`);
    console.log();

  }

  // 设置事件监听器
  setEventListener(eventName, listener) {
    this.listeners[eventName] = listener;
  }

  generateSeed(playerRandom: number, aiRandom: number): number {
    const timestamp = Date.now();
    const timestampPart = parseInt(timestamp.toString().slice(-5)); // 截取时间戳的最后5位
    return playerRandom + aiRandom + timestampPart;
  }

  customRandom(seed: number): () => number {
    let value = seed;
    return () => {
      value = (value * 9301 + 49297) % 233280;
      return value / 233280;
    };
  }
  generateWorlds(): number[] {
    const randomSeed = this.generateSeed(this.playerRandom, this.aiRandom);
    const random = this.customRandom(randomSeed);
    const numWorlds = Math.floor(random() * 8) + 1;
    const worlds = Array.from({ length: numWorlds }, () =>
      random() > 0.5 ? 1 : 0
    );
    return worlds;
  }

  generateItems(): number[] {
    const randomSeed = this.generateSeed(this.playerRandom, this.aiRandom);
    const random = this.customRandom(randomSeed);
    return Array.from({ length: 8 }, () => Math.floor(random() * 5) + 1);
  }
  distributeItems() {
    this.playerItems = this.items.slice(0, 4);
    this.aiItems = this.items.slice(2, 8);
    console.log(`人类道具: ${this.playerItems}, 人工智能道具: ${this.aiItems}`);
  }

  shuffleArray<T>(array: T[]): T[] {
    console.log("Shuffling array...");
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  async startRound() {
    if (await this.isGameOver()) {
      return;
    }
    console.log('------------------startRound--------------');

    if (this.worldsLeft === 0) {
      await this.resetWorldsAndItems();
      return;
    }
    console.log(`---------------第${this.currentRound}回合---------------`, new Date().toLocaleString());
    await this.showDecisionOptions();
  }

  saveConversationsToJson(conversations: any[], fileName: string): File {
    const jsonBlob = new Blob([JSON.stringify(conversations)], { type: "application/json" });
    return new File([jsonBlob], fileName, { type: "application/json" });
  }

  async uploadJsonFile(file: File) {
    try {
      const response = await fetch(`https://publisher.walrus-testnet.walrus.space/v1/blobs?epochs=100`, {
        method: "PUT",
        body: file,
      });

      if (response.status === 200) {
        const info = await response.json();
        console.log("Upload successful:", info);
        console.log("Media type:", file.type);
        return info.newlyCreated.blobObject.blobId;
      } else {
        throw new Error("Something went wrong when storing the blob!");
      }
    } catch (error) {
      console.error("Error uploading the file:", error);
      return undefined;
    }
  }
  async isGameOver(): Promise<boolean> {
    if (this.playerHealth <= 0 || this.aiHealth <= 0) {
      console.log(
        `游戏结束，${this.playerHealth <= 0 ? "人工智能" : "人类"}获胜。`
      );
      this.gameOver = true;
      this.leader = this.playerHealth <= 0 ? "人工智能" : "人类";
      const jsonFile = this.saveConversationsToJson(this.conversations, "conversations.json");

      // Step 3: 上传文件
      await this.uploadJsonFile(jsonFile).then(file_info => {
        this.conversations_blob_id = file_info
      });
      // if (this.leader === "人类" && this.gameOver) {
      //   updateUserPoints(this.addressId, 100)
      // } else {
      //   updateUserPoints(this.addressId, -100)
      // }
      // 触发事件
      this.listeners?.onGameEvent("gameOver");
      return true;
    }
    return false;
  }

  async resetWorldsAndItems() {
    console.log("本轮世界已耗尽，重新生成世界和道具。");

    const data = {
      msg: `This round of zone has been exhausted, the zone and card have been regenerated`,
    };
    // 延时触发重置提醒
    // 触发事件
    setTimeout(() => {
      this.listeners?.onGameEvent("resetZone", data);
    }, 2000);

    this.worlds = this.generateWorlds().map((world) =>
      world === 1 ? "致命世界" : "安全世界"
    );
    this.worldsLeft = this.worlds.length;
    this.dangerousWorlds = this.worlds.filter(
      (world) => world === "致命世界"
    ).length;
    this.safeWorlds = this.worlds.length - this.dangerousWorlds;

    const newItems = this.generateItems();
    this.playerItems = this.playerItems.concat(newItems.slice(0, 4));
    this.aiItems = this.aiItems.concat(newItems.slice(4, 8));
    console.log(`新生成的世界: ${this.worldsLeft}`);
    console.log(`新生成的道具: ${newItems}`);
    console.log(`累加后的人类道具: ${this.playerItems}`);
    console.log(`累加后的AI道具: ${this.aiItems}`);

    console.log("游戏准备完毕，开始进行下一回合。");
    // await this.startRound();
    await this.showDecisionOptions()
  }

  async showDecisionOptions() {
    this.displayStatus();
    // const choice = await this.getInput("请选择(a/b/c-道具序号):");

    if (this.leader === "人工智能") {
      // await waitTime(3000);
      if (this.gameOver) return;
      this.conversations.push(this.aiMsg)
      const aiResult = await this.fetchGptOption(this.aiMsg);
      this.conversations.push(aiResult)
      // 由于返回字段不确定 默认选择第一个字段
      const choice = Object.values(aiResult)?.[0] || "";
      console.log("ai choice: ", choice);

      // 触发事件
      let newStr = aiResult?.translate.replace(/world/gi, 'zone');
      this.listeners?.onGameEvent("aiSpeek", newStr);
      await this.makeDecision(choice);
    }
  }

  displayStatus() {
    console.log(`血量和道具情况`);
    console.log(`人类血量：${this.playerHealth}`);
    console.log(`人类的剩余道具列表：${this.playerItems}`);
    console.log(`人工智能血量：${this.aiHealth}`);
    console.log(`人工智能的剩余道具列表：${this.aiItems}`);
    console.log(`致命世界数量：${this.dangerousWorlds}`);
    console.log(`安全世界数量：${this.safeWorlds}`);
    console.log(`--------------${this.leader}--选择-----------------`);
    console.log(`a.选择自己进入异世界`);
    console.log(`b.选择对方进入异世界`);
    const _msg = `
        血量和道具情况\n
        人类血量：${this.playerHealth};\n
        人类的剩余道具列表：${this.playerItems};\n
        人工智能血量：${this.aiHealth};\n
        人工智能的剩余道具列表：${this.aiItems};\n
        致命世界数量：${this.dangerousWorlds};\n
        安全世界数量：${this.safeWorlds};\n
        ${this.lastUseItem};\n
        --------------${this.leader}--选择-----------------\n
        a.选择自己进入异世界;\n
        b.选择对方进入异世界;\n
        `;
    this.showItemOptions(_msg);
  }

  showItemOptions(_msg) {
    const items = this.leader === "人类" ? this.playerItems : this.aiItems;
    let optionMsg = "\n";
    items.forEach((item, index) => {
      optionMsg += `c-${index + 1}. ${this.getItemName(item)};\n`;
      console.log(`c-${index + 1}. ${this.getItemName(item)}`);
    });
    this.aiMsg = _msg + optionMsg;
  }

  getItemName(item: number): string {
    const itemNames = ["生命之泉", "EMP", "钢铁洪流", "格式化", "阴阳眼"];
    return itemNames[item - 1] || "未知道具";
  }

  async makeDecision(choice: string) {

    if (choice.startsWith("c-")) {
      const itemIndex = parseInt(choice.split("-")[1]) - 1;
      await this.useItem(itemIndex);
    } else if (choice === "a" || choice === "b") {
      await this.enterWorld(choice);
    } else {
      console.log("无效选择，请重新选择。");
      await this.showDecisionOptions();
    }
  }

  castActiveSkill(character: any, callBack: Function) {
    console.log('castActiveSkill: ', character);
    const { type } = character
    let data

    // 赌场老板
    if (type === 'casinoBoss') {
      // 从 aiItems 数组中随机选择一个元素
      const randomIndex = Math.floor(Math.random() * this.aiItems.length);
      const randomItem = this.aiItems[randomIndex];

      // 移除 aiItems 选中的元素，并添加到 playerItems 数组中
      this.aiItems.splice(randomIndex, 1);
      this.playerItems.push(randomItem);

      data = {
        msg: `${type} exchange one opponent's card`,
      };
      callBack()
      // 黑客
    } else if (type === 'hacker') {
      // 从 aiItems 数组中随机选择一个元素
      const randomIndex = Math.floor(Math.random() * this.aiItems.length);

      // 移除选中的元素
      this.aiItems.splice(randomIndex, 1);

      data = {
        msg: `${type} choose to have the opponent discard a card`,
      };
      callBack()
      // 海豹突击队员
    } else {
      // 在血量小于最大4滴血的情况 加一点血
      if (this.playerHealth < 4) {
        this.playerHealth++
        data = {
          msg: `${type} restore one drop of blood volume`,
        };
        callBack()
      } else {
        data = {
          msg: `The current health is also the maximum, and skills cannot be used`,
        };
      }
    }
    // 触发事件
    this.listeners?.onGameEvent("castKill", data);

  }

  async castPassiveSkill(character: any, scene: any, toolType: string, callBack: Function) {
    console.log('castActiveSkill: ', character);
    const { type } = character
    const isDanger = this.worlds[0] === '致命世界'
    let data

    return new Promise<void>(async (resolve, reject) => {
      // 赌场老板
      if (type === 'casinoBoss') {
        // 使用道具不触发
        if (toolType) {
          resolve()
          return
        }
        // 是否触发被动
        const isTrans = character.passiveSkill.effect(scene)
        if (isTrans && isDanger) {
          // 将世界变为安全的
          this.worlds.splice(0, 1, '安全世界')
          this.safeWorlds++
          this.dangerousWorlds--

          data = {
            msg: `${type} trigger passive skills to make the zone a safe place`,
          };

          // 触发事件
          this.listeners?.onGameEvent("castKill", data);

          callBack()
          resolve()
        }
        // 黑客
      } else if (type === 'hacker') {
        // 使用格式化触发
        if (toolType !== '4') {
          resolve()
          return
        }
        const _aiHealth = character.passiveSkill.effect(this.aiHealth, scene)
        if (this.aiHealth !== _aiHealth) {
          this.aiHealth = _aiHealth
          data = {
            msg: `${type} trigger passive skill to cause opponent to lose 1 health point`,
          };
          // 触发事件
          this.listeners?.onGameEvent("castKill", data);
          await waitTime(2000)
          if (await this.isGameOver()) return
          callBack()
          resolve()
        }
        // 海豹突击队员
      } else {
        // 使用道具不触发
        if (toolType) {
          resolve()
          return
        }
        // 当前是致命世界
        if (isDanger) {
          const _aiHealth = character.passiveSkill.effect(this.aiHealth, scene)
          if (this.aiHealth !== _aiHealth) {
            this.aiHealth = _aiHealth
            data = {
              msg: `${type} trigger passive skill to cause opponent to lose 1 health point`,
            };
            // 触发事件
            this.listeners?.onGameEvent("castKill", data);
            await waitTime(2000)

            if (await this.isGameOver()) return
            callBack()
            resolve()
          }
        }
      }

    })
  }

  async updateItemEffect(itemIndex: number, itemList: number[]) {
    itemList.splice(itemIndex, 1);

    const data = {
      msg: `${'toolDesc'}${'resultDesc'}`,
    };
    // await waitTime(3000)
    // 触发事件
    // this.listeners?.onGameEvent("useTool", data);
  }

  async useItem(itemIndex: number) {
    const itemList = this.leader === "人类" ? this.playerItems : this.aiItems;
    const item = itemList[itemIndex];
    console.log(`${this.leader} 使用了道具 ${this.getItemName(item)}`);
    this.handleItemEffect(item, itemIndex, itemList);

    await this.showDecisionOptions();
  }

  async handleItemEffect(item: number, itemIndex: number, itemList: number[]) {
    const toolDesc = `${localization[this.leader]} used the ${localization[this.getItemName(item)]} card\n `;
    // const toolDesc = `${this.leader} 使用了道具 ${this.getItemName(item)}\n`;
    let resultDesc = "";
    switch (item) {
      case 1:
        const desc = this.handleHealthItem(itemIndex, itemList);
        resultDesc = desc;
        break;
      case 2:
        if (this.useEMP) {
          console.log(`本回合已经使用EMP,等下一回合再说`);
          resultDesc = `EMP has been used in this round, wait until the next round`;
        } else {
          this.useEMP = true;
          itemList.splice(itemIndex, 1);
          resultDesc = `opponents will be bound`;
        }

        break;
      case 3:
        this.danger = 2;
        console.log(`异世界造成2点伤害`);
        itemList.splice(itemIndex, 1);
        resultDesc = `the zone deals 2 damage`;
        if (this.leader === "人工智能") {
          this.lastUseItem = `本回合已经使用钢铁洪流`
        }
        break;
      case 4:
        this.removeCurrentWorld();
        itemList.splice(itemIndex, 1);
        resultDesc = `remove the current zone`;
        // resultDesc = `移除了当前世界`;
        // 移除掉最后一个世界，重新更新世界
        if (this.worldsLeft === 0) {
          await this.resetWorldsAndItems();
          return;
        }
        break;
      case 5:
        if (this.useEye) {
          console.log(`本回合已经使用EMP,等下一回合再说`);
          resultDesc = `Yin and Yang Eyes have been used in this round, wait until the next round`;
        } else {
          this.useEye = true;
          itemList.splice(itemIndex, 1);
          console.log(`当前异世界是${this.worlds[0]}`);
          resultDesc = `the current zone is ${localization[this.worlds[0]]}`;
          if (this.leader === "人工智能") {
            this.lastUseItem = `本回合已经使用阴阳眼, 当前异世界是${this.worlds[0]}`
          }
        }
        break;
      default:
        console.log("未知道具");
    }
    const data = {
      msg: `${toolDesc}${resultDesc}`,
    };
    // await waitTime(3000)
    // 触发事件
    this.listeners?.onGameEvent("useTool", data);
  }
  handleHealthItem(itemIndex: number, itemList: number[]) {
    let _resultDesc = "";
    const localLeader = localization[this.leader]
    if (this.leader === "人类") {
      if (this.playerHealth < this.maxHealth) {
        this.playerHealth++;
        itemList.splice(itemIndex, 1);
        console.log(`${this.leader} 恢复了一格血🩸`);
        _resultDesc = `${localLeader} a drop of blood was restored🩸`;
      } else {
        console.log(`${this.leader} 大于本轮最大生命值,不能使用道具`);
        _resultDesc = `${localLeader} greater than the maximum health value of this round, you cannot use card`;
      }
    } else {
      if (this.aiHealth < this.maxHealth) {
        this.aiHealth++;
        itemList.splice(itemIndex, 1);
        console.log(`${this.leader} 恢复了一格血🩸`);
        _resultDesc = `${localLeader} a drop of blood was restored🩸`;
      } else {
        console.log(`${this.leader} 大于本轮最大生命值,不能使用道具`);
        _resultDesc = `${localLeader} greater than the maximum health value of this round, you cannot use card`;
      }
    }
    return _resultDesc;
  }
  removeCurrentWorld() {
    const deleteWorld = this.worlds.shift()!;
    this.worldsLeft--;
    if (deleteWorld === "致命世界") {
      this.dangerousWorlds--;
    } else {
      this.safeWorlds--;
    }
  }

  async enterWorld(choice: string) {
    const world = this.worlds.shift()!;
    this.worldsLeft--;
    // 设置 当前leader
    const _currentLeader = this.leader + ''

    const isDangerous = world === "致命世界";
    const isAI = this.leader === "人工智能";

    console.log(`---------------回合结果------------`, new Date().toLocaleString());
    console.log(
      `${this.leader}选择了${choice === "a" ? "自己" : "对方"
      }进入异世界，该异世界是${world}，现在让我们进行第${this.currentRound + 1
      }回合。`
    );

    if (isAI) {
      this.lastUseItem = ''
    }

    const updateLeader = (newLeader: string) => {
      if (this.useEMP) {
        this.useEMP = false;
        console.log(`使用了EMP, 当前玩家还是${this.leader}`);
      } else {
        this.leader = newLeader;
      }
    };

    const processDangerousWorld = () => {
      this.dangerousWorlds--;
      if (isAI) {
        if (choice === "a") {
          this.aiHealth -= this.danger;
          updateLeader("人类");
        }
        if (choice === "b") {
          this.playerHealth -= this.danger;
          updateLeader("人类");
        }
      } else {
        if (choice === "a") {
          this.playerHealth -= this.danger;
          updateLeader("人工智能");
        }
        if (choice === "b") {
          this.aiHealth -= this.danger;
          updateLeader("人工智能");
        }
      }
    };

    const processSafeWorld = () => {
      this.safeWorlds--;
      if (choice === "b") {
        updateLeader(isAI ? "人类" : "人工智能");
      } else {
        updateLeader(this.leader);
      }
    };

    if (isDangerous) {
      processDangerousWorld();
    } else {
      processSafeWorld();
    }

    const roundDesc = (!this.aiHealth || !this.playerHealth) ? 'End of turn' : `Now let's proceed to the ${this.currentRound + 1} round`
    // const roundDesc = (!this.aiHealth || !this.playerHealth) ? '回合结束' : `现在让我们进行第${this.currentRound + 1}回合`
    const data = {
      msg: `${localization[_currentLeader]} choose ${choice === "a" ? "own" : "opponent"
        } enter the zone, which is ${localization[world]}\n
          ${isDangerous ? "damage is suffered, and health points are reduced" : "was not harmed"}\n
          ${roundDesc}`,
      // msg: `${_currentLeader}选择了${choice === "a" ? "自己" : "对方"
      //   }进入异世界，该异世界是${world}\n
      //     ${isDangerous ? "受到伤害，减少生命值" : "没有受到伤害"}\n
      //     ${roundDesc}`,
    };

    this.danger = 1;
    this.useEye = false;
    this.currentRound++;

    // await waitTime(3000)
    // 触发事件
    this.listeners?.onGameEvent("roundResult", data);
    await this.startRound();
  }

  async fetchGptOption(prompt: string) {
    if (!prompt) return;

    const data = {
      roleAppId: this.roleAppId,
      prompt,
      session_id: this.sessionId || undefined,
    };

    try {
      const response = await axios.post('/api/gptReply', data);
      const { session_id, text } = response?.data?.output || {};
      this.sessionId = session_id;
      const bracesContentRegex = /{([^{}]*)}/;
      const dataMatch = text?.match(bracesContentRegex);

      let parsedData = null;
      if (dataMatch) {
        try {
          parsedData = JSON.parse(`{${dataMatch[1] || ''}}`);
        } catch (jsonError) {
          console.error("Error parsing JSON", jsonError);
        }
      }

      return parsedData;
    } catch (error) {
      console.error("Error making API request", error);
    }
  }
  //   getInput(prompt: string): Promise<string> {
  //     return new Promise((resolve) => {
  //       this.rl.question(prompt, (answer) => {
  //         resolve(answer);
  //       });
  //     });
  //   }
}

export default LifeAndDeathGame;

// Example usage
// if (require.main === module) {
//   const initData: InitData = {
//     ai_random: 244,
//     hp: 2,
//     items: [3, 4, 1, 2, 3, 2, 5, 4],
//     player_random: 84,
//     turn_begin: [4, 5],
//     turn_item: [2, 2],
//     worlds: [1, 0, 1, 1, 1, 0],
//   };
//   const game = new LifeAndDeathGame();
//   game.prepareGame(initData);
// }
