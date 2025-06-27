interface ToggleSwitchProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  labelPosition?: "left" | "right";
  size?: "sm" | "md";
}

export const ToggleSwitch = ({
  id,
  checked,
  onChange,
  label,
  labelPosition = "right",
  size = "md",
}: ToggleSwitchProps) => {
  const sizes = {
    sm: {
      trackW: "w-9",
      trackH: "h-5",
      knobSize: "w-3.5 h-3.5",
      knobTranslate: "translate-x-4",
      labelText: "text-xs",
    },
    md: {
      trackW: "w-10",
      trackH: "h-6",
      knobSize: "w-4 h-4",
      knobTranslate: "translate-x-4",
      labelText: "text-sm",
    },
  };
  const currentSize = sizes[size];

  const handleToggleClick = () => {
    onChange(!checked);
  };

  return (
    <div
      className="flex items-center space-x-2 cursor-pointer group"
      onClick={handleToggleClick}
    >
      {label && labelPosition === "left" && (
        <label
          htmlFor={id}
          className={`${currentSize.labelText} font-medium text-neutral-600 dark:text-neutral-300 group-hover:text-neutral-800 dark:group-hover:text-neutral-100 transition-colors mr-1 cursor-pointer`}
        >
          {label}
        </label>
      )}
      <div
        className={`relative inline-block ${currentSize.trackW} align-middle select-none transition duration-300 ease-in-out cursor-pointer`}
      >
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        {/* Track */}
        <div
          className={`block ${currentSize.trackW} ${
            currentSize.trackH
          } rounded-full transition-colors duration-300 ${
            checked
              ? "bg-cyan-600"
              : "bg-neutral-300 dark:bg-neutral-600 peer-focus-visible:ring-2 peer-focus-visible:ring-offset-1 peer-focus-visible:ring-offset-white dark:peer-focus-visible:ring-offset-neutral-900 peer-focus-visible:ring-cyan-500"
          } cursor-pointer`}
          onClick={handleToggleClick}
        />
        {/* Knob */}
        <div
          className={`absolute top-1 left-1 ${
            currentSize.knobSize
          } rounded-full bg-white transform transition-transform duration-300 ease-in-out shadow ${
            checked ? currentSize.knobTranslate : "translate-x-0"
          } cursor-pointer`}
          onClick={handleToggleClick}
        />
      </div>
      {label && labelPosition === "right" && (
        <label
          htmlFor={id}
          className={`${currentSize.labelText} font-medium text-neutral-600 dark:text-neutral-300 group-hover:text-neutral-800 dark:group-hover:text-neutral-100 transition-colors cursor-pointer`}
        >
          {label}
        </label>
      )}
    </div>
  );
};
