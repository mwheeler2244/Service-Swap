import { motion } from "framer-motion";
import { Calendar, Star, MapPin, Check, Heart } from "lucide-react";
import { Service } from "@/types";
import { getCategoryImage } from "@/utils/styles";
import { UserAvatar } from "@/components/ui/UserAvatar";

interface ServiceCardProps {
  service: Service;
  matchedService: Service | null;
  onViewDetails: (serviceId: number) => void;
  isCompactView?: boolean;
}

export const ServiceCard = ({
  service,
  matchedService,
  onViewDetails,
  isCompactView = false,
}: ServiceCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.98 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -15, scale: 0.95 }}
    transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
    whileHover={{
      y: 0.5,
      scale: 1.02,
      boxShadow:
        "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 5px 10px -6px rgba(0, 0, 0, 0.1)",
      zIndex: 10,
    }}
    className={`relative bg-white dark:bg-neutral-800 rounded-2xl shadow-md dark:shadow-neutral-900/50 ${
      isCompactView ? "p-3.5" : "p-4"
    } border border-neutral-200 dark:border-neutral-700/80 flex flex-col justify-between cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900 focus-visible:ring-cyan-500 transition-all duration-300 ease-in-out overflow-hidden group`}
    onClick={() => onViewDetails(service.id)}
    tabIndex={0}
    onKeyDown={(e) =>
      (e.key === "Enter" || e.key === " ") && onViewDetails(service.id)
    }
  >
    <div>
      {!isCompactView && (
        <div className="w-full h-40 mb-4 rounded-xl overflow-hidden relative border border-neutral-100 dark:border-neutral-700">
          <img
            src={service.image || getCategoryImage(service.category)}
            alt={service.image ? `${service.title}` : ""}
            className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/5 to-transparent transition-opacity duration-300" />
          {service.isBooked && (
            <div className="absolute top-2.5 left-2.5 bg-cyan-600 text-white text-xs font-medium py-1 px-3 rounded-full flex items-center shadow-sm z-10">
              <Calendar size={13} className="mr-1" />
              Booked
            </div>
          )}
          {service.isFavorite && (
            <div className="absolute top-2.5 right-2.5 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm text-rose-500 dark:text-rose-400 p-1.5 rounded-full z-10 shadow-sm">
              <Heart size={14} fill="currentColor" />
            </div>
          )}
        </div>
      )}

      <div
        className={`flex justify-between items-start ${
          isCompactView ? "mb-2" : "mb-2.5"
        }`}
      >
        {/* Category Tag */}
        <span
          className={`inline-block bg-cyan-50 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-300 ${
            isCompactView ? "text-[11px] px-2 py-0.5" : "text-xs px-2.5 py-1"
          } font-medium rounded-full border border-cyan-200/70 dark:border-cyan-700/50`}
        >
          {service.category}
        </span>
        {service.location && !isCompactView && (
          <span className="flex items-center text-xs text-neutral-500 dark:text-neutral-400">
            <MapPin size={12} className="mr-1 flex-shrink-0" />
            {service.location}
          </span>
        )}
      </div>

      {/* Title */}
      <h2
        className={`${
          isCompactView ? "text-base" : "text-lg"
        } font-semibold mb-1.5 text-neutral-800 dark:text-neutral-100 truncate`}
      >
        {service.title}
      </h2>
      {/* Description */}
      <p
        className={`text-neutral-600 dark:text-neutral-300 ${
          isCompactView ? "mb-2 text-xs" : "mb-3 text-sm"
        } ${isCompactView ? "line-clamp-2" : "line-clamp-2"} leading-relaxed`}
      >
        {service.description}
      </p>

      {isCompactView && service.isBooked && (
        <div className="mb-2 inline-flex bg-cyan-600 text-white text-xs font-medium py-0.5 px-2 rounded-full items-center">
          <Calendar size={10} className="mr-1" />
          Booked
        </div>
      )}

      {/* Footer - User info & Rating */}
      <div className="flex items-center justify-between text-sm text-neutral-600 dark:text-neutral-400 mt-auto pt-3 border-t border-neutral-100 dark:border-neutral-700/80">
        <div className="flex items-center space-x-2.5">
          <UserAvatar
            name={service.userName}
            size={isCompactView ? "sm" : "md"}
            avatar={service.avatar}
          />
          <span className="font-medium text-neutral-700 dark:text-neutral-200 truncate">
            {service.userName}
          </span>
        </div>
        <span className="flex items-center flex-shrink-0">
          <Star
            size={isCompactView ? 15 : 16}
            className="text-amber-400 dark:text-amber-300 mr-1"
            fill="currentColor"
          />
          <span className="font-semibold text-neutral-700 dark:text-neutral-200">
            {service.ratings.toFixed(1)}
          </span>
        </span>
      </div>
    </div>
    {/* Match Indicator */}
    {matchedService && (
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-3 pt-3 border-t border-cyan-200/60 dark:border-cyan-800/50"
      >
        <p className="text-cyan-700 dark:text-cyan-300 text-xs font-medium flex items-center">
          <span className="bg-cyan-100 dark:bg-cyan-900/60 text-cyan-800 dark:text-cyan-100 p-1 rounded-full mr-1.5 flex-shrink-0 shadow-sm">
            <Check size={12} />
          </span>
          <span className="truncate">
            Matched: &quot;{matchedService.title}&quot;
          </span>
        </p>
      </motion.div>
    )}
  </motion.div>
);
