'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Coupon {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  minPurchase?: number;
  maxUses?: number;
  usedCount: number;
  expiresAt?: string;
  isActive: boolean;
}

interface CouponStore {
  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  
  addCoupon: (coupon: Omit<Coupon, 'usedCount'>) => void;
  removeCoupon: (code: string) => void;
  toggleCouponActive: (code: string) => void;
  applyCoupon: (code: string, cartTotal: number) => { success: boolean; message: string; discount?: number };
  clearAppliedCoupon: () => void;
  calculateDiscount: (cartTotal: number) => number;
}

const initialCoupons: Coupon[] = [
  {
    code: 'BIENVENIDO10',
    discount: 10,
    type: 'percentage',
    minPurchase: 50000,
    isActive: true,
    usedCount: 0,
  },
  {
    code: 'ENVIOGRATIS',
    discount: 5000,
    type: 'fixed',
    minPurchase: 100000,
    isActive: true,
    usedCount: 0,
  },
  {
    code: 'VERANO20',
    discount: 20,
    type: 'percentage',
    minPurchase: 150000,
    maxUses: 50,
    isActive: true,
    usedCount: 0,
  },
];

export const useCouponStore = create<CouponStore>()(
  persist(
    (set, get) => ({
      coupons: initialCoupons,
      appliedCoupon: null,

      addCoupon: (couponData) => {
        const newCoupon: Coupon = {
          ...couponData,
          usedCount: 0,
        };
        set((state) => ({
          coupons: [...state.coupons, newCoupon],
        }));
      },

      removeCoupon: (code) => {
        set((state) => ({
          coupons: state.coupons.filter((c) => c.code !== code),
        }));
      },

      toggleCouponActive: (code) => {
        set((state) => ({
          coupons: state.coupons.map((c) =>
            c.code === code ? { ...c, isActive: !c.isActive } : c
          ),
        }));
      },

      applyCoupon: (code, cartTotal) => {
        const { coupons } = get();
        const coupon = coupons.find(
          (c) => c.code.toUpperCase() === code.toUpperCase()
        );

        if (!coupon) {
          return { success: false, message: 'Cupón no válido' };
        }

        if (!coupon.isActive) {
          return { success: false, message: 'Este cupón ya no está activo' };
        }

        if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
          return { success: false, message: 'Este cupón ha expirado' };
        }

        if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
          return { success: false, message: 'Este cupón ha alcanzado su límite de usos' };
        }

        if (coupon.minPurchase && cartTotal < coupon.minPurchase) {
          const formatted = new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0,
          }).format(coupon.minPurchase);
          return {
            success: false,
            message: `Compra mínima de ${formatted} requerida`,
          };
        }

        const discount =
          coupon.type === 'percentage'
            ? (cartTotal * coupon.discount) / 100
            : coupon.discount;

        set({ appliedCoupon: coupon });

        return {
          success: true,
          message: `¡Cupón aplicado! Descuento: ${
            coupon.type === 'percentage' ? `${coupon.discount}%` : `$${coupon.discount.toLocaleString()}`
          }`,
          discount,
        };
      },

      clearAppliedCoupon: () => {
        set({ appliedCoupon: null });
      },

      calculateDiscount: (cartTotal) => {
        const { appliedCoupon } = get();
        if (!appliedCoupon) return 0;

        return appliedCoupon.type === 'percentage'
          ? (cartTotal * appliedCoupon.discount) / 100
          : appliedCoupon.discount;
      },
    }),
    {
      name: 'georgina-coupons',
    }
  )
);