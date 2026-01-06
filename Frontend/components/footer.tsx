"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  CreditCard,
  Shield,
  Truck,
  ArrowUp
} from "lucide-react"

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const footerLinks = {
    "Get to Know Us": [
      { name: "About Us", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Press Releases", href: "/press" },
      { name: "LMM Cares", href: "/cares" },
      { name: "Gift a Smile", href: "/gift" }
    ],
    "Make Money with Us": [
      { name: "Sell on LMM", href: "/sell" },
      { name: "Become an Affiliate", href: "/affiliate" },
      { name: "Advertise Your Products", href: "/advertise" },
      { name: "LMM Pay on Merchants", href: "/pay-merchants" }
    ],
    "LMM Payment Products": [
      { name: "LMM Business Card", href: "/business-card" },
      { name: "Shop with Points", href: "/points" },
      { name: "Reload Your Balance", href: "/reload" },
      { name: "LMM Currency Converter", href: "/currency" }
    ],
    "Let Us Help You": [
      { name: "Your Account", href: "/account" },
      { name: "Your Orders", href: "/orders" },
      { name: "Shipping Rates & Policies", href: "/shipping" },
      { name: "Returns & Replacements", href: "/returns" },
      { name: "Help", href: "/help" }
    ]
  }

  const paymentMethods = [
    "Visa", "Mastercard", "American Express", "PayPal", "UPI", "Net Banking"
  ]

  return (
    <footer className="bg-muted border-t border-border">
      {/* Back to Top */}
      <motion.div
        className="bg-card hover:bg-accent transition-colors cursor-pointer border-b border-border"
        onClick={scrollToTop}
        whileHover={{ backgroundColor: "hsl(var(--accent))" }}
      >
        <div className="max-w-7xl mx-auto px-4 py-4 text-center">
          <div className="flex items-center justify-center gap-2 text-sm font-medium text-foreground">
            <ArrowUp className="w-4 h-4" />
            Back to top
          </div>
        </div>
      </motion.div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <Link href="/" className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-orange-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">LM</span>
                </div>
                <div>
                  <span className="font-bold text-xl text-foreground">Lalitha Mega Mall</span>
                  <div className="text-xs text-muted-foreground">Your Shopping Destination</div>
                </div>
              </Link>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                Your trusted online shopping destination with millions of products, 
                competitive prices, and exceptional customer service.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4 text-orange-500" />
                  <span>+91 1800-123-4567</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4 text-orange-500" />
                  <span>support@lalithamegamall.com</span>
                </div>
                <div className="flex items-start gap-3 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 text-orange-500 mt-0.5" />
                  <span>123 Shopping Street, Commerce City, India 560001</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links], index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <h3 className="font-semibold text-foreground mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-orange-400 transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 pt-8 border-t border-border"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Stay Updated</h3>
              <p className="text-gray-400 text-sm">
                Subscribe to our newsletter for exclusive deals and latest updates.
              </p>
            </div>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
              />
              <motion.button
                className="px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-xl font-medium hover:from-orange-700 hover:to-orange-600 transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Social Media & Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 pt-8 border-t border-gray-800"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Social Media */}
            <div>
              <h3 className="font-semibold mb-4">Follow Us</h3>
              <div className="flex gap-4">
                {[
                  { icon: Facebook, href: "#", color: "hover:text-blue-500" },
                  { icon: Twitter, href: "#", color: "hover:text-sky-500" },
                  { icon: Instagram, href: "#", color: "hover:text-pink-500" },
                  { icon: Youtube, href: "#", color: "hover:text-red-500" }
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    className={`w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center text-gray-400 ${social.color} transition-colors`}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Truck className="w-6 h-6 text-orange-500" />
                </div>
                <div className="text-xs text-gray-400">Free Shipping</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Shield className="w-6 h-6 text-orange-500" />
                </div>
                <div className="text-xs text-gray-400">Secure Payment</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <CreditCard className="w-6 h-6 text-orange-500" />
                </div>
                <div className="text-xs text-gray-400">Easy Returns</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-950 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-400">
              © 2024 Lalitha Mega Mall. All rights reserved. | 
              <Link href="/privacy" className="hover:text-orange-400 transition-colors ml-1">Privacy Policy</Link> | 
              <Link href="/terms" className="hover:text-orange-400 transition-colors ml-1">Terms of Service</Link>
            </div>
            
            {/* Payment Methods */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400 mr-2">We accept:</span>
              {paymentMethods.map((method, index) => (
                <div
                  key={method}
                  className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-300 border border-gray-700"
                >
                  {method}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}