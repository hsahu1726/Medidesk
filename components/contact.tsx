'use client';

import { Mail, Phone, Twitter } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';

export default function Contact() {
  const { ref, isVisible } = useScrollAnimation();
  
  const founders = [
    {
      name: 'Devansh Jain',
      role: 'Co-founder'
    },
    {
      name: 'Shourya Pratap Singh Chouhan',
      role: 'Co-founder'
    },
    {
      name: 'Yash Mittal',
      role: 'Co-founder'
    }
  ];

  return (
    <section ref={ref} id="contact" className="py-20 md:py-32 bg-primary/5 border-t border-border">
      <div className="container mx-auto px-4">
        <h2 className={`text-4xl md:text-5xl font-bold text-center mb-4 text-foreground transition-all duration-1000 ${isVisible ? 'animate-float' : 'opacity-0 translate-y-8'}`}>
          Get In <span className="text-primary">Touch</span>
        </h2>
        
        <p className={`text-center text-muted-foreground text-lg mb-16 max-w-2xl mx-auto transition-all duration-1000 delay-200 ${isVisible ? 'animate-float' : 'opacity-0 translate-y-8'}`} style={{ animationDelay: isVisible ? '0.2s' : '0s' }}>
          Have questions? We'd love to hear from you. Reach out to our team.
        </p>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className={`bg-background rounded-xl p-8 border border-border hover:shadow-lg transition-all duration-300 hover:scale-105 hover:translate-y-[-4px] animate-menu-item ${isVisible ? 'animate-float' : 'opacity-0 translate-y-8'}`}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <a href="tel:+917878419251" className="text-lg font-semibold text-foreground hover:text-primary transition-colors">
                    +91 78784 19251
                  </a>
                </div>
              </div>
            </div>

            <div className={`bg-background rounded-xl p-8 border border-border hover:shadow-lg transition-all duration-300 hover:scale-105 hover:translate-y-[-4px] animate-menu-item ${isVisible ? 'animate-float' : 'opacity-0 translate-y-8'}`} style={{ animationDelay: isVisible ? '0.1s' : '0s' }}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                  <Mail className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <a href="mailto:shouryapratap6081@gmail.com" className="text-lg font-semibold text-foreground hover:text-accent transition-colors">
                    shouryapratap6081@gmail.com
                  </a>
                </div>
              </div>
            </div>

            <div className={`bg-background rounded-xl p-8 border border-border hover:shadow-lg transition-all duration-300 hover:scale-105 hover:translate-y-[-4px] animate-menu-item ${isVisible ? 'animate-float' : 'opacity-0 translate-y-8'}`} style={{ animationDelay: isVisible ? '0.2s' : '0s' }}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center">
                  <Twitter className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Twitter</p>
                  <a href="https://twitter.com/iamyashmittal" target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-foreground hover:text-secondary transition-colors">
                    @iamyashmittal
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Founders */}
          <div className={`bg-background rounded-xl p-8 border border-border ${isVisible ? 'animate-float' : 'opacity-0 translate-y-8'}`} style={{ animationDelay: isVisible ? '0.3s' : '0s' }}>
            <h3 className="text-2xl font-bold mb-8 text-foreground flex items-center gap-3">
              <img 
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-11-17%20at%2018.39.16_c5907857-CCFQfiudNqNMwOWOgqNtHa8YFw38IK.jpg"
                alt="MediDesk Logo"
                className="w-10 h-10 object-contain rounded"
              />
              Meet Our Team
            </h3>
            <div className="space-y-6">
              {founders.map((founder, idx) => (
                <div key={idx} className={`pb-6 border-b border-border last:border-b-0 animate-menu-item transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ animationDelay: isVisible ? `${idx * 150}ms` : '0s' }}>
                  <h4 className="text-lg font-bold text-foreground mb-1">{founder.name}</h4>
                  <p className="text-primary font-semibold text-sm">{founder.role}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground mb-4">
                We're passionate about making medicine management simple and accessible for everyone.
              </p>
              <button className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-all duration-300 hover:scale-105 animate-menu-item">
                Schedule a Demo
              </button>
            </div>
          </div>
        </div>

        {/* Important Disclaimer */}
        <div className={`bg-destructive/10 border border-destructive/30 rounded-xl p-6 transition-all duration-1000 ${isVisible ? 'animate-float' : 'opacity-0 translate-y-8'}`} style={{ animationDelay: isVisible ? '0.5s' : '0s' }}>
          <p className="text-sm text-foreground font-semibold mb-2">⚠️ Important Disclaimer</p>
          <p className="text-muted-foreground text-sm">
            MediDesk provides informational assistance only and is not a substitute for professional medical advice. Always consult your doctor or healthcare provider for medical guidance. This is not a prescription service.
          </p>
        </div>
      </div>
    </section>
  );
}
