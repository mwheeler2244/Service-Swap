import { motion } from "framer-motion";
import { Bell, X } from "lucide-react";

interface NotificationProps {
  message: string;
  onClose: () => void;
}

export const Notification = ({ message, onClose }: NotificationProps) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: -70, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{
      opacity: 0,
      y: -70,
      scale: 0.9,
      transition: { duration: 0.3, ease: "easeOut" },
    }}
    transition={{ type: "spring", stiffness: 350, damping: 25 }}
    className="fixed top-6 right-6 bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-4 border border-neutral-200/80 dark:border-neutral-700/80 max-w-sm z-[100]"
  >
    <div className="flex justify-between items-center">
      <div className="flex items-center mr-4">
        <Bell
          size={19}
          className="text-cyan-500 dark:text-cyan-400 mr-3.5 flex-shrink-0"
        />
        <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
          {message}
        </p>
      </div>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onClose}
        className="text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 dark:focus-visible:ring-neutral-400 rounded-full p-1 -mr-1 -mt-1 hover:bg-neutral-100 dark:hover:bg-neutral-700"
        aria-label="Close notification"
      >
        <X size={18} />
      </motion.button>
    </div>
  </motion.div>
);
