// auth.js
const supabaseUrl = 'https://gtjejfxoxheglajmvrir.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0amVqZnhveGhlZ2xham12cmlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5NjQ3MzUsImV4cCI6MjA2MDU0MDczNX0.JuR8-n0dQD1d2uX0aroFpXMbTe3iFt_78p-ENpv7OyI';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Kontrollera inloggning på skyddade sidor
async function checkAuth(requireAdmin = false) {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    // Om inte inloggad, omdirigera till login
    if (!window.location.pathname.includes('login.html') {
      window.location.href = 'login.html';
    }
    return null;
  }
  
  if (requireAdmin) {
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', user.id)
      .single();
      
    if (userError || !userData.is_admin) {
      window.location.href = 'account.html';
      return null;
    }
  }
  
  return user;
}

// Logga ut funktion
async function logout() {
  await supabase.auth.signOut();
  window.location.href = 'login.html';
}