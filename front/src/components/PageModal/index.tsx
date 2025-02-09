import React, { useRef, useEffect } from 'react';
import './index.less'
const PageModal = ({ width, open, onCancel, children }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        // onCancel();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);



  return (
    <>
      {open && (
        <div className='pageModal'>
          <div ref={modalRef} className='content' style={{ width }}>
            {/* Modal 内容 */}
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default PageModal;
