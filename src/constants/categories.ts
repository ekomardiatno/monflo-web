import { CATEGORIES, COLORS } from './index';

export const iconInfo = (category?: string): { iconName: string; color: string } => {
  switch (category) {
    case CATEGORIES.ALLOWANCE:
      return { iconName: 'monetization_on', color: COLORS.colorInfo700 };
    case CATEGORIES.AWARD:
      return { iconName: 'emoji_events', color: COLORS.colorSuccess700 };
    case CATEGORIES.BONUS:
      return { iconName: 'monetization_on', color: COLORS.colorBasic900 };
    case CATEGORIES.DIVIDEND:
      return { iconName: 'show_chart', color: COLORS.colorWarning700 };
    case CATEGORIES.INVESTMENT:
      return { iconName: 'insights', color: COLORS.colorWarning600 };
    case CATEGORIES.LOTTERY:
      return { iconName: 'casino', color: COLORS.colorDanger500 };
    case CATEGORIES.SALARY:
      return { iconName: 'monetization_on', color: COLORS.colorPrimary700 };
    case CATEGORIES.TIPS:
      return { iconName: 'monetization_on', color: COLORS.colorPrimary900 };
    case CATEGORIES.BILLS:
      return { iconName: 'receipt', color: COLORS.colorInfo600 };
    case CATEGORIES.CLOTHING:
      return { iconName: 'checkroom', color: COLORS.colorPrimary800 };
    case CATEGORIES.EDUCATION:
      return { iconName: 'school', color: COLORS.colorSuccess900 };
    case CATEGORIES.ENTERTAINMENT:
      return { iconName: 'movie', color: COLORS.colorDanger700 };
    case CATEGORIES.FITNESS:
      return { iconName: 'fitness_center', color: COLORS.colorSuccess800 };
    case CATEGORIES.FOOD:
      return { iconName: 'local_dining', color: COLORS.colorDanger600 };
    case CATEGORIES.GIFTS:
      return { iconName: 'card_giftcard', color: COLORS.colorWarning900 };
    case CATEGORIES.HEALTH:
      return { iconName: 'medical_services', color: COLORS.colorDanger900 };
    case CATEGORIES.FURNITURE:
      return { iconName: 'king_bed', color: COLORS.colorInfo900 };
    case CATEGORIES.PET:
      return { iconName: 'pets', color: COLORS.colorSuccess600 };
    case CATEGORIES.SHOPPING:
      return { iconName: 'shopping_bag', color: COLORS.colorDanger800 };
    case CATEGORIES.TRANSPORTATION:
      return { iconName: 'local_taxi', color: COLORS.colorInfo800 };
    case CATEGORIES.TRAVEL:
      return { iconName: 'luggage', color: COLORS.colorWarning800 };
    default:
      return { iconName: 'widgets', color: COLORS.colorPrimary600 };
  }
};

// Map material icon names to react-icons/md component names
export const materialIconMap: Record<string, string> = {
  monetization_on: 'MdMonetizationOn',
  emoji_events: 'MdEmojiEvents',
  show_chart: 'MdShowChart',
  insights: 'MdInsights',
  casino: 'MdCasino',
  receipt: 'MdReceipt',
  checkroom: 'MdCheckroom',
  school: 'MdSchool',
  movie: 'MdMovie',
  fitness_center: 'MdFitnessCenter',
  local_dining: 'MdLocalDining',
  card_giftcard: 'MdCardGiftcard',
  medical_services: 'MdMedicalServices',
  king_bed: 'MdKingBed',
  pets: 'MdPets',
  shopping_bag: 'MdShoppingBag',
  local_taxi: 'MdLocalTaxi',
  luggage: 'MdLuggage',
  widgets: 'MdWidgets',
};
