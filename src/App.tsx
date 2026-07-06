import React, { useState, useEffect } from 'react';
import { 
  Sun, Phone, MapPin, Mail, Clock, ShieldCheck, Award, Zap, 
  ChevronRight, ChevronLeft, Calculator, Sparkles, Star, Check, CheckCircle2, 
  MessageSquare, LayoutDashboard, Send, ArrowUpRight, HelpCircle,
  Instagram
} from 'lucide-react';
import Header from './components/Header';
import SolarCalculator from './components/SolarCalculator';
import SolarChatbot from './components/SolarChatbot';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [activeProductTab, setActiveProductTab] = useState<'on-grid' | 'off-grid' | 'hybrid'>('on-grid');

  // Hero Carousel State for Warehouse & On-Site photos
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroImages = [
    {
      url: "https://lh3.googleusercontent.com/d/19XaDooqob_6AzntrQJ7QCB1BZ7Gj4FQ-",
      label: "Vijay Nagar Warehouse Stack",
      description: "Direct inventory of A-grade premium solar panels in Indore"
    },
    {
      url: "https://lh3.googleusercontent.com/d/1SxTvo9E8XAiz4d5L3FLou9DQMCKVWmvH",
      label: "Authentic Batch Stock",
      description: "Pallets of monocrystalline panels ready for immediate dispatch"
    },
    {
      url: "https://lh3.googleusercontent.com/d/1NbGpsO7zhT8fwqj6s3-j4D_Ck9D6oauk",
      label: "Infinity Logistics Hub",
      description: "Fully stocked central warehouse supplying Indore and surrounding regions"
    },
    {
      url: "https://lh3.googleusercontent.com/d/1r05HfnJOLzhzkeSnydScIHFe_ugLx0v1",
      label: "Expert Technical Lead",
      description: "Conducting professional on-site mounting checks under clear blue sky"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactBill, setContactBill] = useState('');
  const [contactType, setContactType] = useState('on-grid');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          phone: contactPhone,
          message: `${contactMessage} (Preferred System: ${contactType}, Monthly Bill estimate: ₹${contactBill || 'N/A'})`,
          monthlyBill: contactBill ? Number(contactBill) : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit contact request. Please try again.');
      }

      setSubmitted(true);
      setContactName('');
      setContactEmail('');
      setContactPhone('');
      setContactMessage('');
      setContactBill('');
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  const services = [
    {
      icon: <Sun className="w-6 h-6 text-amber-400" />,
      title: "Rooftop Solar Installation",
      desc: "Turn your unused roof space into an active power plant. We handle high-efficiency design, premium tier-1 mono panels, structural framing, and clean wiring for houses and commercial setups in Indore."
    },
    {
      icon: <Zap className="w-6 h-6 text-amber-400" />,
      title: "Authorized Dealership",
      desc: "Infinity Solar supplies only certified, durable, and weather-proof solar products—including on-grid, off-grid, and hybrid smart string inverters from leading international and national solar companies."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-amber-400" />,
      title: "Net Metering approvals",
      desc: "Leave the heavy paperwork to us. We coordinate direct end-to-end net metering permissions and official grid synchronizations with Madhya Pradesh West Discom (MPPKVVCL) in Indore."
    },
    {
      icon: <Award className="w-6 h-6 text-amber-400" />,
      title: "Subsidy Claim Services",
      desc: "Specialized advisors for the PM Surya Ghar Muft Bijli Yojana Central scheme. We ensure up to ₹78,000 in Central subsidies is successfully processed and credited straight to your bank account."
    },
    {
      icon: <Clock className="w-6 h-6 text-amber-400" />,
      title: "24/7 Operations Support",
      desc: "Solar is an asset for decades. We are available round-the-clock for physical site inspections, troubleshooting, performance audits, cleaning, and prompt warranty processing."
    },
    {
      icon: <HelpCircle className="w-6 h-6 text-amber-400" />,
      title: "Customized Consultation",
      desc: "Every house structure has unique sun paths. We construct highly detailed architectural shadow-analyses and load-calculations to recommend the exact optimal angle and capacity."
    }
  ];

  const products = {
    'on-grid': {
      title: "On-Grid Solar Systems",
      subtitle: "Best for immediate power bill savings & Govt Subsidies",
      image: "/src/assets/images/solar_hero_banner_1783271764144.jpg",
      benefits: [
        "Direct synchronization with West Discom (MPPKVVCL) grid",
        "Eligible for Central Subsidy up to ₹78,000 (PM Surya Ghar Scheme)",
        "Sell surplus electricity back to the utility company",
        "Zero battery replacement overhead costs over 25 years",
        "Typical ROI payback in under 3.5 to 4.5 years"
      ],
      desc: "On-grid (grid-tied) solar is Indore's most popular solution. Your panels feed the home loads, and any excess clean electricity is exported back to the grid via a bidirectional Net-Meter. You get equivalent credits directly deducted on your monthly utility bill."
    },
    'off-grid': {
      title: "Off-Grid Solar Systems",
      subtitle: "Absolute energy independence with robust battery storage",
      image: "/src/assets/images/solar_tech_products_1783271793785.jpg",
      benefits: [
        "Completely independent of state Discom grids & local power lines",
        "Includes premium high-rate life lithium-ion or solar tall tubular batteries",
        "Perfect protection during local grid failures or Vijay Nagar maintenance shutdowns",
        "Saves off-grid agriculture or remote estates from diesel fuel costs",
        "Uninterrupted, stabilized surge-proof electricity for heavy appliances"
      ],
      desc: "Off-grid configurations use smart MPPT solar chargers and battery banks to store your daylight solar energy. These systems work anywhere, storing backup energy to feed your home during nights or during general grid blackouts without reliance on MP West Discom."
    },
    'hybrid': {
      title: "Smart Hybrid Systems",
      subtitle: "The ultimate combination of savings and backup safety",
      image: "/src/assets/images/solar_install_team_1783271777482.jpg",
      benefits: [
        "Works as both an On-grid system and an Off-grid backup powerhouse",
        "Intelligently switches automatically between solar, battery, and utility grid",
        "Keep exporting excess solar to save bills, but keep batteries full for emergencies",
        "Allows customizable backup priorities (e.g., power ACs from solar, lights from battery)",
        "Premium smart inverter handles automatic battery voltage maintenance"
      ],
      desc: "Hybrid technology is the gold-standard. It keeps you connected to the grid to earn PM Surya Ghar subsidy credits while holding a lithium battery backup in reserve. If the grid crashes, your essential appliances keep running instantly with zero flicker."
    }
  };

  const steps = [
    {
      num: "01",
      title: "Free Site Survey & Analysis",
      desc: "Infinity's engineers visit your property in Indore to perform load-calculation and shade testing."
    },
    {
      num: "02",
      title: "3D Design & Custom Proposal",
      desc: "We design a high-performance blueprint optimized for the exact rooftop dimensions."
    },
    {
      num: "03",
      title: "Net-Metering Approvals",
      desc: "Our regulatory desk files net-metering documents with West Discom (MPPKVVCL) for immediate connection."
    },
    {
      num: "04",
      title: "Prompt Installation & Commission",
      desc: "Expert installation team deploys high-tech structural frames and certified tier-1 solar panels."
    }
  ];

  const IndoreFAQs = [
    {
      q: "What is the subsidy rate under PM Surya Ghar Muft Bijli Yojana in Madhya Pradesh?",
      a: "Under the latest guidelines for MP: 1 kW gets up to ₹30,000, 2 kW gets up to ₹60,000, and 3 kW or higher systems get a maximum central subsidy of ₹78,000. Infinity Solar handles the end-to-end documentation so you don't have to worry about the regulatory process."
    },
    {
      q: "How much rooftop area is required for 1 kW of solar?",
      a: "Typically, 1 kW of high-efficiency solar panels requires approximately 100 sq ft of shadow-free rooftop space. A standard 3 kW residential setup takes about 300 sq ft."
    },
    {
      q: "Are the solar panels durable enough for Indore's hot summers?",
      a: "Yes! We deal exclusively in Tier-1 Monocrystalline PERC panels. These panels are specifically engineered to maintain excellent efficiency even under peak hot conditions in Central India and are certified to withstand heavy wind loads, hailstorms, and seasonal monsoon rains."
    },
    {
      q: "How long does the entire solar panel installation process take?",
      a: "The physical installation of a residential rooftop solar system usually takes only 2 to 3 days. However, the complete process—including West Discom net-metering clearances, inspection, grid synchronization, and final subsidy credit—takes around 3 to 4 weeks."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* Navigation Header */}
      <Header 
        onOpenCalculator={() => setIsCalculatorOpen(true)} 
        onOpenAdmin={() => setIsAdminOpen(true)} 
      />

      {/* HOME / HERO BANNER */}
      <section id="home" className="relative pt-32 pb-20 md:py-40 flex items-center justify-center overflow-hidden">
        {/* Ambient solar light backdrop glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-10 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-xs font-semibold text-slate-300">
                <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>
                <span>Indore's Trusted Solar Dealer & Installers</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                Infinite Energy.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500">
                  Infinite Savings.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
                Infinity Solar Power System brings 8+ years of expertise in high-performance solar installations to Indore. We specialize in helping homeowners and businesses reduce electricity bills, claim PM Surya Ghar subsidies, and gain complete energy independence.
              </p>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-4 py-2 border-y border-slate-900 font-mono">
                <div>
                  <span className="block text-2xl font-extrabold text-white">8+ Yrs</span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">Local Experience</span>
                </div>
                <div>
                  <span className="block text-2xl font-extrabold text-amber-400">₹78,000</span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">Max Central Subsidy</span>
                </div>
                <div>
                  <span className="block text-2xl font-extrabold text-white">24/7</span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">Service Support</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  onClick={() => setIsCalculatorOpen(true)}
                  className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-all shadow-[0_4px_25px_rgba(245,158,11,0.3)] hover:shadow-[0_4px_30px_rgba(245,158,11,0.5)] flex items-center justify-center gap-2 group cursor-pointer hover:-translate-y-0.5"
                >
                  <Calculator className="w-5 h-5" />
                  <span>Use AI Solar Calculator</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <a
                  href="#contact"
                  className="px-8 py-4 bg-slate-900 hover:bg-slate-850 text-white font-bold rounded-xl transition-all border border-slate-800 text-center cursor-pointer hover:-translate-y-0.5"
                >
                  Get a Free Quote
                </a>
              </div>

              {/* Badges/Subsidies info */}
              <p className="text-xs text-slate-400 italic">
                *Officially registered solar dealer. PM Surya Ghar Muft Bijli Yojana subsidy directly applicable.
              </p>
            </div>

            {/* Right Visual Image Column */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Decorative border frame */}
                <div className="absolute inset-0 bg-gradient-to-tr from-amber-500 to-yellow-500 rounded-3xl rotate-3 opacity-20 blur-sm"></div>
                
                {/* Clean background element */}
                <div className="relative bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl group/hero">
                  <img 
                    key={currentSlide}
                    src={heroImages[currentSlide].url} 
                    alt={heroImages[currentSlide].label} 
                    referrerPolicy="no-referrer"
                    className="w-full h-[320px] sm:h-[400px] object-cover animate-fade-in-slide"
                  />
                  
                  {/* Real Photo Tag */}
                  <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md border border-slate-800/80 px-2.5 py-1 rounded-xl flex items-center gap-1.5 z-10 shadow-lg">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-[10px] font-mono tracking-wider text-slate-300 font-semibold uppercase">Real Stock Photo</span>
                  </div>

                  {/* Manual Slide Selectors (Chevrons) */}
                  <button
                    onClick={() => setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-slate-950/75 hover:bg-slate-950/90 border border-slate-800/50 hover:border-amber-400/40 rounded-xl text-white hover:text-amber-400 opacity-0 group-hover/hero:opacity-100 transition-all duration-300 cursor-pointer z-10 shadow-lg hover:scale-105 active:scale-95"
                    title="Previous Photo"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentSlide((prev) => (prev + 1) % heroImages.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-slate-950/75 hover:bg-slate-950/90 border border-slate-800/50 hover:border-amber-400/40 rounded-xl text-white hover:text-amber-400 opacity-0 group-hover/hero:opacity-100 transition-all duration-300 cursor-pointer z-10 shadow-lg hover:scale-105 active:scale-95"
                    title="Next Photo"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  {/* Interactive Miniature Thumbnail Selector Panel */}
                  <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-slate-950/80 backdrop-blur-md border border-slate-800/80 px-3 py-2 rounded-2xl z-10 shadow-xl">
                    {heroImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`relative w-10 h-8 rounded-lg overflow-hidden border-2 transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 ${
                          idx === currentSlide 
                            ? 'border-amber-400 scale-105 shadow-[0_0_10px_rgba(245,158,11,0.3)]' 
                            : 'border-slate-800 opacity-60 hover:opacity-100 hover:border-slate-600'
                        }`}
                        title={`View ${img.label}`}
                      >
                        <img 
                          src={img.url} 
                          alt="" 
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>

                  {/* Floating Stat Widget / Slide Caption */}
                  <div className="absolute bottom-4 left-4 right-4 bg-slate-950/95 backdrop-blur-md border border-slate-800/80 p-3 rounded-2xl flex items-center justify-between shadow-2xl transition-all duration-300">
                    <div className="min-w-0 flex-1 mr-3">
                      <span className="block text-[10px] font-mono tracking-wider text-amber-400 uppercase leading-none font-semibold">{heroImages[currentSlide].label}</span>
                      <span className="block text-xs text-slate-300 mt-1 font-sans truncate font-medium leading-tight">{heroImages[currentSlide].description}</span>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="block text-[9px] text-slate-400 font-mono">Open 24 Hours</span>
                      <span className="block text-[10px] text-emerald-400 font-semibold mt-0.5 font-mono">● Active Dealer</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ABOUT US */}
      <section id="about" className="py-20 border-t border-slate-900 bg-slate-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Image Column */}
            <div className="lg:col-span-5 order-last lg:order-first">
              <div className="relative">
                <div className="absolute inset-0 bg-amber-500 rounded-3xl -rotate-3 opacity-10 blur-md"></div>
                <div className="relative bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
                  <img 
                    src="/src/assets/images/solar_install_team_1783271777482.jpg" 
                    alt="Infinity Solar Power installation team working in Indore" 
                    className="w-full h-[360px] object-cover"
                  />
                  <div className="p-5 bg-slate-950 border-t border-slate-800/80">
                    <p className="text-xs text-slate-300 italic">
                      "Our certified engineers installing monocrystalline panels with high load-strength anodized aluminum mounts."
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Narrative Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-1.5 text-xs text-amber-400 uppercase tracking-widest font-mono">
                <Sun className="w-3.5 h-3.5" />
                <span>Our Heritage & Values</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Infinity Solar Power System &mdash; Powering Indore's Future, Sustainably
              </h2>

              <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                Infinity Solar Power System is Indore's trusted pioneer in residential and commercial solar setups. From our dealership base in Vijay Nagar, Indore, we have assisted hundreds of homes, factories, showrooms, and commercial properties in transitioning successfully to clean, renewable, and budget-friendly electricity.
              </p>

              <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                With **over 8 years of trusted experience**, we understand that moving to solar is a 25-year financial asset. That's why we never compromise on our core principles: tier-1 certified modules, certified dual-channel string inverters, and premium surge protection structures. We are accessible **24/7** to provide physical troubleshooting, custom modifications, and net metering assistance.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="p-4 bg-slate-950/60 border border-slate-800/50 rounded-xl">
                  <h4 className="font-bold text-white text-sm">Our Mission</h4>
                  <p className="text-xs text-slate-400 mt-1">To simplify and accelerate Indore's transition to sustainable energy, making it affordable, robust, and accessible to everyone.</p>
                </div>
                <div className="p-4 bg-slate-950/60 border border-slate-800/50 rounded-xl">
                  <h4 className="font-bold text-white text-sm">Infinite Support</h4>
                  <p className="text-xs text-slate-400 mt-1">We maintain dedicated monitoring support and on-ground technicians in Indore available around the clock to ensure optimal panel output.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-20 bg-slate-950 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          
          {/* Section Header */}
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="text-xs text-amber-400 uppercase tracking-widest font-mono font-bold block">Professional Solutions</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">End-To-End Solar Services</h2>
            <p className="text-sm text-slate-400">
              We manage everything from primary shade audits and Discom regulatory net-meter clearance to physical installation and continuous maintenance.
            </p>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((srv, idx) => (
              <div 
                key={idx} 
                className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl hover:border-amber-500/30 transition-all duration-300 hover:-translate-y-1 text-left flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="p-3 bg-amber-500/10 rounded-xl w-fit">
                    {srv.icon}
                  </div>
                  <h3 className="text-base font-bold text-white">{srv.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{srv.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* PRODUCTS */}
      <section id="products" className="py-20 bg-slate-900/15 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <span className="text-xs text-amber-400 uppercase tracking-widest font-mono font-bold block">Our Solar Systems</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Tailored Solar Architectures</h2>
            <p className="text-sm text-slate-400">
              Select from three distinct architectural solar configurations built for residential properties, businesses, and farmhouses in Central India.
            </p>
          </div>

          {/* Product Tabs Navigation */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex p-1 bg-slate-900 border border-slate-800 rounded-xl">
              {(Object.keys(products) as Array<keyof typeof products>).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveProductTab(tab)}
                  className={`px-4 sm:px-6 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                    activeProductTab === tab
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content Display */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 sm:p-10 transition-all duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Product Info */}
              <div className="lg:col-span-7 space-y-5">
                <span className="text-xs text-amber-400 font-mono font-bold uppercase">{products[activeProductTab].subtitle}</span>
                <h3 className="text-2xl sm:text-3xl font-bold text-white">{products[activeProductTab].title}</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {products[activeProductTab].desc}
                </p>

                <div className="space-y-2.5 pt-2">
                  <h4 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">Key Highlights:</h4>
                  <ul className="space-y-2">
                    {products[activeProductTab].benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 flex gap-4">
                  <button
                    onClick={() => setIsCalculatorOpen(true)}
                    className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Calculator className="w-4 h-4" />
                    <span>Calculate Custom Setup</span>
                  </button>
                  <a
                    href="#contact"
                    className="px-6 py-3 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-white font-bold rounded-xl text-xs transition-colors block text-center"
                  >
                    Inquire Specification
                  </a>
                </div>
              </div>

              {/* Product Image */}
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
                  <img 
                    src={products[activeProductTab].image} 
                    alt={products[activeProductTab].title} 
                    className="w-full h-[300px] object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent flex items-end p-4">
                    <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase font-semibold">Infinity Quality Verified</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section id="why-choose-us" className="py-20 bg-slate-950 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Value Props Narrative */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-1.5 text-xs text-amber-400 uppercase tracking-widest font-mono font-bold">
                <Award className="w-3.5 h-3.5" />
                <span>Indore's Trusted Standard</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Why Indore Chooses Infinity Solar Power System
              </h2>

              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                As long-term members of the Vijay Nagar community, we have earned our reputation through rigid technical standards, transparent pricing, and robust local post-sales maintenance.
              </p>

              {/* Bento styled grids */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-slate-900/40 border border-slate-800/80 rounded-xl">
                  <div className="flex gap-2 text-amber-400 items-center mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs font-bold font-mono uppercase tracking-wider">Available 24x7</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    We keep engineers ready round-the-clock. If you experience an emergency grid issue or want to consult, we are always a single phone call away.
                  </p>
                </div>

                <div className="p-4 bg-slate-900/40 border border-slate-800/80 rounded-xl">
                  <div className="flex gap-2 text-amber-400 items-center mb-1">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-xs font-bold font-mono uppercase tracking-wider">25-Year Performance</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Our monocrystalline solar panels carry a 25-year performance warranty alongside direct technical support for inverters and batteries.
                  </p>
                </div>

                <div className="p-4 bg-slate-900/40 border border-slate-800/80 rounded-xl">
                  <div className="flex gap-2 text-amber-400 items-center mb-1">
                    <Award className="w-4 h-4" />
                    <span className="text-xs font-bold font-mono uppercase tracking-wider">8+ Years Local Roots</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Established in Vijay Nagar with massive local know-how. We deal with specific regional West Discom approval channels seamlessly.
                  </p>
                </div>

                <div className="p-4 bg-slate-900/40 border border-slate-800/80 rounded-xl">
                  <div className="flex gap-2 text-amber-400 items-center mb-1">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-xs font-bold font-mono uppercase tracking-wider">PM Subsidy Experts</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    We manage the entire application on the Central National Portal for solar subsidies, guaranteeing zero clerical hassle for our customers.
                  </p>
                </div>
              </div>
            </div>

            {/* Steps Infographic column */}
            <div className="lg:col-span-5 bg-slate-900/20 border border-slate-850 p-6 rounded-3xl">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono text-amber-400 mb-6 pb-2 border-b border-slate-850">
                Our 4-Step Process:
              </h3>
              <div className="space-y-6">
                {steps.map((st, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="text-2xl font-extrabold text-amber-400/45 font-mono">{st.num}</div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{st.title}</h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{st.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* GALLERY / PAST PROJECTS */}
      <section id="gallery" className="py-20 bg-slate-900/10 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs text-amber-400 uppercase tracking-widest font-mono font-bold block">Completed Work</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Active Installations in Indore</h2>
            <p className="text-sm text-slate-400">
              A glimpse of past solar rooftop installations in commercial, agricultural, and residential properties around Indore.
            </p>
          </div>

          {/* Project Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Gallery Item 1 */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg group">
              <div className="relative h-[220px]">
                <img 
                  src="/src/assets/images/solar_hero_banner_1783271764144.jpg" 
                  alt="Rooftop solar panels Indore" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-amber-500 text-slate-950 font-mono text-[9px] font-bold uppercase px-2 py-0.5 rounded-full">
                  5 kW On-Grid
                </span>
              </div>
              <div className="p-4 space-y-2">
                <h4 className="font-bold text-sm text-white">Vijay Nagar Residence</h4>
                <p className="text-xs text-slate-400">Rooftop grid-sync system delivering average monthly savings of ₹4,200.</p>
                <div className="flex justify-between items-center text-[10px] text-slate-400 pt-2 border-t border-slate-800/60 font-mono">
                  <span>MPPKVVCL Approved</span>
                  <span className="text-emerald-400">Completed 2025</span>
                </div>
              </div>
            </div>

            {/* Gallery Item 2 */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg group">
              <div className="relative h-[220px]">
                <img 
                  src="/src/assets/images/solar_install_team_1783271777482.jpg" 
                  alt="Industrial installation Indore" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-amber-500 text-slate-950 font-mono text-[9px] font-bold uppercase px-2 py-0.5 rounded-full">
                  15 kW Commercial
                </span>
              </div>
              <div className="p-4 space-y-2">
                <h4 className="font-bold text-sm text-white">Palasia Warehouse Complex</h4>
                <p className="text-xs text-slate-400">High-capacity structural arrays powering complex refrigeration and machines.</p>
                <div className="flex justify-between items-center text-[10px] text-slate-400 pt-2 border-t border-slate-800/60 font-mono">
                  <span>Net-meter Synchronized</span>
                  <span className="text-emerald-400">Completed 2026</span>
                </div>
              </div>
            </div>

            {/* Gallery Item 3 */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg group">
              <div className="relative h-[220px]">
                <img 
                  src="/src/assets/images/solar_tech_products_1783271793785.jpg" 
                  alt="Off grid home solar system Indore" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-amber-500 text-slate-950 font-mono text-[9px] font-bold uppercase px-2 py-0.5 rounded-full">
                  3 kW Hybrid
                </span>
              </div>
              <div className="p-4 space-y-2">
                <h4 className="font-bold text-sm text-white">Bicholi Mardana Villa</h4>
                <p className="text-xs text-slate-400">Continuous power supply backing up luxury loads with advanced lithium storage.</p>
                <div className="flex justify-between items-center text-[10px] text-slate-400 pt-2 border-t border-slate-800/60 font-mono">
                  <span>L-Ion Smart Storage</span>
                  <span className="text-emerald-400">Completed 2025</span>
                </div>
              </div>
            </div>

          </div>

          {/* Quick installation metric card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-1 text-center md:text-left">
              <h4 className="text-lg font-bold text-white">Curious what your own roof can yield?</h4>
              <p className="text-xs text-slate-400 max-w-lg">
                Enter your current electricity bill and rooftop area in our AI system to see expected annual returns in under 30 seconds.
              </p>
            </div>
            <button
              onClick={() => setIsCalculatorOpen(true)}
              className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Calculator className="w-4.5 h-4.5" />
              <span>Launch AI Calculation Engine</span>
            </button>
          </div>

        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-20 bg-slate-950 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs text-amber-400 uppercase tracking-widest font-mono font-bold block">Real Feedback</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Stories from Happy Customers</h2>
            <p className="text-sm text-slate-400">
              See how families and corporate operations in Indore reduced carbon emissions and saved massive utility costs with Infinity.
            </p>
          </div>

          {/* Testimonial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Review 1 */}
            <div className="p-6 bg-slate-900/30 border border-slate-800 rounded-2xl flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "We installed a 5kW On-grid solar system with Infinity Solar Power System in Vijay Nagar. Our monthly West Discom bill came down from ₹6,500 to almost zero! The team was extremely professional, managing the entire Net-meter documentation. The PM Surya Ghar subsidy of ₹78,000 was credited directly to my bank account. Highly recommended!"
                </p>
              </div>
              <div className="flex items-center gap-3 pt-3 border-t border-slate-800/40">
                <div className="w-10 h-10 rounded-full bg-slate-800 font-bold flex items-center justify-center text-xs text-amber-400">
                  RM
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Rajesh Mishra</h4>
                  <p className="text-[10px] text-slate-500 font-mono">Vijay Nagar Resident, Indore</p>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="p-6 bg-slate-900/30 border border-slate-800 rounded-2xl flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "Being a pharmaceutical manufacturing unit in Indore, our machinery loads require steady power. Infinity Solar designed a customized 15kW Hybrid system with automatic switching. It gives us maximum savings during the day and secure battery storage for the night. Their 24/7 technical hotline is truly active—I called once at midnight and an engineer assisted me immediately."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-3 border-t border-slate-800/40">
                <div className="w-10 h-10 rounded-full bg-slate-800 font-bold flex items-center justify-center text-xs text-amber-400">
                  AS
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Amit Singh</h4>
                  <p className="text-[10px] text-slate-500 font-mono">Factory Owner, Sanwer Road Industrial Area</p>
                </div>
              </div>
            </div>

            {/* Review 3 */}
            <div className="p-6 bg-slate-900/30 border border-slate-800 rounded-2xl flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "Amazing service! Very honest consultation. They first inspected my roof and advised that some tree shadows would block efficiency, so they elevated the structural mounting angles. The panels are premium Tier-1 quality, and we are saving 90% of our domestic bills now. Infinity Solar is Indore's absolute best!"
                </p>
              </div>
              <div className="flex items-center gap-3 pt-3 border-t border-slate-800/40">
                <div className="w-10 h-10 rounded-full bg-slate-800 font-bold flex items-center justify-center text-xs text-amber-400">
                  PV
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Priyanka Vyas</h4>
                  <p className="text-[10px] text-slate-500 font-mono">Homeowner, Bicholi Mardana</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* CONTACT US & MAP */}
      <section id="contact" className="py-20 bg-slate-900/20 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Side: Detail list & map info */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-1.5 text-xs text-amber-400 uppercase tracking-widest font-mono font-bold">
                <Sun className="w-3.5 h-3.5" />
                <span>Visit Our Dealership</span>
              </div>

              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                Let's Partner for Infinite Savings
              </h2>

              <p className="text-sm text-slate-400 leading-relaxed">
                Reach out to us to book a physical shadow audit and detailed site inspection at no cost. Our specialists are ready to answer your calls round the clock.
              </p>

              <div className="space-y-4 text-xs">
                <div className="flex gap-3.5 items-center p-3 bg-slate-900/40 border border-slate-800 rounded-xl">
                  <MapPin className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <div>
                    <span className="block font-mono text-[9px] uppercase tracking-wider text-slate-500">Showroom Address</span>
                    <span className="text-slate-200 font-semibold">Vijay Nagar, Indore, Madhya Pradesh - 452010</span>
                  </div>
                </div>

                <div className="flex gap-3.5 items-center p-3 bg-slate-900/40 border border-slate-800 rounded-xl">
                  <Phone className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <div>
                    <span className="block font-mono text-[9px] uppercase tracking-wider text-slate-500">24/7 Hotline</span>
                    <a href="tel:+919876543210" className="text-amber-400 hover:underline font-semibold font-mono">+91 98765 43210</a>
                  </div>
                </div>

                <div className="flex gap-3.5 items-center p-3 bg-slate-900/40 border border-slate-800 rounded-xl">
                  <Mail className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <div>
                    <span className="block font-mono text-[9px] uppercase tracking-wider text-slate-500">Official Email</span>
                    <a href="mailto:info@infinitysolarpower.com" className="text-slate-200 hover:underline font-mono">info@infinitysolarpower.com</a>
                  </div>
                </div>

                <div className="flex gap-3.5 items-center p-3 bg-slate-900/40 border border-slate-800 rounded-xl">
                  <Instagram className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <div>
                    <span className="block font-mono text-[9px] uppercase tracking-wider text-slate-500">Instagram Profile</span>
                    <a href="https://www.instagram.com/infinity_solar_power_system?igsh=NWNud2N3cGo4aXhm" target="_blank" rel="noopener noreferrer" className="text-slate-200 hover:underline font-mono text-[11px] break-all">@infinity_solar_power_system</a>
                  </div>
                </div>
              </div>

              {/* Simulated Map Component (Sleek vector layout) */}
              <div className="border border-slate-800 bg-slate-950 rounded-2xl p-4 space-y-3 relative overflow-hidden">
                <div className="absolute top-2 right-2 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">Vijay Nagar Dealer Location</span>
                </div>
                
                {/* Visual simulated street map */}
                <div className="h-[140px] bg-slate-900 rounded-xl border border-slate-800/80 relative overflow-hidden flex items-center justify-center">
                  
                  {/* Grid lines simulating streets */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="w-full h-[1px] bg-slate-600 absolute top-1/4"></div>
                    <div className="w-full h-[1px] bg-slate-600 absolute top-2/3"></div>
                    <div className="h-full w-[1px] bg-slate-600 absolute left-1/3"></div>
                    <div className="h-full w-[1px] bg-slate-600 absolute left-2/3"></div>
                    {/* Diagonal bypass */}
                    <div className="w-[150%] h-[1px] bg-slate-600 absolute -rotate-12 top-1/3 -left-1/4"></div>
                  </div>

                  {/* Visual Landmarks */}
                  <span className="absolute top-4 left-6 text-[8px] font-mono text-slate-500 bg-slate-950/80 px-1 rounded">C21 Mall</span>
                  <span className="absolute bottom-6 right-8 text-[8px] font-mono text-slate-500 bg-slate-950/80 px-1 rounded">Brilliant Convention Centre</span>

                  {/* Marker Pin */}
                  <div className="absolute z-10 flex flex-col items-center">
                    <div className="p-1.5 bg-amber-500 rounded-full text-slate-950 shadow-lg animate-bounce">
                      <Sun className="w-4.5 h-4.5" />
                    </div>
                    <span className="bg-slate-950 border border-slate-850 px-2 py-0.5 rounded text-[9px] text-white font-mono font-bold mt-1 shadow-md">
                      INFINITY SOLAR
                    </span>
                  </div>

                </div>

                <p className="text-[10px] text-slate-500 leading-relaxed font-mono">
                  *Located near central Vijay Nagar intersections. Visit our showroom for live physical demonstrations of Hybrid inverters and Monocrystalline technology.
                </p>
              </div>

            </div>

            {/* Right Side: Inquiry Form */}
            <div className="lg:col-span-7 bg-slate-900/30 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white">Quick Inquiry Form</h3>
                <p className="text-xs text-slate-400">
                  Fill in your basic information and our team will prepare your primary quotation.
                </p>
              </div>

              {submitted ? (
                <div className="text-center py-12 space-y-4 border border-dashed border-emerald-500/30 bg-emerald-500/5 rounded-2xl">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                  <div className="space-y-1">
                    <h4 className="text-white font-bold text-lg">Thank You! Inquiry Received</h4>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Your interest in switching to solar has been registered. An Infinity representative from Vijay Nagar will reach out to schedule a physical survey.
                    </p>
                  </div>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-5 py-2 bg-slate-850 hover:bg-slate-800 text-xs font-semibold text-white rounded-lg transition-colors cursor-pointer"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="e.g. Amit Patel"
                        className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Phone Line</label>
                      <input
                        type="tel"
                        required
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="e.g. +91 99999 88888"
                        className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                      <input
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="e.g. amit@gmail.com"
                        className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">System Interest</label>
                      <select
                        value={contactType}
                        onChange={(e) => setContactType(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:ring-1 focus:ring-amber-500"
                      >
                        <option value="on-grid">On-Grid (Best utility savings)</option>
                        <option value="off-grid">Off-Grid (Independent battery backup)</option>
                        <option value="hybrid">Hybrid (Savings + smart backup)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Approximate Monthly Electricity Bill (INR) &mdash; Optional</label>
                    <input
                      type="number"
                      value={contactBill}
                      onChange={(e) => setContactBill(e.target.value)}
                      placeholder="e.g. 4500"
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Detailed message or address</label>
                    <textarea
                      rows={4}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="e.g. Looking to install a 3 kW system for our domestic roof in Vijay Nagar. Please coordinate a site audit."
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? 'Submitting Details...' : 'Submit Inquiry'}</span>
                  </button>

                  {error && (
                    <p className="text-xs text-red-400 font-mono text-center">{error}</p>
                  )}
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <section className="py-20 bg-slate-950 border-t border-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3">
            <span className="text-xs text-amber-400 uppercase tracking-widest font-mono font-bold block">Support & Answers</span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Solar Queries Answered</h2>
          </div>

          <div className="space-y-4 divide-y divide-slate-900">
            {IndoreFAQs.map((faq, idx) => (
              <div key={idx} className="pt-4 first:pt-0 space-y-1.5 text-left">
                <h4 className="text-sm font-bold text-white flex items-start gap-2">
                  <span className="text-amber-400 font-mono">Q.</span>
                  <span>{faq.q}</span>
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed pl-5">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 border-t border-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pb-8 border-b border-slate-900">
            
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-500 rounded-xl">
                <Sun className="w-5 h-5 text-slate-950" />
              </div>
              <div>
                <span className="block text-lg font-bold tracking-tight text-white leading-none">
                  INFINITY SOLAR
                </span>
                <span className="block text-[9px] font-mono tracking-widest text-amber-400 uppercase mt-0.5">
                  POWER SYSTEM
                </span>
              </div>
            </div>

            {/* Links */}
            <div className="flex flex-wrap gap-6 text-xs text-slate-400 font-medium">
              <a href="#home" className="hover:text-amber-400 transition-colors">Home</a>
              <a href="#about" className="hover:text-amber-400 transition-colors">About Us</a>
              <a href="#services" className="hover:text-amber-400 transition-colors">Services</a>
              <a href="#products" className="hover:text-amber-400 transition-colors">Products</a>
              <a href="#why-choose-us" className="hover:text-amber-400 transition-colors">Why Us</a>
              <a href="#contact" className="hover:text-amber-400 transition-colors">Contact</a>
            </div>

            {/* Portal access & Social */}
            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/infinity_solar_power_system?igsh=NWNud2N3cGo4aXhm"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-amber-400 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                title="Follow us on Instagram"
              >
                <Instagram className="w-3.5 h-3.5 text-amber-400" />
                <span>Instagram</span>
              </a>

              <button
                onClick={() => setIsAdminOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-amber-400" />
                <span>Lead Portal</span>
              </button>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-slate-500 font-mono">
            <span>&copy; {new Date().getFullYear()} Infinity Solar Power System. All rights reserved.</span>
            <div className="flex gap-4">
              <span>Vijay Nagar, Indore</span>
              <span>Available 24 Hours / 7 Days</span>
            </div>
          </div>

        </div>
      </footer>

      {/* OVERLAY MODALS & DRAWERS */}
      <SolarCalculator 
        isOpen={isCalculatorOpen} 
        onClose={() => setIsCalculatorOpen(false)} 
        onSubmitInquiry={(calc, bill, area) => {
          // Calculator handles its own submission inside its component
        }}
      />

      <AdminDashboard 
        isOpen={isAdminOpen} 
        onClose={() => setIsAdminOpen(false)} 
      />

      {/* Floating Chatbot */}
      <SolarChatbot />

    </div>
  );
}
