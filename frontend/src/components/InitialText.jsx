import { useState, useEffect } from "react";

const InitialText = ({ text }) => {
  const [bgColor, setBgColor] = useState("#E5E7EB");

  const getInitials = (value) => {
    if (typeof value !== "string") return "";

    const words = value.trim().split(" ").filter(Boolean);

    if (words.length === 0) return "";

    return words
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase() || "")
      .join("");
  };

  const getRandomLightColor = () => {
    const letters = "89ABCDEF";
    let color = "#";

    for (let i = 0; i < 6; i++) {
      const index = Math.floor(Math.random() * letters.length);
      color += letters[index];
    }

    return color;
  };

  useEffect(() => {
    try {
      setBgColor(getRandomLightColor());
    } catch (error) {
      console.error("Color generation error:", error);
      setBgColor("#E5E7EB");
    }
  }, [text]);

  return (
    <div
      className="h-10 w-10 rounded-lg flex-shrink-0 flex items-center justify-center font-semibold text-sm text-black"
      style={{ backgroundColor: bgColor }}
    >
      {getInitials(text) || ""}
    </div>
  );
};

export default InitialText;
