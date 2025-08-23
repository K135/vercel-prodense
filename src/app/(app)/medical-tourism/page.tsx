import { ApplicationLayout } from '../application-layout'
import SectionPatientFlow from '@/components/SectionPatientFlow'

export default function MedicalTourismPage() {
  return (
    <ApplicationLayout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#0480ea]/10 to-[#f07499]/10 py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              World-Class Dental Care
              <span className="block text-[#0480ea]">In India&apos;s Tourist Destinations</span>
            </h1>
            <p className="text-xl text-gray-600 mb-4 max-w-3xl mx-auto">
              Experience premium dental treatments in beautiful tourist cities across India. 
              Skip the metro cities and get your dental care where your vacation begins.
            </p>
            <p className="text-2xl font-bold text-[#f07499] mb-8">
              &quot;Smile. And Show-Up&quot;
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-[#0480ea] to-[#f07499] hover:from-[#0480ea]/90 hover:to-[#f07499]/90 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105">
                Get Free Consultation
              </button>
              <button className="border-2 border-[#0480ea] text-[#0480ea] hover:bg-[#0480ea] hover:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all">
                Browse Procedures
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                We provide comprehensive medical tourism services with a focus on quality, safety, and affordability.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center p-6 rounded-xl bg-[#0480ea]/10 hover:bg-[#0480ea]/20 transition-colors">
                <div className="w-16 h-16 bg-[#0480ea] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Certified Clinics</h3>
                <p className="text-gray-600">ISO & HIPAA certified dental facilities in tourist cities</p>
              </div>

              <div className="text-center p-6 rounded-xl bg-[#f07499]/10 hover:bg-[#f07499]/20 transition-colors">
                <div className="w-16 h-16 bg-[#f07499] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Cost Effective</h3>
                <p className="text-gray-600">Save up to 70% compared to metro city clinics</p>
              </div>

              <div className="text-center p-6 rounded-xl bg-green-50 hover:bg-green-100 transition-colors">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Tourist Destinations</h3>
                <p className="text-gray-600">Combine dental care with vacation in beautiful India</p>
              </div>

              <div className="text-center p-6 rounded-xl bg-orange-50 hover:bg-orange-100 transition-colors">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Community Support</h3>
                <p className="text-gray-600">Building like-mindedness over building likes</p>
              </div>
            </div>
          </div>
        </section>

        {/* Patient Flow Section */}
        <SectionPatientFlow className="bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800" />

        {/* Popular Procedures */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Popular Procedures</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Explore our most sought-after medical treatments and procedures.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { name: 'Dental Implants', description: 'Permanent tooth replacement solutions', image: '🦷' },
                { name: 'Teeth Whitening', description: 'Professional smile brightening', image: '✨' },
                { name: 'Root Canal Treatment', description: 'Advanced endodontic care', image: '🔧' },
                { name: 'Orthodontics', description: 'Braces and alignment solutions', image: '😁' },
                { name: 'Oral Surgery', description: 'Surgical dental procedures', image: '🏥' },
                { name: 'Cosmetic Dentistry', description: 'Smile makeover treatments', image: '💎' },
              ].map((procedure, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 border-l-4 border-[#0480ea]">
                  <div className="text-4xl mb-4">{procedure.image}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{procedure.name}</h3>
                  <p className="text-gray-600 mb-4">{procedure.description}</p>
                  <button className="text-[#0480ea] hover:text-[#f07499] font-medium transition-colors">
                    Learn More →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-[#0480ea] to-[#f07499] text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Start Your Dental Journey?</h2>
            <p className="text-xl mb-4 max-w-2xl mx-auto">
              Get personalized dental treatment recommendations and cost estimates from our experts in India&apos;s most beautiful destinations.
            </p>
            <p className="text-lg mb-8 italic">
              &quot;It is not the strength of the fight, it is the size of the bite.&quot;
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-[#0480ea] hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-all">
                Schedule Consultation
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-[#0480ea] px-8 py-4 rounded-lg font-semibold text-lg transition-all">
                Download Brochure
              </button>
            </div>
          </div>
        </section>
      </div>
    </ApplicationLayout>
  )
}