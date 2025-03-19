
export const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5, 
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

export const fadeInDelay = (delay: number) => ({
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5, 
      delay,
      ease: [0.22, 1, 0.36, 1]
    }
  }
});

export const slideIn = (direction: 'left' | 'right' | 'up' | 'down' = 'up', delay: number = 0) => {
  const x = direction === 'left' ? -20 : direction === 'right' ? 20 : 0;
  const y = direction === 'up' ? -20 : direction === 'down' ? 20 : 0;
  
  return {
    hidden: { opacity: 0, x, y },
    visible: { 
      opacity: 1, 
      x: 0, 
      y: 0,
      transition: { 
        duration: 0.5, 
        delay,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };
};

export const scaleIn = (delay: number = 0) => ({
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.4, 
      delay,
      ease: [0.22, 1, 0.36, 1]
    }
  }
});
