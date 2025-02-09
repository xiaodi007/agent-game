import { useState, useEffect } from "react";
import PageModal from "../../../../components/PageModal";

const SelectedTools = (props) => {
  const { open, values, onUpdate, onCancel } = props || {};
  const [content, setContent] = useState("");
  let timer = null;

  useEffect(() => {
    setContent(values?.msg || "");
  }, [values]);

  useEffect(() => {
    // if (open) {
    //   timer = setTimeout(() => {
    //     onCancel();
    //   }, 3000);
    // } else {
    //   setContent("");
    // }
    // return () => {
    //   clearTimeout(timer);
    // };
  }, [open]);

  const handleSelectedTool = (item = {}) => {};
  return (
    <>
      {open && (
        <div className=" absolute top-[200px] right-[20px] p-6 w-[240px]"  style={{ backgroundImage: `url("/assets/icon/border2.png")`, backgroundRepeat: "no-repeat", backgroundSize: "100% 100%" }}>
          <span className="mb-4 whitespace-pre-line text-sm">{content}</span>
        </div>
      )}
    </>
  );
};

export default SelectedTools;
