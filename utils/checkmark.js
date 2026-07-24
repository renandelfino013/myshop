import { useState } from "react";
import Lottie from "lottie-react";
import checkAnimationd from "/public/assets/CHECKJSON.json";

export default function SuccessCheckmark() {
  const [visible, setVisible] = useState(true);

  const restartAnimation = () => {
    setVisible(false);
    setTimeout(() => {
      setVisible(true);
    }, 10);
  };

  return (
    <div style={{ width: 200, margin: "0 auto" }}>
      <Lottie path="/assets/CHECKJSON.json" loop={false} />
    </div>
  );
}
