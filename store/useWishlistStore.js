// store/useWishlistStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      wishlistIds: [],
      // True once the store has been synced with the server's real wishlist
      // (see components/Header.jsx). Deliberately NOT persisted — it must
      // start false on every fresh load so components fall back to their
      // server-rendered `initialWishlisted` prop until the sync completes,
      // instead of flashing whatever stale array was last in localStorage.
      hasSynced: false,
      isWishlisted: (productId) => get().wishlistIds.includes(productId),
      setWishlistIds: (ids) => set({ wishlistIds: ids, hasSynced: true }),
      toggle: (productId) => {
        const current = get().wishlistIds;
        const exists = current.includes(productId);
        set({
          wishlistIds: exists
            ? current.filter((id) => id !== productId)
            : [...current, productId],
        });
      },
    }),
    { name: "wishlist-storage", partialize: (state) => ({ wishlistIds: state.wishlistIds }) }
  )
);