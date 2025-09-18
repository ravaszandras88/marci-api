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
    const [isOpen, setOpen] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState<'top' | 'bottom'>('bottom');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    
    const handleLogout = () => {
        logout();
        closeDropdown();
        showToast("Successfully signed out. See you next time!", "success");
    };

    // Debug: Component mount
    useEffect(() => {
        console.log('🔵 Header component mounted - dropdown debugging active');
    }, []);

    // Debug: State changes
    useEffect(() => {
        console.log(`📊 isOpen state changed to: ${isOpen}`);
    }, [isOpen]);

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
        setOpen(false);
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
        if (isOpen) {
            const handleResize = () => {
                checkDropdownPosition();
            };
            
            window.addEventListener('resize', handleResize);
            return () => {
                window.removeEventListener('resize', handleResize);
            };
        }
    }, [isOpen]);

    
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
        <header className="w-full z-40 fixed top-0 left-0 bg-black/90 backdrop-blur-md border-b border-gray-800">
            <div className="container relative mx-auto min-h-20 flex gap-4 flex-row lg:grid lg:grid-cols-3 items-center">
                <div className="justify-start items-center gap-4 lg:flex hidden flex-row">
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
                <div className="flex lg:justify-center">
                    <p className="font-bold text-xl">
                        Marcel <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Nyirő</span>
                    </p>
                </div>
                <div className="flex justify-end w-full gap-4 items-center">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button variant="ghost" className="hidden md:inline text-gray-300 hover:text-white hover:bg-gray-800">
                            <Link href="/#services">Services</Link>
                        </Button>
                    </motion.div>
                    <div className="border-r border-gray-700 hidden md:inline"></div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white">
                            <Link href="/#contact">Contact</Link>
                        </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                            <Link href="/courses">Start Learning</Link>
                        </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                            <Link href="/#contact">Get Started</Link>
                        </Button>
                    </motion.div>
                    
                    {/* User Account Button */}
                    <div className="relative" ref={dropdownRef}>
                        <Button 
                            ref={buttonRef}
                            variant="ghost" 
                            size="sm"
                            className={`p-2 text-white hover:bg-gray-800 rounded-full ${user ? 'bg-blue-600/20 border border-blue-500/30' : ''}`}
                            onClick={() => {
                                console.log('Button clicked!'); // Simple log
                                window.console.log('Window console test'); // Direct window console
                                
                                if (!isOpen) {
                                    console.log('🟢 Button clicked - opening dropdown');
                                    checkDropdownPosition();
                                    setOpen(true);
                                    console.log('🟢 Dropdown position:', dropdownPosition);
                                } else {
                                    console.log('🔴 Button clicked - closing dropdown');
                                    closeDropdown();
                                }
                            }}
                        >
                            <User className="h-5 w-5" />
                            {user && (
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></span>
                            )}
                        </Button>
                        
                        <AnimatePresence 
                            mode="wait"
                            onExitComplete={() => console.log('⚫ AnimatePresence: Exit animation complete')}
                        >
                            {isOpen && (
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
                <div className="flex w-12 shrink lg:hidden items-end justify-end">
                    <Button variant="ghost" onClick={() => setOpen(!isOpen)} className="text-gray-300 hover:text-white hover:bg-gray-800">
                        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </Button>
                    {isOpen && (
                        <div className="absolute top-20 border-t border-gray-700 flex flex-col w-full right-0 bg-gray-900 shadow-lg py-4 container gap-8">
                            {navigationItems.map((item) => (
                                <div key={item.title}>
                                    <div className="flex flex-col gap-2">
                                        {item.href ? (
                                            <Link
                                                href={item.href}
                                                className="flex justify-between items-center text-gray-300 hover:text-white"
                                                onClick={closeDropdown}
                                            >
                                                <span className="text-lg">{item.title}</span>
                                                <MoveRight className="w-4 h-4 stroke-1 text-gray-500" />
                                            </Link>
                                        ) : (
                                            <p className="text-lg text-white">{item.title}</p>
                                        )}
                                        {item.items &&
                                            item.items.map((subItem) => (
                                                <Link
                                                    key={subItem.title}
                                                    href={subItem.href}
                                                    className="flex justify-between items-center text-gray-400 hover:text-white"
                                                    onClick={closeDropdown}
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
                </div>
            </div>
        </header>
    );
}

export { Header1 };