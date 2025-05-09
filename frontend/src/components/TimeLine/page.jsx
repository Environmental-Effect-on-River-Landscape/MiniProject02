import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from "recharts";
import img1 from "../../assets/river_jan_21.png";
import img2 from "../../assets/river_march_25.png";
import img3 from "../../assets/river_may_23.png";
import img4 from "../../assets/river_nov_2018.png";
import img5 from "../../assets/river(10-11-22).png";
import beforesegmented from '../../assets/before_segmented.jpg';
import after from '../../assets/after.png';
import RiverBarChart from "../Env_Factors/Page";

const riverData = [
    {
        date: "Jan 2023",
        imageUrl: img1,
        area: "1250 sq.km",
        factors: {
            temperature_2m_max: "30°C",
            temperature_2m_min: "15°C",
            precipitation_sum: "80mm",
            pressure_msl_mean: "1010 hPa",
            rain_sum: "60mm",
        },
        explanation: "High precipitation caused the river to swell noticeably.",
        areaValue: 1250,
        color: "#3498db"
    },
    {
        date: "Mar 2025",
        imageUrl: img2,
        area: "1230 sq.km",
        factors: {
            temperature_2m_max: "35°C",
            temperature_2m_min: "20°C",
            precipitation_sum: "20mm",
            pressure_msl_mean: "1005 hPa",
            rain_sum: "15mm",
        },
        explanation: "Temperature rise caused some evaporation, reducing the size.",
        areaValue: 1230,
        color: "#2ecc71"
    },
    {
        date: "May 2023",
        imageUrl: img3,
        area: "1180 sq.km",
        factors: {
            temperature_2m_max: "40°C",
            temperature_2m_min: "25°C",
            precipitation_sum: "5mm",
            pressure_msl_mean: "1000 hPa",
            rain_sum: "2mm",
        },
        explanation: "Minimal rain and high heat significantly reduced water volume.",
        areaValue: 1180,
        color: "#e74c3c"
    },
    {
        date: "Nov 2018",
        imageUrl: img4,
        area: "1280 sq.km",
        factors: {
            temperature_2m_max: "32°C",
            temperature_2m_min: "22°C",
            precipitation_sum: "120mm",
            pressure_msl_mean: "1008 hPa",
            rain_sum: "100mm",
        },
        explanation: "Heavy monsoon rains refilled the river volume.",
        areaValue: 1280,
        color: "#9b59b6"
    },
    {
        date: "Nov 2022",
        imageUrl: img5,
        area: "1205 sq.km",
        factors: {
            temperature_2m_max: "25°C",
            temperature_2m_min: "10°C",
            precipitation_sum: "40mm",
            pressure_msl_mean: "1015 hPa",
            rain_sum: "30mm",
        },
        explanation: "Post-monsoon dryness slightly reduced water coverage.",
        areaValue: 1205,
        color: "#f39c12"
    },
];

// Custom active shape for pie chart
const renderActiveShape = (props) => {
    const {
        cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload
    } = props;

    return (
        <g>
            <text x={cx} y={cy - 10} dy={8} textAnchor="middle" fill="#333" fontSize="20" fontWeight="bold">
                {payload.date}
            </text>
            <text x={cx} y={cy + 10} dy={8} textAnchor="middle" fill="#666">
                {payload.area}
            </text>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius + 10}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
            />
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={outerRadius + 15}
                outerRadius={outerRadius + 20}
                fill={fill}
            />
        </g>
    );
};

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo and Brand */}
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <span className={`h-10 w-10 flex items-center justify-center rounded-full ${scrolled ? 'bg-blue-600' : 'bg-blue-500'
                                } text-white font-bold text-xl`}>
                                R
                            </span>
                        </div>
                        <div className="ml-3">
                            <span className={`font-bold text-xl ${scrolled ? 'text-blue-800' : 'text-white'
                                } transition-colors duration-300`}>
                                RiverWatch
                            </span>
                            <span className={`ml-2 text-sm ${scrolled ? 'text-blue-600' : 'text-blue-200'
                                } transition-colors duration-300`}>
                                Research Portal
                            </span>
                        </div>
                    </div>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex md:items-center md:space-x-8">
                        <a href="#overview" className={`${scrolled ? 'text-gray-700 hover:text-blue-700' : 'text-white hover:text-blue-200'
                            } transition-colors duration-300 font-medium`}>
                            Overview
                        </a>
                        <a href="#visualizations" className={`${scrolled ? 'text-gray-700 hover:text-blue-700' : 'text-white hover:text-blue-200'
                            } transition-colors duration-300 font-medium`}>
                            Visualizations
                        </a>
                        <a href="#timeline" className={`${scrolled ? 'text-gray-700 hover:text-blue-700' : 'text-white hover:text-blue-200'
                            } transition-colors duration-300 font-medium`}>
                            Timeline
                        </a>
                        <a href="#analysis" className={`${scrolled ? 'text-gray-700 hover:text-blue-700' : 'text-white hover:text-blue-200'
                            } transition-colors duration-300 font-medium`}>
                            Analysis
                        </a>
                        <a href="#results" className={`${scrolled ? 'text-gray-700 hover:text-blue-700' : 'text-white hover:text-blue-200'
                            } transition-colors duration-300 font-medium`}>
                            Results
                        </a>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            type="button"
                            className={`inline-flex items-center justify-center p-2 rounded-md ${scrolled ? 'text-gray-700 hover:text-blue-700 hover:bg-gray-100' : 'text-white hover:text-blue-200 hover:bg-blue-700'
                                } transition-colors duration-300`}
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            <span className="sr-only">Open main menu</span>
                            {/* Icon when menu is closed */}
                            <svg
                                className={`${mobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                            {/* Icon when menu is open */}
                            <svg
                                className={`${mobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu, show/hide based on menu state. */}
            <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden`}>
                <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-lg rounded-b-lg">
                    <a href="#overview" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-700 hover:bg-blue-50">
                        Overview
                    </a>
                    <a href="#visualizations" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-700 hover:bg-blue-50">
                        Visualizations
                    </a>
                    <a href="#timeline" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-700 hover:bg-blue-50">
                        Timeline
                    </a>
                    <a href="#analysis" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-700 hover:bg-blue-50">
                        Analysis
                    </a>
                    <a href="#results" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-700 hover:bg-blue-50">
                        Results
                    </a>
                </div>
            </div>
        </nav>
    );
};

const Hero = () => {
    return (
        <div className="relative">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 bg-cover bg-center" style={{
                backgroundImage: `url(${img4})`,
                filter: 'brightness(0.5)',
                height: '70vh'
            }}></div>

            {/* Content */}
            <div className="relative min-h-[70vh] flex items-center justify-center">
                <div className="text-center px-4 py-16 max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in-down">
                        River Evolution Analysis
                    </h1>
                    <p className="text-xl md:text-2xl text-blue-100 mb-8 animate-fade-in-up">
                        Tracking and analyzing the temporal changes in river systems using advanced satellite imaging and environmental data
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 animate-fade-in">
                        <a href="#visualizations" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                            View Visualizations
                        </a>
                        <a href="#results" className="bg-transparent hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg border-2 border-white hover:border-blue-700 transition-all duration-300 transform hover:scale-105">
                            View Research Results
                        </a>
                    </div>

                    {/* Quick Stats */}
                    <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg p-2 rounded-lg">
                            <div className="text-3xl font-bold text-white">5</div>
                            <div className="text-blue-800">Time Periods</div>
                        </div>
                        <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg p-2 rounded-lg">
                            <div className="text-3xl font-bold text-white">1,280</div>
                            <div className="text-blue-800">Max Area (sq.km)</div>
                        </div>
                        <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg p-2 rounded-lg">
                            <div className="text-3xl font-bold text-white">92%</div>
                            <div className="text-blue-800">Detection Accuracy</div>
                        </div>
                        <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg p-2 rounded-lg">
                            <div className="text-3xl font-bold text-white">7</div>
                            <div className="text-blue-800">Years of Data</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Wave Divider */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-16">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.11,140.83,111.94,213.34,95.09c56.25-13.32,111.62-30.03,174-32.77A600.21,600.21,0,0,1,321.39,56.44Z" className="fill-blue-50"></path>
                </svg>
            </div>
        </div>
    );
};

const RiverTimeline = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [selectedImage, setSelectedImage] = useState(riverData[0]);

    const onPieEnter = (_, index) => {
        setActiveIndex(index);
        setSelectedImage(riverData[index]);
    };

    return (
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
            <Navbar />
            <Hero />

            <div id="overview" className="pt-20"></div>
            <div className="max-w-6xl mx-auto px-6 py-16">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-blue-800 mb-4">Comprehensive River Analysis</h2>
                    <div className="h-1 w-24 bg-blue-600 mx-auto mb-6"></div>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Our research tracks changes in river systems over time by analyzing satellite imagery and correlating with environmental factors including temperature, precipitation, and atmospheric pressure.
                    </p>
                </div>

                <section id="visualizations" className="py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left side - Chart */}
                        <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center">
                            <h2 className="text-2xl font-semibold mb-4 text-blue-700">River Area Distribution</h2>
                            <div className="w-full h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            activeIndex={activeIndex}
                                            activeShape={renderActiveShape}
                                            data={riverData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={90}
                                            outerRadius={120}
                                            dataKey="areaValue"
                                            onMouseEnter={onPieEnter}
                                        >
                                            {riverData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex justify-center mt-4 space-x-2">
                                {riverData.map((entry, index) => (
                                    <button
                                        key={`btn-${index}`}
                                        className={`w-4 h-4 rounded-full ${activeIndex === index ? 'ring-2 ring-offset-2' : ''}`}
                                        style={{ backgroundColor: entry.color }}
                                        onClick={() => {
                                            setActiveIndex(index);
                                            setSelectedImage(riverData[index]);
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Right side - Selected image and details */}
                        <div className="bg-white p-6 rounded-2xl shadow-lg">
                            <h2 className="text-2xl font-semibold mb-4 text-blue-700">{selectedImage.date} Details</h2>
                            <div className="relative overflow-hidden rounded-xl mb-4 shadow-md">
                                <img
                                    src={selectedImage.imageUrl}
                                    alt={`River in ${selectedImage.date}`}
                                    className="w-full h-64 object-cover"
                                />
                                <div className="absolute top-0 right-0 bg-blue-800 text-white font-bold px-3 py-1 rounded-bl-lg">
                                    {selectedImage.date}
                                </div>
                            </div>

                            <div className="p-4 bg-blue-50 rounded-lg mb-4">
                                <h3 className="font-semibold mb-2 text-blue-800">Key Factors:</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {Object.entries(selectedImage.factors).map(([key, val]) => (
                                        <div key={key} className="flex items-center">
                                            <div className="w-3 h-3 rounded-full bg-blue-600 mr-2"></div>
                                            <span className="text-sm text-gray-700">
                                                <span className="font-medium">{key.replace(/_/g, " ")}:</span> {val}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-blue-800 text-white p-4 rounded-lg">
                                <h3 className="font-semibold mb-2">Analysis:</h3>
                                <p>{selectedImage.explanation}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Timeline section */}
                <section id="timeline" className="py-16">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-blue-800">River Evolution Timeline</h2>
                        <div className="h-1 w-24 bg-blue-600 mx-auto mt-4"></div>
                    </div>

                    <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-blue-300 -translate-y-1/2"></div>

                        <div className="flex justify-between relative">
                            {/* Sort data chronologically for timeline display */}
                            {[...riverData].sort((a, b) => {
                                const yearA = parseInt(a.date.split(" ")[1]);
                                const yearB = parseInt(b.date.split(" ")[1]);
                                return yearA - yearB;
                            }).map((data, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col items-center"
                                    onClick={() => {
                                        // Find the original index in riverData
                                        const originalIndex = riverData.findIndex(item => item.date === data.date);
                                        setActiveIndex(originalIndex);
                                        setSelectedImage(riverData[originalIndex]);
                                    }}
                                >
                                    <div
                                        className={`w-6 h-6 rounded-full z-10 cursor-pointer transition-all duration-300 ${selectedImage.date === data.date ? 'w-8 h-8 bg-blue-600' : 'bg-blue-400 hover:bg-blue-500'}`}
                                        style={{ borderColor: data.color, borderWidth: '3px' }}
                                    ></div>
                                    <div className={`mt-2 font-medium ${selectedImage.date === data.date ? 'text-blue-700' : 'text-blue-500'}`}>
                                        {data.date}
                                    </div>
                                    <div className="hidden md:flex items-center justify-center mt-4">
                                        <img
                                            src={data.imageUrl}
                                            alt={`River in ${data.date}`}
                                            className={`w-24 h-16 object-cover rounded-lg shadow-md transition-all duration-300 ${selectedImage.date === data.date ? 'w-28 h-20 ring-2 ring-blue-500' : 'opacity-70 hover:opacity-100'}`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* All detailed explanations */}
                <section id="analysis" className="py-16">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-blue-800">Detailed Analysis</h2>
                        <div className="h-1 w-24 bg-blue-600 mx-auto mt-4"></div>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-4">
                            Comprehensive analysis of river conditions across different time periods with correlation between environmental factors and water area coverage.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Sort data chronologically for detailed analysis section */}
                        {[...riverData].sort((a, b) => {
                            const yearA = parseInt(a.date.split(" ")[1]);
                            const yearB = parseInt(b.date.split(" ")[1]);
                            return yearA - yearB;
                        }).map((data, index) => (
                            <div
                                key={index}
                                className="bg-white p-6 rounded-xl shadow-lg border-t-4 hover:shadow-xl transition-shadow duration-300"
                                style={{ borderColor: data.color }}
                                onClick={() => {
                                    // Find the original index in riverData
                                    const originalIndex = riverData.findIndex(item => item.date === data.date);
                                    setActiveIndex(originalIndex);
                                    setSelectedImage(riverData[originalIndex]);
                                }}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-bold text-xl text-gray-800">{data.date}</h3>
                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                                        {data.area}
                                    </span>
                                </div>

                                <div className="mb-4 overflow-hidden rounded-lg">
                                    <img
                                        src={data.imageUrl}
                                        alt={`River in ${data.date}`}
                                        className="w-full h-40 object-cover hover:scale-105 transition-transform duration-300"
                                    />
                                </div>

                                <div className="bg-gray-50 p-3 rounded-lg mb-4">
                                    <h4 className="font-medium text-gray-700 mb-2">Environmental Factors:</h4>
                                    <ul className="space-y-1">
                                        {Object.entries(data.factors).map(([key, val]) => (
                                            <li key={key} className="text-sm flex items-center">
                                                <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: data.color }}></span>
                                                <span className="font-medium">{key.replace(/_/g, " ")}:</span>
                                                <span className="ml-1 text-gray-600">{val}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="bg-blue-50 p-3 rounded-lg">
                                    <h4 className="font-medium text-blue-800 mb-1">Analysis:</h4>
                                    <p className="text-sm text-gray-700">{data.explanation}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <section id="results" className="py-20 px-6 bg-blue-50">
                <div className="container mx-auto">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-blue-900">Research Results</h2>
                        <div className="h-1 w-24 bg-blue-600 mx-auto mt-4 mb-8"></div>
                    </div>

                    <div className="mb-16">
                        <div className="flex flex-col md:flex-row justify-center gap-8 mb-12">
                            <div className="bg-white p-6 rounded-xl shadow-lg text-center flex-1">
                                <h4 className="text-lg font-bold mb-4 text-blue-900">Before Image Segmentation</h4>
                                <div className="rounded-lg overflow-hidden">
                                    <img src={beforesegmented} alt="River before flood" className="w-full h-auto" />
                                </div>
                                <p className="mt-4 text-gray-700">Normal water levels recorded on Dec 01, 2024</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-lg text-center flex-1">
                                <h4 className="text-lg font-bold mb-4 text-blue-900">After Segmentation</h4>
                                <div className="rounded-lg overflow-hidden">
                                    <img src={after} alt="River during flood" className="w-full h-auto" />
                                </div>
                                <p className="mt-4 text-gray-700">Water area detected with the Area</p>
                            </div>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-lg">
                            <h3 className="text-2xl font-bold mb-6 text-blue-900">Key Research Findings</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <ul className="space-y-4">
                                        <li className="flex gap-3">
                                            <div className="flex-shrink-0 text-blue-500">✓</div>
                                            <p>Detected significant water level variations with 92% accuracy in monitored rivers</p>
                                        </li>
                                        <li className="flex gap-3">
                                            <div className="flex-shrink-0 text-blue-500">✓</div>
                                            <p>Established correlation between rapid water level changes and precipitation patterns</p>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <ul className="space-y-4">
                                        <li className="flex gap-3">
                                            <div className="flex-shrink-0 text-blue-500">✓</div>
                                            <p>Developed an algorithm to differentiate between normal seasonal changes and abnormal fluctuations</p>
                                        </li>
                                        <li className="flex gap-3">
                                            <div className="flex-shrink-0 text-blue-500">✓</div>
                                            <p>Created a classification system for risk assessment based on water level dynamics</p>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="py-16 max-w-6xl mx-auto px-6">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-blue-800">Environmental Factors Analysis</h2>
                    <div className="h-1 w-24 bg-blue-600 mx-auto mt-4 mb-6"></div>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Interactive data visualization of key environmental factors affecting river water levels over time.
                    </p>
                </div>
                <RiverBarChart />
            </div>
        </div>
    );
}
export default RiverTimeline;