# Authentication Setup Guide

This guide will help you set up the authentication system for the application.

## Prerequisites

1. A Supabase account and project
2. Node.js and npm installed
3. Git installed

## Setup Steps

### 1. Supabase Configuration

1. Go to your Supabase project dashboard
2. Navigate to Project Settings > API
3. Copy the following values:
   - Project URL
   - anon/public key

### 2. Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Database Setup

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy the contents of `supabase/migrations/20240320000000_create_auth_tables.sql`
4. Run the SQL script

### 4. Authentication Settings

1. Go to Authentication > Settings in your Supabase dashboard
2. Enable Email auth provider
3. Configure the following settings:
   - Site URL: `http://localhost:8080` (or your development URL)
   - Redirect URLs: Add `http://localhost:8080/auth/callback`
   - Email Template: Customize as needed

### 5. Application Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Visit `http://localhost:8080` (or your configured port)

## Testing Authentication

1. Try signing up with a new account
2. Verify that you receive a confirmation email
3. Sign in with your credentials
4. Test the sign-out functionality

## Troubleshooting

### Common Issues

1. **Invalid API Key**
   - Verify that your `.env` file contains the correct values
   - Check that the environment variables are being loaded correctly

2. **Sign-up Fails**
   - Check the browser console for error messages
   - Verify that the database tables were created successfully
   - Ensure email provider is enabled in Supabase

3. **Sign-in Issues**
   - Verify that the user exists in Supabase
   - Check that the email has been confirmed
   - Look for error messages in the browser console

### Debugging

1. Enable debug logging in the browser console
2. Check the Network tab for failed requests
3. Verify Supabase client initialization
4. Test database connections

## Security Considerations

1. Never commit `.env` files to version control
2. Use Row Level Security (RLS) policies
3. Implement proper error handling
4. Validate user input
5. Use secure password requirements

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Authentication Best Practices](https://supabase.com/docs/guides/auth)
- [Database Security](https://supabase.com/docs/guides/database/security) 