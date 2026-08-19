CREATE TYPE flock_status AS ENUM ('active', 'resting', 'sold', 'closed');
CREATE TYPE customer_type AS ENUM ('retailer', 'wholesaler');
CREATE TYPE expense_category AS ENUM ('feed', 'feed-production materials', 'vaccines', 'drugs/medication', 'production materials', 'other');

CREATE TABLE farms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE flocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id uuid NOT NULL REFERENCES farms(id),
  name text NOT NULL,
  start_date date NOT NULL,
  status flock_status NOT NULL DEFAULT 'active',
  stage text NOT NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE egg_collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id uuid NOT NULL REFERENCES farms(id),
  flock_id uuid NOT NULL REFERENCES flocks(id),
  collection_date date NOT NULL,
  crates integer NOT NULL,
  loose_eggs integer NOT NULL,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE egg_sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id uuid NOT NULL REFERENCES farms(id),
  sale_date date NOT NULL,
  customer_type customer_type NOT NULL,
  crates integer NOT NULL,
  loose_eggs integer NOT NULL,
  total_price numeric(12,2) NOT NULL,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE egg_losses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id uuid NOT NULL REFERENCES farms(id),
  loss_date date NOT NULL,
  crates integer NOT NULL,
  loose_eggs integer NOT NULL,
  reason text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id uuid NOT NULL REFERENCES farms(id),
  expense_date date NOT NULL,
  category expense_category NOT NULL,
  amount numeric(12,2) NOT NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
