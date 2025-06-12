export default function ColourfulBlock({
  text,
  className,
  size="lg"
}: {
  text: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <span
      className={`font-[700] rounded-[12px] flex justify-center items-center border-box ${className} ${
        size === "lg" ? "px-[16px] py-[10px] sm:px-[24px] sm:py-[12px] sm:min-w-[120px] max-w-fit min-w-[80px] h-[35px] sm:h-[45px]" :
        size === "sm" ? "px-[16px] py-[8px] sm:px-[10px] sm:py-[10px] sm:min-w-[110px] max-w-fit min-w-[100px] h-[40px] sm:h-[40px]" : ""
      } `}

    >
      {" "}
      {/* Fixed the className placement */}
      {text}
    </span>
  );
}
