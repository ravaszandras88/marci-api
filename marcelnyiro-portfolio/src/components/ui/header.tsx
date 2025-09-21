"use client";

import { Button } from "@/components/ui/button";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Menu, MoveRight, X, User, LogOut } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { AuthModal } from "@/components/ui/auth-modal";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/toast";

function Header1() {
    const { user, logout } = useAuth();
    const { showToast } = useToast();
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isUserDropdownOpen, setUserDropdownOpen] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState<'top' | 'bottom'>('bottom');
    const [isHeaderVisible, setIsHeaderVisible] = useState(true);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    
    const handleLogout = () => {
        logout();
        closeDropdown();
        showToast("Successfully signed out. See you next time!", "success");
    };

    // Debug and fix header visibility issue
    useEffect(() => {
        console.log('🔵 Header component mounted');
        
        // Force header to be visible
        if (headerRef.current) {
            const styles = window.getComputedStyle(headerRef.current);
            console.log('Header initial styles:', {
                position: styles.position,
                top: styles.top,
                zIndex: styles.zIndex,
                display: styles.display,
                visibility: styles.visibility,
                opacity: styles.opacity,
                transform: styles.transform
            });
            
            // Force visibility
            headerRef.current.style.visibility = 'visible';
            headerRef.current.style.opacity = '1';
            headerRef.current.style.transform = 'translateY(0)';
        }
        
        // Check on scroll
        const handleScroll = () => {
            if (headerRef.current) {
                const rect = headerRef.current.getBoundingClientRect();
                console.log('Header position on scroll:', {
                    top: rect.top,
                    visible: rect.top >= 0,
                    height: rect.height
                });
            }
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Debug: State changes
    useEffect(() => {
        console.log(`📊 isUserDropdownOpen state changed to: ${isUserDropdownOpen}`);
    }, [isUserDropdownOpen]);

    // Check if dropdown should appear above or below
    const checkDropdownPosition = () => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceAbove = rect.top;
            const dropdownHeight = 300; // Approximate height
            
            if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
                setDropdownPosition('top');
            } else {
                setDropdownPosition('bottom');
            }
        }
    };

    // Handle closing with animation - Framer Motion handles the exit animation
    const closeDropdown = useCallback(() => {
        console.log('🔴 closeDropdown called - Framer Motion will handle exit animation');
        setUserDropdownOpen(false);
    }, []);
    
    const closeMobileMenu = useCallback(() => {
        setMobileMenuOpen(false);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Element;
            
            // Don't close if clicking inside the dropdown
            if (dropdownRef.current && dropdownRef.current.contains(event.target as Node)) {
                return;
            }
            
            // Don't close if clicking inside a modal
            if (target.closest('[role="dialog"]') || 
                target.closest('[data-radix-popper-content-wrapper]') ||
                target.closest('.fixed.inset-0') ||
                target.closest('[data-state="open"]')) {
                return;
            }
            
            closeDropdown();
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [closeDropdown]);

    // Recalculate position on window resize
    useEffect(() => {
        if (isUserDropdownOpen) {
            const handleResize = () => {
                checkDropdownPosition();
            };
            
            window.addEventListener('resize', handleResize);
            return () => {
                window.removeEventListener('resize', handleResize);
            };
        }
    }, [isUserDropdownOpen]);

    
    const navigationItems = [
        {
            title: "Expertise",
            href: "/#expertise",
            description: "",
        },
        {
            title: "Services",
            description: "Professional consulting and advisory services",
            items: [
                {
                    title: "Speaking Engagements",
                    href: "/#services",
                },
                {
                    title: "1-on-1 Mentoring",
                    href: "/#services",
                },
                {
                    title: "Strategic Advisory",
                    href: "/#services",
                },
            ],
        },
        {
            title: "Courses",
            description: "AI entrepreneurship and business strategy courses",
            items: [
                {
                    title: "AI Entrepreneurship Course",
                    href: "/courses",
                },
                {
                    title: "Outfino Case Study",
                    href: "/courses",
                },
                {
                    title: "View All Courses",
                    href: "/courses",
                },
            ],
        },
        {
            title: "Achievements",
            href: "/#achievements",
            description: "",
        },
        {
            title: "Testimonials",
            href: "/#testimonials",
            description: "",
        },
    ];

    return (
        <header 
            ref={headerRef} 
            className="w-full z-[9999] fixed top-0 left-0 bg-black backdrop-blur-md border-b border-gray-800/80"
            style={{
                visibility: 'visible',
                opacity: 1,
                transform: 'translateY(0)',
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 9999
            }}
        >
            <div className="relative w-full h-14 sm:h-16 md:h-20 flex items-center px-3 sm:px-4 md:px-6 lg:px-8 bg-black">
                {/* Desktop Navigation - Hidden on mobile */}
                <div className="hidden lg:flex items-center justify-between w-full">
                    <div className="flex items-center gap-4">
                    <NavigationMenu className="flex justify-start items-start">
                        <NavigationMenuList className="flex justify-start gap-4 flex-row">
                            {navigationItems.map((item) => (
                                <NavigationMenuItem key={item.title}>
                                    {item.href ? (
                                        <>
                                            <NavigationMenuLink href={item.href}>
                                                <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-800">{item.title}</Button>
                                            </NavigationMenuLink>
                                        </>
                                    ) : (
                                        <>
                                            <NavigationMenuTrigger className="font-medium text-sm text-gray-300 hover:text-white">
                                                {item.title}
                                            </NavigationMenuTrigger>
                                            <NavigationMenuContent className="!w-[450px] p-4 bg-gray-900 border border-gray-700">
                                                <div className="flex flex-col lg:grid grid-cols-2 gap-4">
                                                    <div className="flex flex-col h-full justify-between">
                                                        <div className="flex flex-col">
                                                            <p className="text-base text-white">{item.title}</p>
                                                            <p className="text-gray-400 text-sm">
                                                                {item.description}
                                                            </p>
                                                        </div>
                                                        <Button size="sm" className="mt-10 bg-blue-600 hover:bg-blue-700">
                                                            <Link href="/#contact">Book Consultation</Link>
                                                        </Button>
                                                    </div>
                                                    <div className="flex flex-col text-sm h-full justify-end">
                                                        {item.items?.map((subItem) => (
                                                            <NavigationMenuLink
                                                                href={subItem.href}
                                                                key={subItem.title}
                                                                className="flex flex-row justify-between items-center hover:bg-gray-800 py-2 px-4 rounded text-gray-300 hover:text-white"
                                                            >
                                                                <span>{subItem.title}</span>
                                                                <MoveRight className="w-4 h-4 text-gray-500" />
                                                            </NavigationMenuLink>
                                                        ))}
                                                    </div>
                                                </div>
                                            </NavigationMenuContent>
                                        </>
                                    )}
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>
                    </div>
                    
                    {/* Logo - Desktop center */}
                    <div className="flex justify-center">
                        <p className="font-bold text-xl whitespace-nowrap">
                            Marcel <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Nyirő</span>
                        </p>
                    </div>
                
                    {/* Desktop navigation buttons */}
                    <div className="flex items-center gap-2">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-800 text-sm min-h-[40px]">
                            <Link href="/#services">Services</Link>
                        </Button>
                    </motion.div>
                    <div className="border-r border-gray-700 h-6"></div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white text-sm px-3 md:px-4 py-2 min-h-[40px] touch-manipulation">
                            <Link href="/#contact">Contact</Link>
                        </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 md:px-4 py-2 min-h-[40px] touch-manipulation">
                            <Link href="/courses">Start Learning</Link>
                        </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 md:px-4 py-2 min-h-[40px] touch-manipulation">
                            <Link href="/#contact">Get Started</Link>
                        </Button>
                    </motion.div>
                    
                    {/* User Account Button */}
                    <div className="relative" ref={dropdownRef}>
                        <Button 
                            ref={buttonRef}
                            variant="ghost" 
                            size="sm"
                            className={`p-1.5 sm:p-2 text-white hover:bg-gray-800 rounded-full min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px] touch-manipulation ${user ? 'bg-blue-600/20 border border-blue-500/30' : ''}`}
                            onClick={() => {
                                console.log('Button clicked!'); // Simple log
                                window.console.log('Window console test'); // Direct window console
                                
                                if (!isUserDropdownOpen) {
                                    console.log('🟢 Button clicked - opening dropdown');
                                    checkDropdownPosition();
                                    setUserDropdownOpen(true);
                                    console.log('🟢 Dropdown position:', dropdownPosition);
                                } else {
                                    console.log('🔴 Button clicked - closing dropdown');
                                    closeDropdown();
                                }
                            }}
                        >
                            <User className="h-4 w-4 sm:h-5 sm:w-5" />
                            {user && (
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></span>
                            )}
                        </Button>
                        
                        <AnimatePresence 
                            mode="wait"
                            onExitComplete={() => console.log('⚫ AnimatePresence: Exit animation complete')}
                        >
                            {isUserDropdownOpen && (
                                <motion.div 
                                    key="dropdown"
                                    className={`absolute right-0 w-56 bg-gray-900 border border-gray-700 rounded-xl shadow-lg py-2 z-50 ${
                                        dropdownPosition === 'bottom' ? 'top-12' : 'bottom-12'
                                    }`}
                                    initial={{ 
                                        opacity: 0, 
                                        scale: 0.95,
                                        y: dropdownPosition === 'bottom' ? -10 : 10
                                    }}
                                    animate={{ 
                                        opacity: 1, 
                                        scale: 1,
                                        y: 0
                                    }}
                                    exit={{ 
                                        opacity: 0, 
                                        scale: 0.95,
                                        y: dropdownPosition === 'bottom' ? -10 : 10
                                    }}
                                    transition={{
                                        type: "spring",
                                        duration: 0.2,
                                        bounce: 0.1
                                    }}
                                    style={{
                                        transformOrigin: dropdownPosition === 'bottom' ? 'top right' : 'bottom right'
                                    }}
                                    onAnimationStart={() => console.log('🟡 Framer Motion: Animation started')}
                                    onAnimationComplete={() => console.log('🟢 Framer Motion: Animation completed')}
                                >
                                {user ? (
                                    // Logged in user menu
                                    <>
                                        <div className="px-4 py-3 border-b border-gray-700">
                                            <p className="text-sm text-gray-300">Signed in as</p>
                                            <p className="text-sm font-medium text-white truncate">{user.name}</p>
                                            <p className="text-xs text-gray-400 truncate">{user.email}</p>
                                        </div>
                                        <Link 
                                            href="/courses" 
                                            className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                                            onClick={closeDropdown}
                                        >
                                            <User className="h-4 w-4 mr-2" />
                                            My Courses
                                        </Link>
                                        <div className="border-t border-gray-700 my-1"></div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                                        >
                                            <LogOut className="h-4 w-4 mr-2" />
                                            Sign Out
                                        </button>
                                    </>
                                ) : (
                                    // Guest user menu
                                    <>
                                        <AuthModal defaultTab="signin">
                                            <div 
                                                className="w-full flex items-center px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors cursor-pointer"
                                                onMouseDown={(e) => e.stopPropagation()}
                                            >
                                                <User className="h-4 w-4 mr-2" />
                                                Sign In
                                            </div>
                                        </AuthModal>
                                        <AuthModal defaultTab="register">
                                            <div 
                                                className="w-full flex items-center px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors cursor-pointer"
                                                onMouseDown={(e) => e.stopPropagation()}
                                            >
                                                <User className="h-4 w-4 mr-2" />
                                                Register
                                            </div>
                                        </AuthModal>
                                        <div className="border-t border-gray-700 my-1"></div>
                                        <Link 
                                            href="/courses" 
                                            className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                                            onClick={closeDropdown}
                                        >
                                            <User className="h-4 w-4 mr-2" />
                                            Browse Courses
                                        </Link>
                                    </>
                                )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
                </div>
                
                {/* Mobile Layout - Visible only on mobile */}
                <div className="flex lg:hidden items-center justify-between w-full">
                    {/* Logo - Mobile */}
                    <div className="flex-shrink-0">
                        <p className="font-bold text-sm sm:text-base whitespace-nowrap">
                            Marcel <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Nyirő</span>
                        </p>
                    </div>
                    
                    {/* Mobile buttons container */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                        {/* Hamburger Menu Button */}
                        <Button 
                            variant="ghost" 
                            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} 
                            className="text-gray-300 hover:text-white hover:bg-gray-800 p-1.5 min-h-[36px] min-w-[36px] touch-manipulation order-last"
                        >
                            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </Button>
                        
                        {/* Mobile Get Started Button (hidden on smallest screens) */}
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="hidden sm:block">
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1.5 min-h-[36px] touch-manipulation">
                                <Link href="/#contact">Get Started</Link>
                            </Button>
                        </motion.div>
                        
                        {/* User Account Button - Mobile */}
                        <div className="relative">
                            <Button 
                                variant="ghost" 
                                size="sm"
                                className={`p-1.5 text-white hover:bg-gray-800 rounded-full min-h-[36px] min-w-[36px] touch-manipulation ${user ? 'bg-blue-600/20 border border-blue-500/30' : ''}`}
                                onClick={() => {
                                    if (!isUserDropdownOpen) {
                                        checkDropdownPosition();
                                        setUserDropdownOpen(true);
                                    } else {
                                        closeDropdown();
                                    }
                                }}
                            >
                                <User className="h-4 w-4" />
                                {user && (
                                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full border-2 border-black"></span>
                                )}
                            </Button>
                            
                            <AnimatePresence mode="wait">
                                {isUserDropdownOpen && (
                                    <motion.div 
                                        key="mobile-dropdown"
                                        className={`absolute right-0 w-48 bg-gray-900 border border-gray-700 rounded-xl shadow-lg py-2 z-50 ${
                                            dropdownPosition === 'bottom' ? 'top-10' : 'bottom-10'
                                        }`}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.15 }}
                                    >
                                        {/* Mobile user dropdown content */}
                                        {user ? (
                                            <>
                                                <div className="px-3 py-2 border-b border-gray-700">
                                                    <p className="text-xs text-gray-300">Signed in as</p>
                                                    <p className="text-sm font-medium text-white truncate">{user.name}</p>
                                                </div>
                                                <Link 
                                                    href="/courses" 
                                                    className="flex items-center px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white text-sm"
                                                    onClick={closeDropdown}
                                                >
                                                    <User className="h-3 w-3 mr-2" />
                                                    My Courses
                                                </Link>
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white text-sm"
                                                >
                                                    <LogOut className="h-3 w-3 mr-2" />
                                                    Sign Out
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <AuthModal defaultTab="signin">
                                                    <div className="w-full flex items-center px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white text-sm cursor-pointer">
                                                        <User className="h-3 w-3 mr-2" />
                                                        Sign In
                                                    </div>
                                                </AuthModal>
                                                <AuthModal defaultTab="register">
                                                    <div className="w-full flex items-center px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white text-sm cursor-pointer">
                                                        <User className="h-3 w-3 mr-2" />
                                                        Register
                                                    </div>
                                                </AuthModal>
                                            </>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
            {/* Mobile menu dropdown - moved outside header container */}
            {isMobileMenuOpen && (
                <div className="fixed top-14 sm:top-16 md:top-20 border-t border-gray-700 flex flex-col w-full left-0 bg-gray-900/95 backdrop-blur-sm shadow-lg py-6 px-4 gap-4 sm:gap-6 z-[90]">
                            {navigationItems.map((item) => (
                                <div key={item.title}>
                                    <div className="flex flex-col gap-2">
                                        {item.href ? (
                                            <Link
                                                href={item.href}
                                                className="flex justify-between items-center text-gray-300 hover:text-white py-2 px-3 rounded-lg hover:bg-gray-800 transition-colors min-h-[48px]"
                                                onClick={closeMobileMenu}
                                            >
                                                <span className="text-lg">{item.title}</span>
                                                <MoveRight className="w-4 h-4 stroke-1 text-gray-500" />
                                            </Link>
                                        ) : (
                                            <p className="text-lg text-white py-2 px-3">{item.title}</p>
                                        )}
                                        {item.items &&
                                            item.items.map((subItem) => (
                                                <Link
                                                    key={subItem.title}
                                                    href={subItem.href}
                                                    className="flex justify-between items-center text-gray-400 hover:text-white py-2 px-3 ml-4 rounded-lg hover:bg-gray-800 transition-colors min-h-[44px]"
                                                    onClick={closeMobileMenu}
                                                >
                                                    <span>
                                                        {subItem.title}
                                                    </span>
                                                    <MoveRight className="w-4 h-4 stroke-1" />
                                                </Link>
                                            ))}
                                    </div>
                                </div>
                            ))}
                </div>
            )}
        </header>
    );
}

export { Header1 };