export default function ColourfulBlock({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <span
      className={`font-[700] rounded-[12px] sm:px-[16px] sm:py-[10px] px-[10px] py-[8px] inline-flex justify-center items-center w-[80px] sm:w-[100px]  sm:h-[45px] box-border overflow-hidden whitespace-nowrap text-ellipsis ${className}`}
    >
      {text}
    </span>
  );
}