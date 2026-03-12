import { Clock, Instagram, Facebook, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-6 h-6 text-primary" />
              <span className="font-display text-lg font-bold text-foreground">
                Slice <span className="text-primary">O'Clock</span>
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Handcrafted pizzas made with love and the finest ingredients. Every slice tells a story.
            </p>
          </div>

          <div>
            <h4 className="font-display text-lg font-semibold text-foreground mb-4">Hours</h4>
            <div className="text-muted-foreground text-sm space-y-1">
              <p>Mon–Thu: 11am – 10pm</p>
              <p>Fri–Sat: 11am – 12am</p>
              <p>Sunday: 12pm – 9pm</p>
            </div>
          </div>

          <div>
            <h4 className="font-display text-lg font-semibold text-foreground mb-4">Follow Us</h4>
            <div className="flex gap-4">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border text-center text-muted-foreground text-xs">
          © 2026 Slice O'Clock. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
