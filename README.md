# Apocalyptic World, the AI agent card game

[PPT](https://docs.google.com/presentation/d/1WNNDf4HkB0iu8scEAUjaURKUapPLaQ4Z/edit?usp=sharing&ouid=100027038551905707321&rtpof=true&sd=true)


[Into Video]()


[testnet demo](https://agent-game-zeta.vercel.app/) 


**Apocalyptic World** is a turn-based card game that combines AI-driven agents and random elements to create a dynamic and immersive experience. Each game is unique, with unpredictable outcomes, strategic depth, and engaging AI interactions.

---

## Key Features

- **🔀 Randomized Gameplay:**  
  Powered by the Sui random module, each round generates truly random numbers to influence game parameters, ensuring no two games are the same.

- **🤖 Unique AI Agents:**  
  Play against 6 distinct AI agents, each with a unique personality, adapting to environmental changes and providing dynamic dialogues.

- **💾 AI Battle Data:**  
  Integrated with Walrus for storing battle data, enabling training of more powerful AI models and managing static game files.

- **🌐 Atoma Network Integration:**  
  Utilizing DeepSeek R1, the game creates AI-driven roleplay scenarios, ensuring engaging and immersive interactions.

---

## Gameplay Overview

In **Apocalyptic World**, players must use their cards strategically to outsmart their opponents, aiming to reduce their opponent's health to zero while protecting their own.

---

### 🎯 Objective

Navigate through randomly generated **🌋 Radiation Zones** and **🏠 Shelters** using your cards to outmaneuver your opponent. Players must deduce the nature of these locations based on limited information and decide whether to enter them.

---

### ⚙️ Key Mechanics

- **🌋 Radiation Zone:**  
  Entering a **Radiation Zone** decreases your health by 1 point.

- **🏠 Shelter:**  
  Entering a **Shelter** allows you to control the next round, making the first move.

- **🛠️ Items:**
  - **💥 Grenade:**  Grenade
    Causes a 2 health point loss in a **Radiation Zone**; no effect in **Shelters**.
  - **🩸 Blood Pack:**  
    Restores 1 health point when used.
  - **🩹 Adhesive Tape:**  
    Restricts the opponent's actions in the next round, allowing you to proceed with your move.
  - **🔥 Match:**  
    Clears the current location, transitioning to the next one.
  - **🔭 Telescope:**  
    Reveals whether a location is a **Radiation Zone** (deadly) or a **Shelter** (safe).

---

## Character Roles & Scenario Skills

In **Apocalyptic World**, choose from three distinct characters, each with their own **Active** and **Passive Skills** that shape your strategy. The environment also introduces unique **Scenario Skills**, providing additional opportunities to gain an edge.

---

### Select Your Role

#### 1. **🎲 Casino Boss**
- **🌀 Active Skill:**  
  Swap one of your opponent’s cards with one from your hand. Disrupt their plans and gain an advantage.
- **⚡ Passive Skill:**  
  When entering a **Radiation Zone**, you have a 20% chance to transform it into a **Shelter**, turning a risky situation into an opportunity.

#### 2. **🐾 Seal Team Member**
- **🩹 Active Skill:**  
  Recover a small amount of health in any round, keeping you in the game longer.
- **⚡ Passive Skill:**  
  When you enter a **Radiation Zone**, there’s a 20% chance your opponent loses 1 health point. Use this to pressure your opponent when they take risks.

#### 3. **💻 Hacker**
- **🌀 Active Skill:**  
  Force your opponent to discard one card, weakening their strategy.
- **⚡ Passive Skill:**  
  Each time you use a 'format' item, there’s a 20% chance your opponent loses 1 health point. Leverage this ability to make each move count.

---

### Scenario Skills

Each environment provides unique opportunities to trigger special skills, adding layers of strategy to the game.

- **🏝️ Battle Ruins**  
  **Scenario Skill:** *Will to Fight*  
  Increases the likelihood of the **Seal Team Member’s** *Will to Fight* skill activating to 50%. Boost your healing and stay in the fight longer.

- **🎰 Lost Casino**  
  **Scenario Skill:** *Gambler Spirit*  
  Increases the chance of the **Casino Boss’s** *Gambler Spirit* skill activating to 50%. Take risks and transform **Radiation Zones** into **Shelters**.

- **💾 Data Flow Space**  
  **Scenario Skill:** *Info Interference*  
  Increases the chance of the **Hacker’s** *Info Interference* skill activating to 50%. Disrupt your opponent by forcing them to discard cards or lose health.

---

### 🏆 Win Condition

To win, reduce your opponent’s health to zero while keeping yours intact. Utilize your cards, skills, and environment to outsmart your opponent and claim victory.

---


## contract address
testnet: 0x4976538ea14c2dc851484a45df864789ec1297682583a37a581c4c655b0e1ec6
