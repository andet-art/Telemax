import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Star,
  Search,
  Heart,
  X,
  CheckCircle,
  Eye,
  Grid,
  List,
  Package,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { useCart } from "../context/CartContext";
import { api } from "@/lib/api";
import woodBg from "../assets/artisan3.jpg";

// Backend API types
interface ApiProduct {
  id: string | number;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number | null;
  image?: string;
  image_url?: string;
  rating?: number;
  reviewCount?: number;
  inStock?: boolean;
  featured?: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
  category?: string;
  category_slug?: string;
  sku?: string;
  stock?: number;
}

interface ApiCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  product_count?: number;
}

// Pipe categories
const PIPE_CATEGORIES = [
  { slug: "4th-july", name: "4th July", description: "Patriotic commemorative pipes" },
  { slug: "anchor", name: "Anchor Series", description: "Classic anchor-themed designs" },
  { slug: "avery", name: "Avery Series", description: "Traditional craftsmanship" },
  { slug: "autumn", name: "Autumn", description: "Seasonal autumn-themed pipes" },
  { slug: "black-sand", name: "Black Sand", description: "Dark, elegant finishes" },
  { slug: "elbe", name: "Elbe Series", description: "Named after the Elbe river" },
  { slug: "hamburg-cumberland", name: "Hamburg Cumberland", description: "Regional classics" },
  { slug: "hanse", name: "Hanse", description: "Hanseatic League inspired" },
  { slug: "leaf", name: "Leaf Pattern", description: "Nature-inspired leaf designs" },
  { slug: "long-pipes", name: "Long Pipes", description: "Extended length pipes" },
  { slug: "mini-pipes", name: "Mini Pipes", description: "Compact and portable" },
  { slug: "morta", name: "Morta", description: "Ancient bog oak construction" },
  { slug: "mountain", name: "Mountain Series", description: "Rugged mountain-themed" },
  { slug: "nautica", name: "Nautica Series", description: "Maritime-inspired designs" },
  { slug: "real-horn", name: "Real Horn", description: "Authentic horn materials" },
];

// Toast component
const Toast = ({
  message,
  type = "success",
  onClose,
}: {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
}) => (
  <motion.div
    className={`fixed bottom-6 left-6 px-6 py-3 rounded-lg shadow-lg z-[70] flex items-center gap-3 ${
      type === "success"
        ? "bg-[#c9a36a] text-[#1a120b]"
        : "bg-red-800 text-red-100"
    }`}
    initial={{ opacity: 0, y: 20, x: -20 }}
    animate={{ opacity: 1, y: 0, x: 0 }}
    exit={{ opacity: 0, y: 20, x: -20 }}
    transition={{ type: "spring", damping: 20, stiffness: 300 }}
  >
    <CheckCircle className="w-5 h-5" />
    <span className="font-medium font-serif">{message}</span>
    <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">
      <X className="w-4 h-4" />
    </button>
  </motion.div>
);

// Product card
const ProductCard = ({
  product,
  onAddToCart,
  onToggleFavorite,
  isFavorite,
  onQuickView,
}: {
  product: ApiProduct;
  onAddToCart: (product: ApiProduct) => void;
  onToggleFavorite: (id: string | number) => void;
  isFavorite: boolean;
  onQuickView: (product: ApiProduct) => void;
}) => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="group bg-[#2a1d13] rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-[#c9a36a]/20"
      whileHover={{ y: -4 }}
      layout
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image || product.image_url || "/images/pipes/placeholder.jpg"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/images/pipes/placeholder.jpg";
          }}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full font-medium">
              New
            </span>
          )}
          {product.featured && (
            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium">
              Featured
            </span>
          )}
          {product.isBestseller && (
            <span className="bg-orange-600 text-white text-xs px-2 py-1 rounded-full font-medium">
              Bestseller
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onToggleFavorite(product.id)}
            className={`p-2 rounded-full backdrop-blur-sm border transition-colors ${
              isFavorite
                ? "bg-red-500/90 text-white border-red-500"
                : "bg-white/90 text-gray-600 border-white/50 hover:bg-red-500 hover:text-white"
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
          </button>
          <button
            onClick={() => onQuickView(product)}
            className="p-2 rounded-full bg-white/90 text-gray-600 border border-white/50 backdrop-blur-sm hover:bg-blue-500 hover:text-white transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3
            className="font-semibold text-white cursor-pointer hover:text-[#c9a36a] transition-colors line-clamp-2 font-serif"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            {product.name}
          </h3>
          {product.rating && (
            <div className="flex items-center gap-1 text-[#c9a36a]">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm text-stone-300">{product.rating}</span>
            </div>
          )}
        </div>

        {product.description && (
          <p className="text-stone-300 text-sm mb-3 line-clamp-2">{product.description}</p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-[#c9a36a] font-serif">${product.price}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-stone-400 line-through">${product.originalPrice}</span>
            )}
          </div>

          <button
            onClick={() => onAddToCart(product)}
            disabled={!product.inStock}
            className="flex items-center gap-2 bg-[#c9a36a] text-[#1a120b] px-4 py-2 rounded-lg hover:bg-[#b8934d] transition-colors disabled:bg-stone-600 disabled:cursor-not-allowed font-serif"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="text-sm font-medium">Add to Cart</span>
          </button>
        </div>

        {product.sku && (
          <div className="mt-2 text-xs text-stone-400">SKU: {product.sku}</div>
        )}
      </div>
    </motion.div>
  );
};

// Category card
const CategoryCard = ({
  category,
  productCount,
  isSelected,
  onClick,
}: {
  category: typeof PIPE_CATEGORIES[0];
  productCount: number;
  isSelected: boolean;
  onClick: () => void;
}) => (
  <motion.div
    className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
      isSelected
        ? "border-[#c9a36a] bg-[#c9a36a]/10 shadow-lg"
        : "border-[#c9a36a]/20 bg-[#2a1d13] hover:border-[#c9a36a]/40 hover:shadow-md"
    }`}
    onClick={onClick}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <div className="flex items-center justify-between mb-3">
      <h3 className={`font-semibold font-serif ${isSelected ? "text-[#c9a36a]" : "text-white"}`}>
        {category.name}
      </h3>
      <span
        className={`text-sm px-2 py-1 rounded-full ${
          isSelected ? "bg-[#c9a36a] text-[#1a120b]" : "bg-[#1a120b] text-stone-300"
        }`}
      >
        {productCount} pipes
      </span>
    </div>
    <p className={`text-sm ${isSelected ? "text-[#c9a36a]/80" : "text-stone-300"}`}>
      {category.description}
    </p>
  </motion.div>
);

export default function Orders() {
  const { t } = useTranslation();
  const { addToCart } = useCart();

  // State
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [favorites, setFavorites] = useState<(string | number)[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ApiProduct | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [categoriesRes, productsRes] = await Promise.all([
          api.get<ApiCategory[]>("/api/categories"),
          api.get<ApiProduct[]>("/api/products"),
        ]);

        setCategories(categoriesRes.data || []);
        setProducts(productsRes.data || []);
      } catch (err: any) {
        console.error("Failed to fetch data:", err);
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getCategoryFromName = (name: string): string => {
    const lowerName = name.toLowerCase();
    for (const cat of PIPE_CATEGORIES) {
      if (lowerName.includes(cat.slug) || lowerName.includes(cat.name.toLowerCase())) {
        return cat.name;
      }
    }
    return "Uncategorized";
  };

  const getCategoryProductCount = (categoryName: string): number => {
    if (categoryName === "all") return products.length;
    return products.filter((product) => {
      const productCategory = product.category || getCategoryFromName(product.name);
      return productCategory === categoryName;
    }).length;
  };

  const filteredProducts = products
    .filter((product) => {
      if (selectedCategory !== "all") {
        const productCategory = product.category || getCategoryFromName(product.name);
        if (productCategory !== selectedCategory) return false;
      }
      if (searchTerm.trim()) {
        const search = searchTerm.toLowerCase();
        return (
          product.name.toLowerCase().includes(search) ||
          (product.description || "").toLowerCase().includes(search) ||
          (product.category || "").toLowerCase().includes(search)
        );
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name":
          return a.name.localeCompare(b.name);
        case "newest":
          return Number(b.isNew) - Number(a.isNew);
        case "featured":
        default:
          return Number(b.featured) - Number(a.featured);
      }
    });

  const handleAddToCart = (product: ApiProduct) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image || product.image_url || "/images/pipes/placeholder.jpg",
      quantity: 1,
    });
    setToast({ message: `${product.name} added to cart!`, type: "success" });
    setTimeout(() => setToast(null), 3000);
  };

  const toggleFavorite = (productId: string | number) => {
    setFavorites((prev) => {
      const isCurrentlyFavorite = prev.includes(productId);
      const product = products.find((p) => p.id === productId);
      if (product) {
        setToast({
          message: isCurrentlyFavorite
            ? `${product.name} removed from favorites`
            : `${product.name} added to favorites!`,
          type: "success",
        });
        setTimeout(() => setToast(null), 3000);
      }
      return isCurrentlyFavorite ? prev.filter((id) => id !== productId) : [...prev, productId];
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a120b] flex items-center justify-center">
        <Sidebar />
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c9a36a] mx-auto mb-4"></div>
          <p className="text-stone-300 font-serif">Loading pipes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#1a120b] flex items-center justify-center">
        <Sidebar />
        <div className="text-center">
          <p className="text-red-400 mb-4 font-serif">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#c9a36a] text-[#1a120b] px-4 py-2 rounded-lg hover:bg-[#b8934d] font-serif"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a120b] text-white font-serif relative">
      <Sidebar />

      {/* Background Image */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{ backgroundImage: `url(${woodBg})` }}
      />

      <div className="relative z-10">
        {/* Sticky navbar */}
        <div className="bg-[#2a1d13]/90 backdrop-blur-sm border-b border-[#c9a36a]/20 sticky top-0 z-50">
          
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search & Filters Section */}
          <div className="bg-[#2a1d13]/90 p-4 mt-16 rounded-xl shadow-md border border-[#c9a36a]/20 mb-10">
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search pipes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#1a120b] border border-[#c9a36a]/30 rounded-lg focus:ring-2 focus:ring-[#c9a36a] focus:border-[#c9a36a] text-white placeholder-stone-400"
                />
              </div>

             

              
            </div>
          </div>

          {/* Categories */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#c9a36a] mb-6 font-serif flex items-center gap-2">
              <Package className="w-6 h-6" />
              Categories
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <CategoryCard
                category={{ slug: "all", name: "All Pipes", description: "Browse the full collection" }}
                productCount={getCategoryProductCount("all")}
                isSelected={selectedCategory === "all"}
                onClick={() => setSelectedCategory("all")}
              />
              {PIPE_CATEGORIES.map((category) => (
                <CategoryCard
                  key={category.slug}
                  category={category}
                  productCount={getCategoryProductCount(category.name)}
                  isSelected={selectedCategory === category.name}
                  onClick={() => setSelectedCategory(category.name)}
                />
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <h2 className="text-2xl font-bold text-[#c9a36a] mb-6 font-serif flex items-center gap-2">
              <ShoppingCart className="w-6 h-6" />
              Products ({filteredProducts.length})
            </h2>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 bg-[#2a1d13]/50 rounded-xl border border-[#c9a36a]/20">
                <p className="text-stone-300 font-serif">No pipes found matching your criteria.</p>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                      onToggleFavorite={toggleFavorite}
                      isFavorite={favorites.includes(product.id)}
                      onQuickView={setSelectedProduct}
                    />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onToggleFavorite={toggleFavorite}
                    isFavorite={favorites.includes(product.id)}
                    onQuickView={setSelectedProduct}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
