interface UserAvatarProps {
  name: string;
  avatar?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

export const UserAvatar = ({ name, avatar, size = "md" }: UserAvatarProps) => {
  const sizes = {
    xs: "w-5 h-5 text-[10px]",
    sm: "w-7 h-7 text-xs",
    md: "w-9 h-9 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-lg",
  };

  // Teal, Indigo, Purple, Pink, Amber
  const colors = [
    "bg-cyan-600",
    "bg-indigo-600",
    "bg-purple-600",
    "bg-pink-600",
    "bg-amber-600",
  ];

  const colorIndex = name ? name.charCodeAt(0) % colors.length : 0;
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return avatar ? (
    <img
      src={avatar}
      alt={`${name}'s avatar`}
      className={`${sizes[size]} rounded-full object-cover flex-shrink-0 border-2 border-white dark:border-neutral-800 shadow-sm`}
    />
  ) : (
    <div
      className={`${sizes[size]} ${colors[colorIndex]} rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 border-2 border-white/50 dark:border-neutral-800/50 shadow-sm`}
    >
      {initials}
    </div>
  );
};
