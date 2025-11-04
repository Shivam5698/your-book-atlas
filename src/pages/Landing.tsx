import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BookOpen, Library, Search, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import heroImage from "@/assets/hero-books.jpg";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-background z-0" />
        <div 
          className="absolute inset-0 opacity-20 bg-cover bg-center z-0"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="inline-block">
              <div className="flex items-center justify-center gap-2 text-primary mb-4">
                <BookOpen className="h-12 w-12" />
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
                Welcome to <span className="text-primary">BookVerse</span>
              </h1>
            </div>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Your personal digital bookshelf. Discover, organize, and track your reading journey all in one beautiful place.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" asChild className="text-lg">
                <Link to="/auth">Start Your Journey</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg">
                <Link to="/auth">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Everything You Need for Your Reading Life
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center space-y-4 p-6 rounded-lg bg-card hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">Discover Books</h3>
              <p className="text-muted-foreground">
                Search millions of books using Google Books API. Find your next great read easily.
              </p>
            </div>
            
            <div className="text-center space-y-4 p-6 rounded-lg bg-card hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary">
                <Library className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">Organize Shelves</h3>
              <p className="text-muted-foreground">
                Create custom shelves: Want to Read, Currently Reading, and Read. Keep your books organized.
              </p>
            </div>
            
            <div className="text-center space-y-4 p-6 rounded-lg bg-card hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary">
                <Star className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">Track Progress</h3>
              <p className="text-muted-foreground">
                Move books between shelves, track what you're reading, and celebrate completed books.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6 p-12 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-border">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Build Your Library?
            </h2>
            <p className="text-lg text-muted-foreground">
              Join BookVerse today and start organizing your reading journey.
            </p>
            <Button size="lg" asChild className="text-lg">
              <Link to="/auth">Get Started Free</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 bg-card/30">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 BookVerse. Your personal digital bookshelf.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
