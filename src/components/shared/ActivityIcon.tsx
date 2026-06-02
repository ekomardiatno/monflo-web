import {
  MdMonetizationOn, MdEmojiEvents, MdShowChart, MdInsights, MdCasino,
  MdReceipt, MdCheckroom, MdSchool, MdMovie, MdFitnessCenter,
  MdLocalDining, MdCardGiftcard, MdMedicalServices, MdKingBed, MdPets,
  MdShoppingBag, MdLocalTaxi, MdLuggage, MdWidgets,
} from 'react-icons/md';
import { iconInfo } from '@/constants/categories';
import { COLORS } from '@/constants';
import type { Categories } from '@/types';

const iconComponents: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  monetization_on: MdMonetizationOn,
  emoji_events: MdEmojiEvents,
  show_chart: MdShowChart,
  insights: MdInsights,
  casino: MdCasino,
  receipt: MdReceipt,
  checkroom: MdCheckroom,
  school: MdSchool,
  movie: MdMovie,
  fitness_center: MdFitnessCenter,
  local_dining: MdLocalDining,
  card_giftcard: MdCardGiftcard,
  medical_services: MdMedicalServices,
  king_bed: MdKingBed,
  pets: MdPets,
  shopping_bag: MdShoppingBag,
  local_taxi: MdLocalTaxi,
  luggage: MdLuggage,
  widgets: MdWidgets,
};

export default function ActivityIcon({
  category,
  size = 48,
  iconSize = 24,
  inverted = false,
  iconColor,
}: {
  category: string;
  size?: number;
  iconSize?: number;
  inverted?: boolean;
  iconColor?: string;
}) {
  const { iconName, color } = iconInfo(category as Categories);
  const IconComponent = iconComponents[iconName] || MdWidgets;

  return (
    <div
      className="flex items-center justify-center shrink-0"
      style={{
        width: size,
        height: size,
        backgroundColor: inverted ? undefined : color,
        borderRadius: size / 2,
      }}
    >
      <IconComponent
        size={iconSize}
        color={iconColor ?? (inverted ? color : COLORS.colorBasic000)}
      />
    </div>
  );
}
