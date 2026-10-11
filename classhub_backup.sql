--
-- PostgreSQL database dump
--

\restrict xioY7nBQNQTedCpFW5pnogA7jud7BebsAr5wuLuYPY43WRSudT5ibS1w2wasfEo

-- Dumped from database version 18.6 (4e955f5)
-- Dumped by pg_dump version 18.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public."Submission" DROP CONSTRAINT IF EXISTS "Submission_studentId_fkey";
ALTER TABLE IF EXISTS ONLY public."Submission" DROP CONSTRAINT IF EXISTS "Submission_assignmentId_fkey";
ALTER TABLE IF EXISTS ONLY public."Assignment" DROP CONSTRAINT IF EXISTS "Assignment_subjectId_fkey";
DROP INDEX IF EXISTS public."Submission_studentId_assignmentId_key";
DROP INDEX IF EXISTS public."Subject_name_key";
DROP INDEX IF EXISTS public."Student_email_key";
ALTER TABLE IF EXISTS ONLY public."Submission" DROP CONSTRAINT IF EXISTS "Submission_pkey";
ALTER TABLE IF EXISTS ONLY public."Subject" DROP CONSTRAINT IF EXISTS "Subject_pkey";
ALTER TABLE IF EXISTS ONLY public."Student" DROP CONSTRAINT IF EXISTS "Student_pkey";
ALTER TABLE IF EXISTS ONLY public."Assignment" DROP CONSTRAINT IF EXISTS "Assignment_pkey";
ALTER TABLE IF EXISTS public."Submission" ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public."Subject" ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public."Student" ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public."Assignment" ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE IF EXISTS public."Submission_id_seq";
DROP TABLE IF EXISTS public."Submission";
DROP SEQUENCE IF EXISTS public."Subject_id_seq";
DROP TABLE IF EXISTS public."Subject";
DROP SEQUENCE IF EXISTS public."Student_id_seq";
DROP TABLE IF EXISTS public."Student";
DROP SEQUENCE IF EXISTS public."Assignment_id_seq";
DROP TABLE IF EXISTS public."Assignment";
DROP TYPE IF EXISTS public."InputMode";
DROP TYPE IF EXISTS public."AssignmentType";
-- *not* dropping schema, since initdb creates it
--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS '';


--
-- Name: AssignmentType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."AssignmentType" AS ENUM (
    'TEST',
    'HOMEWORK'
);


--
-- Name: InputMode; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."InputMode" AS ENUM (
    'TEXT',
    'PDF'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Assignment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Assignment" (
    id integer NOT NULL,
    title text NOT NULL,
    type public."AssignmentType" NOT NULL,
    "inputMode" public."InputMode" NOT NULL,
    "maxScore" double precision DEFAULT 100 NOT NULL,
    "textContent" text,
    "fileUrl" text,
    "subjectId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Assignment_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Assignment_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Assignment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Assignment_id_seq" OWNED BY public."Assignment".id;


--
-- Name: Student; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Student" (
    id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    "avgScore" double precision DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "isAdmin" boolean DEFAULT false NOT NULL
);


--
-- Name: Student_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Student_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Student_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Student_id_seq" OWNED BY public."Student".id;


--
-- Name: Subject; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Subject" (
    id integer NOT NULL,
    name text NOT NULL
);


--
-- Name: Subject_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Subject_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Subject_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Subject_id_seq" OWNED BY public."Subject".id;


--
-- Name: Submission; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Submission" (
    id integer NOT NULL,
    "studentId" integer NOT NULL,
    score double precision NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "assignmentId" integer NOT NULL,
    "studentFileUrl" text
);


--
-- Name: Submission_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Submission_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Submission_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Submission_id_seq" OWNED BY public."Submission".id;


--
-- Name: Assignment id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Assignment" ALTER COLUMN id SET DEFAULT nextval('public."Assignment_id_seq"'::regclass);


--
-- Name: Student id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Student" ALTER COLUMN id SET DEFAULT nextval('public."Student_id_seq"'::regclass);


--
-- Name: Subject id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subject" ALTER COLUMN id SET DEFAULT nextval('public."Subject_id_seq"'::regclass);


--
-- Name: Submission id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Submission" ALTER COLUMN id SET DEFAULT nextval('public."Submission_id_seq"'::regclass);


--
-- Data for Name: Assignment; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Assignment" (id, title, type, "inputMode", "maxScore", "textContent", "fileUrl", "subjectId", "createdAt") FROM stdin;
16	Aayu baccha kal se hogaa apkaa homework aaj toh pappi lo aap bass 	HOMEWORK	TEXT	100	💋💋💋💋💋😘😘😘😘😘	\N	4	2026-10-05 18:56:00.518
\.


--
-- Data for Name: Student; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Student" (id, name, email, password, "avgScore", "createdAt", "isAdmin") FROM stdin;
1	Harsh Verma	hakaigamer5@gmail.com	12344321	0	2026-10-01 16:06:21.848	t
2	Aayu	a65657668@gmail.com	12344321	0	2026-10-02 08:55:53.08	f
\.


--
-- Data for Name: Subject; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Subject" (id, name) FROM stdin;
3	Economics
4	Accounts
5	Business Studies
6	English
\.


--
-- Data for Name: Submission; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Submission" (id, "studentId", score, "createdAt", "assignmentId", "studentFileUrl") FROM stdin;
16	2	0	2026-10-05 18:56:00.518	16	\N
\.


--
-- Name: Assignment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Assignment_id_seq"', 16, true);


--
-- Name: Student_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Student_id_seq"', 3, true);


--
-- Name: Subject_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Subject_id_seq"', 6, true);


--
-- Name: Submission_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Submission_id_seq"', 16, true);


--
-- Name: Assignment Assignment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Assignment"
    ADD CONSTRAINT "Assignment_pkey" PRIMARY KEY (id);


--
-- Name: Student Student_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Student"
    ADD CONSTRAINT "Student_pkey" PRIMARY KEY (id);


--
-- Name: Subject Subject_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Subject"
    ADD CONSTRAINT "Subject_pkey" PRIMARY KEY (id);


--
-- Name: Submission Submission_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Submission"
    ADD CONSTRAINT "Submission_pkey" PRIMARY KEY (id);


--
-- Name: Student_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Student_email_key" ON public."Student" USING btree (email);


--
-- Name: Subject_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Subject_name_key" ON public."Subject" USING btree (name);


--
-- Name: Submission_studentId_assignmentId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Submission_studentId_assignmentId_key" ON public."Submission" USING btree ("studentId", "assignmentId");


--
-- Name: Assignment Assignment_subjectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Assignment"
    ADD CONSTRAINT "Assignment_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES public."Subject"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Submission Submission_assignmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Submission"
    ADD CONSTRAINT "Submission_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES public."Assignment"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Submission Submission_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Submission"
    ADD CONSTRAINT "Submission_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict xioY7nBQNQTedCpFW5pnogA7jud7BebsAr5wuLuYPY43WRSudT5ibS1w2wasfEo

