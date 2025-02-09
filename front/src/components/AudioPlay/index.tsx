import React, { useEffect, useRef, useState } from "react";
import { PlayCircleOutlined, PauseCircleOutlined } from "@ant-design/icons";

const AudioPlay = ({ src, onPlay, onPause }) => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
  
    const handlePlay = () => {
      return
      audioRef.current?.play()
        .then(() => {
          setIsPlaying(true);
          if (onPlay) {
            onPlay();
          }
        })
        .catch((error) => {
          console.error('Error attempting to play audio:', error);
        });
    };
  
    const handlePause = () => {
      audioRef.current?.pause();
      setIsPlaying(false);
      if (onPause) {
        onPause();
      }
    };
  
    const togglePlayPause = () => {
      if (isPlaying) {
        handlePause();
      } else {
        handlePlay();
      }
    };
  
    useEffect(() => {
      // 当 src 变化时，自动播放音频
      if (audioRef.current) {
        audioRef.current.load(); // 重新加载新音频
        handlePlay(); // 播放新音频
      }
    }, [src]);

    // useEffect(() => {
    //     const handleClickAnywhere = () => {
    //       handlePlay();
    //     };
    
    //     // 添加全局点击事件监听器
    //     document.addEventListener('click', handleClickAnywhere);
    
    //     return () => {
    //       // 组件卸载时移除监听器
    //       document.removeEventListener('click', handleClickAnywhere);
    //     };
    //   }, []);

  return (
    <div>
      <audio ref={audioRef} src={src} loop/>
      <div onClick={togglePlayPause}>
        {isPlaying ? (
          <PauseCircleOutlined
            style={{ fontSize: 30 }}
          />
        ) : (
          <PlayCircleOutlined
            style={{ fontSize: 30 }}
          />
        )}
      </div>
    </div>
  );
};

export default AudioPlay;
