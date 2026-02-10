import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useAuth } from "@hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { LanguageSwitcher } from "@components/common/LanguageSwitcher";
import { ROUTES, APP_NAME } from "@utils/constants";
import { RootState } from "@store/store";

export const Header = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { totalItems } = useSelector((state: RootState) => state.booking);

  const handleLogout = async () => {
    try {
      await logout();
      navigate(ROUTES.LOGIN);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const closeAllMenus = () => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full px-3 sm:px-4 lg:px-8 max-w-7xl mx-auto">
        <div className="flex h-14 sm:h-16 items-center justify-between gap-2 sm:gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 flex-shrink-0 min-w-0 max-w-[50%] sm:max-w-none"
          >
            <span className="text-xl sm:text-2xl flex-shrink-0">🌍</span>
            <span className="text-sm sm:text-base lg:text-xl font-bold text-gradient-ethiopian truncate">
              {APP_NAME}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6 flex-shrink-0 min-w-0 overflow-hidden">
            <Link
              to="/tours"
              className="text-sm font-medium text-foreground/60 hover:text-foreground transition-colors whitespace-nowrap flex-shrink-0"
            >
              {t("nav.tours")}
            </Link>
            <Link
              to="/destinations"
              className="text-sm font-medium text-foreground/60 hover:text-foreground transition-colors whitespace-nowrap flex-shrink-0"
            >
              {t("nav.destinations")}
            </Link>
            <Link
              to="/cultural"
              className="text-sm font-medium text-foreground/60 hover:text-foreground transition-colors whitespace-nowrap flex-shrink-0"
            >
              {t("nav.culture")}
            </Link>
            <Link
              to="/marketplace"
              className="text-sm font-medium text-foreground/60 hover:text-foreground transition-colors whitespace-nowrap flex-shrink-0"
            >
              {t("nav.marketplace")}
            </Link>
          </nav>

          {/* User Menu */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {/* Cart Icon - Always visible */}
            <Link
              to="/cart"
              className="relative p-1.5 sm:p-2 rounded-md hover:bg-accent transition-colors flex-shrink-0"
              aria-label="Shopping cart"
            >
              <svg
                className="h-5 w-5 sm:h-6 sm:w-6 text-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8"
                />
              </svg>
              {/* Cart badge */}
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </Link>

            {/* Language Switcher - Hidden on small screens */}
            <div className="hidden md:block flex-shrink-0">
              <LanguageSwitcher />
            </div>

            {isAuthenticated ? (
              <div className="relative flex-shrink-0">
                <button
                  onClick={() => {
                    setIsUserMenuOpen(!isUserMenuOpen);
                    setIsMobileMenuOpen(false); // Close mobile menu when opening user menu
                  }}
                  className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-md hover:shadow-lg transition-all duration-300 border border-orange-600"
                  aria-label="User menu"
                >
                  <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold text-xs sm:text-sm flex-shrink-0 ring-2 ring-white/30">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span className="text-xs sm:text-sm font-semibold truncate max-w-[60px] sm:max-w-[80px]">
                    {user?.name?.split(" ")[0] || "User"}
                  </span>
                  <svg
                    className={`h-3 w-3 sm:h-4 sm:w-4 transition-transform ${isUserMenuOpen ? "rotate-180" : ""} flex-shrink-0`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 sm:w-64 rounded-xl shadow-xl bg-card border-2 border-orange-200 dark:border-orange-800 z-50 animate-in slide-in-from-top-2 overflow-hidden">
                      <div className="py-1">
                        <div className="px-4 py-3 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-b border-orange-200 dark:border-orange-800">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {user?.name}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                            {user?.email}
                          </p>
                        </div>

                        {/* Language Switcher for mobile */}
                        <div className="lg:hidden px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                          <LanguageSwitcher />
                        </div>

                        <Link
                          to={ROUTES.DASHBOARD}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <svg
                            className="h-4 w-4 text-orange-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                            />
                          </svg>
                          {t("nav.dashboard")}
                        </Link>

                        <Link
                          to={ROUTES.PROFILE}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <svg
                            className="h-4 w-4 text-orange-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          {t("nav.profile")}
                        </Link>

                        <Link
                          to="/bookings"
                          className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <svg
                            className="h-4 w-4 text-orange-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                          </svg>
                          {t("nav.bookings")}
                        </Link>

                        <Link
                          to="/settings"
                          className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <svg
                            className="h-4 w-4 text-orange-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          {t("nav.settings")}
                        </Link>

                        <div className="border-t border-gray-200 dark:border-gray-700 mt-1">
                          <button
                            onClick={() => {
                              handleLogout();
                              setIsUserMenuOpen(false);
                            }}
                            className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium"
                          >
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                              />
                            </svg>
                            {t("nav.signOut")}
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              /* Auth buttons - Always visible */
              <div className="hidden sm:flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(ROUTES.LOGIN)}
                  className="text-xs sm:text-sm px-2 sm:px-3 whitespace-nowrap"
                >
                  {t("nav.signIn")}
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate(ROUTES.REGISTER)}
                  className="text-xs sm:text-sm px-2 sm:px-3 whitespace-nowrap"
                >
                  {t("nav.signUp")}
                </Button>
              </div>
            )}

            {/* Mobile Menu Button - Always visible and prominent */}
            <button
              className="lg:hidden p-2 rounded-md hover:bg-accent transition-colors flex-shrink-0 border border-border"
              onClick={() => {
                setIsMobileMenuOpen(!isMobileMenuOpen);
                setIsUserMenuOpen(false); // Close user menu when opening mobile menu
              }}
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6 text-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Navigation Menu - Show for all users on mobile */}
          {isMobileMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40 lg:hidden"
                onClick={closeAllMenus}
              />
              <div className="absolute top-full left-0 right-0 bg-card border-b shadow-lg z-50 lg:hidden animate-in slide-in-from-top-2">
                <nav className="px-4 py-4 space-y-3">
                  <Link
                    to="/tours"
                    className="block py-2 text-sm font-medium text-foreground/60 hover:text-foreground transition-colors"
                    onClick={closeAllMenus}
                  >
                    {t("nav.tours")}
                  </Link>
                  <Link
                    to="/destinations"
                    className="block py-2 text-sm font-medium text-foreground/60 hover:text-foreground transition-colors"
                    onClick={closeAllMenus}
                  >
                    {t("nav.destinations")}
                  </Link>
                  <Link
                    to="/cultural"
                    className="block py-2 text-sm font-medium text-foreground/60 hover:text-foreground transition-colors"
                    onClick={closeAllMenus}
                  >
                    {t("nav.culture")}
                  </Link>
                  <Link
                    to="/marketplace"
                    className="block py-2 text-sm font-medium text-foreground/60 hover:text-foreground transition-colors"
                    onClick={closeAllMenus}
                  >
                    {t("nav.marketplace")}
                  </Link>
                  <Link
                    to="/cart"
                    className="flex items-center justify-between py-2 text-sm font-medium text-foreground/60 hover:text-foreground transition-colors"
                    onClick={closeAllMenus}
                  >
                    <span>Shopping Cart</span>
                    {totalItems > 0 && (
                      <span className="bg-orange-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {totalItems > 99 ? "99+" : totalItems}
                      </span>
                    )}
                  </Link>

                  {/* Show language switcher for mobile */}
                  <div className="pt-2 border-t">
                    <LanguageSwitcher />
                  </div>

                  {/* Show auth buttons for non-authenticated users - Mobile only */}
                  {!isAuthenticated && (
                    <div className="pt-2 border-t space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigate(ROUTES.LOGIN);
                          closeAllMenus();
                        }}
                        className="w-full justify-start"
                      >
                        {t("nav.signIn")}
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          navigate(ROUTES.REGISTER);
                          closeAllMenus();
                        }}
                        className="w-full"
                      >
                        {t("nav.signUp")}
                      </Button>
                    </div>
                  )}

                  {/* Show user menu items for authenticated users - Mobile only */}
                  {isAuthenticated && (
                    <div className="pt-2 border-t space-y-1">
                      <div className="px-2 py-2 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-md mb-2">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {user?.name}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                          {user?.email}
                        </p>
                      </div>
                      <Link
                        to={ROUTES.DASHBOARD}
                        className="block py-2 px-2 text-sm font-medium text-foreground/60 hover:text-foreground transition-colors hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-md"
                        onClick={closeAllMenus}
                      >
                        {t("nav.dashboard")}
                      </Link>
                      <Link
                        to={ROUTES.PROFILE}
                        className="block py-2 px-2 text-sm font-medium text-foreground/60 hover:text-foreground transition-colors hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-md"
                        onClick={closeAllMenus}
                      >
                        {t("nav.profile")}
                      </Link>
                      <Link
                        to="/bookings"
                        className="block py-2 px-2 text-sm font-medium text-foreground/60 hover:text-foreground transition-colors hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-md"
                        onClick={closeAllMenus}
                      >
                        {t("nav.bookings")}
                      </Link>
                      <Link
                        to="/settings"
                        className="block py-2 px-2 text-sm font-medium text-foreground/60 hover:text-foreground transition-colors hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-md"
                        onClick={closeAllMenus}
                      >
                        {t("nav.settings")}
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          closeAllMenus();
                        }}
                        className="block w-full text-left py-2 px-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors rounded-md"
                      >
                        {t("nav.signOut")}
                      </button>
                    </div>
                  )}
                </nav>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;