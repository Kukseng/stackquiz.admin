import Image from "next/image";

export function Logo() {
  return (
    <div className="flex items-center space-x-3 min-w-[15rem]">
      {/* Logo */}
      <div className="relative h-12 w-12">
        {/* Light mode logo */}
        <Image
          src="/images/logo/logo.png"
          fill
          className="dark:hidden object-contain"
          alt="StackQuiz logo"
          priority
        />

        {/* Dark mode logo */}
        <Image
          src="/images/logo/logo.png"
          fill
          className="hidden dark:block object-contain"
          alt="StackQuiz dark logo"
          priority
        />
      </div>

      {/* Text with two colors */}
      <span className="text-xl font-bold bg-gradient-to-r from-[#0B82FC] to-[#FFCC00] bg-clip-text text-transparent">
        STACKQUIZ
      </span>
    </div>
  );
}
