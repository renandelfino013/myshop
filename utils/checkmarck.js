import { useState } from "react";
import Lottie from "lottie-react";
import checkAnimationd from "../public/assets/CHECKJSON.json";

function SuccessCheckmark() {
  const [visible, setVisible] = useState(true);

  const restartAnimation = () => {
    setVisible(false);
    setTimeout(() => {
      setVisible(true);
    }, 10);
  };

  return (
    <div style={{ width: 200, margin: "0 auto" }}>
      {visible && <Lottie animationData={checkAnimationd} loop={false} />}
    </div>
  );
}

export default SuccessCheckmark;
