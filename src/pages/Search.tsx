import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { searchBooks, addBookToShelf, BookSearchResult } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import BookCard from "@/components/BookCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Search = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [books, setBooks] = useState<BookSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState<BookSearchResult | null>(null);
  const [selectedShelf, setSelectedShelf] = useState<string>("want_to_read");

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
      } else {
        setUser(user);
      }
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session?.user) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const results = await searchBooks(searchQuery);
      setBooks(results);
      if (results.length === 0) {
        toast({
          title: "No results",
          description: "No books found. Try a different search term.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search books. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = async () => {
    if (!selectedBook) return;

    try {
      await addBookToShelf(
        selectedBook.id,
        selectedBook.volumeInfo.title,
        selectedBook.volumeInfo.authors || [],
        selectedBook.volumeInfo.description || null,
        selectedBook.volumeInfo.imageLinks?.thumbnail || null,
        selectedBook.volumeInfo.publishedDate || null,
        selectedShelf as any
      );

      toast({
        title: "Success!",
        description: "Book added to your shelf",
      });
      setSelectedBook(null);
    } catch (error: any) {
      if (error.message.includes('duplicate')) {
        toast({
          title: "Already added",
          description: "This book is already on your shelf",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to add book. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Discover Your Next Read</h1>
            <p className="text-muted-foreground text-lg">
              Search millions of books and add them to your personal bookshelf
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="text"
              placeholder="Search by title, author, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 text-lg"
            />
            <Button type="submit" size="lg" disabled={loading}>
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <SearchIcon className="h-5 w-5 mr-2" />
                  Search
                </>
              )}
            </Button>
          </form>

          {books.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Search Results</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {books.map((book) => (
                  <BookCard
                    key={book.id}
                    book={{
                      id: book.id,
                      title: book.volumeInfo.title,
                      authors: book.volumeInfo.authors,
                      thumbnail: book.volumeInfo.imageLinks?.thumbnail,
                    }}
                    addToShelfButton
                    onAdd={() => setSelectedBook(book)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Dialog open={!!selectedBook} onOpenChange={() => setSelectedBook(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Shelf</DialogTitle>
            <DialogDescription>
              Choose which shelf to add "{selectedBook?.volumeInfo.title}" to
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Select value={selectedShelf} onValueChange={setSelectedShelf}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="want_to_read">Want to Read</SelectItem>
                <SelectItem value="currently_reading">Currently Reading</SelectItem>
                <SelectItem value="read">Read</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleAddBook} className="w-full">
              Add to Shelf
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Search;
