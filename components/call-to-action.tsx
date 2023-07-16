import React, { useState } from "react";
import { motion } from "framer-motion";
import { css } from "tailwindcss";

const CallToAction = () => {
  const [isAnimated, setIsAnimated] = useState(false);

  return (
    <motion.div
      variants={{
        animated: {
          opacity: 1,
          transition: {
            duration: 1s,
          },
        },
        notAnimated: {
          opacity: 0,
        },
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: isAnimated ? 1 : 0 }}
      onMount={() => setIsAnimated(true)}
    >
      <h1 className='mt-4'>Sign Up Today</h1>
      <p className='mt-2'>Get started with our free trial</p>
    </motion.div>
  );
};

export default CallToAction;