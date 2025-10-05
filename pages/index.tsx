import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Premium Hylam Sheets for Every Application
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl mb-8 max-w-3xl mx-auto text-blue-100">
              Industry-leading laminate solutions with advanced tracking and management systems
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard" className="bg-white text-blue-900 hover:bg-blue-50 font-bold py-4 px-8 rounded-lg text-lg transition transform hover:scale-105 shadow-xl">
                Go to Dashboard
              </Link>
              <Link href="/orders" className="bg-blue-700 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition transform hover:scale-105 shadow-xl border-2 border-white">
                Manage Orders
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-100 to-transparent"></div>
      </section>

      {/* Company Introduction */}
      <section className="bg-gray-100 py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              About Hylam Sheets
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto">
              Leading manufacturer of high-quality decorative and industrial laminates, serving diverse industries with innovative solutions and exceptional craftsmanship.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center transform hover:scale-105 transition">
              <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Years Experience</div>
              <p className="text-gray-600">Trusted expertise in laminate manufacturing</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center transform hover:scale-105 transition">
              <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Design Options</div>
              <p className="text-gray-600">Wide variety of textures and finishes</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center transform hover:scale-105 transition">
              <div className="text-4xl font-bold text-blue-600 mb-2">100%</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Quality Assured</div>
              <p className="text-gray-600">ISO certified manufacturing process</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="bg-white py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Our Product Range
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Premium laminates designed for various applications, from decorative interiors to heavy-duty industrial use
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition">
              <div className="relative h-48 bg-gray-200">
                <Image 
                  src="/images/product-decorative.svg" 
                  alt="Decorative Laminates" 
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Decorative Laminates</h3>
                <p className="text-gray-700 mb-4">
                  Elegant surfaces for furniture, cabinets, and interior applications with exceptional aesthetics
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✓ Wide range of designs and textures</li>
                  <li>✓ Scratch and stain resistant</li>
                  <li>✓ Easy to clean and maintain</li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition">
              <div className="relative h-48 bg-gray-200">
                <Image 
                  src="/images/product-industrial.svg" 
                  alt="Industrial Laminates" 
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Industrial Laminates</h3>
                <p className="text-gray-700 mb-4">
                  High-performance laminates for demanding environments and heavy-duty applications
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✓ Superior mechanical strength</li>
                  <li>✓ Chemical and heat resistant</li>
                  <li>✓ Electrical insulation properties</li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition">
              <div className="relative h-48 bg-gray-200">
                <Image 
                  src="/images/product-compact.svg" 
                  alt="Compact Laminates" 
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Compact Laminates</h3>
                <p className="text-gray-700 mb-4">
                  Self-supporting panels perfect for partitions, lockers, and exterior cladding
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✓ High impact resistance</li>
                  <li>✓ Moisture and water resistant</li>
                  <li>✓ Vandal-proof construction</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Applications Section */}
      <section className="bg-gray-50 py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Applications & Use Cases
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Our laminates are trusted across multiple industries for their durability, aesthetics, and performance
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
              <div className="relative h-40">
                <Image 
                  src="/images/application-furniture.svg" 
                  alt="Furniture Manufacturing" 
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Furniture Manufacturing</h3>
                <p className="text-gray-600 text-sm">Kitchen cabinets, wardrobes, office furniture, and modular units</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
              <div className="relative h-40">
                <Image 
                  src="/images/application-interior.svg" 
                  alt="Interior Design" 
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Interior Design</h3>
                <p className="text-gray-600 text-sm">Wall paneling, ceilings, decorative surfaces, and partitions</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
              <div className="relative h-40">
                <Image 
                  src="/images/application-commercial.svg" 
                  alt="Commercial Spaces" 
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Commercial Spaces</h3>
                <p className="text-gray-600 text-sm">Retail stores, hotels, restaurants, and office interiors</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Hylam Sheets
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Premium Quality</h3>
              <p className="text-gray-600 text-sm">Manufactured using state-of-the-art technology and premium materials</p>
            </div>

            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Timely Delivery</h3>
              <p className="text-gray-600 text-sm">Efficient logistics and inventory management for on-time delivery</p>
            </div>

            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Custom Solutions</h3>
              <p className="text-gray-600 text-sm">Tailored cutting and sizing to meet your specific requirements</p>
            </div>

            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Expert Support</h3>
              <p className="text-gray-600 text-sm">Technical assistance and consultation for optimal product selection</p>
            </div>
          </div>
        </div>
      </section>

      {/* Business Tracking Features Section */}
      <section className="bg-blue-900 text-white py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Advanced Business Tracking System
            </h2>
            <p className="text-lg text-blue-100 max-w-3xl mx-auto">
              Comprehensive digital tools to manage your sheet cutting operations efficiently
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Link href="/dashboard" className="bg-blue-800 hover:bg-blue-700 rounded-lg p-6 transition transform hover:scale-105">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="text-lg font-semibold mb-2">Dashboard</h3>
              <p className="text-sm text-blue-200">View summary statistics and charts</p>
            </Link>

            <Link href="/stock" className="bg-blue-800 hover:bg-blue-700 rounded-lg p-6 transition transform hover:scale-105">
              <div className="text-3xl mb-3">📦</div>
              <h3 className="text-lg font-semibold mb-2">Stock Management</h3>
              <p className="text-sm text-blue-200">Track material inventory and usage</p>
            </Link>

            <Link href="/orders" className="bg-blue-800 hover:bg-blue-700 rounded-lg p-6 transition transform hover:scale-105">
              <div className="text-3xl mb-3">📋</div>
              <h3 className="text-lg font-semibold mb-2">Orders</h3>
              <p className="text-sm text-blue-200">Manage customer orders and jobs</p>
            </Link>

            <Link href="/customers" className="bg-blue-800 hover:bg-blue-700 rounded-lg p-6 transition transform hover:scale-105">
              <div className="text-3xl mb-3">👥</div>
              <h3 className="text-lg font-semibold mb-2">Customers</h3>
              <p className="text-sm text-blue-200">Complete customer profiles</p>
            </Link>

            <Link href="/factories" className="bg-blue-800 hover:bg-blue-700 rounded-lg p-6 transition transform hover:scale-105">
              <div className="text-3xl mb-3">🏭</div>
              <h3 className="text-lg font-semibold mb-2">Factories</h3>
              <p className="text-sm text-blue-200">Supplier profiles and materials</p>
            </Link>

            <Link href="/purchases" className="bg-blue-800 hover:bg-blue-700 rounded-lg p-6 transition transform hover:scale-105">
              <div className="text-3xl mb-3">🛒</div>
              <h3 className="text-lg font-semibold mb-2">Purchases</h3>
              <p className="text-sm text-blue-200">Incoming stock tracking</p>
            </Link>

            <Link href="/leftovers" className="bg-blue-800 hover:bg-blue-700 rounded-lg p-6 transition transform hover:scale-105">
              <div className="text-3xl mb-3">♻️</div>
              <h3 className="text-lg font-semibold mb-2">Leftovers</h3>
              <p className="text-sm text-blue-200">Manage offcut pieces</p>
            </Link>

            <Link href="/visualizer" className="bg-blue-800 hover:bg-blue-700 rounded-lg p-6 transition transform hover:scale-105">
              <div className="text-3xl mb-3">🎨</div>
              <h3 className="text-lg font-semibold mb-2">Visualizer</h3>
              <p className="text-sm text-blue-200">Visualize cutting layouts</p>
            </Link>
          </div>

          <div className="bg-blue-800 rounded-lg p-6 sm:p-8">
            <h3 className="text-2xl font-bold mb-4">Key Features:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <span className="text-green-400 mr-3">✓</span>
                <span>End-to-end material traceability from factory to customer</span>
              </div>
              <div className="flex items-start">
                <span className="text-green-400 mr-3">✓</span>
                <span>Complete CRUD operations for all data entities</span>
              </div>
              <div className="flex items-start">
                <span className="text-green-400 mr-3">✓</span>
                <span>Excel-based data storage for easy backup and sharing</span>
              </div>
              <div className="flex items-start">
                <span className="text-green-400 mr-3">✓</span>
                <span>Real-time dashboard with charts and analytics</span>
              </div>
              <div className="flex items-start">
                <span className="text-green-400 mr-3">✓</span>
                <span>Leftover piece management and optimization</span>
              </div>
              <div className="flex items-start">
                <span className="text-green-400 mr-3">✓</span>
                <span>Visual sheet cutting layout planner</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Markers Section */}
      <section className="bg-gray-100 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
              Trusted by Leading Businesses
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="text-4xl font-bold text-blue-600 mb-2">ISO</div>
                <div className="text-sm text-gray-600">Certified Quality</div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="text-4xl font-bold text-blue-600 mb-2">5000+</div>
                <div className="text-sm text-gray-600">Happy Clients</div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
                <div className="text-sm text-gray-600">Support Available</div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="text-4xl font-bold text-blue-600 mb-2">Pan</div>
                <div className="text-sm text-gray-600">India Delivery</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg sm:text-xl mb-8 text-blue-100">
            Access our comprehensive business tracking system to manage your sheet cutting operations efficiently
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard" className="bg-white text-blue-900 hover:bg-blue-50 font-bold py-4 px-8 rounded-lg text-lg transition transform hover:scale-105 shadow-xl">
              Access Dashboard
            </Link>
            <Link href="/orders" className="bg-transparent hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition border-2 border-white">
              Start Managing Orders
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
