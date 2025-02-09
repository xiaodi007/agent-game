/**
 * 角色选择
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import { characters } from '../../config/constants';

const CharacterSelection = () => {
    const navigate = useNavigate();
    const handleLink = (character) => {
        localStorage.setItem('character', JSON.stringify(character));
        navigate('/scene');
    }
    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-10">Select The Role</h2>
            <div className="md:w-[1000px] pt-2 m-auto grid grid-cols-1 md:grid-cols-3 ">
                {characters.map((character, index) => (
                    <div
                        key={index}
                        className="px-5"
                    >
                        <div
                            className=' h-[500px] cursor-pointer hover:scale-105 transition-transform duration-300 relative'
                            onClick={() => handleLink(character)}
                            style={{ backgroundImage: `url("/assets/${character.img}")`, backgroundRepeat: "no-repeat", backgroundPosition: "center center", backgroundSize: "cover" }}
                        >
                            <h3 className="absolute left-4 top-[300px] text-xl text-center ">{character.type}</h3>
                            <div className=" pl-4 pr-2 absolute left-0 top-[350px]">
                                <p className="mb-2 text-sm text-gray-400">Active Skills：{character.activeSkill.description}</p>
                                <p className="text-sm text-gray-400">Passive Skills：{character.passiveSkill.description}</p>

                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CharacterSelection;
