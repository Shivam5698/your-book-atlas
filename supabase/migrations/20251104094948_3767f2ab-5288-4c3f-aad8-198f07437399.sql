-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create user_books table to store books and their shelf assignments
CREATE TABLE public.user_books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  google_book_id TEXT NOT NULL,
  title TEXT NOT NULL,
  authors TEXT[] DEFAULT ARRAY[]::TEXT[],
  description TEXT,
  thumbnail TEXT,
  published_date TEXT,
  shelf_type TEXT NOT NULL CHECK (shelf_type IN ('want_to_read', 'currently_reading', 'read')),
  added_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, google_book_id)
);

-- Enable RLS on user_books
ALTER TABLE public.user_books ENABLE ROW LEVEL SECURITY;

-- User books policies
CREATE POLICY "Users can view own books"
  ON public.user_books FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own books"
  ON public.user_books FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own books"
  ON public.user_books FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own books"
  ON public.user_books FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_user_books_user_id ON public.user_books(user_id);
CREATE INDEX idx_user_books_shelf_type ON public.user_books(shelf_type);