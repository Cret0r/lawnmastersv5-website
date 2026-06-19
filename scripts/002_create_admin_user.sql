-- Create admin user for the dashboard
-- First check if user exists, only insert if not

DO $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Check if admin already exists
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@test.com') THEN
    new_user_id := gen_random_uuid();

    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      confirmation_token,
      raw_app_meta_data,
      raw_user_meta_data,
      is_super_admin
    )
    VALUES (
      '00000000-0000-0000-0000-000000000000',
      new_user_id,
      'authenticated',
      'authenticated',
      'admin@test.com',
      crypt('test123456', gen_salt('bf')),
      now(),
      now(),
      now(),
      '',
      '{"provider":"email","providers":["email"]}',
      '{"role":"admin"}',
      false
    );

    INSERT INTO auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      provider_id,
      last_sign_in_at,
      created_at,
      updated_at
    )
    VALUES (
      new_user_id,
      new_user_id,
      jsonb_build_object('sub', new_user_id::text, 'email', 'admin@test.com'),
      'email',
      new_user_id::text,
      now(),
      now(),
      now()
    );
  END IF;
END $$;
