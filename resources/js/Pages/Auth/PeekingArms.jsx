import React from 'react';
import { animated } from 'react-spring';

function PeekingArms({ isPeeking = false, ...props }) {
  return (
    <g {...props}>
      {/* Left Arm - Peeking with two fingers */}
      <g className="leftPeekArm">
        <path
          fill="#f8fafc"
          stroke="#334155"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M60 120 Q50 110 45 100 Q40 90 45 85 L55 88 Q65 95 70 105 L65 115 Z"
          transform="translate(0, 0)"
        />
        
        {/* Two fingers peeking */}
        <g className="peekingFingers">
          {/* Index finger */}
          <path
            fill="#f8fafc"
            stroke="#334155"
            strokeLinecap="round"
            strokeWidth="1.5"
            d="M75 95 L85 92 Q88 90 87 88 Q86 86 83 87 L73 90 Q70 92 72 95 Z"
          />
          
          {/* Middle finger */}
          <path
            fill="#f8fafc"
            stroke="#334155"
            strokeLinecap="round"
            strokeWidth="1.5"
            d="M77 100 L87 97 Q90 95 89 93 Q88 91 85 92 L75 95 Q72 97 74 100 Z"
          />
          
          {/* Finger separation lines */}
          <path
            stroke="#cbd5e1"
            strokeLinecap="round"
            strokeWidth="0.5"
            d="M76 97 L84 94.5"
          />
        </g>
      </g>

      {/* Right Arm - Peeking with two fingers */}
      <g className="rightPeekArm">
        <path
          fill="#f8fafc"
          stroke="#334155"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M140 120 Q150 110 155 100 Q160 90 155 85 L145 88 Q135 95 130 105 L135 115 Z"
          transform="translate(0, 0)"
        />
        
        {/* Two fingers peeking */}
        <g className="peekingFingers">
          {/* Index finger */}
          <path
            fill="#f8fafc"
            stroke="#334155"
            strokeLinecap="round"
            strokeWidth="1.5"
            d="M125 95 L115 92 Q112 90 113 88 Q114 86 117 87 L127 90 Q130 92 128 95 Z"
          />
          
          {/* Middle finger */}
          <path
            fill="#f8fafc"
            stroke="#334155"
            strokeLinecap="round"
            strokeWidth="1.5"
            d="M123 100 L113 97 Q110 95 111 93 Q112 91 115 92 L125 95 Q128 97 126 100 Z"
          />
          
          {/* Finger separation lines */}
          <path
            stroke="#cbd5e1"
            strokeLinecap="round"
            strokeWidth="0.5"
            d="M124 97 L116 94.5"
          />
        </g>
      </g>

      {/* Eye area shadows when peeking */}
      {isPeeking && (
        <g className="peekingShadows" opacity="0.3">
          <ellipse cx="85" cy="95" rx="8" ry="4" fill="#64748b" />
          <ellipse cx="115" cy="95" rx="8" ry="4" fill="#64748b" />
        </g>
      )}
    </g>
  );
}

export default PeekingArms;
