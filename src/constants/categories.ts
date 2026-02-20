// Item Categories
export enum ItemCategory {
  ELECTRONICS = 'ELECTRONICS',
  DOCUMENTS = 'DOCUMENTS',
  CLOTHING = 'CLOTHING',
  ACCESSORIES = 'ACCESSORIES',
  BAGS = 'BAGS',
  KEYS = 'KEYS',
  JEWELRY = 'JEWELRY',
  BOOKS = 'BOOKS',
  SPORTS_EQUIPMENT = 'SPORTS_EQUIPMENT',
  PERISHABLES = 'PERISHABLES',
  OTHER = 'OTHER',
}

// Category Labels
export const CATEGORY_LABELS: Record<ItemCategory, string> = {
  [ItemCategory.ELECTRONICS]: 'Electronics',
  [ItemCategory.DOCUMENTS]: 'Documents',
  [ItemCategory.CLOTHING]: 'Clothing',
  [ItemCategory.ACCESSORIES]: 'Accessories',
  [ItemCategory.BAGS]: 'Bags',
  [ItemCategory.KEYS]: 'Keys',
  [ItemCategory.JEWELRY]: 'Jewelry',
  [ItemCategory.BOOKS]: 'Books',
  [ItemCategory.SPORTS_EQUIPMENT]: 'Sports Equipment',
  [ItemCategory.PERISHABLES]: 'Perishables',
  [ItemCategory.OTHER]: 'Other',
};

// Category Icons (using lucide-react icon names)
export const CATEGORY_ICONS: Record<ItemCategory, string> = {
  [ItemCategory.ELECTRONICS]: 'Smartphone',
  [ItemCategory.DOCUMENTS]: 'FileText',
  [ItemCategory.CLOTHING]: 'Shirt',
  [ItemCategory.ACCESSORIES]: 'Watch',
  [ItemCategory.BAGS]: 'Briefcase',
  [ItemCategory.KEYS]: 'Key',
  [ItemCategory.JEWELRY]: 'Gem',
  [ItemCategory.BOOKS]: 'Book',
  [ItemCategory.SPORTS_EQUIPMENT]: 'Dumbbell',
  [ItemCategory.PERISHABLES]: 'Apple',
  [ItemCategory.OTHER]: 'Package',
};

// Category Colors
export const CATEGORY_COLORS: Record<ItemCategory, string> = {
  [ItemCategory.ELECTRONICS]: '#3b82f6',
  [ItemCategory.DOCUMENTS]: '#ef4444',
  [ItemCategory.CLOTHING]: '#8b5cf6',
  [ItemCategory.ACCESSORIES]: '#ec4899',
  [ItemCategory.BAGS]: '#f59e0b',
  [ItemCategory.KEYS]: '#10b981',
  [ItemCategory.JEWELRY]: '#f97316',
  [ItemCategory.BOOKS]: '#06b6d4',
  [ItemCategory.SPORTS_EQUIPMENT]: '#84cc16',
  [ItemCategory.PERISHABLES]: '#ef4444',
  [ItemCategory.OTHER]: '#64748b',
};

// Category Options for Select
export const CATEGORY_OPTIONS = Object.values(ItemCategory).map((category) => ({
  value: category,
  label: CATEGORY_LABELS[category],
}));

// Combined Category Info (for easy access in components)
export const ITEM_CATEGORIES: Record<ItemCategory, { label: string; icon: string; color: string }> = {
  [ItemCategory.ELECTRONICS]: {
    label: CATEGORY_LABELS[ItemCategory.ELECTRONICS],
    icon: CATEGORY_ICONS[ItemCategory.ELECTRONICS],
    color: 'blue',
  },
  [ItemCategory.DOCUMENTS]: {
    label: CATEGORY_LABELS[ItemCategory.DOCUMENTS],
    icon: CATEGORY_ICONS[ItemCategory.DOCUMENTS],
    color: 'red',
  },
  [ItemCategory.CLOTHING]: {
    label: CATEGORY_LABELS[ItemCategory.CLOTHING],
    icon: CATEGORY_ICONS[ItemCategory.CLOTHING],
    color: 'purple',
  },
  [ItemCategory.ACCESSORIES]: {
    label: CATEGORY_LABELS[ItemCategory.ACCESSORIES],
    icon: CATEGORY_ICONS[ItemCategory.ACCESSORIES],
    color: 'pink',
  },
  [ItemCategory.BAGS]: {
    label: CATEGORY_LABELS[ItemCategory.BAGS],
    icon: CATEGORY_ICONS[ItemCategory.BAGS],
    color: 'orange',
  },
  [ItemCategory.KEYS]: {
    label: CATEGORY_LABELS[ItemCategory.KEYS],
    icon: CATEGORY_ICONS[ItemCategory.KEYS],
    color: 'green',
  },
  [ItemCategory.JEWELRY]: {
    label: CATEGORY_LABELS[ItemCategory.JEWELRY],
    icon: CATEGORY_ICONS[ItemCategory.JEWELRY],
    color: 'orange',
  },
  [ItemCategory.BOOKS]: {
    label: CATEGORY_LABELS[ItemCategory.BOOKS],
    icon: CATEGORY_ICONS[ItemCategory.BOOKS],
    color: 'cyan',
  },
  [ItemCategory.SPORTS_EQUIPMENT]: {
    label: CATEGORY_LABELS[ItemCategory.SPORTS_EQUIPMENT],
    icon: CATEGORY_ICONS[ItemCategory.SPORTS_EQUIPMENT],
    color: 'lime',
  },
  [ItemCategory.PERISHABLES]: {
    label: CATEGORY_LABELS[ItemCategory.PERISHABLES],
    icon: CATEGORY_ICONS[ItemCategory.PERISHABLES],
    color: 'red',
  },
  [ItemCategory.OTHER]: {
    label: CATEGORY_LABELS[ItemCategory.OTHER],
    icon: CATEGORY_ICONS[ItemCategory.OTHER],
    color: 'gray',
  },
};



export const ANALYTICS_CATEGORY_COLORS: Record<string, string> = {
  ELECTRONICS: 'bg-blue-500',
  DOCUMENTS: 'bg-indigo-500',
  CLOTHING: 'bg-purple-500',
  ACCESSORIES: 'bg-pink-500',
  BAGS: 'bg-orange-500',
  KEYS: 'bg-amber-500',
  JEWELRY: 'bg-yellow-500',
  BOOKS: 'bg-emerald-500',
  SPORTS_EQUIPMENT: 'bg-cyan-500',
  OTHER: 'bg-slate-500',
};
