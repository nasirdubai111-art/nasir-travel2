import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  X,
  Luggage,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  RotateCcw,
  Download,
  Copy,
  Check,
  Sparkles,
  FileText,
  Shirt,
  Smartphone,
  Sparkle,
  HeartPulse,
  Package,
  Search,
  Filter,
  Printer,
  Calendar,
  MapPin,
  Plane,
  Train,
  Bus,
  Building2,
  Palmtree,
  Landmark,
  Map as MapIcon,
  Car,
  UtensilsCrossed,
  Ticket,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  GripVertical,
  ChevronDown,
  ChevronRight,
  FolderPlus,
  Layers,
  Tag,
  ArrowUpDown,
  Move,
  Edit2,
  CheckSquare,
  Mountain,
  Briefcase,
  CloudRain,
  Compass,
  AlertTriangle,
  Bookmark,
  Loader2,
  FileDown,
} from "lucide-react";
import { BookingItem, ServiceCategory, UserProfile } from "../types";
import { PACKING_PRESETS, PackingPresetTemplate } from "../data/packingPresets";
import { downloadPackingChecklistPDF } from "../utils/packingChecklistPdfGenerator";

export type PackingCategoryType =
  | "documents"
  | "clothing"
  | "electronics"
  | "toiletries"
  | "medications"
  | "custom";

export interface PackingItem {
  id: string;
  name: string;
  category: PackingCategoryType;
  subcategory?: string;
  packed: boolean;
  essential?: boolean;
  notes?: string;
  order?: number;
}

interface PackingChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingItem | null;
  allBookings?: BookingItem[];
  userProfile: UserProfile;
  onSelectAnotherBooking?: (booking: BookingItem) => void;
}

// Generate smart, service-tailored default packing items with sub-categories
export function generateDefaultPackingList(booking: BookingItem): PackingItem[] {
  const service = booking.serviceType;
  const isFlight = service === "flights";
  const isTrain = service === "trains";
  const isBus = service === "buses";
  const isHotel = service === "hotels";
  const isResort = service === "resorts";
  const isPilgrimage = service === "pilgrimage";
  const isTour = service === "tours";

  const list: PackingItem[] = [
    // 1. Essential Documents
    {
      id: "doc-1",
      name: "Original Government Photo ID (Aadhaar / Passport / Voter ID)",
      category: "documents",
      subcategory: "Identity & Passes",
      packed: false,
      essential: true,
      notes: isFlight
        ? "Required at CISF airport entry gate"
        : isTrain
        ? "Required for IRCTC TTE verification"
        : "Required for hotel check-in",
    },
    {
      id: "doc-2",
      name: isFlight
        ? "Flight Boarding Pass (Digital or Printed)"
        : isTrain
        ? "IRCTC E-Ticket & PNR Confirmation"
        : "Booking Voucher & Confirmation Slip",
      category: "documents",
      subcategory: "Identity & Passes",
      packed: false,
      essential: true,
      notes: `PNR: ${booking.pnr || "BY-CONFIRMED"}`,
    },
    {
      id: "doc-3",
      name: "Travel & Health Insurance Card / Policy PDF",
      category: "documents",
      subcategory: "Insurance & Health",
      packed: false,
      essential: false,
    },
    {
      id: "doc-4",
      name: "Physical Payment Cards & Emergency Cash (₹2,000 - ₹5,000)",
      category: "documents",
      subcategory: "Money & Cards",
      packed: false,
      essential: true,
      notes: "Useful in transit zones with low cellular network",
    },

    // 2. Clothing & Wearables
    {
      id: "cloth-1",
      name: isPilgrimage
        ? "Traditional Temple Attire (Kurta-Pyjama / Dhoti / Saree)"
        : isResort
        ? "Casual Resortwear & Breathable Cottons"
        : "Comfortable Travel Outfits (2-3 Sets)",
      category: "clothing",
      subcategory: isPilgrimage || isResort ? "Special Attire" : "Daily Outfits",
      packed: false,
      essential: true,
    },
    {
      id: "cloth-2",
      name: "Extra Undergarments & Quick-Dry Socks",
      category: "clothing",
      subcategory: "Essentials",
      packed: false,
      essential: true,
    },
    {
      id: "cloth-3",
      name: "Comfortable Walking Shoes & Slip-on Footwear",
      category: "clothing",
      subcategory: "Footwear",
      packed: false,
      essential: true,
      notes: isPilgrimage ? "Easy to remove outside temple sanctums" : undefined,
    },
    {
      id: "cloth-4",
      name: isFlight || isTrain || isBus
        ? "Light Jacket / Shawl / Hoodie (For AC coach & cabin chill)"
        : "Light Outerwear or Sun Protection Scarf",
      category: "clothing",
      subcategory: "Weather & Layers",
      packed: false,
      essential: false,
    },
    {
      id: "cloth-5",
      name: "Sleepwear & Night Lounge Dress",
      category: "clothing",
      subcategory: "Essentials",
      packed: false,
      essential: false,
    },
    ...(isResort
      ? [
          {
            id: "cloth-resort-1",
            name: "Swimwear / Beachwear & Pool Slippers",
            category: "clothing" as PackingCategoryType,
            subcategory: "Special Attire",
            packed: false,
            essential: false,
          },
          {
            id: "cloth-resort-2",
            name: "Sun Hat / UV Sunglasses",
            category: "clothing" as PackingCategoryType,
            subcategory: "Accessories",
            packed: false,
            essential: false,
          },
        ]
      : []),

    // 3. Electronics & Gadgets
    {
      id: "elec-1",
      name: "Smartphone & High-Speed Fast Charger",
      category: "electronics",
      subcategory: "Essentials",
      packed: false,
      essential: true,
    },
    {
      id: "elec-2",
      name: "Portable Power Bank (10,000mAh - 20,000mAh)",
      category: "electronics",
      subcategory: "Power & Cables",
      packed: false,
      essential: true,
      notes: isFlight ? "Must be kept in Hand Baggage / Cabin ONLY" : undefined,
    },
    {
      id: "elec-3",
      name: "Noise-Cancelling Headphones / Wireless Earbuds",
      category: "electronics",
      subcategory: "Audio & Media",
      packed: false,
      essential: false,
    },
    {
      id: "elec-4",
      name: isTrain || isHotel
        ? "Multi-Plug Universal Adapter / 3-Pin Extension"
        : "Charging Cables & Spare Adapter",
      category: "electronics",
      subcategory: "Power & Cables",
      packed: false,
      essential: false,
    },

    // 4. Toiletries & Personal Care
    {
      id: "toil-1",
      name: "Toothbrush, Travel Toothpaste & Floss",
      category: "toiletries",
      subcategory: "Daily Hygiene",
      packed: false,
      essential: true,
    },
    {
      id: "toil-2",
      name: isFlight
        ? "Travel Miniatures Kit (<100ml bottles in clear pouch)"
        : "Body Wash, Shampoo & Face Wash",
      category: "toiletries",
      subcategory: "Bath & Body",
      packed: false,
      essential: false,
      notes: isFlight ? "Airport security liquid regulations compliant" : undefined,
    },
    {
      id: "toil-3",
      name: "Sunscreen Lotion (SPF 50+) & Lip Balm",
      category: "toiletries",
      subcategory: "Skin & Sun",
      packed: false,
      essential: false,
    },
    {
      id: "toil-4",
      name: "Pocket Hand Sanitizer & Antiseptic Wet Wipes",
      category: "toiletries",
      subcategory: "Daily Hygiene",
      packed: false,
      essential: true,
    },
    {
      id: "toil-5",
      name: "Deodorant / Fragrance & Hair Comb",
      category: "toiletries",
      subcategory: "Grooming",
      packed: false,
      essential: false,
    },

    // 5. Health, Medications & First Aid
    {
      id: "med-1",
      name: "Personal Daily Prescription Medicines & Doctor's Note",
      category: "medications",
      subcategory: "Daily Prescriptions",
      packed: false,
      essential: true,
      notes: "Carry enough for the full trip duration + 2 buffer days",
    },
    {
      id: "med-2",
      name: isBus || isFlight || isTour
        ? "Motion Sickness / Acidity / Antacid Tablets"
        : "Antacid & Digestive Enzyme Tablets",
      category: "medications",
      subcategory: "Travel First Aid",
      packed: false,
      essential: false,
    },
    {
      id: "med-3",
      name: "Pain Relief (Paracetamol / Ibuprofen) & Band-Aids",
      category: "medications",
      subcategory: "Travel First Aid",
      packed: false,
      essential: true,
    },
    {
      id: "med-4",
      name: "ORS Electrolyte Hydration Sachets",
      category: "medications",
      subcategory: "Hydration & Energy",
      packed: false,
      essential: false,
      notes: "Essential for warm destinations & extensive walking",
    },

    // 6. Custom & Journey Extras
    {
      id: "cust-1",
      name: isTrain
        ? "Luggage Security Chain & Small Number Lock"
        : isFlight
        ? "TSA Approved Luggage Locks & Baggage Tag with Contact Info"
        : "Luggage Identification Tags",
      category: "custom",
      subcategory: "Luggage Security",
      packed: false,
      essential: false,
    },
    {
      id: "cust-2",
      name: isFlight || isTrain || isBus
        ? "Ergonomic Memory Foam Travel Neck Pillow & Eye Mask"
        : "Reusable Insulated Water Bottle",
      category: "custom",
      subcategory: "Transit Comfort",
      packed: false,
      essential: false,
    },
  ];

  return list;
}

export function PackingChecklistModal({
  isOpen,
  onClose,
  booking,
  allBookings = [],
  userProfile,
  onSelectAnotherBooking,
}: PackingChecklistModalProps) {
  const [items, setItems] = useState<PackingItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<PackingCategoryType | "all">("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | "all">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "unpacked" | "packed">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [groupBySubcategory, setGroupBySubcategory] = useState(true);
  const [collapsedSubcategories, setCollapsedSubcategories] = useState<Record<string, boolean>>({});

  // Adding Item State
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState<PackingCategoryType>("clothing");
  const [newItemSubcategory, setNewItemSubcategory] = useState("");
  const [isCustomSubcategoryInput, setIsCustomSubcategoryInput] = useState(false);
  const [newSubcategoryName, setNewSubcategoryName] = useState("");

  // Drag and Drop State
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [dragOverItemId, setDragOverItemId] = useState<string | null>(null);
  const [dropPosition, setDropPosition] = useState<"above" | "below" | null>(null);
  const [dragOverSubcategoryKey, setDragOverSubcategoryKey] = useState<string | null>(null);

  // New subcategory creation dialog
  const [isAddSubcategoryModalOpen, setIsAddSubcategoryModalOpen] = useState(false);
  const [subcatModalCategory, setSubcatModalCategory] = useState<PackingCategoryType>("clothing");
  const [subcatModalName, setSubcatModalName] = useState("");

  // Preset dropdown & confirmation dialog state
  const [isPresetDropdownOpen, setIsPresetDropdownOpen] = useState(false);
  const [selectedPresetForConfirm, setSelectedPresetForConfirm] = useState<PackingPresetTemplate | null>(null);
  const [keepExistingMatchingItems, setKeepExistingMatchingItems] = useState(false);
  const presetDropdownRef = useRef<HTMLDivElement>(null);

  // PDF download dropdown & loading state
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [isPdfMenuOpen, setIsPdfMenuOpen] = useState(false);
  const pdfMenuRef = useRef<HTMLDivElement>(null);

  const [isCopied, setIsCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Categories metadata
  const categoriesConfig: {
    id: PackingCategoryType;
    label: string;
    icon: React.ReactNode;
    color: string;
    bgBadge: string;
  }[] = [
    {
      id: "documents",
      label: "Documents & ID",
      icon: <FileText className="w-3.5 h-3.5" />,
      color: "text-amber-700 bg-amber-50 border-amber-200",
      bgBadge: "bg-amber-100 text-amber-900 border-amber-300",
    },
    {
      id: "clothing",
      label: "Clothing",
      icon: <Shirt className="w-3.5 h-3.5" />,
      color: "text-indigo-700 bg-indigo-50 border-indigo-200",
      bgBadge: "bg-indigo-100 text-indigo-900 border-indigo-300",
    },
    {
      id: "electronics",
      label: "Electronics",
      icon: <Smartphone className="w-3.5 h-3.5" />,
      color: "text-sky-700 bg-sky-50 border-sky-200",
      bgBadge: "bg-sky-100 text-sky-900 border-sky-300",
    },
    {
      id: "toiletries",
      label: "Toiletries",
      icon: <Sparkles className="w-3.5 h-3.5" />,
      color: "text-emerald-700 bg-emerald-50 border-emerald-200",
      bgBadge: "bg-emerald-100 text-emerald-900 border-emerald-300",
    },
    {
      id: "medications",
      label: "Health & Meds",
      icon: <HeartPulse className="w-3.5 h-3.5" />,
      color: "text-rose-700 bg-rose-50 border-rose-200",
      bgBadge: "bg-rose-100 text-rose-900 border-rose-300",
    },
    {
      id: "custom",
      label: "Custom & Extras",
      icon: <Package className="w-3.5 h-3.5" />,
      color: "text-purple-700 bg-purple-50 border-purple-200",
      bgBadge: "bg-purple-100 text-purple-900 border-purple-300",
    },
  ];

  // Load saved checklist for this booking ID or generate defaults
  useEffect(() => {
    if (!booking) return;

    const storageKey = `bharatyatra_packing_checklist_${booking.id}`;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Normalize subcategory if missing
          const normalized = parsed.map((item: PackingItem) => ({
            ...item,
            subcategory: item.subcategory || "General Essentials",
          }));
          setItems(normalized);
          return;
        }
      }
    } catch (e) {
      console.warn("Could not read packing checklist from localStorage", e);
    }

    // Default generated list
    const defaults = generateDefaultPackingList(booking);
    setItems(defaults);
  }, [booking?.id]);

  // Save changes to localStorage
  const saveItems = (updated: PackingItem[]) => {
    setItems(updated);
    if (booking?.id) {
      const storageKey = `bharatyatra_packing_checklist_${booking.id}`;
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch (e) {
        console.warn("Could not save packing checklist", e);
      }
    }
  };

  // Extract distinct subcategories grouped by category
  const availableSubcategoriesByCategory = useMemo(() => {
    const map: Record<PackingCategoryType, Set<string>> = {
      documents: new Set(["Identity & Passes", "Insurance & Health", "Money & Cards", "Travel Vouchers"]),
      clothing: new Set(["Essentials", "Daily Outfits", "Special Attire", "Footwear", "Weather & Layers", "Accessories"]),
      electronics: new Set(["Essentials", "Power & Cables", "Audio & Media", "Photography & Work"]),
      toiletries: new Set(["Daily Hygiene", "Bath & Body", "Skin & Sun", "Grooming", "Cosmetics"]),
      medications: new Set(["Daily Prescriptions", "Travel First Aid", "Hydration & Energy", "Allergies"]),
      custom: new Set(["Luggage Security", "Transit Comfort", "Snacks & Food", "Miscellaneous"]),
    };

    items.forEach((it) => {
      if (it.category && it.subcategory) {
        if (!map[it.category]) map[it.category] = new Set();
        map[it.category].add(it.subcategory.trim());
      }
    });

    const result: Record<PackingCategoryType, string[]> = {
      documents: Array.from(map.documents),
      clothing: Array.from(map.clothing),
      electronics: Array.from(map.electronics),
      toiletries: Array.from(map.toiletries),
      medications: Array.from(map.medications),
      custom: Array.from(map.custom),
    };

    return result;
  }, [items]);

  // Set default subcategory when category changes in add form
  useEffect(() => {
    const available = availableSubcategoriesByCategory[newItemCategory] || [];
    if (available.length > 0 && !isCustomSubcategoryInput) {
      setNewItemSubcategory(available[0]);
    }
  }, [newItemCategory, availableSubcategoriesByCategory, isCustomSubcategoryInput]);

  // Click outside listener for preset dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (presetDropdownRef.current && !presetDropdownRef.current.contains(event.target as Node)) {
        setIsPresetDropdownOpen(false);
      }
      if (pdfMenuRef.current && !pdfMenuRef.current.contains(event.target as Node)) {
        setIsPdfMenuOpen(false);
      }
    }
    if (isPresetDropdownOpen || isPdfMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPresetDropdownOpen, isPdfMenuOpen]);

  // Helper for preset icons
  const renderPresetIcon = (iconName: string, className = "w-4 h-4") => {
    switch (iconName) {
      case "Mountain":
        return <Mountain className={className} />;
      case "Palmtree":
        return <Palmtree className={className} />;
      case "Briefcase":
        return <Briefcase className={className} />;
      case "Landmark":
        return <Landmark className={className} />;
      case "Compass":
        return <Compass className={className} />;
      case "CloudRain":
        return <CloudRain className={className} />;
      default:
        return <Sparkles className={className} />;
    }
  };

  // Preset selection trigger
  const handleSelectPresetClick = (preset: PackingPresetTemplate) => {
    setIsPresetDropdownOpen(false);
    setSelectedPresetForConfirm(preset);
  };

  // Preset confirmation commit
  const handleConfirmLoadPreset = () => {
    if (!selectedPresetForConfirm) return;
    const newPresetItems = selectedPresetForConfirm.generateItems(booking);

    let finalItems = newPresetItems;
    if (keepExistingMatchingItems) {
      const existingCheckedNames = new Set(
        items.filter((i) => i.packed).map((i) => i.name.toLowerCase().trim())
      );
      finalItems = newPresetItems.map((item) => ({
        ...item,
        packed: existingCheckedNames.has(item.name.toLowerCase().trim()),
      }));
    }

    saveItems(finalItems);
    showToast(`Loaded "${selectedPresetForConfirm.name}" preset (${finalItems.length} items)! ✨`);
    setSelectedPresetForConfirm(null);
  };

  if (!isOpen || !booking) return null;

  // Toggle packed status
  const handleToggleItem = (id: string) => {
    const updated = items.map((it) => (it.id === id ? { ...it, packed: !it.packed } : it));
    saveItems(updated);
  };

  // Add custom item
  const handleAddItem = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanName = newItemName.trim();
    if (!cleanName) return;

    const subcat = isCustomSubcategoryInput
      ? newSubcategoryName.trim() || "General Essentials"
      : newItemSubcategory || "General Essentials";

    const newItem: PackingItem = {
      id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: cleanName,
      category: newItemCategory,
      subcategory: subcat,
      packed: false,
      essential: false,
      order: Date.now(),
    };

    const updated = [newItem, ...items];
    saveItems(updated);
    setNewItemName("");
    if (isCustomSubcategoryInput) {
      setNewSubcategoryName("");
      setIsCustomSubcategoryInput(false);
    }
    showToast(`Added "${cleanName}" to [${subcat}]`);
  };

  // Delete an item
  const handleDeleteItem = (id: string, name: string) => {
    const updated = items.filter((it) => it.id !== id);
    saveItems(updated);
    showToast(`Removed "${name}" from checklist.`);
  };

  // Mark all packed / unpacked
  const handleSetAllPacked = (packed: boolean) => {
    const updated = items.map((it) => ({ ...it, packed }));
    saveItems(updated);
    showToast(packed ? "All items marked as packed! 🎒" : "All items reset to unpacked.");
  };

  // Mark subcategory packed / unpacked
  const handleToggleSubcategoryPacked = (cat: PackingCategoryType, subcat: string, targetPacked: boolean) => {
    const updated = items.map((it) => {
      if (it.category === cat && (it.subcategory || "General Essentials") === subcat) {
        return { ...it, packed: targetPacked };
      }
      return it;
    });
    saveItems(updated);
    showToast(`${targetPacked ? "Packed" : "Unpacked"} all in "${subcat}".`);
  };

  // Reset checklist to defaults
  const handleResetDefaults = () => {
    if (window.confirm("Reset checklist to original recommendations? Any custom items and order will be restored.")) {
      const defaults = generateDefaultPackingList(booking);
      saveItems(defaults);
      showToast("Checklist reset to recommended defaults.");
    }
  };

  // Add custom subcategory modal submit
  const handleCreateSubcategory = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSub = subcatModalName.trim();
    if (!cleanSub) return;

    // Create a starter item or placeholder in this subcategory
    const starterItem: PackingItem = {
      id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: `First item in ${cleanSub}`,
      category: subcatModalCategory,
      subcategory: cleanSub,
      packed: false,
      essential: false,
    };

    saveItems([starterItem, ...items]);
    setIsAddSubcategoryModalOpen(false);
    setSubcatModalName("");
    showToast(`Created sub-category "${cleanSub}". Drag items here!`);
  };

  // Toast notification
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // -------------------------------------------------------------
  // DRAG AND DROP HANDLERS
  // -------------------------------------------------------------
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
    setDraggedItemId(id);
  };

  const handleDragOverItem = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";

    if (draggedItemId === targetId) return;

    const targetElement = e.currentTarget as HTMLElement;
    const rect = targetElement.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    const pos = e.clientY < midY ? "above" : "below";

    setDragOverItemId(targetId);
    setDropPosition(pos);
  };

  const handleDragOverSubcategory = (e: React.DragEvent, subcategoryKey: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverSubcategoryKey(subcategoryKey);
  };

  const handleDragLeave = () => {
    setDragOverItemId(null);
    setDropPosition(null);
  };

  const handleDropOnItem = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedItemId || draggedItemId === targetId) {
      cleanupDragState();
      return;
    }

    const sourceIndex = items.findIndex((i) => i.id === draggedItemId);
    const targetIndex = items.findIndex((i) => i.id === targetId);

    if (sourceIndex === -1 || targetIndex === -1) {
      cleanupDragState();
      return;
    }

    const draggedItem = items[sourceIndex];
    const targetItem = items[targetIndex];

    // Adapt category & subcategory to the drop target
    const updatedDraggedItem: PackingItem = {
      ...draggedItem,
      category: targetItem.category,
      subcategory: targetItem.subcategory || "General Essentials",
    };

    const newItems = [...items];
    // Remove from old position
    newItems.splice(sourceIndex, 1);

    // Calculate insert position
    let insertIndex = newItems.findIndex((i) => i.id === targetId);
    if (dropPosition === "below") {
      insertIndex += 1;
    }

    newItems.splice(insertIndex, 0, updatedDraggedItem);
    saveItems(newItems);

    showToast(`Reordered "${draggedItem.name}" to [${updatedDraggedItem.subcategory}]`);
    cleanupDragState();
  };

  const handleDropOnSubcategory = (
    e: React.DragEvent,
    targetCategory: PackingCategoryType,
    targetSubcategory: string
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedItemId) {
      cleanupDragState();
      return;
    }

    const sourceIndex = items.findIndex((i) => i.id === draggedItemId);
    if (sourceIndex === -1) {
      cleanupDragState();
      return;
    }

    const draggedItem = items[sourceIndex];
    const updatedDraggedItem: PackingItem = {
      ...draggedItem,
      category: targetCategory,
      subcategory: targetSubcategory,
    };

    const newItems = [...items];
    newItems.splice(sourceIndex, 1);
    // Add to the top of this category/subcategory
    const firstSubcatItemIndex = newItems.findIndex(
      (i) => i.category === targetCategory && (i.subcategory || "General Essentials") === targetSubcategory
    );

    if (firstSubcatItemIndex !== -1) {
      newItems.splice(firstSubcatItemIndex, 0, updatedDraggedItem);
    } else {
      newItems.unshift(updatedDraggedItem);
    }

    saveItems(newItems);
    showToast(`Moved "${draggedItem.name}" into [${targetSubcategory}]`);
    cleanupDragState();
  };

  const cleanupDragState = () => {
    setDraggedItemId(null);
    setDragOverItemId(null);
    setDropPosition(null);
    setDragOverSubcategoryKey(null);
  };

  // Move item up / down (touch & accessibility helper)
  const handleMoveItemRelative = (id: string, direction: "up" | "down") => {
    const idx = items.findIndex((i) => i.id === id);
    if (idx === -1) return;
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= items.length) return;

    const newItems = [...items];
    const temp = newItems[idx];
    newItems[idx] = newItems[targetIdx];
    newItems[targetIdx] = temp;
    saveItems(newItems);
  };

  // Copy formatted checklist to clipboard (with Sub-categories)
  const handleCopyChecklist = () => {
    const packedCount = items.filter((i) => i.packed).length;
    let text = `🎒 BharatYatra Packing Checklist\n`;
    text += `Trip: ${booking.title} (${booking.date})\n`;
    text += `Progress: ${packedCount}/${items.length} items packed (${Math.round((packedCount / items.length) * 100)}%)\n\n`;

    const categories: { id: PackingCategoryType; label: string }[] = [
      { id: "documents", label: "📄 Essential Documents & ID" },
      { id: "clothing", label: "👕 Clothing & Wearables" },
      { id: "electronics", label: "🔌 Electronics & Gadgets" },
      { id: "toiletries", label: "🧴 Toiletries & Personal Care" },
      { id: "medications", label: "💊 Health & Medications" },
      { id: "custom", label: "🎒 Custom & Journey Extras" },
    ];

    categories.forEach((cat) => {
      const catItems = items.filter((i) => i.category === cat.id);
      if (catItems.length > 0) {
        text += `==============================\n${cat.label}\n==============================\n`;
        
        // Group by subcategory
        const subMap: Record<string, PackingItem[]> = {};
        catItems.forEach((it) => {
          const sub = it.subcategory || "General Essentials";
          if (!subMap[sub]) subMap[sub] = [];
          subMap[sub].push(it);
        });

        Object.entries(subMap).forEach(([subName, subItems]) => {
          text += `\n📁 ${subName}:\n`;
          subItems.forEach((it) => {
            text += `  [${it.packed ? "✓" : " "}] ${it.name}${it.essential ? " (Essential)" : ""}${it.notes ? ` - ${it.notes}` : ""}\n`;
          });
        });
        text += `\n`;
      }
    });

    text += `Generated on BharatYatra Unified Travel Suite`;

    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      showToast("Checklist copied to clipboard with sub-categories!");
      setTimeout(() => setIsCopied(false), 2500);
    });
  };

  // Print checklist
  const handlePrint = () => {
    window.print();
  };

  // Download clean, print-ready PDF checklist
  const handleDownloadPdf = async (includeOnlyUnpacked = false) => {
    if (!booking) return;
    setIsPdfMenuOpen(false);
    setIsDownloadingPdf(true);
    try {
      const filename = await downloadPackingChecklistPDF(booking, items, {
        includeOnlyUnpacked,
        filterCategory: selectedCategory !== "all" ? selectedCategory : undefined,
      });
      showToast(`Downloaded "${filename}" for offline use! 📄`);
    } catch (error) {
      console.error("PDF generation failed:", error);
      showToast("Could not generate PDF checklist. Please try again.");
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  // Stats calculation
  const totalItems = items.length;
  const packedItemsCount = items.filter((i) => i.packed).length;
  const percentage = totalItems > 0 ? Math.round((packedItemsCount / totalItems) * 100) : 0;
  const isAllPacked = totalItems > 0 && packedItemsCount === totalItems;

  // Filtered items
  const filteredItems = useMemo(() => {
    return items.filter((it) => {
      // Category filter
      if (selectedCategory !== "all" && it.category !== selectedCategory) {
        return false;
      }
      // Subcategory filter
      if (selectedSubcategory !== "all" && (it.subcategory || "General Essentials") !== selectedSubcategory) {
        return false;
      }
      // Status filter
      if (statusFilter === "packed" && !it.packed) return false;
      if (statusFilter === "unpacked" && it.packed) return false;
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          it.name.toLowerCase().includes(q) ||
          (it.subcategory && it.subcategory.toLowerCase().includes(q)) ||
          (it.notes && it.notes.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [items, selectedCategory, selectedSubcategory, statusFilter, searchQuery]);

  // Group items by Category & Sub-category for structured rendering
  const groupedStructure = useMemo(() => {
    const categoryOrder: PackingCategoryType[] = [
      "documents",
      "clothing",
      "electronics",
      "toiletries",
      "medications",
      "custom",
    ];

    const result: {
      category: PackingCategoryType;
      categoryConfig: (typeof categoriesConfig)[0];
      subcategories: {
        name: string;
        key: string;
        items: PackingItem[];
        totalCount: number;
        packedCount: number;
        isAllPacked: boolean;
      }[];
      totalCount: number;
      packedCount: number;
    }[] = [];

    categoryOrder.forEach((catId) => {
      if (selectedCategory !== "all" && selectedCategory !== catId) return;

      const catItems = filteredItems.filter((i) => i.category === catId);
      if (catItems.length === 0 && searchQuery) return; // Hide empty categories when searching

      const catConfig = categoriesConfig.find((c) => c.id === catId)!;

      // Group subcategories in this category
      const subMap = new Map<string, PackingItem[]>();

      // Preserve any existing subcategories for this category even if empty if no search
      const knownSubs = availableSubcategoriesByCategory[catId] || [];
      knownSubs.forEach((sub) => {
        subMap.set(sub, []);
      });

      catItems.forEach((it) => {
        const sub = it.subcategory || "General Essentials";
        if (!subMap.has(sub)) {
          subMap.set(sub, []);
        }
        subMap.get(sub)!.push(it);
      });

      const subcategoriesList: {
        name: string;
        key: string;
        items: PackingItem[];
        totalCount: number;
        packedCount: number;
        isAllPacked: boolean;
      }[] = [];

      subMap.forEach((subItems, subName) => {
        if (selectedSubcategory !== "all" && selectedSubcategory !== subName) return;
        if (subItems.length === 0 && (searchQuery || statusFilter !== "all")) return;

        const packedCount = subItems.filter((i) => i.packed).length;
        subcategoriesList.push({
          name: subName,
          key: `${catId}__${subName}`,
          items: subItems,
          totalCount: subItems.length,
          packedCount,
          isAllPacked: subItems.length > 0 && packedCount === subItems.length,
        });
      });

      const catPacked = catItems.filter((i) => i.packed).length;

      if (subcategoriesList.length > 0 || catItems.length > 0) {
        result.push({
          category: catId,
          categoryConfig: catConfig,
          subcategories: subcategoriesList,
          totalCount: catItems.length,
          packedCount: catPacked,
        });
      }
    });

    return result;
  }, [filteredItems, selectedCategory, selectedSubcategory, searchQuery, statusFilter, availableSubcategoriesByCategory]);

  // Category counts for badges
  const categoryCounts = useMemo(() => {
    const counts: Record<string, { total: number; packed: number }> = {
      all: { total: items.length, packed: items.filter((i) => i.packed).length },
      documents: { total: 0, packed: 0 },
      clothing: { total: 0, packed: 0 },
      electronics: { total: 0, packed: 0 },
      toiletries: { total: 0, packed: 0 },
      medications: { total: 0, packed: 0 },
      custom: { total: 0, packed: 0 },
    };

    items.forEach((it) => {
      if (!counts[it.category]) {
        counts[it.category] = { total: 0, packed: 0 };
      }
      counts[it.category].total += 1;
      if (it.packed) counts[it.category].packed += 1;
    });

    return counts;
  }, [items]);

  const toggleSubcategoryCollapse = (key: string) => {
    setCollapsedSubcategories((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getServiceBadgeIcon = (cat: ServiceCategory) => {
    switch (cat) {
      case "flights": return <Plane className="w-3.5 h-3.5 text-sky-600" />;
      case "trains": return <Train className="w-3.5 h-3.5 text-amber-600" />;
      case "buses": return <Bus className="w-3.5 h-3.5 text-red-600" />;
      case "hotels": return <Building2 className="w-3.5 h-3.5 text-indigo-600" />;
      case "resorts": return <Palmtree className="w-3.5 h-3.5 text-emerald-600" />;
      case "pilgrimage": return <Landmark className="w-3.5 h-3.5 text-amber-700" />;
      case "tours": return <MapIcon className="w-3.5 h-3.5 text-fuchsia-600" />;
      default: return <Ticket className="w-3.5 h-3.5 text-slate-600" />;
    }
  };

  const upcomingBookings = allBookings.filter(
    (b) => b.status === "upcoming" || b.status === "confirmed"
  );

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[94vh]">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-indigo-800/40">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300 shadow-inner">
              <Luggage className="w-6 h-6 text-indigo-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg tracking-tight text-white">
                  Interactive Travel Packing Checklist
                </h3>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-black uppercase">
                  <Sparkles className="w-3 h-3 text-emerald-400" /> Sub-categories & Drag-Drop
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Organize packing essentials into custom sub-categories with drag & drop reordering
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Close packing checklist"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Trip Details & Trip Switcher */}
        <div className="bg-slate-50 px-4 sm:px-6 py-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
              {getServiceBadgeIcon(booking.serviceType)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900 line-clamp-1">{booking.title}</span>
                {booking.pnr && (
                  <span className="text-[10px] font-mono font-bold bg-indigo-100 text-indigo-800 px-1.5 py-0.2 rounded">
                    {booking.pnr}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-0.5">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  {booking.date}
                </span>
                <span>•</span>
                <span>{booking.passengers || 1} Passenger{(booking.passengers || 1) > 1 ? "s" : ""}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions (Copy, Reset, Print, Add Subcategory) */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {upcomingBookings.length > 1 && onSelectAnotherBooking && (
              <select
                value={booking.id}
                onChange={(e) => {
                  const target = upcomingBookings.find((b) => b.id === e.target.value);
                  if (target) onSelectAnotherBooking(target);
                }}
                className="text-xs font-bold bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-slate-700 shadow-2xs focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                {upcomingBookings.map((b) => (
                  <option key={b.id} value={b.id}>
                    Switch: {b.title.substring(0, 22)}...
                  </option>
                ))}
              </select>
            )}

            {/* Load Preset Dropdown Menu */}
            <div className="relative" ref={presetDropdownRef}>
              <button
                type="button"
                onClick={() => setIsPresetDropdownOpen(!isPresetDropdownOpen)}
                className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                title="Load curated travel template (Himalayan Trek, Beach, Business Trip, etc.)"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                <span>Load Preset</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isPresetDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {isPresetDropdownOpen && (
                <div className="absolute right-0 sm:left-0 mt-1.5 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="p-3 bg-slate-900 text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span className="font-extrabold text-xs">Curated Travel Templates</span>
                    </div>
                    <span className="text-[10px] text-slate-300 font-medium">Select a theme</span>
                  </div>

                  <div className="p-2 max-h-80 overflow-y-auto space-y-1">
                    {PACKING_PRESETS.map((preset) => {
                      const sampleItems = preset.generateItems(booking);
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => handleSelectPresetClick(preset)}
                          className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all flex items-start gap-2.5 group cursor-pointer"
                        >
                          <div className={`p-2 rounded-xl border shrink-0 transition-transform group-hover:scale-105 ${preset.themeColor}`}>
                            {renderPresetIcon(preset.iconName, "w-4 h-4")}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1 mb-0.5">
                              <span className="font-bold text-xs text-slate-900 group-hover:text-indigo-600 transition-colors">
                                {preset.name}
                              </span>
                              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full border ${preset.bgBadge}`}>
                                {sampleItems.length} items
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 line-clamp-1">
                              {preset.subtitle}
                            </p>
                            <div className="flex items-center gap-1.5 mt-1 text-[10px]">
                              <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium">
                                {preset.categoryTag}
                              </span>
                            </div>
                          </div>
                        </button>
                      );
                    })}

                    {/* Restore standard booking recommendation */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsPresetDropdownOpen(false);
                        handleResetDefaults();
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-indigo-50/70 border border-indigo-100 transition-all flex items-center gap-2.5 text-indigo-900 cursor-pointer mt-1"
                    >
                      <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700 border border-indigo-200 shrink-0">
                        <RotateCcw className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-indigo-950">
                          Reset to {booking.serviceType.toUpperCase()} Standard
                        </div>
                        <p className="text-[10px] text-indigo-700">
                          Restore auto-recommended items based on this booking
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsAddSubcategoryModalOpen(true)}
              className="px-2.5 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-800 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              title="Add a custom sub-category section"
            >
              <FolderPlus className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">+ Sub-category</span>
            </button>

            <button
              onClick={handleCopyChecklist}
              className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              title="Copy formatted checklist to clipboard"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-600" />
                  <span>Copy</span>
                </>
              )}
            </button>

            {/* Download PDF Menu */}
            <div className="relative" ref={pdfMenuRef}>
              <div className="inline-flex rounded-lg shadow-2xs">
                <button
                  type="button"
                  onClick={() => handleDownloadPdf(false)}
                  disabled={isDownloadingPdf}
                  className="px-2.5 py-1.5 rounded-l-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Download clean, print-ready PDF checklist"
                >
                  {isDownloadingPdf ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <FileDown className="w-3.5 h-3.5 text-indigo-100" />
                      <span>Download PDF</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsPdfMenuOpen(!isPdfMenuOpen)}
                  disabled={isDownloadingPdf}
                  className="px-1.5 py-1.5 rounded-r-lg bg-indigo-700 hover:bg-indigo-800 disabled:bg-indigo-400 text-white text-xs border-l border-indigo-500 transition-colors cursor-pointer flex items-center"
                  title="PDF Download Options"
                >
                  <ChevronDown className={`w-3 h-3 transition-transform duration-150 ${isPdfMenuOpen ? "rotate-180" : ""}`} />
                </button>
              </div>

              {isPdfMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 p-1.5">
                  <div className="px-2.5 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
                    PDF Export Options
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDownloadPdf(false)}
                    className="w-full text-left p-2 rounded-xl hover:bg-indigo-50 text-slate-800 hover:text-indigo-900 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <FileDown className="w-4 h-4 text-indigo-600 shrink-0" />
                    <div>
                      <div className="font-bold">Complete Checklist</div>
                      <div className="text-[10px] text-slate-500 font-normal">All {items.length} items with sub-categories & checkboxes</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDownloadPdf(true)}
                    className="w-full text-left p-2 rounded-xl hover:bg-amber-50 text-slate-800 hover:text-amber-900 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer mt-0.5"
                  >
                    <Package className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      <div className="font-bold">Remaining Unpacked Only</div>
                      <div className="text-[10px] text-slate-500 font-normal">Only items left to pack ({items.filter((i) => !i.packed).length} items)</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={handlePrint}
              className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              title="Print checklist"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              onClick={handleResetDefaults}
              className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              title="Restore default recommended items"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Progress Banner */}
        <div className="bg-white px-4 sm:px-6 py-2.5 border-b border-slate-200">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                Packing Progress
              </span>
              <span className="text-xs font-extrabold text-indigo-700">
                {packedItemsCount} of {totalItems} Items Packed
              </span>
            </div>
            <div className="flex items-center gap-2">
              {isAllPacked ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 100% Ready to Go!
                </span>
              ) : (
                <span className="text-xs font-bold text-slate-500">{percentage}% completed</span>
              )}
            </div>
          </div>

          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/80">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                isAllPacked
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                  : percentage > 50
                  ? "bg-gradient-to-r from-indigo-500 to-emerald-500"
                  : "bg-gradient-to-r from-amber-500 to-indigo-500"
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Filters Toolbar: Category Pills & Subcategory Selector & Drag-Drop Tip */}
        <div className="px-4 sm:px-6 py-2.5 bg-slate-50/90 border-b border-slate-200 space-y-2">
          {/* Main Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSelectedSubcategory("all");
              }}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                selectedCategory === "all"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              <span>All Categories</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  selectedCategory === "all" ? "bg-indigo-700 text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                {categoryCounts.all.packed}/{categoryCounts.all.total}
              </span>
            </button>

            {categoriesConfig.map((cat) => {
              const count = categoryCounts[cat.id] || { total: 0, packed: 0 };
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setSelectedSubcategory("all");
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {cat.icon}
                  <span>{cat.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      isSelected ? "bg-indigo-700 text-white" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {count.packed}/{count.total}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search, Grouping View toggle, Status Tabs, and Actions */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search items or sub-categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {/* Grouping Toggle */}
              <button
                onClick={() => setGroupBySubcategory(!groupBySubcategory)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all flex items-center gap-1 cursor-pointer ${
                  groupBySubcategory
                    ? "bg-indigo-50 border-indigo-300 text-indigo-800"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
                title="Toggle Sub-category Grouping"
              >
                <Layers className="w-3 h-3 text-indigo-600" />
                <span>{groupBySubcategory ? "Sub-categories: ON" : "Flat List"}</span>
              </button>

              {/* Status Segmented Control */}
              <div className="bg-white border border-slate-300 rounded-xl p-0.5 flex items-center shadow-2xs text-[11px] font-bold text-slate-600">
                {(
                  [
                    { id: "all", label: "All" },
                    { id: "unpacked", label: "To Pack" },
                    { id: "packed", label: "Packed" },
                  ] as const
                ).map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setStatusFilter(st.id)}
                    className={`px-2 py-0.8 rounded-lg transition-all cursor-pointer ${
                      statusFilter === st.id
                        ? "bg-indigo-600 text-white shadow-2xs"
                        : "hover:text-slate-900"
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>

              {/* Quick Batch Actions */}
              <button
                onClick={() => handleSetAllPacked(true)}
                className="px-2.5 py-1 rounded-xl bg-white border border-slate-200 hover:bg-emerald-50 hover:border-emerald-300 text-slate-700 hover:text-emerald-800 text-[11px] font-bold transition-all shadow-2xs cursor-pointer"
                title="Mark all items as packed"
              >
                Pack All
              </button>

              <button
                onClick={() => handleSetAllPacked(false)}
                className="px-2.5 py-1 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-[11px] font-bold transition-all shadow-2xs cursor-pointer"
                title="Mark all items as unpacked"
              >
                Unpack All
              </button>
            </div>
          </div>
        </div>

        {/* Add New Custom Item Bar with Category & Sub-category Selector */}
        <form
          onSubmit={handleAddItem}
          className="bg-indigo-50/40 px-4 sm:px-6 py-2.5 border-b border-indigo-100/80 flex flex-wrap items-center gap-2"
        >
          <input
            type="text"
            placeholder="Add packing item (e.g., Camera Tripod, Power Bank, Shawl)..."
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            className="flex-1 min-w-[200px] bg-white border border-indigo-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 shadow-2xs"
          />

          {/* Category Selector */}
          <select
            value={newItemCategory}
            onChange={(e) => {
              setNewItemCategory(e.target.value as PackingCategoryType);
              setIsCustomSubcategoryInput(false);
            }}
            className="bg-white border border-indigo-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 shadow-2xs cursor-pointer"
          >
            <option value="clothing">👕 Clothing</option>
            <option value="documents">📄 Documents</option>
            <option value="electronics">🔌 Electronics</option>
            <option value="toiletries">🧴 Toiletries</option>
            <option value="medications">💊 Health / Meds</option>
            <option value="custom">🎒 Custom / Misc</option>
          </select>

          {/* Subcategory Selector or Custom Input */}
          {!isCustomSubcategoryInput ? (
            <div className="flex items-center gap-1">
              <select
                value={newItemSubcategory}
                onChange={(e) => {
                  if (e.target.value === "__NEW__") {
                    setIsCustomSubcategoryInput(true);
                  } else {
                    setNewItemSubcategory(e.target.value);
                  }
                }}
                className="bg-white border border-indigo-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 shadow-2xs cursor-pointer max-w-[170px]"
              >
                {(availableSubcategoriesByCategory[newItemCategory] || []).map((sub) => (
                  <option key={sub} value={sub}>
                    📁 {sub}
                  </option>
                ))}
                <option value="__NEW__">➕ + Custom Sub-category</option>
              </select>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <input
                type="text"
                placeholder="Sub-category name..."
                value={newSubcategoryName}
                onChange={(e) => setNewSubcategoryName(e.target.value)}
                className="bg-white border border-indigo-300 rounded-xl px-2.5 py-1.5 text-xs font-bold text-indigo-900 placeholder-indigo-300 focus:ring-2 focus:ring-indigo-500 w-36"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setIsCustomSubcategoryInput(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
                title="Cancel custom sub-category input"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={!newItemName.trim()}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold shadow-2xs flex items-center gap-1 transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </button>
        </form>

        {/* Drag & Drop Reorder Tip */}
        <div className="bg-slate-50/70 px-4 sm:px-6 py-1.5 border-b border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <GripVertical className="w-3.5 h-3.5 text-indigo-500" />
            <span>
              <strong>Tip:</strong> Drag items using the handle to reorder or move across sub-categories!
            </span>
          </div>
          <span className="text-[10px] text-slate-400 hidden sm:inline">
            Drag to category header to relocate
          </span>
        </div>

        {/* Notification Toast */}
        {toastMessage && (
          <div className="mx-4 sm:mx-6 mt-2 p-2 rounded-xl bg-indigo-950 text-white text-xs flex items-center gap-2 animate-in slide-in-from-top duration-200 shadow-md">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold">{toastMessage}</span>
          </div>
        )}

        {/* Checklist Items Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-2">
                <Luggage className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-700">No items match your filter</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                Try selecting &apos;All Categories&apos;, clearing search, or adding custom items above.
              </p>
            </div>
          ) : groupBySubcategory ? (
            // Grouped By Category and Sub-category with Drag & Drop zones
            groupedStructure.map((catGroup) => {
              return (
                <div key={catGroup.category} className="space-y-3">
                  {/* Category Header */}
                  <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <span className={`p-1 rounded-lg ${catGroup.categoryConfig.color}`}>
                        {catGroup.categoryConfig.icon}
                      </span>
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                        {catGroup.categoryConfig.label}
                      </h4>
                      <span className="text-xs font-bold text-slate-500">
                        ({catGroup.packedCount}/{catGroup.totalCount})
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setSubcatModalCategory(catGroup.category);
                          setIsAddSubcategoryModalOpen(true);
                        }}
                        className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-2 py-0.5 rounded-md transition-colors"
                      >
                        + Add Sub-category
                      </button>
                    </div>
                  </div>

                  {/* Subcategories */}
                  <div className="space-y-3 pl-1 sm:pl-2">
                    {catGroup.subcategories.map((subcat) => {
                      const isCollapsed = !!collapsedSubcategories[subcat.key];
                      const isSubcatDragOver = dragOverSubcategoryKey === subcat.key;

                      return (
                        <div
                          key={subcat.key}
                          onDragOver={(e) => handleDragOverSubcategory(e, subcat.key)}
                          onDrop={(e) => handleDropOnSubcategory(e, catGroup.category, subcat.name)}
                          className={`rounded-2xl border transition-all ${
                            isSubcatDragOver
                              ? "border-indigo-500 bg-indigo-50/50 shadow-md ring-2 ring-indigo-300"
                              : "border-slate-200/90 bg-slate-50/40"
                          }`}
                        >
                          {/* Subcategory Header */}
                          <div
                            onClick={() => toggleSubcategoryCollapse(subcat.key)}
                            className="p-2.5 sm:px-3 flex items-center justify-between cursor-pointer hover:bg-slate-100/80 rounded-t-2xl transition-colors select-none"
                          >
                            <div className="flex items-center gap-2">
                              <button className="text-slate-400 hover:text-slate-700">
                                {isCollapsed ? (
                                  <ChevronRight className="w-3.5 h-3.5" />
                                ) : (
                                  <ChevronDown className="w-3.5 h-3.5" />
                                )}
                              </button>

                              <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-xs font-bold text-slate-800 shadow-2xs flex items-center gap-1.5">
                                <Tag className="w-3 h-3 text-indigo-500" />
                                {subcat.name}
                              </span>

                              <span className="text-[11px] font-bold text-slate-500">
                                {subcat.packedCount}/{subcat.totalCount}
                              </span>

                              {subcat.isAllPacked && (
                                <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-full">
                                  <Check className="w-2.5 h-2.5 stroke-[3]" /> Done
                                </span>
                              )}
                            </div>

                            {/* Subcategory Quick Actions */}
                            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                onClick={() =>
                                  handleToggleSubcategoryPacked(
                                    catGroup.category,
                                    subcat.name,
                                    !subcat.isAllPacked
                                  )
                                }
                                className="text-[10px] font-bold text-slate-600 hover:text-indigo-700 bg-white hover:bg-indigo-50 border border-slate-200 px-2 py-0.8 rounded-lg shadow-2xs transition-colors"
                              >
                                {subcat.isAllPacked ? "Unpack" : "Pack All"}
                              </button>
                            </div>
                          </div>

                          {/* Subcategory Item List (Droppable Zone) */}
                          {!isCollapsed && (
                            <div className="p-2 sm:p-2.5 pt-0 space-y-1.5">
                              {subcat.items.length === 0 ? (
                                <div className="py-4 text-center border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
                                  No items here. Drag an item here or add a new one.
                                </div>
                              ) : (
                                subcat.items.map((item) => {
                                  const isDragging = draggedItemId === item.id;
                                  const isTarget = dragOverItemId === item.id;

                                  return (
                                    <div
                                      key={item.id}
                                      draggable
                                      onDragStart={(e) => handleDragStart(e, item.id)}
                                      onDragOver={(e) => handleDragOverItem(e, item.id)}
                                      onDragLeave={handleDragLeave}
                                      onDrop={(e) => handleDropOnItem(e, item.id)}
                                      onClick={() => handleToggleItem(item.id)}
                                      className={`group p-2.5 rounded-xl border transition-all flex items-start gap-2.5 cursor-pointer select-none ${
                                        isDragging
                                          ? "opacity-30 border-dashed border-indigo-400 bg-indigo-50"
                                          : item.packed
                                          ? "bg-slate-50/70 border-slate-200 hover:bg-slate-100"
                                          : "bg-white border-slate-200/90 hover:border-indigo-300 hover:shadow-xs"
                                      } ${
                                        isTarget && dropPosition === "above"
                                          ? "border-t-3 border-t-indigo-600 shadow-xs"
                                          : isTarget && dropPosition === "below"
                                          ? "border-b-3 border-b-indigo-600 shadow-xs"
                                          : ""
                                      }`}
                                    >
                                      {/* Drag Handle */}
                                      <div
                                        onClick={(e) => e.stopPropagation()}
                                        className="mt-0.5 text-slate-300 hover:text-indigo-600 cursor-grab active:cursor-grabbing p-0.5 rounded"
                                        title="Drag to reorder or move across sub-categories"
                                      >
                                        <GripVertical className="w-4 h-4" />
                                      </div>

                                      {/* Checkbox */}
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleToggleItem(item.id);
                                        }}
                                        className={`mt-0.5 w-5 h-5 rounded-lg flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                                          item.packed
                                            ? "bg-emerald-600 text-white shadow-2xs"
                                            : "border-2 border-slate-300 group-hover:border-indigo-500 bg-white"
                                        }`}
                                      >
                                        {item.packed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                      </button>

                                      {/* Content */}
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                          <span
                                            className={`text-xs font-bold transition-all ${
                                              item.packed
                                                ? "line-through text-slate-400 font-medium"
                                                : "text-slate-900"
                                            }`}
                                          >
                                            {item.name}
                                          </span>

                                          {item.essential && (
                                            <span className="px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-black uppercase tracking-wider">
                                              Essential
                                            </span>
                                          )}
                                        </div>

                                        {item.notes && (
                                          <p
                                            className={`text-[11px] mt-0.5 ${
                                              item.packed ? "text-slate-400 line-through" : "text-slate-500"
                                            }`}
                                          >
                                            {item.notes}
                                          </p>
                                        )}
                                      </div>

                                      {/* Quick Up/Down Relocators & Delete */}
                                      <div
                                        className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-all"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <button
                                          type="button"
                                          onClick={() => handleMoveItemRelative(item.id, "up")}
                                          className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                                          title="Move up"
                                        >
                                          <ArrowUpDown className="w-3 h-3" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteItem(item.id, item.name)}
                                          className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                          title="Delete item"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          ) : (
            // Flat List Rendering with Drag and Drop Reordering
            <div className="space-y-1.5">
              {filteredItems.map((item) => {
                const catConfig = categoriesConfig.find((c) => c.id === item.category);
                const isDragging = draggedItemId === item.id;
                const isTarget = dragOverItemId === item.id;

                return (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item.id)}
                    onDragOver={(e) => handleDragOverItem(e, item.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDropOnItem(e, item.id)}
                    onClick={() => handleToggleItem(item.id)}
                    className={`group p-3 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer select-none ${
                      isDragging
                        ? "opacity-30 border-dashed border-indigo-400 bg-indigo-50"
                        : item.packed
                        ? "bg-slate-50/70 border-slate-200 hover:bg-slate-100"
                        : "bg-white border-slate-200/90 hover:border-indigo-300 hover:shadow-xs"
                    } ${
                      isTarget && dropPosition === "above"
                        ? "border-t-3 border-t-indigo-600"
                        : isTarget && dropPosition === "below"
                        ? "border-b-3 border-b-indigo-600"
                        : ""
                    }`}
                  >
                    {/* Drag Handle */}
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="mt-0.5 text-slate-300 hover:text-indigo-600 cursor-grab active:cursor-grabbing p-0.5 rounded"
                      title="Drag to reorder"
                    >
                      <GripVertical className="w-4 h-4" />
                    </div>

                    {/* Checkbox */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleItem(item.id);
                      }}
                      className={`mt-0.5 w-5 h-5 rounded-lg flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                        item.packed
                          ? "bg-emerald-600 text-white shadow-2xs"
                          : "border-2 border-slate-300 group-hover:border-indigo-500 bg-white"
                      }`}
                    >
                      {item.packed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>

                    {/* Item Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-xs font-bold transition-all ${
                            item.packed
                              ? "line-through text-slate-400 font-medium"
                              : "text-slate-900"
                          }`}
                        >
                          {item.name}
                        </span>

                        {item.essential && (
                          <span className="px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-black uppercase tracking-wider">
                            Essential
                          </span>
                        )}

                        {catConfig && (
                          <span
                            className={`px-2 py-0.2 rounded-full text-[10px] font-bold border flex items-center gap-1 ${catConfig.color}`}
                          >
                            {catConfig.icon}
                            <span>{catConfig.label}</span>
                          </span>
                        )}

                        {item.subcategory && (
                          <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200">
                            📁 {item.subcategory}
                          </span>
                        )}
                      </div>

                      {item.notes && (
                        <p
                          className={`text-[11px] mt-0.5 ${
                            item.packed ? "text-slate-400 line-through" : "text-slate-500"
                          }`}
                        >
                          {item.notes}
                        </p>
                      )}
                    </div>

                    {/* Delete Item Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteItem(item.id, item.name);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                      title="Delete item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Summary */}
        <div className="bg-slate-50 px-4 sm:px-6 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              All custom sub-categories and item order saved for <strong>{booking.pnr || booking.title}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleDownloadPdf(false)}
              disabled={isDownloadingPdf}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1.5"
              title="Download offline printable PDF"
            >
              {isDownloadingPdf ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
              ) : (
                <FileDown className="w-3.5 h-3.5 text-indigo-600" />
              )}
              <span>Download PDF</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all shadow-2xs cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>

      {/* Add Custom Sub-category Modal */}
      {isAddSubcategoryModalOpen && (
        <div className="fixed inset-0 z-80 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 overflow-hidden p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-indigo-600" />
                <h4 className="font-bold text-sm text-slate-900">Create New Sub-category</h4>
              </div>
              <button
                onClick={() => setIsAddSubcategoryModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubcategory} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Parent Category
                </label>
                <select
                  value={subcatModalCategory}
                  onChange={(e) => setSubcatModalCategory(e.target.value as PackingCategoryType)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                >
                  <option value="clothing">👕 Clothing & Wearables</option>
                  <option value="documents">📄 Essential Documents & ID</option>
                  <option value="electronics">🔌 Electronics & Gadgets</option>
                  <option value="toiletries">🧴 Toiletries & Personal Care</option>
                  <option value="medications">💊 Health & Medications</option>
                  <option value="custom">🎒 Custom & Extras</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Sub-category Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Photography Gear, Beachwear, Winter Layers..."
                  value={subcatModalName}
                  onChange={(e) => setSubcatModalName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddSubcategoryModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!subcatModalName.trim()}
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold shadow-xs"
                >
                  Create Sub-category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preset Load Confirmation Modal */}
      {selectedPresetForConfirm && (
        <div className="fixed inset-0 z-80 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className={`p-3 rounded-2xl border shadow-inner ${selectedPresetForConfirm.themeColor}`}>
                  {renderPresetIcon(selectedPresetForConfirm.iconName, "w-6 h-6")}
                </div>
                <div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-amber-400 mb-0.5">
                    <Sparkles className="w-3 h-3" /> Template Confirmation
                  </span>
                  <h4 className="font-extrabold text-base text-white">
                    Load "{selectedPresetForConfirm.name}" Preset?
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {selectedPresetForConfirm.categoryTag}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPresetForConfirm(null)}
                className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 space-y-4">
              {/* Warning / Impact box */}
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-amber-900">
                    This will replace your current packing list
                  </div>
                  <p className="text-amber-800 leading-relaxed">
                    Your current list of <strong>{items.length} items</strong> will be replaced by the curated <strong>{selectedPresetForConfirm.generateItems(booking).length} items</strong> from the <strong>{selectedPresetForConfirm.name}</strong> template.
                  </p>
                </div>
              </div>

              {/* Template Overview */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Template Highlights & Overview
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {selectedPresetForConfirm.description}
                </p>

                <div className="pt-2 border-t border-slate-200/80">
                  <div className="text-[11px] font-bold text-slate-600 mb-1.5">
                    Included Sub-categories:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {Array.from(
                      new Set(
                        selectedPresetForConfirm
                          .generateItems(booking)
                          .map((it) => it.subcategory || "General Essentials")
                      )
                    ).map((subcat) => (
                      <span
                        key={subcat}
                        className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-[10px] font-bold text-slate-700 shadow-2xs"
                      >
                        📁 {subcat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Option to preserve packed states for matching items */}
              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={keepExistingMatchingItems}
                  onChange={(e) => setKeepExistingMatchingItems(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-800">Keep checked status</span>
                  <span className="text-slate-500 block text-[11px]">
                    Preserve packed checkmarks for any matching item names
                  </span>
                </div>
              </label>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedPresetForConfirm(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmLoadPreset}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Confirm & Load Template</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
