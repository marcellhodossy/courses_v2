CREATE TABLE course_codes (
  id serial primary key,
  code text NOT NULL,
  course_id integer NOT NULL,
  lifetime boolean NOT NULL,
  active boolean DEFAULT true
);

CREATE TABLE course_list (
  id serial primary key,
  name text NOT NULL,
  descriptions text NOT NULL,
  seen boolean NOT NULL,
  approved boolean NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE courses (
  id serial primary key,
  course_id integer NOT NULL,
  user_id integer NOT NULL,
  type integer NOT NULL DEFAULT 1,
  logged timestamp with time zone DEFAULT now()
);

CREATE TABLE posts (
  id serial primary key,
  course_id integer NOT NULL,
  user_id integer NOT NULL,
  title text NOT NULL,
  text text NOT NULL,
  date timestamp with time zone DEFAULT now()
);

CREATE TABLE reviews (
  id serial primary key,
  user_id integer NOT NULL,
  course_id integer NOT NULL,
  date timestamp with time zone DEFAULT now()
);

CREATE TABLE session (
  sid character varying NOT NULL,
  sess json NOT NULL,
  expire timestamp without time zone NOT NULL
);

CREATE TABLE users (
  id serial primary key,
  email character varying,
  username character varying NOT NULL,
  password character varying NOT NULL,
  active boolean DEFAULT false,
  type integer
);
