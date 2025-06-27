"use client";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
// import { Poppins } from "next/font/google"; // Commented out as not used
import {
  Send,
  Search,
  Calendar,
  Star,
  X,
  Image,
  Smile,
  MapPin,
  Plus,
  Trash,
  Clock,
  Info,
  Heart,
  Mail,
  Phone,
  User as UserIcon,
  CheckCircle,
  Loader2,
  MessageSquare,
  PanelRightClose,
  PanelRightOpen,
  Filter,
  Moon,
  Sun,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Types
import { Service, Match, Message, Conversation, Booking } from "@/types";

// Components
import {
  UserAvatar,
  ToggleSwitch,
  Notification,
  ServiceCard,
  MessageBubble,
} from "@/components";

// Utils and Constants
import { scrollbarStyles, getCategoryImage } from "@/utils/styles";
import { commonEmojis } from "@/constants/emojis";
import {
  currentUser,
  initialServices,
  initialMatches,
  initialConversations,
} from "@/data/mockData";

// Poppins font (loaded but not used in this component)
// const poppins = Poppins({
//   weight: ["400", "500", "600", "700"],
//   subsets: ["latin"],
//   display: "swap",
// });

// ServiceDetailsModal
const ServiceDetailsModal = ({
  service,
  isOpen,
  onClose,
  onSchedule,
  onToggleFavorite,
  currentUserId,
  onContactSeller,
}: {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (serviceId: number) => void;
  onToggleFavorite: (serviceId: number) => void;
  currentUserId: number;
  onContactSeller: (serviceId: number) => void;
}) => {
  const isOwnService = service?.userId === currentUserId;
  const isBooked = service?.isBooked === true;
  if (!service || !isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: "easeInOut" }} // Slightly slower fade
      className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center p-4 z-[50] overflow-y-auto modern-scrollbar" // Darker overlay, more blur
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 10 }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }} // Spring animation
        className="bg-white dark:bg-neutral-800 rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 md:p-6 border-b border-neutral-200 dark:border-neutral-700 flex-shrink-0">
          <div className="flex items-center gap-3 overflow-hidden mr-4">
            {/* Category Tag */}
            <span className="px-3 py-1 bg-cyan-50 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-300 text-xs font-medium rounded-full border border-cyan-200/70 dark:border-cyan-700/50 whitespace-nowrap">
              {service.category}
            </span>
            <h2 className="text-lg md:text-xl font-semibold text-neutral-800 dark:text-neutral-100 truncate">
              {service.title}
            </h2>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Favorite Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => onToggleFavorite(service.id)}
              className={`p-2 rounded-full transition-colors duration-200 ${
                service.isFavorite
                  ? "bg-rose-100 dark:bg-rose-900/40 text-rose-500 dark:text-rose-400 hover:bg-rose-200 dark:hover:bg-rose-900/60"
                  : "text-neutral-400 dark:text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-rose-500 dark:hover:text-rose-400"
              } focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-800 focus-visible:ring-rose-500`}
              aria-label={
                service.isFavorite
                  ? "Remove from favorites"
                  : "Add to favorites"
              }
            >
              <motion.span
                key={service.isFavorite ? "filled" : "empty"}
                initial={{ scale: 0.7 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 12, stiffness: 400 }}
              >
                <Heart
                  size={19}
                  fill={service.isFavorite ? "currentColor" : "none"}
                />
              </motion.span>
            </motion.button>
            {/* Close Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 dark:focus-visible:ring-neutral-400 rounded-full p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-700"
              aria-label="Close details"
            >
              <X size={22} />
            </motion.button>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-grow overflow-y-auto p-5 md:p-7 bg-neutral-50 dark:bg-neutral-800/50 modern-scrollbar">
          {" "}
          {/* Subtle background change */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Left Column */}
            <div className="md:col-span-1 space-y-6">
              <img
                src={service.image || getCategoryImage(service.category)}
                alt={service.image ? `Image for ${service.title}` : ""}
                className="w-full aspect-video object-cover rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-md" // More rounded, shadow
              />

              {/* User Info Box - More prominent */}
              <div className="bg-white dark:bg-neutral-700/70 rounded-2xl p-5 border border-neutral-200 dark:border-neutral-600/80 shadow-sm">
                <div className="flex items-center space-x-4 mb-4">
                  <UserAvatar
                    name={service.userName}
                    size="xl"
                    avatar={service.avatar}
                  />
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-lg">
                      {service.userName}
                    </h3>
                    <div className="flex items-center text-sm text-neutral-600 dark:text-neutral-300 mt-1">
                      <Star
                        className="text-amber-400 dark:text-amber-300 mr-1.5"
                        size={16}
                        fill="currentColor"
                      />
                      <span>{service.ratings.toFixed(1)} Rating</span>
                    </div>
                  </div>
                </div>

                {service.location && (
                  <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-2 flex items-center">
                    <MapPin
                      size={15}
                      className="mr-2 flex-shrink-0 text-neutral-400 dark:text-neutral-500"
                    />
                    {service.location}
                  </p>
                )}

                <div className="mt-5 space-y-3 border-t border-neutral-200 dark:border-neutral-600 pt-4">
                  {service.contactEmail && (
                    <a
                      href={`mailto:${service.contactEmail}`}
                      className="text-sm text-cyan-700 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-300 hover:underline flex items-center group transition-colors"
                    >
                      <Mail
                        size={15}
                        className="mr-2.5 text-neutral-400 dark:text-neutral-500 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 flex-shrink-0 transition-colors"
                      />
                      <span className="truncate">{service.contactEmail}</span>
                    </a>
                  )}
                  {service.contactPhone && (
                    <a
                      href={`tel:${service.contactPhone}`}
                      className="text-sm text-cyan-700 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-300 hover:underline flex items-center group transition-colors"
                    >
                      <Phone
                        size={15}
                        className="mr-2.5 text-neutral-400 dark:text-neutral-500 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 flex-shrink-0 transition-colors"
                      />
                      <span>{service.contactPhone}</span>
                    </a>
                  )}
                  {!service.contactEmail && !service.contactPhone && (
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 italic">
                      No contact info provided.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column (Details, Pricing, Availability) */}
            <div className="md:col-span-2 space-y-7">
              <div>
                <h3 className="text-base font-semibold mb-2.5 text-neutral-700 dark:text-neutral-300">
                  About this service
                </h3>
                <p className="text-neutral-700 dark:text-neutral-200 whitespace-pre-line text-sm leading-relaxed prose prose-sm dark:prose-invert max-w-none">
                  {service.description}
                </p>{" "}
                {/* Using prose for better formatting */}
              </div>

              {service.price && (
                <div>
                  <h3 className="text-base font-semibold mb-2 text-neutral-700 dark:text-neutral-300">
                    Pricing
                  </h3>
                  <p className="text-neutral-800 dark:text-neutral-100 font-semibold text-lg">
                    {service.price}
                  </p>{" "}
                  {/* Larger price */}
                </div>
              )}

              {service.availability && service.availability.length > 0 && (
                <div>
                  <h3 className="text-base font-semibold mb-3 text-neutral-700 dark:text-neutral-300">
                    Availability
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {service.availability.map((time, index) => (
                      // Availability tags
                      <span
                        key={index}
                        className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 text-xs font-medium border border-neutral-200 dark:border-neutral-600 shadow-xs"
                      >
                        <Clock
                          size={13}
                          className="mr-2 text-neutral-400 dark:text-neutral-500"
                        />
                        {time}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 md:p-6 border-t border-neutral-200 dark:border-neutral-700 flex-shrink-0 bg-neutral-100 dark:bg-neutral-800 rounded-b-3xl">
          {" "}
          {/* Match rounding */}
          <div className="flex justify-end gap-3">
            {/* Secondary Button - Refined */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => service && onContactSeller(service.id)}
              className="px-5 py-2.5 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-600 hover:border-neutral-400 dark:hover:border-neutral-500 rounded-lg text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-100 dark:focus-visible:ring-offset-neutral-800 focus-visible:ring-cyan-500"
            >
              <Mail size={16} className="mr-1.5 inline-block -mt-px" /> Contact
              Seller
            </motion.button>
            {isOwnService ? (
              <button
                disabled
                className="px-5 py-2.5 bg-neutral-200 dark:bg-neutral-600 text-neutral-500 dark:text-neutral-400 cursor-not-allowed rounded-lg flex items-center justify-center text-sm font-medium focus:outline-none"
              >
                <UserIcon size={16} className="mr-1.5" />
                Your Service
              </button>
            ) : isBooked ? (
              <button
                disabled
                className="px-5 py-2.5 bg-cyan-100 dark:bg-cyan-800/50 text-cyan-700 dark:text-cyan-300 cursor-not-allowed rounded-lg flex items-center justify-center text-sm font-medium focus:outline-none"
              >
                <CheckCircle size={16} className="mr-1.5" />
                Booked
              </button>
            ) : (
              // Primary Button
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => onSchedule(service.id)}
                className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg flex items-center justify-center text-sm font-medium transition-colors shadow-md hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-100 dark:focus-visible:ring-offset-neutral-800 focus-visible:ring-cyan-600"
              >
                <Calendar size={16} className="mr-1.5" />
                Schedule Now
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ScheduleModal
const ScheduleModal = ({
  service,
  isOpen,
  onClose,
  onSchedule,
  currentUserId,
}: {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (serviceId: number, date: string, time: string) => void;
  currentUserId: number;
}) => {
  const isOwnService = service?.userId === currentUserId;
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [availableTimesForDate, setAvailableTimesForDate] = useState<string[]>(
    []
  );
  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0); // Normalize today to the start of the day
    return date;
  }, []);

  // Generate available dates starting from today
  const availableDates = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => {
      const date = new Date(today); // Create a new Date object for each day
      date.setDate(today.getDate() + i);
      return date.toISOString().split("T")[0];
    });
  }, [today]); // Include today as dependency

  // - Availability Parsing Logic (Improved some parts) -
  const parseAvailability = useCallback(() => {
    if (!service?.availability?.length) return {};

    const dayMap: Record<string, string[]> = {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
    };
    const daysOfWeek = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];

    const parseTimeRange = (timeRange: string): string[] => {
      const times: string[] = [];
      const [startStr, endStr] = timeRange.split("-");
      if (!startStr || !endStr) return [];

      const parseTime = (timeStr: string): number | null => {
        const match = timeStr.trim().match(/(\d{1,2})(?::(\d{2}))?(AM|PM)/i);
        if (!match) return null;
        let hours = parseInt(match[1], 10);
        const minutes = parseInt(match[2] || "0", 10);
        const period = match[3].toUpperCase();

        if (period === "PM" && hours !== 12) hours += 12;
        if (period === "AM" && hours === 12) hours = 0; // Midnight case
        return hours * 60 + minutes; // Return total minutes from midnight
      };

      const startMinutes = parseTime(startStr);
      const endMinutes = parseTime(endStr);

      if (
        startMinutes === null ||
        endMinutes === null ||
        startMinutes >= endMinutes
      )
        return [];

      // Generate hourly slots (ex: 9AM-5PM includes 9:00, 10:00, ..., 16:00)
      for (let minutes = startMinutes; minutes < endMinutes; minutes += 60) {
        const hour = Math.floor(minutes / 60);
        const minute = minutes % 60;
        times.push(
          `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`
        );
      }
      return times;
    };

    service.availability.forEach((availStr) => {
      const parts = availStr.split(" ");
      if (parts.length < 2) return;

      const dayPart = parts[0];
      const timePart = parts.slice(1).join(" ");
      const availableTimes = parseTimeRange(timePart);

      if (dayPart.includes("-")) {
        // Handle day ranges like Mon-Fri
        const [startDayStr, endDayStr] = dayPart.split("-");
        const startDayIndex = daysOfWeek.findIndex((d) =>
          d.startsWith(startDayStr.toLowerCase().slice(0, 3))
        );
        const endDayIndex = daysOfWeek.findIndex((d) =>
          d.startsWith(endDayStr.toLowerCase().slice(0, 3))
        );

        if (startDayIndex !== -1 && endDayIndex !== -1) {
          let currentIndex = startDayIndex;
          while (true) {
            const day = daysOfWeek[currentIndex];
            dayMap[day] = [...new Set([...dayMap[day], ...availableTimes])]; // Merge and deduplicate
            if (currentIndex === endDayIndex) break;
            currentIndex = (currentIndex + 1) % 7;
          }
        }
      } else {
        // Handle single days like Sat, Sunday
        const dayIndex = daysOfWeek.findIndex((d) =>
          d.startsWith(dayPart.toLowerCase().slice(0, 3))
        );
        if (dayIndex !== -1) {
          const day = daysOfWeek[dayIndex];
          dayMap[day] = [...new Set([...dayMap[day], ...availableTimes])]; // Merge and deduplicate
        }
      }
    });

    // Sort times for each day
    Object.keys(dayMap).forEach((day) => dayMap[day].sort());
    return dayMap;
  }, [service]);

  // - Calculate which dates have *any* availability -
  const datesWithAvailability = useMemo(() => {
    const availabilityMap = parseAvailability();
    const availableSet = new Set<string>();
    const daysOfWeek = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];

    availableDates.forEach((dateStr) => {
      const dateObj = new Date(dateStr + "T00:00:00");
      const dayOfWeek = daysOfWeek[dateObj.getDay()];
      const timesForDay = availabilityMap[dayOfWeek] || [];

      // Check if there are future times available for today
      if (dateStr === today.toISOString().split("T")[0]) {
        const now = new Date();
        const currentHour = now.getHours();
        const futureTimesExist = timesForDay.some((time) => {
          const [hour] = time.split(":").map(Number);
          return hour > currentHour;
        });
        if (futureTimesExist) {
          availableSet.add(dateStr);
        }
      } else if (timesForDay.length > 0) {
        // For future dates, any time slot makes the date available
        availableSet.add(dateStr);
      }
    });
    return availableSet;
  }, [availableDates, parseAvailability, today]);
  // - End Availability Calculation -

  const updateAvailableTimes = useCallback(
    (dateStr: string) => {
      if (!dateStr) {
        setAvailableTimesForDate([]);
        return;
      }
      const selectedDateObj = new Date(dateStr + "T00:00:00"); // Use local timezone
      const dayOfWeek = selectedDateObj
        .toLocaleDateString("en-US", { weekday: "long" })
        .toLowerCase();
      const availabilityMap = parseAvailability();
      let times = availabilityMap[dayOfWeek] || [];

      // Filter out past times if the selected date is today
      if (dateStr === today.toISOString().split("T")[0]) {
        const now = new Date();
        const currentHour = now.getHours();
        times = times.filter((time) => {
          const [hour] = time.split(":").map(Number);
          return hour > currentHour; // Only allow booking for future hours today
        });
      }

      setAvailableTimesForDate(times);
    },
    [parseAvailability, today]
  );
  // - End Availability Parsing Logic -

  const handleDateChange = (dateStr: string) => {
    // Only allow selecting dates that have availability
    if (!datesWithAvailability.has(dateStr)) return;
    setSelectedDate(dateStr);
    setSelectedTime(""); // Reset time when date changes
    updateAvailableTimes(dateStr);
  };

  const handleSubmit = () => {
    if (service && selectedDate && selectedTime && !isOwnService) {
      onSchedule(service.id, selectedDate, selectedTime);
    }
  };

  // Reset state when modal opens or service changes
  useEffect(() => {
    if (isOpen) {
      setSelectedDate("");
      setSelectedTime("");
      setAvailableTimesForDate([]);
    } else {
      // Optional: Clear state when closing
      setSelectedDate("");
      setSelectedTime("");
      setAvailableTimesForDate([]);
    }
  }, [isOpen, service]); // Add service as dependency

  if (!service || !isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center p-4 z-[60]"
      onClick={onClose}
    >
      {/* Modal Content */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10, transition: { duration: 0.2 } }}
        transition={{ type: "spring", stiffness: 260, damping: 25 }}
        className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden relative"
        onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center p-5 border-b border-neutral-200 dark:border-neutral-700">
          <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">
            Schedule: {service.title}
          </h2>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-1.5 rounded-full text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
          >
            <X size={20} />
          </motion.button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {isOwnService ? (
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700/50 rounded-lg">
              <Info
                size={18}
                className="inline-block mr-2 text-yellow-600 dark:text-yellow-400"
              />
              <span className="text-sm text-yellow-700 dark:text-yellow-300">
                You cannot schedule your own service.
              </span>
            </div>
          ) : (
            <>
              {/* Date Selection */}
              <div>
                <label
                  htmlFor="schedule-date"
                  className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5"
                >
                  Select Date
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                  {availableDates.map((dateStr) => {
                    const dateObj = new Date(dateStr + "T00:00:00");
                    const isSelected = selectedDate === dateStr;
                    const hasAvailability = datesWithAvailability.has(dateStr);
                    return (
                      <button
                        key={dateStr}
                        onClick={() => handleDateChange(dateStr)}
                        disabled={!hasAvailability} // Disable button if no availability
                        className={`relative p-2.5 rounded-lg text-center text-xs font-medium border transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-cyan-500 ${
                          isSelected
                            ? "bg-cyan-600 border-cyan-600 text-white shadow-md scale-105"
                            : hasAvailability
                            ? "bg-white dark:bg-neutral-700 border-neutral-200 dark:border-neutral-600 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-600/70 hover:border-neutral-300 dark:hover:border-neutral-500 cursor-pointer"
                            : "bg-neutral-100 dark:bg-neutral-700/50 border-neutral-200/50 dark:border-neutral-600/50 text-neutral-400 dark:text-neutral-500 cursor-not-allowed opacity-70" // Style for unavailable dates
                        }`}
                      >
                        <span className="block font-semibold text-sm mb-0.5">
                          {dateObj.toLocaleDateString("en-US", {
                            day: "numeric",
                          })}
                        </span>
                        <span className="block opacity-80">
                          {dateObj.toLocaleDateString("en-US", {
                            month: "short",
                          })}
                        </span>
                        <span className="block opacity-60 text-[10px]">
                          {dateObj.toLocaleDateString("en-US", {
                            weekday: "short",
                          })}
                        </span>
                        {/* Adding a visual indicator for available dates */}
                        {hasAvailability && !isSelected && (
                          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-cyan-500 rounded-full"></span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Selection */}
              {selectedDate && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <label
                    htmlFor="schedule-time"
                    className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5"
                  >
                    Select Time
                  </label>
                  {availableTimesForDate.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                      {availableTimesForDate.map((timeStr) => {
                        const isSelected = selectedTime === timeStr;
                        // Format time for display (ex: 09:00 -> 9:00 AM)
                        const [hour, minute] = timeStr.split(":").map(Number);
                        const period = hour >= 12 ? "PM" : "AM";
                        const displayHour = hour % 12 === 0 ? 12 : hour % 12;
                        const displayTime = `${displayHour}:${String(
                          minute
                        ).padStart(2, "0")} ${period}`;

                        return (
                          <button
                            key={timeStr}
                            onClick={() => setSelectedTime(timeStr)}
                            className={`p-2.5 rounded-lg text-center text-xs font-medium border transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-cyan-500 ${
                              isSelected
                                ? "bg-cyan-600 border-cyan-600 text-white shadow-md scale-105"
                                : "bg-white dark:bg-neutral-700 border-neutral-200 dark:border-neutral-600 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-600/70 hover:border-neutral-300 dark:hover:border-neutral-500"
                            }`}
                          >
                            {displayTime}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 italic p-3 bg-neutral-50 dark:bg-neutral-700/50 rounded-md text-center">
                      No available times for this date.
                    </p>
                  )}
                </motion.div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        {!isOwnService && (
          <div className="flex justify-end items-center p-4 bg-neutral-50 dark:bg-neutral-700/50 border-t border-neutral-200 dark:border-neutral-700 space-x-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-200 bg-white dark:bg-neutral-600 border border-neutral-300 dark:border-neutral-500 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-neutral-400 transition-colors"
            >
              Cancel
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              disabled={!selectedDate || !selectedTime}
              className="px-5 py-2 text-sm font-semibold text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-cyan-600 shadow-sm hover:shadow-md disabled:shadow-none"
            >
              Confirm Booking
            </motion.button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

// - Main App Component -
const App = () => {
  // - State Definitions -
  const [services, setServices] = useState<Service[]>(initialServices);
  const [matches] = useState<Match[]>(initialMatches); // Removed setMatches as it's not used
  const [conversations, setConversations] =
    useState<Conversation[]>(initialConversations);
  const [bookings, setBookings] = useState<Booking[]>([]);

  // UI State
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showServiceDetails, setShowServiceDetails] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [newConversationName, setNewConversationName] = useState("");
  const [showNewChatInput, setShowNewChatInput] = useState(false);
  const [newMessage, setNewMessage] = useState<{ [key: number]: string }>({});
  const [typing, setTyping] = useState<{ [key: number]: boolean }>({});
  const [activeConversation, setActiveConversation] = useState<number | null>(
    null
  );
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState<number | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [isCompactView, setIsCompactView] = useState<boolean>(false);
  const [isConversationCollapsed, setIsConversationCollapsed] = useState(true);
  const [darkMode, setDarkMode] = useState<boolean | undefined>(undefined); // Start undefined to prevent hydration mismatch
  const [isHydrated, setIsHydrated] = useState(false); // Track when client-side hydration is complete

  // Derived State | Refs
  const messageEndRef = useRef<HTMLDivElement>(null);
  const currentUserId = 1; // Alice is user 1

  // - Handlers (Moved up for proper initialization) -

  // Show notification (Using useCallback for stability)
  const showAppNotification = useCallback((message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
    const timer = setTimeout(() => {
      setShowNotification(false);
    }, 4000);
    return () => clearTimeout(timer); // Cleanup function
  }, []); // No dependencies needed if it only uses setters

  // Mark messages as read (useCallback)
  const handleSetActiveConversation = useCallback(
    (conversationId: number) => {
      setActiveConversation(conversationId);
      setShowEmojiPicker(null); // Close emoji picker on convo switch
      setConversations((prevConvos) =>
        prevConvos.map((convo) => {
          if (convo.id === conversationId && convo.unreadCount > 0) {
            // Mark messages from the *other* user as read
            const updatedMessages = convo.messages.map((msg) =>
              msg.userId !== currentUserId && !msg.read
                ? { ...msg, read: true }
                : msg
            );
            return { ...convo, messages: updatedMessages, unreadCount: 0 };
          }
          return convo;
        })
      );
    },
    [currentUserId]
  );

  // - Effects (Only for testing) -

  // Apply dark mode class to HTML element
  useEffect(() => {
    if (darkMode === undefined) return; // Don't apply changes until darkMode is determined

    // Apply or remove dark mode class with transition
    const html = document.documentElement;

    // Add transition class first for smooth theme change
    html.classList.add("color-theme-in-transition");

    // After a short delay, apply the theme change
    setTimeout(() => {
      if (darkMode) {
        html.classList.add("dark");
      } else {
        html.classList.remove("dark");
      }

      // Remove transition class after theme applied
      setTimeout(() => {
        html.classList.remove("color-theme-in-transition");
      }, 100);
    }, 10);

    // Persist dark mode preference in localStorage
    localStorage.setItem("darkMode", JSON.stringify(darkMode));

    // Show notification about theme change (only if not initial load)
    if (typeof window !== "undefined") {
      showAppNotification(`${darkMode ? "Dark" : "Light"} mode activated`);
    }
  }, [darkMode, showAppNotification]);

  // Initialize dark mode from localStorage (client-side only)
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode !== null) {
      setDarkMode(JSON.parse(savedMode));
    } else {
      // If no saved preference, use system preference
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setDarkMode(prefersDark);
    }
    setIsHydrated(true); // Mark as hydrated after dark mode is determined
  }, []);

  // Initialize active conversation
  useEffect(() => {
    if (
      !isConversationCollapsed &&
      activeConversation === null &&
      conversations.length > 0
    ) {
      const filteredConvos = conversations.filter((conversation) => {
        if (!showFavoritesOnly) return true;
        if (conversation.serviceId) {
          const linkedService = services.find(
            (s) => s.id === conversation.serviceId
          );
          return linkedService?.isFavorite === true;
        }
        return false; // Don't show non-service related chats in favorites only mode
      });
      const sortedFilteredConvos = [...filteredConvos].sort(
        (a, b) => b.lastActive.getTime() - a.lastActive.getTime()
      );
      if (sortedFilteredConvos.length > 0) {
        handleSetActiveConversation(sortedFilteredConvos[0].id);
      } else {
        setActiveConversation(null); // Ensure no active convo if filter yields empty
      }
    }
  }, [
    conversations,
    showFavoritesOnly,
    isConversationCollapsed,
    activeConversation,
    services,
    handleSetActiveConversation,
  ]);

  // Welcome notification (only after hydration is complete)
  useEffect(() => {
    if (!isHydrated) return; // Wait for hydration to complete

    const timer = setTimeout(() => {
      showAppNotification(`Welcome back, ${currentUser.name}!`);
    }, 1200);
    return () => clearTimeout(timer);
  }, [isHydrated, showAppNotification]); // Removed currentUser.name as it's not changing

  // Scroll to bottom of messages
  useEffect(() => {
    if (activeConversation && !isConversationCollapsed) {
      // Using requestAnimationFrame for potentially smoother scroll after render
      requestAnimationFrame(() => {
        messageEndRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      });
    }
  }, [conversations, activeConversation, isConversationCollapsed]);

  // - Handlers (Mostly unchanged logic) -

  // Simulate read receipts (useCallback)
  const simulateReadReceipts = useCallback(
    (conversationId: number) => {
      setTimeout(() => {
        setConversations((prevConvos) =>
          prevConvos.map((convo) => {
            if (convo.id === conversationId) {
              // Mark messages *sent by the current user* as read by the opponent
              return {
                ...convo,
                messages: convo.messages.map((msg) =>
                  msg.userId === currentUserId && !msg.read
                    ? { ...msg, read: true }
                    : msg
                ),
              };
            }
            return convo;
          })
        );
      }, 1200 + Math.random() * 800); // faster simulation
    },
    [currentUserId]
  );

  // Send message (useCallback)
  const handleSendMessage = useCallback(
    (conversationId: number) => {
      const text = newMessage[conversationId]?.trim();
      if (!text || !activeConversation || conversationId !== activeConversation)
        return; // active convo matches

      const newMsg: Message = {
        id: Date.now(),
        text: text,
        userId: currentUserId,
        timestamp: new Date(),
        read: false, // Starts as unread
        isEmoji: text.length <= 4 && /\p{Emoji}/u.test(text),
      };

      setConversations((prevConvos) => {
        const convoIndex = prevConvos.findIndex((c) => c.id === conversationId);
        if (convoIndex === -1) return prevConvos; // Should not happen if activeConversation is set

        const updatedConvo = {
          ...prevConvos[convoIndex],
          lastActive: new Date(), // Update last active time
          messages: [...prevConvos[convoIndex].messages, newMsg],
        };

        // Move the updated conversation to the top and return sorted list
        const otherConvos = prevConvos.filter((c) => c.id !== conversationId);
        return [updatedConvo, ...otherConvos].sort(
          (a, b) => b.lastActive.getTime() - a.lastActive.getTime()
        );
      });

      setNewMessage((prev) => ({ ...prev, [conversationId]: "" })); // Clear input for this convo
      setTyping((prev) => ({ ...prev, [conversationId]: false })); // Stop typing indicator
      setShowEmojiPicker(null); // Close emoji picker
      simulateReadReceipts(conversationId); // Simulate opponent reading the message

      // Explicitly scroll after sending
      requestAnimationFrame(() => {
        messageEndRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      });
    },
    [activeConversation, newMessage, currentUserId, simulateReadReceipts]
  );

  // Typing handler (useCallback)
  const typingTimeoutRef = useRef<{ [key: number]: NodeJS.Timeout }>({});
  const handleTyping = useCallback(
    (conversationId: number, value: string) => {
      if (!activeConversation || conversationId !== activeConversation) return; // Check active convo

      setNewMessage((prev) => ({ ...prev, [conversationId]: value }));

      if (typingTimeoutRef.current[conversationId]) {
        clearTimeout(typingTimeoutRef.current[conversationId]);
      }

      if (!typing[conversationId] && value.length > 0) {
        setTyping((prev) => ({ ...prev, [conversationId]: true }));
      } else if (typing[conversationId] && value.length === 0) {
        // Immediately clear if input is empty
        setTyping((prev) => ({ ...prev, [conversationId]: false }));
        return; // No need for timeout if cleared
      }

      // Only set timeout if there's text
      if (value.length > 0) {
        typingTimeoutRef.current[conversationId] = setTimeout(() => {
          setTyping((prev) => ({ ...prev, [conversationId]: false }));
        }, 1500); // Keep timeout duration
      }
    },
    [activeConversation, typing]
  );

  // Emoji select (useCallback)
  const handleEmojiSelect = useCallback(
    (emoji: string, conversationId: number) => {
      if (!activeConversation || conversationId !== activeConversation) return;
      const currentText = newMessage[conversationId] || "";
      // Append emoji and trigger typing indicator correctly
      handleTyping(conversationId, currentText + emoji);
      setShowEmojiPicker(null); // Close picker
      // Focus the input field after selecting emoji (optional but good UX)
      // document.getElementById(`message-input-${conversationId}`)?.focus();
    },
    [activeConversation, handleTyping, newMessage]
  );

  // View details (useCallback)
  const handleViewServiceDetails = useCallback(
    (serviceId: number) => {
      const service = services.find((s) => s.id === serviceId);
      if (service) {
        setSelectedService(service);
        setShowServiceDetails(true);
      }
    },
    [services]
  );

  // Open schedule modal (useCallback)
  const handleScheduleService = useCallback(
    (serviceId: number) => {
      const service = services.find((s) => s.id === serviceId);
      if (service) {
        setSelectedService(service);
        // Decide whether to close details modal or not - keeping it open might be fine
        // setShowServiceDetails(false);
        setShowScheduleModal(true);
      }
    },
    [services]
  );

  // Handle contact seller button click (useCallback)
  const handleContactSeller = useCallback(
    (serviceId: number) => {
      const service = services.find((s) => s.id === serviceId);
      if (!service) return;

      const existingConversation = conversations.find(
        (c) => c.participantUserId === service.userId // Check only participant ID for simplicity here
      );

      let targetConversationId: number;

      if (existingConversation) {
        targetConversationId = existingConversation.id;
        // Optionally update lastActive time even if just opening
        setConversations((prev) =>
          prev
            .map((c) =>
              c.id === targetConversationId
                ? { ...c, lastActive: new Date() }
                : c
            )
            .sort((a, b) => b.lastActive.getTime() - a.lastActive.getTime())
        );
        showAppNotification(`Opened conversation with ${service.userName}.`);
      } else {
        // Create new conversation
        const highestId = Math.max(0, ...conversations.map((c) => c.id)); // highestId >= 0
        const newConvo: Conversation = {
          id: highestId + 1,
          participantUserId: service.userId,
          participantUserName: service.userName,
          participantAvatar: service.avatar,
          unreadCount: 0,
          lastActive: new Date(),
          serviceId: service.id, // Link conversation to the service
          messages: [
            {
              // System message indicating context
              id: Date.now(),
              text: `You started a conversation about "${service.title}".`,
              userId: currentUserId, // Indicates who initiated
              timestamp: new Date(),
              read: true, // User's own message is read
              isSystemMessage: true,
            },
          ],
        };

        setConversations((prev) =>
          [...prev, newConvo].sort(
            (a, b) => b.lastActive.getTime() - a.lastActive.getTime()
          )
        );
        targetConversationId = newConvo.id;
        showAppNotification(
          `Started new conversation with ${service.userName}.`
        );
      }

      // Common actions for both existing and new conversations
      handleSetActiveConversation(targetConversationId);
      setShowServiceDetails(false); // Close details modal
      setIsConversationCollapsed(false); // Expand conversation panel
      // Focus the message input for the new/opened conversation
      //  setTimeout(() => document.getElementById(`message-input-${targetConversationId}`)?.focus(), 100);
    },
    [
      conversations,
      services,
      showAppNotification,
      currentUserId,
      handleSetActiveConversation,
    ]
  );

  // Confirm schedule (useCallback)
  const handleScheduleConfirm = useCallback(
    (serviceId: number, date: string, time: string) => {
      const service = services.find((s) => s.id === serviceId);
      if (!service) return;

      const newBooking: Booking = {
        id: Date.now(), // Simple ID generation
        serviceId,
        userId: currentUserId,
        date,
        time,
        status: "confirmed",
        createdAt: new Date(),
      };
      setBookings((prev) => [...prev, newBooking]);
      setServices((prev) =>
        prev.map((s) => (s.id === serviceId ? { ...s, isBooked: true } : s))
      );

      // Find or Create Conversation
      let targetConvoId: number | null = null;
      const existingConversationIndex = conversations.findIndex(
        (c) => c.participantUserId === service.userId
      );

      const formattedDate = new Date(date + "T00:00:00").toLocaleDateString(
        "en-US",
        { weekday: "short", month: "short", day: "numeric" }
      );
      const bookingMessageText = `✅ Booking confirmed for "${service.title}" on ${formattedDate} at ${time}.`;
      const bookingMessage: Message = {
        id: Date.now() + 1,
        text: bookingMessageText,
        userId: currentUserId,
        timestamp: new Date(),
        read: false,
        isSystemMessage: true,
      };
      // Simulate a friendly confirmation response from the provider
      const responseMessage: Message = {
        id: Date.now() + 2,
        text: `Great, looking forward to it, ${currentUser.name}! See you on ${formattedDate}.`,
        userId: service.userId,
        timestamp: new Date(Date.now() + 1000),
        read: false,
        isSystemMessage: false,
      };

      if (existingConversationIndex > -1) {
        targetConvoId = conversations[existingConversationIndex].id;
        setConversations((prevConvos) =>
          prevConvos
            .map((convo, index) => {
              if (index === existingConversationIndex) {
                return {
                  ...convo,
                  messages: [
                    ...convo.messages,
                    bookingMessage,
                    responseMessage,
                  ],
                  unreadCount:
                    convo.id === activeConversation ? 0 : convo.unreadCount + 1, // Increment unread only if not active
                  lastActive: new Date(),
                };
              }
              return convo;
            })
            .sort((a, b) => b.lastActive.getTime() - a.lastActive.getTime())
        );
      } else {
        // Create new conversation if none exists
        const highestConvoId = Math.max(0, ...conversations.map((c) => c.id));
        const newConvo: Conversation = {
          id: highestConvoId + 1,
          participantUserId: service.userId,
          participantUserName: service.userName,
          participantAvatar: service.avatar,
          serviceId: service.id,
          unreadCount: 1, // Starts with 1 unread (the response message)
          lastActive: new Date(),
          messages: [bookingMessage, responseMessage], // Start with both messages
        };
        targetConvoId = newConvo.id;
        setConversations((prev) =>
          [...prev, newConvo].sort(
            (a, b) => b.lastActive.getTime() - a.lastActive.getTime()
          )
        );
      }

      showAppNotification(`Booking confirmed for ${service.title}!`);
      setShowScheduleModal(false); // Close schedule modal
      setSelectedService(null); // Clear selected service to prevent details modal reopening

      // Ensure conversation panel is open and the relevant conversation is active
      setIsConversationCollapsed(false);
      if (targetConvoId) {
        handleSetActiveConversation(targetConvoId);
        // Focus input after booking confirmation (optional)
        // setTimeout(() => document.getElementById(`message-input-${targetConvoId}`)?.focus(), 100);
      }
    },
    [
      conversations,
      currentUserId,
      services,
      showAppNotification,
      activeConversation,
      handleSetActiveConversation,
    ]
  );

  // Toggle favorite (useCallback)
  const handleToggleFavorite = useCallback(
    (serviceId: number) => {
      let serviceTitle = "";
      let isNowFavorite = false; // Track the *new* state

      setServices((prevServices) =>
        prevServices.map((s) => {
          if (s.id === serviceId) {
            serviceTitle = s.title;
            isNowFavorite = !(s.isFavorite ?? false); // Determine the new state
            return { ...s, isFavorite: isNowFavorite };
          }
          return s;
        })
      );

      // Update favorite status in the selectedService state if it's the one being viewed
      if (selectedService?.id === serviceId) {
        setSelectedService((prev) =>
          prev ? { ...prev, isFavorite: isNowFavorite } : null
        );
      }

      const action = isNowFavorite ? "added to" : "removed from";
      if (serviceTitle) {
        showAppNotification(`"${serviceTitle}" ${action} favorites.`);
      }
    },
    [showAppNotification, selectedService]
  ); // Removed services as unnecessary dependency

  // Cancel booking (useCallback)
  const handleCancelBooking = useCallback(
    (bookingId: number) => {
      const booking = bookings.find((b) => b.id === bookingId);
      if (!booking) return;

      const service = services.find((s) => s.id === booking.serviceId);
      if (!service) return;

      // Update bookings state
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: "canceled" } : b))
      );
      // Update service state (potentially check if other bookings exist for this service)
      const otherBookingsExist = bookings.some(
        (b) =>
          b.serviceId === booking.serviceId &&
          b.id !== bookingId &&
          b.status === "confirmed"
      );
      if (!otherBookingsExist) {
        setServices((prev) =>
          prev.map((s) =>
            s.id === booking.serviceId ? { ...s, isBooked: false } : s
          )
        );
      }

      // Find conversation to add cancellation message
      const conversationIndex = conversations.findIndex(
        (c) => c.participantUserId === service.userId
      );
      const formattedDate = new Date(
        booking.date + "T00:00:00"
      ).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const cancelMessageText = `⚠️ Booking canceled for "${service.title}" on ${formattedDate} at ${booking.time}.`;
      const cancelMessage: Message = {
        id: Date.now(),
        text: cancelMessageText,
        userId: currentUserId,
        timestamp: new Date(),
        read: false,
        isSystemMessage: true, // Style as system message
      };

      if (conversationIndex > -1) {
        setConversations((prevConvos) =>
          prevConvos
            .map((convo, index) => {
              if (index === conversationIndex) {
                return {
                  ...convo,
                  messages: [...convo.messages, cancelMessage],
                  // Don't necessarily increase unread count for a cancellation notice
                  lastActive: new Date(), // Update activity time
                };
              }
              return convo;
            })
            .sort((a, b) => b.lastActive.getTime() - a.lastActive.getTime())
        );

        // Optionally make this conversation active after cancellation
        handleSetActiveConversation(conversations[conversationIndex].id);
        setIsConversationCollapsed(false);
      }
      // If no conversation exists, don't create one just for cancellation

      showAppNotification(`Booking for "${service.title}" canceled.`);
    },
    [
      bookings,
      conversations,
      services,
      showAppNotification,
      currentUserId,
      handleSetActiveConversation,
    ]
  );

  // Add new conversation (useCallback)
  const handleAddNewConversation = useCallback(() => {
    const trimmedName = newConversationName.trim();
    if (trimmedName === "") return;

    // Check if conversation with this *user name* already exists
    // For some info: This assumes user names are unique identifiers for conversations in this context
    const existingConversation = conversations.find(
      (c) => c.participantUserName.toLowerCase() === trimmedName.toLowerCase()
    );

    if (existingConversation) {
      handleSetActiveConversation(existingConversation.id);
      setNewConversationName("");
      setShowNewChatInput(false);
      showAppNotification(`Opened existing chat with ${trimmedName}.`);
      setIsConversationCollapsed(false); // panel is open
      return;
    }

    // Try to find a service associated with this user name to get avatar, ID, etc.
    const userService = services.find(
      (s) => s.userName.toLowerCase() === trimmedName.toLowerCase()
    );
    // Generate a placeholder ID if no user service is found (could be a user without a listed service)
    const participantUserId = userService ? userService.userId : Date.now(); // Use timestamp as fallback ID
    const participantAvatar = userService?.avatar;
    const associatedServiceId = userService?.id;

    const highestId = Math.max(0, ...conversations.map((c) => c.id));
    const newConvo: Conversation = {
      id: highestId + 1,
      participantUserId: participantUserId,
      participantUserName: trimmedName, // Use the entered name
      participantAvatar: participantAvatar,
      unreadCount: 0,
      lastActive: new Date(),
      serviceId: associatedServiceId, // Link if service found
      messages: [
        {
          // Initial system message
          id: Date.now(),
          text: `You started a conversation with ${trimmedName}.`,
          userId: currentUserId,
          timestamp: new Date(),
          read: true,
          isSystemMessage: true,
        },
      ],
    };

    // Simulate a greeting if it's a known service provider (optional)
    if (userService) {
      const greetingMessage: Message = {
        id: Date.now() + 1,
        text: `Hi ${currentUser.name}! I'm ${trimmedName}. How can I help?`, // Simpler greeting
        userId: participantUserId,
        timestamp: new Date(Date.now() + 500), // Slightly delayed
        read: false, // Unread for current user
      };
      newConvo.messages.push(greetingMessage);
      newConvo.unreadCount = 1; // Set unread count because of the greeting
    }

    setConversations((prev) =>
      [...prev, newConvo].sort(
        (a, b) => b.lastActive.getTime() - a.lastActive.getTime()
      )
    );
    handleSetActiveConversation(newConvo.id);
    setNewConversationName("");
    setShowNewChatInput(false);
    showAppNotification(`Started new conversation with ${trimmedName}.`);
    setIsConversationCollapsed(false); // panel is open
  }, [
    newConversationName,
    conversations,
    handleSetActiveConversation,
    services,
    showAppNotification,
    currentUserId,
  ]);

  // Delete conversation (useCallback)
  const handleDeleteConversation = useCallback(
    (conversationId: number) => {
      const convoToDelete = conversations.find((c) => c.id === conversationId);
      if (!convoToDelete) return;

      // UI update
      const updatedConvos = conversations.filter(
        (c) => c.id !== conversationId
      );
      setConversations(updatedConvos);

      // If the deleted conversation was active, select the next logical one
      if (activeConversation === conversationId) {
        const remainingFilteredSortedConvos = updatedConvos
          .filter(
            (c) =>
              !showFavoritesOnly ||
              (c.serviceId &&
                services.find((s) => s.id === c.serviceId)?.isFavorite)
          )
          .sort((a, b) => b.lastActive.getTime() - a.lastActive.getTime());

        const nextActiveId =
          remainingFilteredSortedConvos.length > 0
            ? remainingFilteredSortedConvos[0].id
            : null;
        setActiveConversation(nextActiveId); // Select next or null
      }

      showAppNotification(
        `Conversation with ${convoToDelete.participantUserName} deleted.`
      );
    },
    [
      activeConversation,
      conversations,
      services,
      showFavoritesOnly,
      showAppNotification,
    ]
  );

  // Filter by category (useCallback)
  const handleFilterByCategory = useCallback((category: string | null) => {
    setCategoryFilter(category);
  }, []);

  // - UI Rendering Logic -

  // Filtered Services
  const filteredServices = services
    .filter((service) => {
      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearch =
        searchTerm === "" ||
        service.title.toLowerCase().includes(searchTermLower) ||
        service.description.toLowerCase().includes(searchTermLower) ||
        service.userName.toLowerCase().includes(searchTermLower) ||
        service.category.toLowerCase().includes(searchTermLower);
      const matchesCategory =
        categoryFilter === null || service.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    // Sort: Favorites first, I'll stick to favorites priority
    .sort((a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0));

  const categories = Array.from(
    new Set(services.map((s) => s.category))
  ).sort();

  // Filtered & Sorted Conversations
  const filteredAndSortedConversations = [...conversations]
    .filter((conversation) => {
      // If not filtering by favorites, show all
      if (!showFavoritesOnly) return true;
      // If filtering by favorites, only show convos linked to a favorited service
      const linkedService = conversation.serviceId
        ? services.find((s) => s.id === conversation.serviceId)
        : null;
      return linkedService?.isFavorite === true;
    })
    .sort((a, b) => b.lastActive.getTime() - a.lastActive.getTime()); // Always sort by most recent

  const totalUnreadMessages = conversations.reduce(
    (total, conversation) => total + conversation.unreadCount,
    0
  );
  const activeBookings = bookings
    .filter((booking) => booking.status === "confirmed")
    .sort(
      (a, b) =>
        new Date(a.date + "T" + a.time).getTime() -
        new Date(b.date + "T" + b.time).getTime()
    ); // Sort bookings chronologically
  const showBookingsSection = activeBookings.length > 0;

  // - JSX Structure -
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 pt-2 pb-4 px-4 md:pt-3 md:pb-6 md:px-6 lg:pt-4 lg:pb-8 lg:px-8">
      {/* Apply scrollbar styles */}
      <style dangerouslySetInnerHTML={{ __html: scrollbarStyles }} />

      {/* Header */}
      <header className="flex justify-between items-center mb-4 md:mb-6 flex-shrink-0 pb-4 border-b border-neutral-200 dark:border-neutral-700/80">
        <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 dark:text-neutral-100">
          Service<span className="text-cyan-600 dark:text-cyan-400">Swap</span>
        </h1>
        <div className="flex items-center space-x-3 md:space-x-4">
          {/* Search Bar */}
          <div className="relative">
            {" "}
            {/* Remove hidden sm:block to make visible on all screens */}
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="py-2 pl-10 pr-4 text-sm w-40 sm:w-48 md:w-72 rounded-full border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-neutral-900 focus:ring-cyan-500 focus:border-cyan-500 dark:focus:border-cyan-500 placeholder-neutral-400 dark:placeholder-neutral-500 text-neutral-800 dark:text-neutral-100 transition duration-200 ease-in-out shadow-sm focus:shadow-md"
              aria-label="Search available services"
            />
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 pointer-events-none"
            />
          </div>

          {/* Dark Mode Toggle */}
          <motion.button
            whileTap={{ scale: 0.9, rotate: 15 }}
            onClick={() => setDarkMode(!darkMode)}
            disabled={darkMode === undefined} // Disable until darkMode is determined
            className={`p-2 rounded-full transition-colors duration-200 ease-in-out ${
              darkMode === undefined
                ? "bg-neutral-200 dark:bg-neutral-700 text-neutral-400 dark:text-neutral-500 cursor-not-allowed"
                : darkMode
                ? "bg-neutral-700/30 text-yellow-300 hover:bg-neutral-700/50 hover:text-yellow-400"
                : "bg-blue-100/50 text-blue-700 hover:bg-blue-100/80 hover:text-blue-800"
            } focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900 focus-visible:ring-cyan-500`}
            aria-label={
              darkMode === undefined
                ? "Loading theme..."
                : darkMode
                ? "Switch to Light Mode"
                : "Switch to Dark Mode"
            }
            title={
              darkMode === undefined
                ? "Loading theme..."
                : darkMode
                ? "Switch to Light Mode"
                : "Switch to Dark Mode"
            }
          >
            {darkMode === undefined ? (
              <Loader2 size={20} className="animate-spin" />
            ) : darkMode ? (
              <Sun size={20} className="fill-current" />
            ) : (
              <Moon size={20} className="fill-current" />
            )}
          </motion.button>

          {/* Conversation Toggle Button with Tooltip */}
          <div className="relative group">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() =>
                setIsConversationCollapsed(!isConversationCollapsed)
              }
              className="relative p-2 rounded-full text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200/70 dark:hover:bg-neutral-700/70 hover:text-neutral-800 dark:hover:text-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900 focus-visible:ring-cyan-500 transition-colors"
              aria-label={
                isConversationCollapsed
                  ? "Show Conversations"
                  : "Hide Conversations"
              }
            >
              {isConversationCollapsed ? (
                <PanelRightOpen size={20} />
              ) : (
                <PanelRightClose size={20} />
              )}
              {/* Notification Badge */}
              {totalUnreadMessages > 0 && isConversationCollapsed && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 15,
                    delay: 0.1,
                  }}
                  className="absolute -top-1 -right-1 bg-rose-500 dark:bg-rose-600 text-white text-[10px] font-bold rounded-full h-4.5 w-4.5 flex items-center justify-center border-2 border-white dark:border-neutral-800" // Dark mode border
                >
                  {totalUnreadMessages > 9 ? "9+" : totalUnreadMessages}
                </motion.div>
              )}
            </motion.button>
            {/* Tooltip */}
            <div
              className="absolute invisible opacity-0 group-hover:visible group-hover:opacity-100 group-hover:delay-400 transition-all duration-200 ease-in-out
                             top-full mt-2.5 left-1/2 -translate-x-1/2 bg-neutral-800 dark:bg-neutral-700 text-white text-xs py-1 px-3 rounded-md shadow-lg whitespace-nowrap z-30 pointer-events-none"
            >
              {isConversationCollapsed ? "Show Chats" : "Hide Chats"}
              {totalUnreadMessages > 0 && isConversationCollapsed && (
                <span className="ml-1 opacity-80">
                  ({totalUnreadMessages} unread)
                </span>
              )}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-[5px] border-x-transparent border-b-[5px] border-b-neutral-800 dark:border-b-neutral-700"></div>{" "}
              {/* Arrow */}
            </div>
          </div>
          {/* User Avatar in Header */}
          <UserAvatar
            name={currentUser.name}
            avatar={currentUser.avatar}
            size="md"
          />
        </div>
      </header>

      {/* Main Content Area */}
      <div
        className={`flex-grow grid grid-cols-1 ${
          isConversationCollapsed
            ? "lg:grid-cols-1"
            : "lg:grid-cols-[minmax(0,_1fr)_minmax(360px,_420px)] xl:grid-cols-[minmax(0,_1fr)_480px]"
        } gap-4 md:gap-6 min-h-0 transition-all duration-300 ease-in-out overflow-hidden`}
      >
        {/* Left Column - Services and Bookings */}
        <div
          className={`flex flex-col space-y-4 md:space-y-6 overflow-hidden ${
            isConversationCollapsed ? "lg:col-span-1" : ""
          }`}
        >
          {/* Services Section */}
          <motion.section
            layout // Animate layout changes
            aria-labelledby="services-heading"
            className="flex flex-col rounded-2xl bg-white/80 dark:bg-neutral-800/60 backdrop-blur-xl shadow-lg dark:shadow-neutral-900/60 border border-neutral-200/60 dark:border-neutral-700/50 p-4 md:p-6 overflow-hidden flex-grow"
          >
            {/* Services Header - Improved Layout & Filters */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 flex-shrink-0 gap-4">
              <h2
                id="services-heading"
                className="text-xl font-semibold text-neutral-700 dark:text-neutral-200"
              >
                Available Services
              </h2>
              <div className="flex flex-wrap items-center gap-2">
                {/* Compact View Toggle */}
                <div className="hidden lg:flex mr-3 border-r border-neutral-200 dark:border-neutral-700 pr-3">
                  {" "}
                  {/* Hide on smaller screens */}
                  <ToggleSwitch
                    id="compact-view"
                    checked={isCompactView}
                    onChange={setIsCompactView}
                    label="Compact"
                    size="sm"
                  />
                </div>
                {/* Category Filters - Pill Style */}
                <div className="flex items-center gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-700 rounded-full border border-neutral-200 dark:border-neutral-600">
                  <button
                    onClick={() => handleFilterByCategory(null)}
                    className={`text-xs px-3.5 py-1 rounded-full transition-all duration-200 ease-in-out flex items-center gap-1.5 ${
                      categoryFilter === null
                        ? "bg-white dark:bg-neutral-800 text-cyan-700 dark:text-cyan-300 shadow font-medium ring-1 ring-inset ring-black/5 dark:ring-white/10"
                        : "text-neutral-600 dark:text-neutral-300 hover:text-neutral-800 dark:hover:text-neutral-100"
                    } focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500`}
                  >
                    <Filter
                      size={12}
                      className={
                        categoryFilter === null
                          ? "text-cyan-500 dark:text-cyan-400"
                          : "text-neutral-400 dark:text-neutral-500"
                      }
                    />
                    All
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleFilterByCategory(category)}
                      className={`text-xs px-3.5 py-1 rounded-full transition-all duration-200 ease-in-out ${
                        categoryFilter === category
                          ? "bg-white dark:bg-neutral-800 text-cyan-700 dark:text-cyan-300 shadow font-medium ring-1 ring-inset ring-black/5 dark:ring-white/10"
                          : "text-neutral-600 dark:text-neutral-300 hover:text-neutral-800 dark:hover:text-neutral-100"
                      } focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Services Grid */}
            <div className="flex-grow overflow-y-auto pr-1 -mr-3 modern-scrollbar">
              <AnimatePresence>
                {filteredServices.length > 0 ? (
                  <motion.div
                    layout // Animate grid changes
                    className={`grid grid-cols-1 ${
                      isCompactView
                        ? "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"
                        : "sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
                    } ${
                      isConversationCollapsed
                        ? isCompactView
                          ? "2xl:grid-cols-4"
                          : "2xl:grid-cols-4"
                        : isCompactView
                        ? ""
                        : ""
                    } gap-4 md:gap-5 auto-rows-fr pb-4 pr-2`}
                  >
                    {" "}
                    {/* Use auto-rows-fr for maybe a better height alignment */}
                    {filteredServices.map((service) => {
                      const matchInfo = matches.find(
                        (match) =>
                          match.serviceId === service.id &&
                          match.status === "accepted"
                      );
                      const matchedService = matchInfo
                        ? services.find(
                            (s) => s.id === matchInfo.matchingServiceId
                          ) || null
                        : null;
                      return (
                        <ServiceCard
                          key={service.id}
                          service={service}
                          matchedService={matchedService}
                          onViewDetails={handleViewServiceDetails}
                          isCompactView={isCompactView}
                        />
                      );
                    })}
                  </motion.div>
                ) : (
                  // Empty State
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center text-center h-full py-20"
                  >
                    <Search
                      size={48}
                      className="text-neutral-300 dark:text-neutral-600 mb-5"
                      strokeWidth={1.5}
                    />
                    <p className="text-lg font-medium text-neutral-600 dark:text-neutral-300 mb-1.5">
                      No Services Found
                    </p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-xs">
                      {searchTerm
                        ? `Your search for "${searchTerm}" didn't match any services.`
                        : "Try adjusting your search or category filters."}
                    </p>
                    {/* Can add a Clear filters button here */}
                    {(searchTerm || categoryFilter) && (
                      <button
                        onClick={() => {
                          setSearchTerm("");
                          setCategoryFilter(null);
                        }}
                        className="mt-4 text-xs px-3 py-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded-full transition-colors"
                      >
                        Clear Filters
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.section>

          {/* Bookings Section */}
          <AnimatePresence>
            {showBookingsSection && (
              <motion.section
                initial={{ opacity: 0, height: 0, y: 25 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{
                  opacity: 0,
                  height: 0,
                  y: 15,
                  transition: { duration: 0.2 },
                }}
                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                aria-labelledby="bookings-heading"
                className="flex flex-col rounded-2xl bg-white/80 dark:bg-neutral-800/60 backdrop-blur-xl shadow-lg dark:shadow-neutral-900/60 border border-neutral-200/60 dark:border-neutral-700/50 p-4 md:p-5 overflow-hidden max-h-[250px] md:max-h-[300px] flex-shrink-0 w-full" // styling
              >
                <h2
                  id="bookings-heading"
                  className="text-lg font-semibold text-neutral-700 dark:text-neutral-200 mb-4 flex-shrink-0"
                >
                  Your Upcoming Bookings
                </h2>
                <div className="space-y-3 overflow-y-auto overflow-x-hidden pr-1 -mr-3 modern-scrollbar">
                  {activeBookings.map((booking) => {
                    const service = services.find(
                      (s) => s.id === booking.serviceId
                    );
                    if (!service) return null;
                    const formattedDate = new Date(
                      booking.date + "T00:00:00"
                    ).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    }); // Longer weekday

                    return (
                      // Booking Item Styling
                      <motion.div
                        key={booking.id}
                        layout // Animate changes if list reorders
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 15 }}
                        className="p-4 bg-gradient-to-r from-white to-neutral-50 dark:from-neutral-700/70 dark:to-neutral-700/90 rounded-xl border border-neutral-200 dark:border-neutral-600/80 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden pr-2" // Nicer bg, rounded-xl
                      >
                        <div className="flex justify-between items-center flex-wrap gap-3">
                          <div className="flex-grow min-w-0 mr-3">
                            <h3 className="font-semibold text-neutral-800 dark:text-neutral-100 truncate text-sm mb-0.5">
                              {service.title}
                            </h3>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate mb-1.5">
                              With{" "}
                              <span className="font-medium text-neutral-600 dark:text-neutral-300">
                                {service.userName}
                              </span>
                            </p>
                            <div className="flex items-center text-xs text-cyan-700 dark:text-cyan-300 font-medium bg-cyan-50 dark:bg-cyan-900/50 px-2.5 py-1 rounded-full border border-cyan-200/70 dark:border-cyan-700/50 max-w-max shadow-xs">
                              <Calendar
                                size={13}
                                className="mr-1.5 flex-shrink-0"
                              />
                              <span>
                                {formattedDate} at {booking.time}
                              </span>
                            </div>
                          </div>
                          {/* Cancel Button */}
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleCancelBooking(booking.id)}
                            className="text-xs px-3.5 py-1.5 bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-300 hover:bg-rose-200 dark:hover:bg-rose-900/70 hover:text-rose-700 dark:hover:text-rose-200 rounded-lg transition-colors font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-rose-500 flex items-center gap-1"
                            title="Cancel this booking"
                          >
                            <Trash size={13} /> Cancel
                          </motion.button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>

        {/* Conversations Section - Right Panel */}
        <AnimatePresence>
          {!isConversationCollapsed && (
            <motion.section
              initial={{ opacity: 0, x: 50 }} // Start closer
              animate={{ opacity: 1, x: 0 }}
              exit={{
                opacity: 0,
                x: 50,
                transition: { duration: 0.25, ease: "easeIn" },
              }}
              transition={{
                duration: 0.35,
                type: "spring",
                stiffness: 100,
                damping: 20,
              }} // Spring transition
              aria-labelledby="conversations-heading"
              className="flex flex-col rounded-2xl bg-white/80 dark:bg-neutral-800/60 backdrop-blur-xl shadow-xl dark:shadow-neutral-900/70 border border-neutral-200/60 dark:border-neutral-700/50 overflow-hidden w-full" // styling
            >
              {/* Conversations Header & Filters */}
              <div className="flex-shrink-0 p-4 md:p-5 border-b border-neutral-200 dark:border-neutral-700">
                <div className="flex justify-between items-center mb-3 gap-4">
                  <h2
                    id="conversations-heading"
                    className="text-xl font-semibold text-neutral-700 dark:text-neutral-200 whitespace-nowrap"
                  >
                    Conversations
                  </h2>
                  {/* Favorites Filter Toggle - Refined Pill Style */}
                  <div className="flex items-center space-x-1 p-1 bg-neutral-100 dark:bg-neutral-700 rounded-full border border-neutral-200 dark:border-neutral-600">
                    <button
                      onClick={() => setShowFavoritesOnly(false)}
                      className={`text-xs px-3 py-1 rounded-full transition-all duration-200 ease-in-out ${
                        !showFavoritesOnly
                          ? "bg-white dark:bg-neutral-800 text-cyan-700 dark:text-cyan-300 shadow font-medium ring-1 ring-inset ring-black/5 dark:ring-white/10"
                          : "text-neutral-600 dark:text-neutral-300 hover:text-neutral-800 dark:hover:text-neutral-100"
                      } focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-500`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setShowFavoritesOnly(true)}
                      className={`text-xs px-3 py-1 rounded-full transition-all duration-200 ease-in-out flex items-center gap-1 ${
                        showFavoritesOnly
                          ? "bg-white dark:bg-neutral-800 text-rose-600 dark:text-rose-400 shadow font-medium ring-1 ring-inset ring-black/5 dark:ring-white/10"
                          : "text-neutral-600 dark:text-neutral-300 hover:text-rose-500 dark:hover:text-rose-400"
                      } focus:outline-none focus-visible:ring-1 focus-visible:ring-rose-500`}
                    >
                      <Heart
                        size={12}
                        className={` ${
                          showFavoritesOnly
                            ? "fill-current"
                            : "fill-none stroke-current"
                        }`}
                      />
                      Favorites
                    </button>
                  </div>
                </div>

                {/* Scrollable Conversation Tabs */}
                <div className="flex items-center -mx-4 md:-mx-5 px-3 md:px-4 pb-3 pt-1 overflow-x-auto modern-scrollbar conversation-tabs">
                  {filteredAndSortedConversations.length > 0 ? (
                    filteredAndSortedConversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        className="relative group flex-shrink-0 mr-2.5 last:mr-0"
                      >
                        {/* Tab Button */}
                        <button
                          onClick={() =>
                            handleSetActiveConversation(conversation.id)
                          }
                          className={`flex items-center space-x-2 py-2.5 px-4 rounded-t-lg text-sm whitespace-nowrap transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-500 relative border-b-2 ${
                            activeConversation === conversation.id
                              ? "bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 font-medium border-cyan-500 dark:border-cyan-400 shadow-sm" // Active tab: bg, text color, border highlight
                              : "bg-transparent text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100/70 dark:hover:bg-neutral-700/50 hover:text-neutral-700 dark:hover:text-neutral-200 border-transparent hover:border-neutral-300 dark:hover:border-neutral-600" // Inactive tab
                          }`}
                          aria-current={
                            activeConversation === conversation.id
                              ? "page"
                              : undefined
                          }
                        >
                          {/* Removed motion indicator, relying on border and bg */}
                          <UserAvatar
                            name={conversation.participantUserName}
                            avatar={conversation.participantAvatar}
                            size="sm"
                          />
                          <span className="max-w-[110px] truncate">
                            {conversation.participantUserName}
                          </span>
                          {/* Favorite indicator in tab */}
                          {conversation.serviceId &&
                            services.find(
                              (s) => s.id === conversation.serviceId
                            )?.isFavorite && (
                              <Heart
                                size={12}
                                className="ml-0.5 text-rose-400 dark:text-rose-500 opacity-70"
                                fill="currentColor"
                              />
                            )}
                          {/* Unread count badge */}
                          {conversation.unreadCount > 0 && (
                            <motion.span
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: 0.1 }}
                              className="bg-cyan-500 dark:bg-cyan-600 text-white text-[9px] font-bold rounded-full h-4 w-4 min-w-[1rem] flex items-center justify-center ml-1 border border-white dark:border-neutral-800"
                            >
                              {conversation.unreadCount > 9
                                ? "9+"
                                : conversation.unreadCount}
                            </motion.span>
                          )}
                        </button>
                        {/* Delete Button */}
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteConversation(conversation.id);
                          }}
                          className="absolute top-1 right-1 p-1 opacity-0 group-hover:opacity-100 text-neutral-400 dark:text-neutral-500 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-full transition-all duration-150 focus:opacity-100 focus:outline-none focus-visible:ring-1 focus-visible:ring-rose-500 z-10"
                          aria-label={`Delete conversation with ${conversation.participantUserName}`}
                          title={`Delete chat with ${conversation.participantUserName}`}
                        >
                          <X size={14} />
                        </motion.button>
                      </div>
                    ))
                  ) : (
                    // Empty state for tabs
                    <div className="py-3 px-4 text-sm text-neutral-500 dark:text-neutral-400 italic text-center w-full">
                      {showFavoritesOnly
                        ? "No favorite conversations."
                        : "No active conversations yet."}
                    </div>
                  )}

                  {/* Add New Conversation Input Button*/}
                  <AnimatePresence>
                    {showNewChatInput ? (
                      <motion.div
                        initial={{ width: 0, opacity: 0, marginLeft: 0 }}
                        animate={{
                          width: "auto",
                          opacity: 1,
                          marginLeft: "0.5rem",
                        }}
                        exit={{ width: 0, opacity: 0, marginLeft: 0 }}
                        className="flex items-center bg-white dark:bg-neutral-700 rounded-t-lg border border-neutral-200 dark:border-neutral-600 border-b-transparent px-2 py-[5px] shadow-sm relative bottom-px" // Style adjustments
                      >
                        <input
                          type="text"
                          value={newConversationName}
                          onChange={(e) =>
                            setNewConversationName(e.target.value)
                          }
                          placeholder="Find user..."
                          className="text-sm border-none outline-none focus:ring-0 w-32 placeholder-neutral-400 dark:placeholder-neutral-500 text-neutral-800 dark:text-neutral-100 bg-transparent"
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleAddNewConversation()
                          }
                          autoFocus
                        />
                        {/* Confirm Button */}
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={handleAddNewConversation}
                          disabled={!newConversationName.trim()}
                          className={`ml-1 p-1.5 rounded-full transition-colors ${
                            !newConversationName.trim()
                              ? "text-neutral-300 dark:text-neutral-500 cursor-not-allowed"
                              : "text-cyan-500 dark:text-cyan-400 hover:bg-cyan-100 dark:hover:bg-cyan-800/50"
                          } focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-500`}
                          aria-label="Confirm add conversation"
                        >
                          <CheckCircle size={18} />
                        </motion.button>
                        {/* Cancel Button */}
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            setShowNewChatInput(false);
                            setNewConversationName("");
                          }}
                          className="ml-0.5 p-1.5 rounded-full text-neutral-400 dark:text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-600 hover:text-neutral-600 dark:hover:text-neutral-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-neutral-500"
                          aria-label="Cancel add conversation"
                        >
                          <X size={18} />
                        </motion.button>
                      </motion.div>
                    ) : (
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShowNewChatInput(true)}
                        className="ml-2 flex-shrink-0 flex items-center justify-center p-2 rounded-full text-cyan-600 dark:text-cyan-400 hover:bg-cyan-100 dark:hover:bg-cyan-800/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                        aria-label="Start new conversation"
                        title="Start new conversation"
                      >
                        <Plus size={20} />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Active Conversation Area */}
              <div className="flex-1 flex flex-col bg-white dark:bg-neutral-800 rounded-b-2xl overflow-hidden min-h-0 relative">
                {activeConversation ? (
                  <>
                    {/* Conversation Header */}
                    <div className="p-3.5 border-b border-neutral-200 dark:border-neutral-700 flex justify-between items-center flex-shrink-0 bg-neutral-50 dark:bg-neutral-700/50">
                      {(() => {
                        const conversation = conversations.find(
                          (c) => c.id === activeConversation
                        );
                        const service = conversation?.serviceId
                          ? services.find(
                              (s) => s.id === conversation.serviceId
                            )
                          : null;
                        return (
                          <>
                            <div className="flex items-center space-x-3 overflow-hidden mr-2">
                              <UserAvatar
                                name={conversation?.participantUserName || "?"}
                                avatar={conversation?.participantAvatar}
                                size="md"
                              />
                              <div className="overflow-hidden">
                                <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 truncate">
                                  {conversation?.participantUserName ||
                                    "Select Chat"}
                                </h3>
                                {/* Typing Indicator or Service Title */}
                                <div className="h-4 mt-0.5">
                                  {" "}
                                  {/* Container to prevent layout shift */}
                                  <AnimatePresence initial={false}>
                                    {typing[activeConversation] ? (
                                      <motion.p
                                        key="typing"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="text-xs text-cyan-600 dark:text-cyan-400 italic flex items-center overflow-hidden whitespace-nowrap"
                                      >
                                        Typing
                                        <span className="animate-pulse">
                                          ...
                                        </span>
                                      </motion.p>
                                    ) : service ? (
                                      <motion.p
                                        key="service-title"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="text-xs text-neutral-500 dark:text-neutral-400 truncate overflow-hidden whitespace-nowrap"
                                      >
                                        Regarding:{" "}
                                        <span className="font-medium">
                                          {service.title}
                                        </span>
                                      </motion.p>
                                    ) : (
                                      // Placeholder if no service and not typing
                                      <motion.p
                                        key="no-service"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="text-xs text-neutral-400 dark:text-neutral-500 italic"
                                      >
                                        General chat
                                      </motion.p>
                                    )}
                                  </AnimatePresence>
                                </div>
                              </div>
                            </div>
                            {/* Action Buttons */}
                            <div className="flex space-x-1 flex-shrink-0">
                              {service ? (
                                <>
                                  <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() =>
                                      handleScheduleService(service.id)
                                    }
                                    disabled={
                                      service.isBooked ||
                                      service.userId === currentUserId
                                    }
                                    className={`p-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
                                      service.isBooked ||
                                      service.userId === currentUserId
                                        ? "text-neutral-400 dark:text-neutral-500 cursor-not-allowed"
                                        : "text-neutral-500 dark:text-neutral-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                                    } transition-colors`}
                                    aria-label={`${
                                      service.isBooked
                                        ? "Already booked"
                                        : service.userId === currentUserId
                                        ? "Your service"
                                        : `Schedule ${service.title}`
                                    }`}
                                    title={
                                      service.isBooked
                                        ? "Already booked"
                                        : service.userId === currentUserId
                                        ? "Your service"
                                        : `Schedule ${service.title}`
                                    }
                                  >
                                    <Calendar size={18} />
                                  </motion.button>
                                  <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() =>
                                      handleToggleFavorite(service.id)
                                    }
                                    className={`p-2 rounded-full transition-colors focus:outline-none focus-visible:ring-2 ${
                                      service.isFavorite
                                        ? "text-rose-500 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50 focus-visible:ring-rose-500"
                                        : "text-neutral-500 dark:text-neutral-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 focus-visible:ring-rose-500"
                                    }`}
                                    aria-label={
                                      service.isFavorite
                                        ? `Unfavorite ${service.title}`
                                        : `Favorite ${service.title}`
                                    }
                                    title={
                                      service.isFavorite
                                        ? `Unfavorite`
                                        : `Favorite`
                                    }
                                  >
                                    <Heart
                                      size={18}
                                      fill={
                                        service.isFavorite
                                          ? "currentColor"
                                          : "none"
                                      }
                                    />
                                  </motion.button>
                                </>
                              ) : (
                                <div className="p-2 w-[34px] h-[34px]"></div> // Placeholder to maintain layout
                              )}
                            </div>
                          </>
                        );
                      })()}
                    </div>

                    {/* Messages Container */}
                    <div className="flex-grow p-3 md:p-4 space-y-2 overflow-y-auto bg-gradient-to-b from-white to-neutral-50/50 dark:from-neutral-800 dark:to-neutral-800/80 modern-scrollbar">
                      <AnimatePresence initial={false}>
                        {conversations
                          .find((c) => c.id === activeConversation)
                          ?.messages.map((message) => (
                            <MessageBubble
                              key={message.id}
                              message={message}
                              isCurrentUser={message.userId === currentUserId}
                            />
                          ))}
                      </AnimatePresence>
                      <div ref={messageEndRef} className="h-1" />{" "}
                      {/* Scroll target */}
                    </div>

                    {/* Message Input Area */}
                    <div className="p-3 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-700/60 relative z-10">
                      {/* Emoji Picker */}
                      <AnimatePresence>
                        {showEmojiPicker === activeConversation && (
                          <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{
                              opacity: 0,
                              y: 10,
                              scale: 0.9,
                              transition: { duration: 0.15 },
                            }}
                            transition={{
                              type: "spring",
                              stiffness: 350,
                              damping: 22,
                            }}
                            className="absolute bottom-full left-2 mb-2 p-3 bg-white dark:bg-neutral-800 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-700 grid grid-cols-7 gap-1 max-w-sm z-20" // More columns, rounded-2xl
                          >
                            {commonEmojis.map((emoji) => (
                              <motion.button
                                key={emoji}
                                whileHover={{ scale: 1.25, rotate: 8 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() =>
                                  handleEmojiSelect(emoji, activeConversation)
                                }
                                className="text-2xl hover:bg-neutral-100 dark:hover:bg-neutral-700 p-1 rounded-lg focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-500"
                                aria-label={`Select emoji ${emoji}`}
                              >
                                {emoji}
                              </motion.button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Input Row */}
                      <div className="flex items-center space-x-2.5">
                        {/* Emoji Button */}
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          className={`p-2.5 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 transition-colors ${
                            showEmojiPicker === activeConversation
                              ? "bg-cyan-100 dark:bg-cyan-800/50 text-cyan-600 dark:text-cyan-400"
                              : "text-neutral-500 dark:text-neutral-400 hover:text-cyan-600 dark:hover:text-cyan-400"
                          }`}
                          onClick={() =>
                            setShowEmojiPicker((prev) =>
                              prev === activeConversation
                                ? null
                                : activeConversation
                            )
                          }
                          aria-label="Toggle emoji picker"
                          title="Add emoji"
                        >
                          <Smile size={20} />
                        </motion.button>
                        {/* Image Upload Button */}
                        <motion.label
                          whileTap={{ scale: 0.9 }}
                          className="text-neutral-500 dark:text-neutral-400 hover:text-cyan-600 dark:hover:text-cyan-400 p-2.5 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-600 cursor-pointer focus-within:ring-2 focus-within:ring-cyan-500 transition-colors"
                          title="Attach image"
                        >
                          <Image size={20} />
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => {
                              console.log("File selected:", e.target.files);
                            }}
                          />{" "}
                          {/* Basic handler */}
                        </motion.label>
                        {/* Text Input */}
                        <input
                          type="text"
                          value={newMessage[activeConversation] || ""}
                          id={`message-input-${activeConversation}`} // Added ID for potential focus
                          onChange={(e) =>
                            handleTyping(activeConversation, e.target.value)
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage(activeConversation);
                            }
                          }}
                          placeholder="Type a message..."
                          aria-label="Type message"
                          className="flex-grow py-2.5 px-4 text-sm text-neutral-800 dark:text-neutral-100 bg-white dark:bg-neutral-600 border border-neutral-300 dark:border-neutral-500 rounded-full focus:ring-2 focus:ring-offset-1 focus:ring-offset-neutral-100 dark:focus:ring-offset-neutral-700 focus:ring-cyan-500 focus:border-cyan-500 dark:focus:border-cyan-500 outline-none placeholder-neutral-400 dark:placeholder-neutral-400 transition duration-150 shadow-sm focus:shadow-md" // taller input
                        />
                        {/* Send Button */}
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleSendMessage(activeConversation)}
                          aria-label="Send message"
                          title="Send message"
                          className={`bg-cyan-600 hover:bg-cyan-700 text-white font-semibold p-2.5 rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-neutral-100 dark:focus-visible:ring-offset-neutral-700 focus-visible:ring-cyan-600 shadow-md hover:shadow-lg ${
                            !newMessage[activeConversation] ||
                            newMessage[activeConversation].trim() === ""
                              ? "opacity-50 cursor-not-allowed scale-95"
                              : "opacity-100 scale-100 hover:scale-105"
                          }`} // Subtle hover scale on enabled
                          disabled={
                            !newMessage[activeConversation] ||
                            newMessage[activeConversation].trim() === ""
                          }
                        >
                          <Send
                            size={18}
                            className="-ml-px -mt-px transform rotate-[15deg]"
                          />{" "}
                          {/* rotated */}
                        </motion.button>
                      </div>
                    </div>
                  </>
                ) : (
                  // Placeholder when no conversation selected
                  <div className="flex-1 flex flex-col items-center justify-center text-neutral-500 dark:text-neutral-400 italic text-sm p-8 text-center bg-gradient-to-b from-white to-neutral-50/30 dark:from-neutral-800 dark:to-neutral-800/80">
                    <MessageSquare
                      size={52}
                      className="text-neutral-300 dark:text-neutral-600 mb-5"
                      strokeWidth={1.5}
                    />
                    <p className="font-medium text-base text-neutral-600 dark:text-neutral-300 mb-1.5">
                      Select a Conversation
                    </p>
                    <p className="max-w-xs">
                      Choose a chat from the list or start a new one using the
                      &apos;+&apos; button.
                    </p>
                  </div>
                )}
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      {/* Modals and Notifications Layer */}
      <AnimatePresence>
        {showNotification && (
          <Notification
            message={notificationMessage}
            onClose={() => setShowNotification(false)}
          />
        )}
        {showServiceDetails && selectedService && (
          <ServiceDetailsModal
            service={selectedService}
            isOpen={showServiceDetails}
            onClose={() => setShowServiceDetails(false)}
            onSchedule={handleScheduleService}
            onToggleFavorite={handleToggleFavorite}
            currentUserId={currentUserId}
            onContactSeller={handleContactSeller}
          />
        )}
        {showScheduleModal && selectedService && (
          <ScheduleModal
            service={selectedService}
            isOpen={showScheduleModal}
            onClose={() => setShowScheduleModal(false)}
            onSchedule={handleScheduleConfirm}
            currentUserId={currentUserId}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
