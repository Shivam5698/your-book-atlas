import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { getUserBooks, moveBook, removeBook, UserBook } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import BookCard from "@/components/BookCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const Bookshelf = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [books, setBooks] = useState<UserBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("want_to_read");

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

  useEffect(() => {
    if (user) {
      loadBooks();
    }
  }, [user]);

  const loadBooks = async () => {
    setLoading(true);
    try {
      const data = await getUserBooks();
      setBooks(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load books. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMoveBook = async (bookId: string, newShelf: string) => {
    try {
      await moveBook(bookId, newShelf as any);
      await loadBooks();
      toast({
        title: "Success!",
        description: "Book moved to new shelf",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to move book. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveBook = async (bookId: string) => {
    try {
      await removeBook(bookId);
      await loadBooks();
      toast({
        title: "Success!",
        description: "Book removed from shelf",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove book. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filterBooksByShelf = (shelfType: string) => {
    return books.filter((book) => book.shelf_type === shelfType);
  };

  const renderShelfContent = (shelfType: string, shelfLabel: string) => {
    const shelfBooks = filterBooksByShelf(shelfType);
    
    if (loading) {
      return (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (shelfBooks.length === 0) {
      return (
        <div className="text-center py-20 space-y-2">
          <p className="text-xl text-muted-foreground">Your {shelfLabel} shelf is empty</p>
          <p className="text-sm text-muted-foreground">
            Search for books and add them to get started!
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {shelfBooks.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onMove={handleMoveBook}
            onRemove={handleRemoveBook}
          />
        ))}
      </div>
    );
  };

  const getShelfCount = (shelfType: string) => {
    return filterBooksByShelf(shelfType).length;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold">My Bookshelf</h1>
            <p className="text-muted-foreground text-lg">
              Organize and manage your reading collection
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto">
              <TabsTrigger value="want_to_read">
                Want to Read ({getShelfCount("want_to_read")})
              </TabsTrigger>
              <TabsTrigger value="currently_reading">
                Currently Reading ({getShelfCount("currently_reading")})
              </TabsTrigger>
              <TabsTrigger value="read">
                Read ({getShelfCount("read")})
              </TabsTrigger>
            </TabsList>
            
            <div className="mt-8">
              <TabsContent value="want_to_read">
                {renderShelfContent("want_to_read", "Want to Read")}
              </TabsContent>
              
              <TabsContent value="currently_reading">
                {renderShelfContent("currently_reading", "Currently Reading")}
              </TabsContent>
              
              <TabsContent value="read">
                {renderShelfContent("read", "Read")}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Bookshelf;
