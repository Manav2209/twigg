"use client";

import  { motion}from "motion/react"
import { 
  TrendingUp, 
  PieChart, 
  Calculator, 
  BarChart3, 
  Target, 
  Split,
  ArrowRight,
  DollarSign,
  Percent,
  Activity,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

const features = [
  {
    icon: DollarSign,
    title: "Total Portfolio Value",
    description: "Real-time tracking of your complete investment portfolio with instant value updates and historical performance."
  },
  {
    icon: TrendingUp,
    title: "Stock Performance",
    description: "Individual stock gains and losses displayed in both dollar amounts and percentages with color-coded indicators."
  },
  {
    icon: PieChart,
    title: "Fund Analytics",
    description: "Comprehensive fund performance tracking with detailed breakdowns and comparative analysis tools."
  },
  {
    icon: Calculator,
    title: "Portfolio Calculator",
    description: "Advanced calculator to measure overall portfolio performance with risk-adjusted returns and benchmarking."
  },
  {
    icon: Target,
    title: "Share Simulation",
    description: "Simulate buying additional shares to forecast potential returns and optimize your investment strategy."
  },
  {
    icon: BarChart3,
    title: "Performance Sorting",
    description: "Dynamic sorting capabilities to organize investments by performance, helping you identify top and bottom performers."
  }
];

const stats = [
  { value: "$2.4M+", label: "Assets Tracked" },
  { value: "15,000+", label: "Active Users" },
  { value: "99.9%", label: "Uptime" },
  { value: "24/7", label: "Market Coverage" }
];

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {

  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f9ff] via-[#89baf1] to-[#f0f9ff]">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 px-4 lg:px-6 h-16 flex items-center justify-between backdrop-blur-sm bg-white/10 border-b border-white/20"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
            <Activity className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">PortfolioFlow</span>
        </div>
        <nav className="hidden md:flex gap-6">
          <a href="#features" className="text-gray-700 hover:text-gray-900 transition-colors">Features</a>
          <a href="#pricing" className="text-gray-700 hover:text-gray-900 transition-colors">Pricing</a>
          <a href="#about" className="text-gray-700 hover:text-gray-900 transition-colors">About</a>
        </nav>
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="text-gray-700 hover:text-gray-900" onClick={ () => {router.push("/auth/signin")}}>
            Sign In
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          onClick={() => {
            router.push("/auth/signup")
          }}>
            Get Started
          </Button>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative px-4 lg:px-6 py-20 md:py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <Badge className="mb-6 bg-white/20 text-blue-800 border-white/30 hover:bg-white/30 transition-colors">
            <Star className="w-3 h-3 mr-1" />
            Smart Portfolio Management
          </Badge>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Master Your
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"> Investment </span>
            Portfolio
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 mb-10 max-w-2xl mx-auto leading-relaxed">
            Track, analyze, and optimize your investments with powerful tools designed for modern investors.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
              onClick={() => {
                router.push("/auth/signup")
              }}
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="px-8 py-4 text-lg bg-white/50 hover:bg-white/70 border-white/30 backdrop-blur-sm transition-all duration-300"
            >
              Watch Demo
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto mt-20"
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 lg:px-6 py-20 bg-white/30 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need to
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"> Succeed</span>
            </h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Comprehensive portfolio management tools that give you complete control over your investments.
            </p>
          </div>

          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full bg-white/60 backdrop-blur-sm border-white/50 hover:bg-white/80 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 group">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Dashboard Preview */}
      <section className="px-4 lg:px-6 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Dual Dashboard Experience
          </h2>
          <p className="text-xl text-gray-700 mb-12 max-w-2xl mx-auto">
            Choose between dedicated funds and stocks dashboards, or view your complete portfolio in one unified interface.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="bg-white/60 backdrop-blur-sm border-white/50 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 group">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                    <PieChart className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900">Funds Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6">
                    Comprehensive fund analysis with performance metrics, allocation insights, and growth projections.
                  </p>
                  <div className="space-y-3 text-left">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Expense ratio tracking
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Diversification analysis
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Risk assessment tools
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="bg-white/60 backdrop-blur-sm border-white/50 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 group">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                    <BarChart3 className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900">Stocks Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6">
                    Individual stock monitoring with real-time prices, performance analytics, and trading insights.
                  </p>
                  <div className="space-y-3 text-left">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Real-time price updates
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Technical indicators
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      News & sentiment analysis
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Performance Metrics */}
      <section className="px-4 lg:px-6 py-20 bg-white/20 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Advanced Performance
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"> Analytics</span>
            </h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Get deep insights into your investment performance with our sophisticated analytics engine.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="bg-white/70 backdrop-blur-sm border-white/50 hover:shadow-2xl transition-all duration-500 group">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-6 transition-transform duration-300 shadow-xl">
                    <Percent className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold">Gains & Losses</CardTitle>
                  <CardDescription>
                    Track individual and overall performance with precision percentage calculations and dollar value changes.
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="bg-white/70 backdrop-blur-sm border-white/50 hover:shadow-2xl transition-all duration-500 group">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-6 transition-transform duration-300 shadow-xl">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold">Smart Simulation</CardTitle>
                  <CardDescription>
                    Model potential investments and simulate share purchases to optimize your portfolio strategy.
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Card className="bg-white/70 backdrop-blur-sm border-white/50 hover:shadow-2xl transition-all duration-500 group">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-700 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-6 transition-transform duration-300 shadow-xl">
                    <Split className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold">Performance Sorting</CardTitle>
                  <CardDescription>
                    Intelligent sorting algorithms to identify top performers and optimize your investment decisions.
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="px-4 lg:px-6 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <Card className="bg-white/80 backdrop-blur-sm border-white/50 shadow-2xl shadow-blue-500/20">
            <CardHeader className="py-12">
              <CardTitle className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Ready to Transform Your Portfolio?
              </CardTitle>
              <CardDescription className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
                Join thousands of investors who have already revolutionized their investment strategy with PortfolioFlow.
              </CardDescription>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white px-10 py-4 text-lg shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-105"
                  onClick={() => {
                    router.push("/auth/signup")
                  }}
                >
                  Start Your Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="px-10 py-4 text-lg bg-white/50 hover:bg-white/70 border-white/30 backdrop-blur-sm transition-all duration-300"
                >
                  Schedule Demo
                </Button>
              </div>
            </CardHeader>
          </Card>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="px-4 lg:px-6 py-12 bg-white/10 backdrop-blur-sm border-t border-white/20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">PortfolioFlow</span>
            </div>
            <div className="flex gap-6 text-sm text-gray-600">
              <a href="#" className="hover:text-gray-900 transition-colors">Privacy</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Terms</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Support</a>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-sm text-gray-600">
            © 2025 PortfolioFlow. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}