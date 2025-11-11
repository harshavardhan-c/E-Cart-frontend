"use client"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Award, Users, Truck, Heart } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar cartCount={0} onCartClick={() => {}} />

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">About Lalitha Mega Mall</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your trusted online destination for quality groceries, household items, and kitchen essentials in Tadipatri
          </p>
        </div>

        {/* Our Story */}
        <div className="grid md:grid-cols-2 gap-12 mb-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
            <p className="text-gray-600 mb-4">
              Founded in 2020, Lalitha Mega Mall started with a simple mission: to bring quality products and
              exceptional service to every household in Tadipatri. What began as a small local store has grown into a
              trusted online platform serving thousands of customers.
            </p>
            <p className="text-gray-600 mb-4">
              We believe in providing the best selection of groceries, kitchen items, household accessories, and more at
              competitive prices. Our commitment to quality and customer satisfaction has made us a household name.
            </p>
            <p className="text-gray-600">
              Today, we continue to innovate and expand our product range to meet the evolving needs of our customers.
            </p>
          </div>
          <div className="bg-gradient-to-br from-orange-100 to-orange-50 rounded-lg p-8 h-96 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl font-bold text-orange-600 mb-2">4+</div>
              <p className="text-gray-600">Years of Excellence</p>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why Choose Us</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Award, title: "Quality Products", desc: "Carefully selected items from trusted brands" },
              { icon: Truck, title: "Fast Delivery", desc: "Quick and reliable delivery to your doorstep" },
              { icon: Heart, title: "Customer Care", desc: "Dedicated support for all your needs" },
              { icon: Users, title: "Community", desc: "Trusted by thousands of happy customers" },
            ].map((item, idx) => {
              const Icon = item.icon
              return (
                <Card key={idx} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <Icon className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4 max-w-2xl mx-auto">
            {[
              {
                q: "What are your delivery timings?",
                a: "We deliver between 9 AM to 9 PM on all days. Express delivery is available for selected areas.",
              },
              {
                q: "Do you offer returns?",
                a: "Yes, we offer 7-day returns for most products. Please check individual product policies.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept Cash on Delivery, Credit/Debit Cards, and Digital Wallets.",
              },
              {
                q: "How can I track my order?",
                a: "You can track your order in real-time from your account dashboard.",
              },
            ].map((item, idx) => (
              <Card key={idx}>
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{item.q}</h3>
                  <p className="text-gray-600">{item.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
