import React from "react";

interface GeneratingContentProps {
  message?: string;
}

const GeneratingContent: React.FC<GeneratingContentProps> = ({
  message = "AI is generating your content...",
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        minHeight: "200px",
        padding: "2rem",
        gap: "20px",
      }}
    >
      {/* Perfect arc spinner - exact match to your image */}
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        style={{
          animation: "spin 1s linear infinite",
        }}
      >
        <circle
          cx="16"
          cy="16"
          r="12"
          fill="none"
          stroke="#06b6d4"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="64 11"
          transform="rotate(-90 16 16)"
        />
      </svg>

      {/* Simple text */}
      <p
        style={{
          margin: 0,
          color: "#94a3b8",
          fontSize: "14px",
          fontWeight: "400",
          textAlign: "center",
        }}
      >
        {message}
      </p>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default GeneratingContent;
