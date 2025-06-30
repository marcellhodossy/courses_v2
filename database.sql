CREATE TABLE course_codes (
  id integer NOT NULL DEFAULT nextval('course_codes_id_seq'::regclass),
  code text NOT NULL,
  course_id integer NOT NULL,
  lifetime boolean NOT NULL,
  active boolean DEFAULT true
);

CREATE TABLE course_list (
  id integer NOT NULL DEFAULT nextval('course_list_id_seq'::regclass),
  name text NOT NULL,
  descriptions text NOT NULL,
  seen boolean NOT NULL,
  approved boolean NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE courses (
  id integer NOT NULL DEFAULT nextval('courses_id_seq'::regclass),
  course_id integer NOT NULL,
  user_id integer NOT NULL,
  type integer NOT NULL DEFAULT 1,
  logged timestamp with time zone DEFAULT now()
);

CREATE TABLE posts (
  id integer NOT NULL DEFAULT nextval('posts_id_seq'::regclass),
  course_id integer NOT NULL,
  user_id integer NOT NULL,
  title text NOT NULL,
  text text NOT NULL,
  date timestamp with time zone DEFAULT now()
);

CREATE TABLE reviews (
  id integer NOT NULL DEFAULT nextval('reviews_id_seq'::regclass),
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
  id integer NOT NULL DEFAULT nextval('users_id_seq'::regclass),
  email character varying,
  username character varying NOT NULL,
  password character varying NOT NULL,
  active boolean DEFAULT false,
  type integer
);
