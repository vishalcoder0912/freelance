import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number; // 1 to 5
  text: string;
  date: string;
  isVerified: boolean;
  image?: string;
}

interface ReviewState {
  reviews: Review[];
  addReview: (productId: string, author: string, rating: number, text: string, isVerified?: boolean) => void;
  getReviewsForProduct: (productId: string) => Review[];
  getAverageRating: (productId: string) => { rating: number; count: number };
}

const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'sig-dark-75',
    author: 'Aravind K.',
    rating: 5,
    text: 'Absolutely stunning flavor profile. The dark cherry notes emerge right at the start and linger beautifully with the roasted espresso. A benchmark for Indian single origin chocolate.',
    date: '2026-05-12T10:00:00.000Z',
    isVerified: true
  },
  {
    id: 'rev-2',
    productId: 'sig-dark-75',
    author: 'Meera Sen',
    rating: 5,
    text: 'A masterpiece. I bought three bars and finished the first one within ten minutes. Packaging looks like fine art.',
    date: '2026-06-02T14:30:00.000Z',
    isVerified: true
  },
  {
    id: 'rev-3',
    productId: 'malabar-milk-55',
    author: 'David L.',
    rating: 5,
    text: 'The sea salt flakes are subtle but perfect. High cacao milk chocolate that is not overly sweet. Creamy, rich, and highly addictive.',
    date: '2026-05-20T08:15:00.000Z',
    isVerified: true
  },
  {
    id: 'rev-4',
    productId: 'anaimalai-85',
    author: 'Priya R.',
    rating: 4,
    text: 'Sublime, intense cacao. The citrus and oolong notes are very clear. If you enjoy deep dark chocolate with minimal sugar, this is perfect.',
    date: '2026-06-10T11:45:00.000Z',
    isVerified: true
  },
  {
    id: 'rev-5',
    productId: 'monsoon-harvest-spiced',
    author: 'Vikram Singh',
    rating: 5,
    text: 'Cardamom and orange blossom notes are outstanding. It tastes like monsoon evenings in Kerala. Highly recommended seasonal creation.',
    date: '2026-06-15T16:20:00.000Z',
    isVerified: true
  }
];

export const useReviewStore = create<ReviewState>()(
  persist(
    (set, get) => ({
      reviews: INITIAL_REVIEWS,
      
      addReview: (productId, author, rating, text, isVerified = false) =>
        set((state) => {
          const newReview: Review = {
            id: `rev-${Math.random().toString(36).substr(2, 9)}`,
            productId,
            author,
            rating,
            text,
            date: new Date().toISOString(),
            isVerified
          };
          return { reviews: [newReview, ...state.reviews] };
        }),

      getReviewsForProduct: (productId) => {
        return get().reviews.filter((r) => r.productId === productId);
      },

      getAverageRating: (productId) => {
        const productReviews = get().reviews.filter((r) => r.productId === productId);
        if (productReviews.length === 0) return { rating: 5, count: 0 }; // Default rating 5
        const sum = productReviews.reduce((acc, r) => acc + r.rating, 0);
        return {
          rating: parseFloat((sum / productReviews.length).toFixed(1)),
          count: productReviews.length
        };
      }
    }),
    {
      name: 'mason-reviews-storage',
    }
  )
);
