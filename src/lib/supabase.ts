import { supabase } from "@/integrations/supabase/client";

export interface BookSearchResult {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
    publishedDate?: string;
  };
}

export interface UserBook {
  id: string;
  user_id: string;
  google_book_id: string;
  title: string;
  authors: string[];
  description: string | null;
  thumbnail: string | null;
  published_date: string | null;
  shelf_type: 'want_to_read' | 'currently_reading' | 'read';
  added_at: string;
}

export async function searchBooks(query: string): Promise<BookSearchResult[]> {
  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=20`
    );
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Error searching books:', error);
    throw error;
  }
}

export async function addBookToShelf(
  googleBookId: string,
  title: string,
  authors: string[],
  description: string | null,
  thumbnail: string | null,
  publishedDate: string | null,
  shelfType: 'want_to_read' | 'currently_reading' | 'read'
) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('user_books')
    .insert({
      user_id: user.id,
      google_book_id: googleBookId,
      title,
      authors,
      description,
      thumbnail,
      published_date: publishedDate,
      shelf_type: shelfType,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function moveBook(bookId: string, newShelfType: 'want_to_read' | 'currently_reading' | 'read') {
  const { error } = await supabase
    .from('user_books')
    .update({ shelf_type: newShelfType })
    .eq('id', bookId);

  if (error) throw error;
}

export async function removeBook(bookId: string) {
  const { error } = await supabase
    .from('user_books')
    .delete()
    .eq('id', bookId);

  if (error) throw error;
}

export async function getUserBooks(shelfType?: string): Promise<UserBook[]> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('User not authenticated');

  let query = supabase
    .from('user_books')
    .select('*')
    .eq('user_id', user.id)
    .order('added_at', { ascending: false });

  if (shelfType) {
    query = query.eq('shelf_type', shelfType);
  }

  const { data, error } = await query;

  if (error) throw error;
  return (data || []) as UserBook[];
}
