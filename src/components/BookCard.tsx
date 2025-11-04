import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BookCardProps {
  book: {
    id: string;
    title: string;
    authors?: string[];
    thumbnail?: string | null;
    shelf_type?: string;
  };
  onMove?: (bookId: string, newShelf: string) => void;
  onRemove?: (bookId: string) => void;
  onAdd?: () => void;
  showActions?: boolean;
  addToShelfButton?: boolean;
}

const BookCard = ({ book, onMove, onRemove, onAdd, showActions = true, addToShelfButton = false }: BookCardProps) => {
  const defaultThumbnail = "https://via.placeholder.com/128x192/e8dcc4/8b6f47?text=No+Cover";
  
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
      <div className="aspect-[2/3] overflow-hidden bg-muted">
        <img
          src={book.thumbnail || defaultThumbnail}
          alt={book.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = defaultThumbnail;
          }}
        />
      </div>
      <CardContent className="p-4 flex-1">
        <h3 className="font-semibold text-sm line-clamp-2 mb-2">{book.title}</h3>
        <p className="text-xs text-muted-foreground line-clamp-1">
          {book.authors?.join(", ") || "Unknown Author"}
        </p>
      </CardContent>
      
      {showActions && (
        <CardFooter className="p-4 pt-0 flex gap-2">
          {addToShelfButton ? (
            <Button onClick={onAdd} className="w-full" size="sm">
              <BookOpen className="h-4 w-4 mr-2" />
              Add to Shelf
            </Button>
          ) : (
            <>
              {onMove && book.shelf_type && (
                <Select
                  value={book.shelf_type}
                  onValueChange={(value) => onMove(book.id, value)}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="want_to_read">Want to Read</SelectItem>
                    <SelectItem value="currently_reading">Currently Reading</SelectItem>
                    <SelectItem value="read">Read</SelectItem>
                  </SelectContent>
                </Select>
              )}
              {onRemove && (
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => onRemove(book.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default BookCard;
