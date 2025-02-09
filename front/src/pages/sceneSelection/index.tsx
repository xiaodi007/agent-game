/**
 * 选择场景
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';

import { scenes } from '../../config/constants';
import GlowingMarker from '../../pages/home/components/GlowingMarker';
import { div } from 'framer-motion/client';
import { useNavigate } from 'react-router-dom';

const SceneSelection = () => {
    const [selectedScene, setSelectedScene] = useState({});
    const navigate = useNavigate();
    const handleChange = (name) => {
        console.log(name);
        const scene = scenes.find((item) => item.name === name);
        console.log(scene);

        setSelectedScene(scene);

    }

    // 选择场景
    const handleEnter = (e) => {
        const randomScene = scenes[Math.floor(Math.random() * scenes.length)];
        // 测试 暂时使用选择场景
        localStorage.setItem('scene', JSON.stringify(selectedScene));
        navigate('/home');
    }
    return (
        <div className="h-fill mx-auto py-6 p-10" style={{ backgroundImage: `url(/assets/bg/bg1.png)`, backgroundSize: '100% 100%' }}>
            <h2 className="text-2xl font-bold mb-12">Select A Scene</h2>
            <div className="flex">
                {/* 左侧场景图片 */}
                <div className="w-3/4 flex flex-col items-center">
                    {/* 在页面中插入 style 标签 */}
                    <style>
                        {`
                            @keyframes ripple {
                                0% {
                                transform: scale(0);
                                opacity: 1;
                                }
                                100% {
                                transform: scale(3);
                                opacity: 0;
                                }
                            }
                            `}
                    </style>
                    <motion.div
                        className="mb-4 cursor-pointer"
                    >
                        <div className='w-[800px] h-[600px] relative' style={{ backgroundImage: `url(/assets/bg/map.png)`, backgroundPosition: '94% center', backgroundSize: 'cover' }}>

                            {/* 发光点标记 */}
                            <GlowingMarker left={60} top={115} label="battleRuins" onChange={() => handleChange('战斗废墟')} />
                            <GlowingMarker left={660} top={200} label="lostCasino" onChange={() => handleChange('迷失赌场')} />
                            <GlowingMarker left={410} top={420} label="dataFlowSpace" onChange={() => handleChange('数据流空间')} />
                        </div>
                    </motion.div>
                </div>

                {/* 右侧场景介绍 */}
                <motion.div
                    className="w-1/4 pl-8 flex flex-col justify-between"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className=" text-lg">
                        {
                            selectedScene?.name ?
                                <div>

                                    <h3 className="text-xl font-semibold">{selectedScene.type}</h3>
                                    <p className="mt-4 text-gray-300">scenario skills：{selectedScene.interaction.skill}</p>
                                    <p className="mt-4 text-gray-300">scenario description：{selectedScene.interaction.description}</p>
                                </div>
                                :
                                <div>
                                    <p className="text-gray-300">Please select a scene</p>
                                </div>
                        }

                    </div>
                    <div
                        onClick={handleEnter}
                        disabled={!selectedScene?.name}
                        className='mb-5 w-[200px] py-2 text-center inline-block cursor-pointer  text-gray-300'
                        style={{ backgroundImage: `url(/assets/btn/bt1.png)`, backgroundSize: '100% 100%' }}
                    >
                        Extract Scenes
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default SceneSelection;
