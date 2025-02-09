export const PACKAGE_ID = "0x4976538ea14c2dc851484a45df864789ec1297682583a37a581c4c655b0e1ec6";
export const MAINNET_COUNTER_PACKAGE_ID = "0xTODO";

// export const PACKAGE_ID = "0xe8451445cbeac5de8de145bcca7cd60b475e56884dc8c454c95b2fa6dddceb8";
// export const MAINNET_COUNTER_PACKAGE_ID = "0xTODO";

// AI角色
export const ROLES = [
  { id: 1, name: "司马懿", type: "Sima Yi", app_id: "f9578d1ea9d94831be776ee794d50d44" },
  { id: 2, name: "蝙蝠侠", type: "Batman", app_id: "de0fe0a14ef2433292cf4af142e553a6" },
  { id: 3, name: "福尔摩斯", type: "Holmes", app_id: "9b488b10e4984da8943ba48c9669d09b" },
  { id: 4, name: "风间飞鸟", type: "Birds in the wind", app_id: "bacefc04f02848d781436aeab4c133ea" },
  { id: 5, name: "秦始皇", type: "Qin shihuang", app_id: "9dd212ae8d62423c9844506ba12e5c27" },
  { id: 6, name: "Joker", type: "Joker", app_id: "15104c717ff547a2bba591febf0ea1ab" },
];

// 本地化
export const localization = {
  '人类': 'human',
  '人工智能': 'AI',
  '安全世界': 'Shelter',
  '致命世界': 'Radiation Zone',
  "生命之泉": 'Blood pack', 
  "EMP": 'Tape', 
  "钢铁洪流": 'Grenade', 
  "格式化": 'Match', 
  "阴阳眼": 'Telescope',
  "未知道具": 'Unknown Card',
}

// 角色数据结构
export const characters = [
  {
    name: "赌场老板",
    type: "casinoBoss",
    label: "策略型",
    avatar: 'role/boss_a.png',
    img: 'role/boss.png',
    isCast: true,
    isPassiveCast: true,
    activeSkill: {
      name: "Draw",
      description: "In any round, players can exchange one of the other's cards",
      // name: "换牌",
      // description: "在任何回合，玩家可以交换一张对方的卡牌",
      effect: (targetCard, playerCard) => {}
    },
    passiveSkill: {
      name: "Gambler Spirit",
      description: "Every time I enter a deadly world, I have a 20% chance of turning the world into a safe world.",
      // name: "赌徒精神",
      // description: "自己每进入致命世界时，有20%的几率使世界变成安全的世界",
      baseProbability: 0.2,
      effect: (scene) => {
        const finalProbability = scene ? scene.interaction.probability : this.baseProbability;
        console.log(Math.random() , finalProbability);
        
        return true
        if (Math.random() < finalProbability) {
        }
        return false;
      }
    }
  },
  {
    name: "海豹突击队员",
    type: "sealTeamMember",
    label: "耐力型",
    avatar: 'role/seal_a.png',
    img: 'role/seal.png',
    isCast: true,
    isPassiveCast: true,
    activeSkill: {
      name: "Unyielding",
      description: "In any round, players can recover a little blood",
      // name: "不屈",
      // description: "在失去过血量的情况下，可以额回复一点血量",
      effect: (playerHealth, opponentHealth) => {}
    },
    passiveSkill: {
      name: "Will To Fight",
      description: "Enter the Radiation Zone, there is a 20% chance that the other party will lose 1 point of blood.",
      // name: "战斗意志",
      // description: "每进入致命世界时，有20%的几率使对方失去1点血量",
      baseProbability: 0.2,
      effect: (aiHealth, scene) => {
        const finalProbability = scene ? scene.interaction.probability : this.baseProbability;
        aiHealth--;
        return aiHealth
        if (Math.random() < finalProbability) {
        }
        return aiHealth;
      }
    }
  },
  {
    name: "黑客",
    type: "hacker",
    label: "策略型",
    avatar: 'role/hacker_a.png',
    img: 'role/hacker.png',
    isCast: true,
    isPassiveCast: true,
    activeSkill: {
      name: "Data Reconstruction",
      description: "You can choose to have your opponent discard a card in your hand",
      // name: "数据重构",
      // description: "可以选择让对手丢弃一张手牌",
      effect: (handCards) => {}
    },
    passiveSkill: {
      name: "Info Interference",
      description: "Use a 'format' item, there is a 20% chance that your opponent will lose 1 point of health",
      // name: "信息干扰",
      // description: "每次使用“格式化”道具时，都会有20%的几率使对手失去1点血量",
      baseProbability: 0.2,
      effect: (aiHealth, scene) => {
        const finalProbability = scene ? scene.interaction.probability : this.baseProbability;
        aiHealth--;
        return aiHealth
        if (Math.random() < finalProbability) {
        }
        
        return aiHealth;
      }
    }
  }
]

// 场景数据结构
export const scenes = [
  {
    name: "迷失赌场",
    type: "lostCasino",
    img: 'bg/bg7.png',
    interaction: {
      skill: "Gambler Spirit",
      description: "The probability of the casino owner's 'gambler spirit' being activated in this scenario increases, reaching 50%",
      // skill: "赌徒精神",
      // description: "赌场老板的“赌徒精神”在此场景中激活概率增加，达到50%",
      probability: 0.5
    }
  },
  {
    name: "战斗废墟",
    type: "battleRuins",
    img: 'bg/bg8.png',
    interaction: {
      skill: "Will To Fight",
      description: "The probability of the Navy Seal's 'Will to Fight' being activated in this scenario increases to 50%",
      // skill: "战斗意志",
      // description: "海豹突击队员的“战斗意志”在此场景中激活概率增加，达到50%",
      probability: 0.5
    }
  },
  {
    name: "数据流空间",
    type: "dataFlowSpace",
    img: 'bg/bg6.png',
    interaction: {
      skill: "Info Interference",
      description: "The probability of activation of the hacker's 'Information Interference' skill increases in this scenario, reaching 50%",
      // skill: "信息干扰",
      // description: "黑客的“信息干扰”技能激活概率在此场景中增加，达到50%",
      probability: 0.5
    }
  }
]

// 道具数据结构
export const tools = {
  1: {
    id: 1,
    name: "回血",
    type: "blood",
    img: 'icon/blood.png',
    description: ""
  },
  2: {
    id: 2,
    name: "EMP",
    type: "emp",
    img: 'icon/emp.png',
    description: ""
  },
  3: {
    id: 3,
    name: "伤害翻倍",
    type: "double",
    img: 'icon/double.png',
    description: ""
  },
  4: {
    id: 4,
    name: "格式化",
    type: "format",
    img: 'icon/format.png',
    description: ""
  },
  5: {
    id: 5,
    name: "透视眼",
    type: "eye",
    img: 'icon/eye.png',
    description: ""
  },
}
// 随机选择角色和场景
export function getRandomCharacterAndScene() {
  const characterKeys = Object.keys(characters);
  const sceneKeys = Object.keys(scenes);

  // 随机选择一个角色
  const randomCharacterKey = characterKeys[Math.floor(Math.random() * characterKeys.length)];
  const selectedCharacter = characters[randomCharacterKey];

  // 随机选择一个场景
  const randomSceneKey = sceneKeys[Math.floor(Math.random() * sceneKeys.length)];
  const selectedScene = scenes[randomSceneKey];

  return {
    character: selectedCharacter,
    scene: selectedScene
  };
}
