import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/common/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Search, MapPin, Star, Filter, X } from "lucide-react";
import { Destination, DestinationFilters } from "@/types/destination";

const mockTour: Tour = {
  id: "1",
  title: "Historic Route: Lalibela, Gondar & Axum",
  description:
    "Explore the ancient wonders of Northern Ethiopia on this 7-day tour that takes you through the most significant historical and religious sites in the country. This journey will transport you back in time as you discover the rock-hewn churches of Lalibela, the medieval castles of Gondar, and the ancient obelisks of Axum.",
  shortDescription:
    "Visit rock-hewn churches, medieval castles, and ancient obelisks",
  imageUrl:
    "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800",
  images: [
    "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800",
    "https://images.unsplash.com/photo-1566438480908-0e2e1a1f8a3f?w=800",
    "https://images.unsplash.com/photo-1581441363689-606ed7810ef4?w=800",
    "https://images.unsplash.com/photo-1571832017109-5b0e8a1b3b1d?w=800",
  ],
  price: 5000,
  currency: "ETB",
  duration: "7 days / 6 nights",
  durationDays: 7,
  location: "Northern Ethiopia",
  region: "Amhara",
  category: "historical",
  difficulty: "moderate",
  rating: 4.8,
  reviewCount: 124,
  maxGroupSize: 12,
  minAge: 12,
  highlights: [
    "Explore 11 rock-hewn churches in Lalibela",
    "Visit the Royal Enclosure in Gondar",
    "See the ancient obelisks of Axum",
    "Learn about Ethiopia's rich history and culture",
    "Enjoy traditional Ethiopian cuisine",
    "Travel with an experienced local guide",
  ],
  included: [
    "6 nights accommodation in 3-4 star hotels",
    "All meals (breakfast, lunch, dinner)",
    "Professional English-speaking guide",
    "All entrance fees and local taxes",
    "Domestic flights (Lalibela-Gondar-Axum)",
    "All ground transportation in air-conditioned vehicles",
  ],
  excluded: [
    "International flights",
    "Visa fees",
    "Travel insurance",
    "Alcoholic beverages",
    "Personal expenses",
    "Tips for guides and drivers",
  ],


  itinerary: [
    {
      day: 1,
      title: "Arrival in Addis Ababa",
      description:
        "Arrive in Addis Ababa, meet your guide, and transfer to your hotel.",
      activities: ["Airport pickup", "Hotel check-in", "City tour"],
      meals: ["Dinner"],
    },
    // Update other days similarly
  ],
  guide: {
    id: "1",
    name: "Abebe Kebede",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    languages: ["English", "Amharic", "Tigrinya"],
    rating: 4.9,
    toursGuided: 150,
    bio: "Experienced tour guide with extensive knowledge of Ethiopian history and culture.",
  },
  availability: [
    { date: "2025-10-01", available: true, price: 5000 },
    { date: "2025-10-15", available: true, price: 5000 },
    // Add more dates as needed
  ],
};

export const DestinationsPage = () => {
  const [filteredDestinations, setFilteredDestinations] =
    useState<Destination[]>(mockDestinations);
  const [filters, setFilters] = useState<DestinationFilters>({
    searchQuery: "",
    regions: [],
    categories: [],
    minRating: 0,
    tags: [],
    sortBy: "name",
    sortOrder: "asc",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [regionFilter, setRegionFilter] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  // Apply filters
  useEffect(() => {
    let result = [...mockDestinations];
    // Apply search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(
        (destination) =>
          destination.name.toLowerCase().includes(query) ||
          destination.description.toLowerCase().includes(query) ||
          destination.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }
    // Filter by region
    if (regionFilter) {
      result = result.filter((destination) =>
        destination.region.toLowerCase().includes(regionFilter.toLowerCase())
      );
    }
    // Filter by category
    if (categoryFilter) {
      result = result.filter((destination) =>
        destination.category.some((cat) =>
          cat.toLowerCase().includes(categoryFilter.toLowerCase())
        )
      );
    }
    // Apply rating filter
    if (filters.minRating && filters.minRating > 0) {
      result = result.filter(
        (destination) => destination.rating >= (filters.minRating || 0)
      );
    }
    // Apply sorting
    result.sort((a, b) => {
      if (filters.sortBy === "name") {
        return filters.sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (filters.sortBy === "rating") {
        return filters.sortOrder === "asc"
          ? a.rating - b.rating
          : b.rating - a.rating;
      } else {
        // popularity (default)
        return filters.sortOrder === "asc"
          ? a.reviewCount - b.reviewCount
          : b.reviewCount - a.reviewCount;
      }
    });
    setFilteredDestinations(result);
  }, [filters, regionFilter, categoryFilter]);
  const clearFilters = () => {
    setFilters({
      searchQuery: "",
      regions: [],
      categories: [],
      minRating: 0,
      tags: [],
      sortBy: "name",
      sortOrder: "asc",
    });
    setRegionFilter("");
    setCategoryFilter("");
  };

  return (
    <div className="container py-8">
      <Button variant="ghost" className="mb-6" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Tours
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Tour Images */}
          <div className="space-y-4">
            <div className="relative h-96 rounded-xl overflow-hidden">
              <img
                src={tour.imageUrl}
                alt={tour.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <Badge variant="default" className="text-sm">
                  <Star className="h-4 w-4 mr-1 fill-current" />
                  {tour.rating.toFixed(1)} ({tour.reviewCount} reviews)
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {tour.images.slice(0, 3).map((img, index) => (
                <div key={index} className="h-32 rounded-lg overflow-hidden">
                  <img
                    src={img}
                    alt={`${tour.title} ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Tour Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Tour Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">{tour.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium">{tour.duration}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Group Size</p>
                  <p className="font-medium">
                    Up to {tour.maxGroupSize} people
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Difficulty</p>
                  <p className="font-medium capitalize">{tour.difficulty}</p>
                </div>
              </div>

              <Separator className="my-6" />

              <h3 className="text-lg font-semibold mb-4">Highlights</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                {tour.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>

              <Separator className="my-6" />

              <h3 className="text-lg font-semibold mb-4">Itinerary</h3>
              <div className="space-y-6">
                {tour.itinerary.map((day) => (
                  <div key={day.day} className="flex">
                    <div className="flex flex-col items-center mr-4">
                      <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
                        {day.day}
                      </div>
                      {day.day < tour.itinerary.length && (
                        <div className="w-0.5 h-full bg-border my-2"></div>
                      )}
                    </div>
                    <div className="pb-6">
                      <h4 className="font-medium">{day.title}</h4>
                      <p className="text-muted-foreground text-sm">
                        {day.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-6" />

              <h3 className="text-lg font-semibold mb-4">What's Included</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h4 className="font-medium mb-2">Included</h4>
                  <ul className="space-y-2">
                    {tour.included.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Not Included</h4>
                  <ul className="space-y-2">
                    {tour.excluded.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <Separator className="my-6" />

              <div>
                <h3 className="text-lg font-semibold mb-4">Your Guide</h3>
                <div className="flex items-center space-x-4">
                  <img
                    src={tour.guide.avatar}
                    alt={tour.guide.name}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-medium">{tour.guide.name}</h4>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                      {tour.guide.rating.toFixed(1)} ({tour.guide.toursGuided}+
                      tours)
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {tour.guide.languages.map((lang) => (
                        <Badge
                          key={lang}
                          variant="secondary"
                          className="text-xs"
                        >
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  {tour.guide.bio}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Reviews Section */}
          <Card>
            <CardHeader>
              <CardTitle>Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-6">
                <div className="text-5xl font-bold mr-4">
                  {tour.rating.toFixed(1)}
                </div>
                <div>
                  <div className="flex items-center mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${
                          star <= Math.floor(tour.rating)
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-muted-foreground/20 fill-muted-foreground/20"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Based on {tour.reviewCount} reviews
                  </p>
                </div>
              </div>

              {/* Mock Reviews */}
              <div className="space-y-6">
                {[
                  {
                    id: 1,
                    name: "Sarah Johnson",
                    rating: 5,
                    date: "2 weeks ago",
                    comment:
                      "An absolutely incredible experience! Our guide was knowledgeable and passionate about Ethiopian history. The sites were breathtaking, especially the rock-hewn churches of Lalibela. Highly recommend this tour!",
                  },
                  {
                    id: 2,
                    name: "Michael Chen",
                    rating: 4,
                    date: "1 month ago",
                    comment:
                      "Great tour overall. The itinerary was well-planned, and we got to see all the major historical sites. The only downside was that some of the hotels could have been better. But the guide made up for it with his expertise and friendliness.",
                  },
                  {
                    id: 3,
                    name: "Amina Hassan",
                    rating: 5,
                    date: "2 months ago",
                    comment:
                      "This was a trip of a lifetime! The history, the culture, the people - everything was amazing. Our guide was fantastic and went above and beyond to make sure we had a great experience. The domestic flights made travel between cities so convenient.",
                  },
                ].map((review) => (
                  <div
                    key={review.id}
                    className="border-b pb-6 last:border-b-0 last:pb-0"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{review.name}</h4>
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating
                                  ? "text-yellow-500 fill-yellow-500"
                                  : "text-muted-foreground/20 fill-muted-foreground/20"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {review.date}
                      </span>
                    </div>
                    <p className="text-muted-foreground">{review.comment}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking Sidebar */}
        <div className="lg:sticky lg:top-24 h-fit">
          <Card className="overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
              <h2 className="text-2xl font-bold">
                ${tour.price.toLocaleString()}
              </h2>
              <p className="text-sm opacity-90">per person</p>
            </div>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="date"
                  >
                    Select Date
                  </label>
                  <select
                    id="date"
                    className="w-full p-2 border rounded-md"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  >
                    <option value="">Select a date</option>
                    {tour.availability.map((date) => (
                      <option key={date} value={date}>
                        {new Date(date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="travelers"
                  >
                    Number of Travelers
                  </label>
                  <select
                    id="travelers"
                    className="w-full p-2 border rounded-md"
                    value={travelers}
                    onChange={(e) => setTravelers(Number(e.target.value))}
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} {i === 0 ? "Traveler" : "Travelers"}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2 pt-2">
                  <Button className="w-full" size="lg" onClick={handleBookNow}>
                    Book Now
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleAddToCart}
                  >
                    Add to Cart
                  </Button>
                </div>

                <div className="text-sm text-muted-foreground text-center">
                  Free cancellation up to 7 days before departure
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between py-2">
                    <span>Duration</span>
                    <span className="font-medium">{tour.duration}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span>Group Size</span>
                    <span className="font-medium">
                      Up to {tour.maxGroupSize} people
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span>Difficulty</span>
                    <span className="font-medium capitalize">
                      {tour.difficulty}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span>Minimum Age</span>
                    <span className="font-medium">{tour.minAge} years</span>
                  </div>
                </div>

                <div className="pt-4">
                  <h4 className="font-medium mb-2">Highlights</h4>
                  <ul className="space-y-2">
                    {tour.highlights.slice(0, 4).map((highlight, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TourDetailPage