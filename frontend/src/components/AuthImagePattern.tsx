import React from "react";

interface AuthImagePatternProps {
  title: string;
  subtitle: string;
}

const AuthImagePattern: React.FC<AuthImagePatternProps> = ({ title, subtitle}) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
      <div className="max-w-md text-center">
        <div className="grid grid-cols-3 gap-3 mb-8">
          {Array.from({ length: 9 }, (_, index) => (
            <div
              key={index}
              className={`aspect-square rounded-2xl bg-primary/10 ${index % 2 === 0 ? "animate-pulse" : ""}`}
            />
          ))}
        </div>
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-base-content">{subtitle}</p>
      </div>
    </div>
  )
}

export default AuthImagePattern;