import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      services: [],
      selectedTariff: null,
      tariffDetails: null,
      domainConfig: null,
      selectedPlan: null,
      cartItems: [],
      showCart: false,
      showPaymentStep: false,
      loading: false,
      error: null,

      setServices: (services) => set({ services }),
      setSelectedTariff: (tariff) => set({ selectedTariff: tariff }),
      setTariffDetails: (details) => set({ tariffDetails: details }),
      setDomainConfig: (config) => set({ domainConfig: config }),
      setSelectedPlan: (plan) => set({ selectedPlan: plan }),
      addToCart: (item) => set((state) => ({ cartItems: [...state.cartItems, item] })),
      setShowCart: (value) => set({ showCart: value }),
      setShowPaymentStep: (value) => set({ showPaymentStep: value }),
      setLoading: (value) => set({ loading: value }),
      setError: (value) => set({ error: value }),
    }),
    {
      name: 'mycloud-store', // localStorage uchun nom
      storage: createJSONStorage(() => localStorage), // localStorage da saqlash
      // Faqat kerakli fieldlarni saqlash
      partialize: (state) => ({ cartItems: state.cartItems, selectedTariff: state.selectedTariff }),
    }
  )
);

export default useStore;