"use client";

import { Timeline, type TimelineItem } from "@/components/ui/timeline";
import { CircularTestimonials } from "@/components/ui/circular-testimonials";
import ContactForm from "@/components/ui/form-1";
import { MentoringPaymentModal } from "@/components/ui/mentoring-payment-modal";
import { motion } from "framer-motion";
import { Award, Briefcase, DollarSign, Newspaper, Trophy, Mic, Users, Building2, Check, GraduationCap, Play, Star, Mail, Phone, MapPin, ExternalLink, TrendingUp, Target, Lightbulb, ArrowRight, Globe, Zap, Brain, Rocket, Shield } from "lucide-react";
import { 
  Card,
  Header as CardHeader,
  Plan,
  PlanName,
  Badge,
  Price,
  MainPrice,
  Period,
  Body,
  List,
  ListItem
} from "@/components/ui/pricing-card";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [isMentoringModalOpen, setIsMentoringModalOpen] = useState(false);

  const achievements: TimelineItem[] = [
    {
      id: "1",
      title: "Founded Trophien IT Solutions",
      description: "Started first IT company at university, ran successfully for 6+ years developing solutions for various clients.",
      timestamp: "2017",
      status: "completed",
      icon: <Briefcase className="h-3 w-3" />,
    },
    {
      id: "2", 
      title: "Ubives - Top Startup Recognition",
      description: "Previous venture Ubives recognized as 'top startup of the year' by Growth Magazine, establishing credibility in Hungarian startup ecosystem.",
      timestamp: "2024",
      status: "completed",
      icon: <Trophy className="h-3 w-3" />,
    },
    {
      id: "3",
      title: "Founded Outfino AI Platform", 
      description: "Launched AI-powered fashion platform targeting Gen Z users with advanced recommendation algorithms and social features.",
      timestamp: "2024",
      status: "completed",
      icon: <Award className="h-3 w-3" />,
    },
    {
      id: "4",
      title: "73M HUF OUVC Investment",
      description: "Secured 73 million HUF investment from OUVC (Óbuda University Venture Capital) - first Hungarian university-backed VC investment.",
      timestamp: "2025", 
      status: "completed",
      icon: <DollarSign className="h-3 w-3" />,
    },
    {
      id: "5",
      title: "Major Media Coverage",
      description: "Featured in Portfolio.hu, StartupOnline, and recognized by Széchenyi Funds. Platform reaching 300+ users with 5,000 target by November.",
      timestamp: "2025",
      status: "active",
      icon: <Newspaper className="h-3 w-3" />,
    },
  ];

  const testimonials = [
    {
      quote: "Marcel's journey from university startup to securing 73M HUF investment demonstrates exceptional entrepreneurial vision. His AI-first approach to fashion tech is revolutionary.",
      name: "Dr. Péter Várhegyi",
      designation: "Director, OUVC",
      src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
    },
    {
      quote: "Outfino represents the future of fashion technology in Central Europe. Marcel's ability to combine AI innovation with practical business execution is impressive.",
      name: "Zoltán Nagy",
      designation: "Portfolio.hu Tech Editor",
      src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
    },
    {
      quote: "Marcel's track record speaks for itself - from founding Trophien to the Ubives success story. His strategic insights have helped shape the Hungarian startup ecosystem.",
      name: "Andrea Takács",
      designation: "Széchenyi Funds Advisor",
      src: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face"
    },
    {
      quote: "Working with Marcel provides access to both technical expertise and business acumen. His understanding of Gen Z user behavior in fashion tech is unparalleled.",
      name: "Gábor Molnár",
      designation: "Startup Mentor, STRT Program",
      src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face"
    }
  ];

  return (
    <div className="bg-black min-h-screen">
      {/* Navigation */}
      
      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-black to-purple-600/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-full text-blue-300 text-sm mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Zap className="h-4 w-4" />
            <span>73M HUF OUVC Investment • First Hungarian University VC</span>
          </motion.div>
          
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Marcel<br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Nyirő</span>
          </motion.h1>
          
          <motion.p 
            className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            AI Entrepreneur & Strategic Advisor transforming ideas into funded realities.
            <span className="text-blue-400 font-semibold"> Proven track record with Outfino's 73M HUF success.</span>
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Link href="#contact" className="group inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105">
              <span>Start Your Project</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="#achievements" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 border border-white/20">
              <span>View Success Stories</span>
            </Link>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 max-w-4xl mx-auto px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <motion.div 
              className="text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-2xl sm:text-3xl font-bold text-white mb-2">73M</div>
              <div className="text-gray-400 text-xs sm:text-sm">HUF Investment</div>
            </motion.div>
            <motion.div 
              className="text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-2xl sm:text-3xl font-bold text-white mb-2">6+</div>
              <div className="text-gray-400 text-xs sm:text-sm">Years Experience</div>
            </motion.div>
            <motion.div 
              className="text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-2xl sm:text-3xl font-bold text-white mb-2">300+</div>
              <div className="text-gray-400 text-xs sm:text-sm">Platform Users</div>
            </motion.div>
            <motion.div 
              className="text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-2xl sm:text-3xl font-bold text-white mb-2">Top</div>
              <div className="text-gray-400 text-xs sm:text-sm">Startup Award</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Expertise Section */}
      <section id="expertise" className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
              Transforming <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Ideas</span> into Reality
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Strategic AI expertise that delivers results. From concept to 73M HUF funding, 
              I help entrepreneurs navigate the complex landscape of modern business.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-20 max-w-5xl mx-auto px-4">
            <motion.div 
              className="group relative bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-blue-500/50 transition-all duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div className="mt-6">
                <h3 className="text-2xl font-bold text-white mb-4">AI Strategy</h3>
                <p className="text-gray-300 mb-6">
                  Cutting-edge AI implementation that transforms business models. 
                  From fashion tech to enterprise solutions.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Check className="h-4 w-4 text-blue-400" />
                    <span>Machine Learning Integration</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Check className="h-4 w-4 text-blue-400" />
                    <span>Recommendation Systems</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Check className="h-4 w-4 text-blue-400" />
                    <span>Data-Driven Growth</span>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="group relative bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-purple-500/50 transition-all duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
                <Rocket className="h-8 w-8 text-white" />
              </div>
              <div className="mt-6">
                <h3 className="text-2xl font-bold text-white mb-4">Startup Scaling</h3>
                <p className="text-gray-300 mb-6">
                  Proven methodologies for rapid growth. From 0 to 300+ users 
                  and scaling to 5,000 targets.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Check className="h-4 w-4 text-purple-400" />
                    <span>Growth Hacking</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Check className="h-4 w-4 text-purple-400" />
                    <span>User Acquisition</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Check className="h-4 w-4 text-purple-400" />
                    <span>Performance Optimization</span>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="group relative bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-green-500/50 transition-all duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div className="mt-6">
                <h3 className="text-2xl font-bold text-white mb-4">Investment Ready</h3>
                <p className="text-gray-300 mb-6">
                  Expert guidance through funding rounds. Track record includes 
                  first Hungarian university VC success.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Check className="h-4 w-4 text-green-400" />
                    <span>Pitch Deck Creation</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Check className="h-4 w-4 text-green-400" />
                    <span>VC Relationship Building</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Check className="h-4 w-4 text-green-400" />
                    <span>Due Diligence Prep</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Achievement Showcase */}
      <section id="achievements" className="py-20 bg-gradient-to-br from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
              Proven <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Track Record</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Real results from real ventures. See how strategic vision transforms into measurable success.
            </p>
          </motion.div>
          
          <div className="relative">
            <motion.div 
              className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              viewport={{ once: true }}
              style={{ originY: 0 }}
            ></motion.div>
            
            <div className="space-y-16">
              <motion.div 
                className="flex flex-col md:flex-row items-center gap-8"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="md:w-1/2 md:text-right">
                  <motion.div 
                    className="bg-gradient-to-br from-blue-900 to-blue-800 p-8 rounded-2xl border border-blue-700"
                    whileHover={{ scale: 1.02, y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex items-center gap-3 mb-4 justify-end">
                      <h3 className="text-2xl font-bold text-white">Outfino Success</h3>
                      <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                        <Lightbulb className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <p className="text-blue-200 mb-4">
                      AI-powered fashion platform securing 73M HUF investment from OUVC - 
                      the first Hungarian university-backed VC investment.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-xl sm:text-2xl font-bold text-white">73M HUF</div>
                        <div className="text-blue-300 text-xs sm:text-sm">Investment</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl sm:text-2xl font-bold text-white">300+</div>
                        <div className="text-blue-300 text-xs sm:text-sm">Users</div>
                      </div>
                    </div>
                  </motion.div>
                </div>
                <motion.div 
                  className="relative z-10 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, delay: 0.5 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.1 }}
                >
                  <span className="text-white font-bold">2025</span>
                </motion.div>
                <div className="md:w-1/2"></div>
              </motion.div>
              
              <motion.div 
                className="flex flex-col md:flex-row items-center gap-8"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="md:w-1/2"></div>
                <motion.div 
                  className="relative z-10 w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, delay: 0.4 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.1 }}
                >
                  <span className="text-white font-bold">2024</span>
                </motion.div>
                <div className="md:w-1/2">
                  <motion.div 
                    className="bg-gradient-to-br from-purple-900 to-purple-800 p-8 rounded-2xl border border-purple-700"
                    whileHover={{ scale: 1.02, y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                        <Trophy className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white">Ubives Recognition</h3>
                    </div>
                    <p className="text-purple-200 mb-4">
                      Previous venture recognized as "top startup of the year" by Growth Magazine, 
                      establishing credibility in the Hungarian startup ecosystem.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">Top</div>
                        <div className="text-purple-300 text-sm">Startup</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">Growth</div>
                        <div className="text-purple-300 text-sm">Magazine</div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex flex-col md:flex-row items-center gap-8"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="md:w-1/2 md:text-right">
                  <motion.div 
                    className="bg-gradient-to-br from-green-900 to-green-800 p-8 rounded-2xl border border-green-700"
                    whileHover={{ scale: 1.02, y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex items-center gap-3 mb-4 justify-end">
                      <h3 className="text-2xl font-bold text-white">Trophien Foundation</h3>
                      <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <p className="text-green-200 mb-4">
                      Founded first IT company at university, successfully operating for 6+ years 
                      developing solutions for various clients.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">6+</div>
                        <div className="text-green-300 text-sm">Years</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">First</div>
                        <div className="text-green-300 text-sm">Venture</div>
                      </div>
                    </div>
                  </motion.div>
                </div>
                <motion.div 
                  className="relative z-10 w-16 h-16 bg-green-600 rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, delay: 0.4 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.1 }}
                >
                  <span className="text-white font-bold">2017</span>
                </motion.div>
                <div className="md:w-1/2"></div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-black relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
              Transform Your <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Vision</span> into Success
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Work directly with the entrepreneur who secured 73M HUF funding and built multiple successful ventures. 
              Get the strategic guidance that delivers results.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto px-4">
            {/* Speaking Engagements */}
            <div className="group relative bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-blue-500/50 transition-all duration-300 transform hover:-translate-y-2">
              <div className="absolute -top-4 -right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </div>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center">
                  <Mic className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Speaking Engagements</h3>
                  <p className="text-blue-400 font-semibold">Quote-based pricing</p>
                </div>
              </div>
              
              <p className="text-gray-300 mb-6">
                Inspire your audience with real stories of AI entrepreneurship, investment success, 
                and startup scaling. Perfect for conferences, corporate events, and university talks.
              </p>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-gray-300">
                  <Check className="h-5 w-5 text-blue-400 flex-shrink-0" />
                  <span>45-90 minute keynote presentations</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Check className="h-5 w-5 text-blue-400 flex-shrink-0" />
                  <span>Real-world AI & entrepreneurship stories</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Check className="h-5 w-5 text-blue-400 flex-shrink-0" />
                  <span>Interactive Q&A with actionable insights</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Check className="h-5 w-5 text-blue-400 flex-shrink-0" />
                  <span>Post-event networking & follow-up</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Check className="h-5 w-5 text-blue-400 flex-shrink-0" />
                  <span>EU travel included in pricing</span>
                </div>
              </div>
              
              <Link href="#contact" className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-colors duration-300">
                Request Speaking Quote
              </Link>
            </div>

            {/* 1-on-1 Mentoring */}
            <div className="group relative bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-purple-500/50 transition-all duration-300 transform hover:-translate-y-2">
              <div className="absolute -top-4 -right-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                One-time
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">1-on-1 Mentoring</h3>
                  <p className="text-purple-400 font-semibold">16,000 HUF</p>
                  <p className="text-gray-400 text-sm">One-time payment</p>
                </div>
              </div>
              
              <p className="text-gray-300 mb-6">
                Personal guidance from someone who's been there. Get direct access to proven strategies, 
                network connections, and the mindset that secured major VC investment.
              </p>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-gray-300">
                  <Check className="h-5 w-5 text-purple-400 flex-shrink-0" />
                  <span>Focused 60-minute deep-dive sessions</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Check className="h-5 w-5 text-purple-400 flex-shrink-0" />
                  <span>Business strategy & execution planning</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Check className="h-5 w-5 text-purple-400 flex-shrink-0" />
                  <span>Leadership development & scaling advice</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Check className="h-5 w-5 text-purple-400 flex-shrink-0" />
                  <span>Fundraising strategy & VC connections</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Check className="h-5 w-5 text-purple-400 flex-shrink-0" />
                  <span>Access to exclusive network introductions</span>
                </div>
              </div>
              
              <button 
                onClick={() => setIsMentoringModalOpen(true)}
                className="block w-full text-center bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold transition-colors duration-300"
              >
                Book Now - 16,000 HUF
              </button>
            </div>

          </div>
          
          <div className="text-center mt-16">
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-8 bg-gray-900/50 backdrop-blur border border-gray-700 rounded-2xl p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">73M HUF</div>
                <div className="text-gray-400 text-sm">Investment Secured</div>
              </div>
              <div className="w-px h-8 bg-gray-600"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">6+ Years</div>
                <div className="text-gray-400 text-sm">Proven Experience</div>
              </div>
              <div className="w-px h-8 bg-gray-600"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">Top Startup</div>
                <div className="text-gray-400 text-sm">Award Winner</div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gradient-to-br from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
              Trusted by <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Industry Leaders</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Don't just take my word for it. See what entrepreneurs, founders, and industry leaders 
              say about working with Marcel.
            </p>
          </div>
          
          <div className="relative">
            <div className="flex justify-center">
              <CircularTestimonials 
                testimonials={testimonials}
                autoplay={true}
                colors={{
                  name: "#ffffff",
                  designation: "#d1d5db", 
                  testimony: "#f3f4f6",
                  arrowBackground: "#374151",
                  arrowForeground: "#ffffff",
                  arrowHoverBackground: "#111827"
                }}
              />
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 max-w-4xl mx-auto px-4">
              <div className="text-center">
                <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2">Portfolio.hu</div>
                <div className="text-gray-400 text-xs sm:text-sm">Featured Coverage</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">OUVC</div>
                <div className="text-gray-400 text-sm">First Investment</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">Growth Mag</div>
                <div className="text-gray-400 text-sm">Top Startup</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">500+</div>
                <div className="text-gray-400 text-sm">LinkedIn Network</div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Contact Section */}
      <section id="contact" className="py-20 bg-black relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Transform</span> Your Vision?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Join successful entrepreneurs who've turned their ideas into funded realities. 
              Let's discuss how to accelerate your journey to the next level.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 px-4">
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-white mb-8">
                  Get Direct Access to Proven Expertise
                </h3>
                
                <div className="space-y-6">
                  <div className="group flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-900/20 to-blue-800/20 border border-blue-700/30 hover:border-blue-500/50 transition-all duration-300">
                    <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Mail className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-lg mb-1">Direct Email</h4>
                      <p className="text-blue-300 font-semibold">business@marcelnyiro.com</p>
                      <p className="text-sm text-gray-400 mt-1">Perfect for detailed business inquiries and partnership discussions</p>
                    </div>
                  </div>
                  
                  <div className="group flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-purple-900/20 to-purple-800/20 border border-purple-700/30 hover:border-purple-500/50 transition-all duration-300">
                    <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Globe className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-lg mb-1">LinkedIn Network</h4>
                      <p className="text-purple-300 font-semibold">500+ Professional Connections</p>
                      <p className="text-sm text-gray-400 mt-1">Connect for networking, industry insights, and collaboration opportunities</p>
                    </div>
                  </div>
                  
                  <div className="group flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-green-900/20 to-green-800/20 border border-green-700/30 hover:border-green-500/50 transition-all duration-300">
                    <div className="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <MapPin className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-lg mb-1">Global Reach</h4>
                      <p className="text-green-300 font-semibold">Budapest + EU Travel</p>
                      <p className="text-sm text-gray-400 mt-1">Available for in-person meetings, speaking events, and remote consultations</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl border border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-white">Fast Response Guarantee</h4>
                </div>
                <p className="text-gray-300 mb-4">
                  As someone who secured 73M HUF investment, I understand the value of time. 
                  Every serious business inquiry gets a personal response within 24 hours.
                </p>
                <div className="flex items-center gap-2 text-blue-400 text-sm font-semibold">
                  <Check className="h-4 w-4" />
                  <span>For urgent matters, mark your message "URGENT" for priority handling</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl border border-gray-700">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Start Your Success Story</h3>
                <p className="text-gray-300">Fill out the form below and let's discuss how to turn your vision into reality.</p>
              </div>
              <ContactForm />
            </div>
          </div>
          
          <div className="text-center mt-20">
            <div className="inline-flex flex-col sm:flex-row items-center gap-6 sm:gap-12 bg-gray-900/50 backdrop-blur border border-gray-700 rounded-2xl p-6 sm:p-8">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white mb-2">73M HUF</div>
                <div className="text-gray-400">Investment Secured</div>
                <div className="text-blue-400 text-sm">First Hungarian University VC</div>
              </div>
              <div className="w-full h-px sm:w-px sm:h-16 bg-gray-600"></div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white mb-2">Portfolio.hu</div>
                <div className="text-gray-400">Media Coverage</div>
                <div className="text-purple-400 text-sm">Major Hungarian Business Press</div>
              </div>
              <div className="w-full h-px sm:w-px sm:h-16 bg-gray-600"></div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white mb-2">Top Startup</div>
                <div className="text-gray-400">Growth Magazine</div>
                <div className="text-green-400 text-sm">Award-Winning Track Record</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MentoringPaymentModal
        isOpen={isMentoringModalOpen}
        onClose={() => setIsMentoringModalOpen(false)}
        onSuccess={() => {
          setIsMentoringModalOpen(false);
        }}
      />
    </div>
  );
}
