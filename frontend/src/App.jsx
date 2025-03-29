import React from 'react';
import changeimg from './assets/changes_show.png';
import beforesegmented from './assets/before_segmented.jpg';
import after from './assets/after.png';
function App() {
  return (
    <div className="font-sans text-gray-800">
      {/* Navigation - Improved contrast and accessibility */}
      <header className="bg-blue-900 text-white sticky top-0  shadow-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold tracking-tight">RiverWatch</h1>
            <nav className="hidden md:block">
              <ul className="flex space-x-8 z-50">
                <li><a href="#home" className="font-medium text-white hover:text-blue-300 transition-colors">Home</a></li>
                <li><a href="#about" className="font-medium text-white hover:text-blue-300 transition-colors">About</a></li>
                <li><a href="#methodology" className="font-medium text-white hover:text-blue-300 transition-colors">Methodology</a></li>
                <li><a href="#results" className="font-medium text-white hover:text-blue-300 transition-colors">Results</a></li>
                <li><a href="#future" className="font-medium text-white hover:text-blue-300 transition-colors">Future Scope</a></li>
                <li><a href="#contact" className="font-medium text-white hover:text-blue-300 transition-colors">Contact</a></li>
              </ul>
            </nav>

            {/* Mobile menu button */}
            <button className="md:hidden text-white focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
          {/* Mobile menu - hidden by default */}
          <div className="md:hidden mt-4 hidden">
            <ul className="flex flex-col space-y-3">
              <li><a href="#home" className="block font-medium hover:text-blue-300 transition-colors py-2">Home</a></li>
              <li><a href="#about" className="block font-medium hover:text-blue-300 transition-colors py-2">About</a></li>
              <li><a href="#methodology" className="block font-medium hover:text-blue-300 transition-colors py-2">Methodology</a></li>
              <li><a href="#results" className="block font-medium hover:text-blue-300 transition-colors py-2">Results</a></li>
              <li><a href="#future" className="block font-medium hover:text-blue-300 transition-colors py-2">Future Scope</a></li>
              <li><a href="#contact" className="block font-medium hover:text-blue-300 transition-colors py-2">Contact</a></li>
            </ul>
          </div>
        </div>
      </header>

      {/* Hero Section - Modernized with better visual hierarchy and call to action */}
      <section id="home" className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-pattern-grid"></div>
        </div>
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl">
            <span className="inline-block px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full mb-6">Research Project</span>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">Advanced River Monitoring System</h2>
            <p className="text-xl max-w-2xl mb-8 text-blue-100">Using satellite imagery and AI to track water level changes and predict natural disasters with unprecedented accuracy.</p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-white text-blue-900 py-3 px-8 rounded-lg transition-all hover:bg-blue-100 font-medium shadow-lg hover:shadow-xl">View Research</button>
              <button className="bg-transparent border-2 border-white text-white py-3 px-8 rounded-lg transition-all hover:bg-white/10 font-medium">Watch Demo</button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar - New section to add credibility */}
      <section className="bg-white py-8 shadow-md">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-blue-900">92%</p>
              <p className="text-gray-600">Prediction Accuracy</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-900">5+</p>
              <p className="text-gray-600">Rivers Monitored</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-900">14k+</p>
              <p className="text-gray-600">Satellite Images Analyzed</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-900">7</p>
              <p className="text-gray-600">Research Publications</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 bg-gray-50">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6 text-blue-900">About Our Research</h2>
              <p className="mb-4 text-lg">Our research leverages cutting-edge satellite technology and machine learning algorithms to monitor rivers worldwide. By analyzing temporal changes in water bodies, we can identify patterns that precede natural disasters.</p>
              <p className="mb-6 text-lg">This innovative approach enables early detection of abnormal water level fluctuations, providing crucial time for disaster preparedness and response.</p>
              {/* <div className="flex gap-4 items-center">
                <div className="h-1 w-12 bg-blue-500"></div>
                <p className="text-blue-800 font-medium">Founded in 2023 at Global Hydrology Institute</p>
              </div> */}
            </div>
            <div className="md:w-1/2 rounded-xl overflow-hidden shadow-xl">
              <img src={changeimg} alt="Satellite image analysis of river" className="w-full h-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section id="methodology" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-6 text-blue-900">Our Scientific Methodology</h2>
            <p className="text-lg text-gray-700">We employ a rigorous four-stage approach to ensure accurate water level monitoring and reliable prediction of natural disasters.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <span className="text-3xl">🛰️</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-blue-900">Satellite Imagery</h3>
              <p className="text-gray-700">Collection and processing of high-resolution satellite images of river systems at specified time intervals</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <span className="text-3xl">🧠</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-blue-900">Image Segmentation</h3>
              <p className="text-gray-700">Advanced AI algorithms precisely identify water bodies and measure their boundaries within the collected images</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-blue-900">Comparative Analysis</h3>
              <p className="text-gray-700">Statistical methods to quantify differences in water levels between temporal images and identify significant changes</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <span className="text-3xl">🌦️</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-blue-900">Climate Correlation</h3>
              <p className="text-gray-700">Cross-referencing water level changes with climate data to establish predictive models for natural disasters</p>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section id="results" className="py-20 px-6 bg-blue-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16 text-blue-900">Research Results</h2>
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

      {/* Future Scope Section */}
      <section id="future" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-6 text-blue-900">Future Research Directions</h2>
            <p className="text-lg text-gray-700">Our ongoing research aims to expand into predictive modeling for various natural disasters and environmental changes:</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-800 to-blue-900 text-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Flood Prediction</h3>
              <p className="text-blue-100">Early warning systems for potential flooding events based on rapid water level increases</p>
            </div>
            <div className="bg-gradient-to-br from-blue-800 to-blue-900 text-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Drought Monitoring</h3>
              <p className="text-blue-100">Tracking decreasing water levels to identify regions at risk of drought and water scarcity</p>
            </div>
            <div className="bg-gradient-to-br from-blue-800 to-blue-900 text-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Volcanic Activity</h3>
              <p className="text-blue-100">Detecting unusual water level patterns in rivers near volcanic regions as early warning signs</p>
            </div>
            <div className="bg-gradient-to-br from-blue-800 to-blue-900 text-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Climate Change Impact</h3>
              <p className="text-blue-100">Long-term monitoring to assess the impact of climate change on river ecosystems and water resources</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 bg-gray-50">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-blue-900">Contact Our Research Team</h2>
            <p className="text-center text-lg mb-12 text-gray-700">Have questions about our research or interested in collaboration? Get in touch with our team.</p>
            <form className="bg-white p-8 rounded-xl shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block mb-2 font-medium text-gray-700">Full Name</label>
                  <input type="text" id="name" placeholder="Your Name" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" />
                </div>
                <div>
                  <label htmlFor="email" className="block mb-2 font-medium text-gray-700">Email Address</label>
                  <input type="email" id="email" placeholder="Your Email" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" />
                </div>
              </div>
              <div className="mb-6">
                <label htmlFor="subject" className="block mb-2 font-medium text-gray-700">Subject</label>
                <input type="text" id="subject" placeholder="Subject" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" />
              </div>
              <div className="mb-6">
                <label htmlFor="message" className="block mb-2 font-medium text-gray-700">Message</label>
                <textarea id="message" rows="5" placeholder="Your Message" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"></textarea>
              </div>
              <button type="submit" className="bg-blue-800 hover:bg-blue-900 text-white py-3 px-8 rounded-lg transition-colors font-medium w-full shadow-lg">Send Message</button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-12 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold mb-2">RiverWatch</h2>
              <p className="text-blue-200">Advanced River Monitoring Research Project</p>
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-blue-200 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                </svg>
              </a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors">
                <span className="sr-only">GitHub</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
                </svg>
              </a>
            </div>
          </div>
          <div className="border-t border-blue-800 mt-8 pt-8 text-center">
            <p className="text-blue-200">&copy; 2025 RiverWatch Research Project. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;