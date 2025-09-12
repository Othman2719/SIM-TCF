/*
  # Create Test Admin User

  This creates a test admin user directly in the database for testing purposes.
  
  1. Creates auth user
  2. Creates profile in users table
  3. Creates subscription
*/

-- First, let's create the auth user (this might fail if auth.users is not accessible)
-- If this fails, you'll need to create the user through Supabase Dashboard

DO $$
DECLARE
    user_id uuid := gen_random_uuid();
BEGIN
    -- Try to insert into auth.users (might not work depending on RLS)
    BEGIN
        INSERT INTO auth.users (
            id,
            instance_id,
            email,
            encrypted_password,
            email_confirmed_at,
            created_at,
            updated_at,
            raw_app_meta_data,
            raw_user_meta_data,
            is_super_admin,
            role
        ) VALUES (
            user_id,
            '00000000-0000-0000-0000-000000000000',
            'tcfadmin@brixel.com',
            crypt('Mostaganem@27', gen_salt('bf')),
            now(),
            now(),
            now(),
            '{"provider": "email", "providers": ["email"]}',
            '{}',
            false,
            'authenticated'
        );
        
        RAISE NOTICE 'Auth user created with ID: %', user_id;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Could not create auth user: %. You need to create it manually in Supabase Dashboard.', SQLERRM;
    END;

    -- Create the profile in users table
    INSERT INTO public.users (
        id,
        email,
        username,
        full_name,
        role,
        is_active,
        subscription_type,
        subscription_expires_at,
        created_at,
        updated_at
    ) VALUES (
        user_id,
        'tcfadmin@brixel.com',
        'Tcfadmin',
        'TCF Administrator',
        'admin',
        true,
        'enterprise',
        now() + interval '10 years',
        now(),
        now()
    ) ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        username = EXCLUDED.username,
        full_name = EXCLUDED.full_name,
        role = EXCLUDED.role,
        is_active = EXCLUDED.is_active,
        subscription_type = EXCLUDED.subscription_type,
        subscription_expires_at = EXCLUDED.subscription_expires_at,
        updated_at = now();

    -- Create subscription
    INSERT INTO public.user_subscriptions (
        user_id,
        subscription_type,
        starts_at,
        expires_at,
        is_active,
        payment_status
    ) VALUES (
        user_id,
        'enterprise',
        now(),
        now() + interval '10 years',
        true,
        'paid'
    ) ON CONFLICT (user_id) DO UPDATE SET
        subscription_type = EXCLUDED.subscription_type,
        expires_at = EXCLUDED.expires_at,
        is_active = EXCLUDED.is_active,
        payment_status = EXCLUDED.payment_status,
        updated_at = now();

    RAISE NOTICE 'Admin user setup completed for: tcfadmin@brixel.com';
    RAISE NOTICE 'User ID: %', user_id;
    RAISE NOTICE 'If auth user creation failed, manually create user in Supabase Dashboard with this email and password: Mostaganem@27';
END $$;