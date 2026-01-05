import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/Button";
import { Product } from "../pages/MarketplacePage";
import { addToCart } from "@store/slices/bookingSlice";
import { BookingItem } from "@/types/booking";
import { Badge } from "@/components/ui/Badge";
import { MapPin, Clock, Check, Gift, Truck, Flag, Flame } from "lucide-react";
import {
  FaHeart as FaHeartSolid,
  FaRegHeart,
  FaShoppingCart,
  FaStar,
  FaShieldAlt,
  FaExclamationTriangle,
} from "react-icons/fa";

interface ProductCardProps {
  product: Product;
  viewMode?: "grid" | "list";
  onWishlistToggle?: (productId: string) => void;
  onAddToCart?: (productId: string) => void;
  onClick?: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  viewMode,
  onWishlistToggle,
  onAddToCart,
  onClick,
}) => {
  const dispatch = useDispatch();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const handleImageError = () => {
    setIsImageLoading(false);
  };

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex(
      (prev) => (prev - 1 + product.images.length) % product.images.length
    );
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onWishlistToggle?.(product.id);
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Convert Product to BookingItem format
    const bookingItem: BookingItem = {
      id: `product-${product.id}-${Date.now()}`,
      tourId: product.id,
      tourName: product.name,
      tourImage: product.images[0] || "/placeholder-product.jpg",
      date: new Date().toISOString().split("T")[0], // Today's date as default
      participants: {
        adults: 1,
        children: 0,
      },
      pricePerAdult: product.price,
      pricePerChild: 0,
      addOns: [],
      totalPrice: product.price,
      meetingPoint: product.vendor.location,
      duration: "Product",
      specialRequests: "",
    };

    // Add to cart using Redux
    dispatch(addToCart(bookingItem));

    // Also call the original callback if provided
    onAddToCart?.(product.id);
  };

  const getAvailabilityStatus = () => {
    switch (product.availability) {
      case "in-stock":
        return {
          icon: <Check className="h-4 w-4 text-green-600" />,
          text: "In Stock",
          color: "text-green-600",
        };
      case "limited":
        return {
          icon: <Clock className="h-4 w-4 text-yellow-600" />,
          text: "Limited Stock",
          color: "text-yellow-600",
        };
      case "out-of-stock":
        return {
          icon: <FaExclamationTriangle className="h-4 w-4 text-red-600" />,
          text: "Out of Stock",
          color: "text-red-600",
        };
      default:
        return {
          icon: <Check className="h-4 w-4 text-green-600" />,
          text: "Available",
          color: "text-green-600",
        };
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        className={`text-sm ${
          i < Math.floor(rating)
            ? "text-yellow-400"
            : "text-gray-300 dark:text-gray-600"
        }`}
      />
    ));
  };

  const availabilityStatus = getAvailabilityStatus();

  if (viewMode === "list") {
    return (
      <div
        className="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 w-full h-full flex flex-col"
        onClick={() => onClick?.(product.id)}
      >
        {/* Image Container */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={product.images[0] || "/placeholder-product.jpg"}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={handleImageError}
            onLoad={handleImageLoad}
          />

          {/* Badges - Improved positioning */}
          <div className="absolute top-2 left-2 flex flex-col items-start gap-1 z-10">
            {product.madeInEthiopia && (
              <Badge className="bg-gradient-to-r from-green-600 to-green-700 text-white text-xs px-2 py-1">
                <Flag className="h-3 w-3 mr-1" />
                Made in Ethiopia
              </Badge>
            )}
            {product.isFeatured && (
              <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs px-2 py-1">
                <Flame className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            )}
            {product.isNew && (
              <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs px-2 py-1">
                <Gift className="h-3 w-3 mr-1" />
                New
              </Badge>
            )}
            {product.discount && (
              <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-2 py-1">
                -{product.discount}%
              </Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistClick}
            className="absolute top-2 right-2 p-2 bg-white/90 dark:bg-gray-900/90 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors z-10"
            aria-label={
              product.isWishlisted ? "Remove from wishlist" : "Add to wishlist"
            }
          >
            <FaHeartSolid
              className={`h-5 w-5 ${
                product.isWishlisted
                  ? "fill-red-500 text-red-500"
                  : "text-gray-600 dark:text-gray-300"
              }`}
            />
          </button>

          {/* Vendor Info */}
          <div className="absolute bottom-2 left-2 right-2">
            <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm p-2 rounded-lg flex items-center">
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-2 flex-shrink-0">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {product.vendor.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {product.vendor.name}
                </p>
                <div className="flex items-center mt-1">
                  <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span className="truncate">{product.vendor.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content for list view */}
        <div className="p-4 flex-1 flex flex-col">
          <div className="mb-2">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white line-clamp-2 mb-1">
              {product.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {product.description}
            </p>
          </div>

          {/* Rating */}
          <div className="flex items-center mb-2">
            <div className="flex items-center mr-2">
              {renderStars(product.rating)}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {product.rating} ({product.reviewCount})
            </span>
          </div>

          {/* Features/Tags */}
          <div className="mb-3 flex flex-wrap gap-1">
            {product.features.slice(0, 2).map((feature, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
              >
                {feature}
              </span>
            ))}
          </div>

          {/* Price */}
          <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <div className="flex flex-col">
                <div className="flex items-baseline gap-2">
                  {product.originalPrice && (
                    <span className="text-gray-500 dark:text-gray-400 line-through text-sm">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {formatPrice(product.price)}
                  </span>
                </div>
                <div className="flex items-center text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {availabilityStatus.icon}
                  <span className={`ml-1 ${availabilityStatus.color}`}>
                    {availabilityStatus.text}
                  </span>
                </div>
              </div>
            </div>

            {/* Availability and Shipping */}
            <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-3">
              <div className="flex items-center">
                <Truck className="h-3.5 w-3.5 mr-1" />
                {product.shipping.free
                  ? "Free shipping"
                  : `$${product.shipping.cost}`}
              </div>
              <span className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {product.shipping.estimatedDays} days
              </span>
            </div>

            {/* Add to Cart Button - Now with orange styling */}
            <Button
              onClick={handleAddToCartClick}
              disabled={product.availability === "out-of-stock"}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300"
            >
              <FaShoppingCart className="mr-2" />
              {product.availability === "out-of-stock"
                ? "Out of Stock"
                : "Add to Cart"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div
      onClick={() => onClick?.(product.id)}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group h-full flex flex-col"
    >
      {/* Image Section */}
      <div className="relative aspect-square overflow-hidden">
        {isImageLoading && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center">
            <div className="text-gray-400">Loading...</div>
          </div>
        )}
        <img
          src={product.images[currentImageIndex] || "/placeholder-product.jpg"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onLoad={handleImageLoad}
          onError={handleImageError}
        />

        {/* Badges - Improved positioning */}
        <div className="absolute top-2 left-2 flex flex-col items-start gap-1 z-10">
          {product.madeInEthiopia && (
            <Badge className="bg-gradient-to-r from-green-600 to-green-700 text-white text-xs px-2 py-1 backdrop-blur-sm bg-opacity-90">
              <Flag className="h-3 w-3 mr-1" />
              Made in Ethiopia
            </Badge>
          )}
          {product.isFeatured && (
            <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs px-2 py-1 backdrop-blur-sm bg-opacity-90">
              <Flame className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          )}
          {product.isNew && (
            <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs px-2 py-1 backdrop-blur-sm bg-opacity-90">
              <Gift className="h-3 w-3 mr-1" />
              New
            </Badge>
          )}
          {product.discount && (
            <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-2 py-1 backdrop-blur-sm bg-opacity-90">
              -{product.discount}%
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-2 right-2 p-2 bg-white/90 dark:bg-gray-900/90 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors z-10"
          aria-label={
            product.isWishlisted ? "Remove from wishlist" : "Add to wishlist"
          }
        >
          {product.isWishlisted ? (
            <FaHeartSolid className="text-red-500 h-5 w-5" />
          ) : (
            <FaRegHeart className="text-gray-600 dark:text-gray-300 h-5 w-5" />
          )}
        </button>

        {/* Image Navigation */}
        {product.images.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handlePrevImage}
              className="bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition-colors"
              aria-label="Previous image"
            >
              ←
            </button>
            <button
              onClick={handleNextImage}
              className="bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition-colors"
              aria-label="Next image"
            >
              →
            </button>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col">
        {/* Vendor and Rating */}
        <div className="mb-2">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 truncate">
              <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
              <span className="truncate">{product.vendor.location}</span>
              {product.vendor.verified && (
                <FaShieldAlt className="text-blue-500 ml-1 flex-shrink-0" />
              )}
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center mr-1">
                {renderStars(product.rating)}
              </div>
              <span>{product.rating}</span>
            </div>
          </div>
        </div>

        {/* Product Name and Description */}
        <div className="mb-2">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white line-clamp-2 mb-1">
            {product.name}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Features/Tags */}
        <div className="mb-3 flex flex-wrap gap-1">
          {product.features.slice(0, 2).map((feature, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
            >
              {feature}
            </span>
          ))}
        </div>

        {/* Price and Actions */}
        <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-2">
                {product.originalPrice && (
                  <span className="text-gray-500 dark:text-gray-400 line-through text-xs sm:text-sm">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                  {formatPrice(product.price)}
                </span>
              </div>
              <div className="flex items-center text-xs text-gray-600 dark:text-gray-400 mt-1">
                {availabilityStatus.icon}
                <span className={`ml-1 ${availabilityStatus.color}`}>
                  {availabilityStatus.text}
                </span>
              </div>
            </div>
          </div>

          {/* Availability and Shipping */}
          <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-3">
            <div className="flex items-center">
              <Truck className="h-3.5 w-3.5 mr-1" />
              {product.shipping.free
                ? "Free shipping"
                : `$${product.shipping.cost}`}
            </div>
            <span className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {product.shipping.estimatedDays} days
            </span>
          </div>

          {/* Add to Cart Button - Orange styling, stays at bottom */}
          <Button
            onClick={handleAddToCartClick}
            disabled={product.availability === "out-of-stock"}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300"
          >
            <FaShoppingCart className="mr-2" />
            {product.availability === "out-of-stock"
              ? "Out of Stock"
              : "Add to Cart"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
