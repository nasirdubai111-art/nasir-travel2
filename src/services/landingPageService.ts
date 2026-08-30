import {
  CMSLandingPage,
  ExploreCMSItem,
  CMSOfferRecord,
} from "../types/travelCmsTypes";
import {
  INITIAL_LANDING_PAGES,
  INITIAL_EXPLORE_ITEMS,
  INITIAL_CMS_OFFERS,
} from "../data/travelCmsData";

const STORAGE_KEYS = {
  PAGES: "bharat_travel_cms_pages_v1",
  EXPLORE: "bharat_travel_cms_explore_v1",
  OFFERS: "bharat_travel_cms_offers_v1",
};

export const landingPageService = {
  // ----------------------------------------------------
  // LANDING PAGES
  // ----------------------------------------------------
  getLandingPages(): CMSLandingPage[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PAGES);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn("Error reading CMS landing pages from localStorage", e);
    }
    return INITIAL_LANDING_PAGES;
  },

  getLandingPageBySlug(slug: string): CMSLandingPage | null {
    const pages = this.getLandingPages();
    const cleanSlug = (slug || "").replace(/^\/+|\/+$/g, "");
    return (
      pages.find(
        (p) => (p.slug || "").replace(/^\/+|\/+$/g, "") === cleanSlug
      ) || null
    );
  },

  saveLandingPage(page: CMSLandingPage): CMSLandingPage[] {
    const pages = this.getLandingPages();
    const existingIndex = pages.findIndex((p) => p.id === page.id);
    let updated: CMSLandingPage[];
    if (existingIndex >= 0) {
      updated = [...pages];
      updated[existingIndex] = { ...page, updatedAt: new Date().toISOString() };
    } else {
      updated = [{ ...page, updatedAt: new Date().toISOString() }, ...pages];
    }
    try {
      localStorage.setItem(STORAGE_KEYS.PAGES, JSON.stringify(updated));
    } catch (e) {
      console.error("Error saving CMS pages", e);
    }
    return updated;
  },

  deleteLandingPage(id: string): CMSLandingPage[] {
    const pages = this.getLandingPages();
    const filtered = pages.filter((p) => p.id !== id);
    try {
      localStorage.setItem(STORAGE_KEYS.PAGES, JSON.stringify(filtered));
    } catch (e) {
      console.error("Error deleting CMS page", e);
    }
    return filtered;
  },

  // ----------------------------------------------------
  // EXPLORE CMS ITEMS
  // ----------------------------------------------------
  getExploreItems(): ExploreCMSItem[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.EXPLORE);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn("Error reading Explore CMS items from localStorage", e);
    }
    return INITIAL_EXPLORE_ITEMS;
  },

  saveExploreItem(item: ExploreCMSItem): ExploreCMSItem[] {
    const items = this.getExploreItems();
    const existingIndex = items.findIndex((i) => i.id === item.id);
    let updated: ExploreCMSItem[];
    if (existingIndex >= 0) {
      updated = [...items];
      updated[existingIndex] = item;
    } else {
      updated = [item, ...items];
    }
    try {
      localStorage.setItem(STORAGE_KEYS.EXPLORE, JSON.stringify(updated));
    } catch (e) {
      console.error("Error saving Explore item", e);
    }
    return updated;
  },

  deleteExploreItem(id: string): ExploreCMSItem[] {
    const items = this.getExploreItems();
    const filtered = items.filter((i) => i.id !== id);
    try {
      localStorage.setItem(STORAGE_KEYS.EXPLORE, JSON.stringify(filtered));
    } catch (e) {
      console.error("Error deleting Explore item", e);
    }
    return filtered;
  },

  // ----------------------------------------------------
  // OFFERS CMS ITEMS
  // ----------------------------------------------------
  getOffers(): CMSOfferRecord[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.OFFERS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn("Error reading Offers CMS from localStorage", e);
    }
    return INITIAL_CMS_OFFERS;
  },

  saveOffer(offer: CMSOfferRecord): CMSOfferRecord[] {
    const offers = this.getOffers();
    const existingIndex = offers.findIndex((o) => o.id === offer.id);
    let updated: CMSOfferRecord[];
    if (existingIndex >= 0) {
      updated = [...offers];
      updated[existingIndex] = offer;
    } else {
      updated = [offer, ...offers];
    }
    try {
      localStorage.setItem(STORAGE_KEYS.OFFERS, JSON.stringify(updated));
    } catch (e) {
      console.error("Error saving Offer", e);
    }
    return updated;
  },

  deleteOffer(id: string): CMSOfferRecord[] {
    const offers = this.getOffers();
    const filtered = offers.filter((o) => o.id !== id);
    try {
      localStorage.setItem(STORAGE_KEYS.OFFERS, JSON.stringify(filtered));
    } catch (e) {
      console.error("Error deleting Offer", e);
    }
    return filtered;
  },
};
