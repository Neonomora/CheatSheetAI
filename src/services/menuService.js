import { collection, getDocs, query } from "firebase/firestore";
import { db } from "./firebase";

// Shuffle array
const shuffleArray = (array) => {
  return [...array].sort(() => Math.random() - 0.5);
};

export const searchMenus = async ({ category, filters, search }) => {
  try {
    const storesSnapshot = await getDocs(collection(db, "stores"));
    const results = [];

    // Shuffle urutan toko dulu
    const stores = shuffleArray(
      storesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
    );

    for (const store of stores) {
      const menusSnapshot = await getDocs(
        collection(db, "stores", store.id, "menus"),
      );

      // Shuffle urutan menu per toko
      const menus = shuffleArray(
        menusSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      );

      for (const menu of menus) {
        if (menu.category !== category) continue;

        if (search) {
          const searchLower = search.toLowerCase();
          if (!menu.name.toLowerCase().includes(searchLower)) continue;
        }

        if (filters && filters.length > 0) {
          const filterLabels = filters.map((f) => f.label);
          const hasMatch = filterLabels.some((label) =>
            menu.filters?.includes(label),
          );
          if (!hasMatch) continue;
        }

        results.push({
          name: menu.name,
          description: `Menu dari ${store.name}`,
          price: menu.price,
          location: menu.location,
          storeName: store.name,
          source: "database",
        });
      }
    }

    return results;
  } catch (error) {
    console.error("Error searching menus:", error);
    return [];
  }
};
