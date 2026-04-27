import React from 'react';

interface Props {
  text: string;
  className?: string;
  asHeader?: boolean;
}

export const GlitchText: React.FC<Props> = ({ text, className = '', asHeader = false }) => {
  const baseClass = asHeader ? 'font-header text-xl md:text-2xl' : 'text-lg';
  
  return (
    <div className={`relative inline-block ${baseClass} ${className}`}>
      <span className="relative z-10 text-cyan-400 drop-shadow-[0_0_5px_rgba(0,255,255,0.8)]">{text}</span>
      <span 
        className="absolute top-0 left-0 -ml-[2px] text-cyan-300 opacity-70 mix-blend-screen animate-[glitch-anim-1_2.5s_infinite_linear_alternate-reverse]" 
        aria-hidden="true"
      >
        {text}
      </span>
      <span 
        className="absolute top-0 left-0 ml-[2px] text-fuchsia-500 opacity-70 mix-blend-screen animate-[glitch-anim-2_3s_infinite_linear_alternate-reverse]" 
        aria-hidden="true"
      >
        {text}
      </span>
    </div>
  );
};
